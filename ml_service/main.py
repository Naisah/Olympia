import io
import json
import logging
import os
import secrets
from pathlib import Path

import face_recognition
import numpy as np
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, File, Form, Header, HTTPException, UploadFile
from PIL import Image, ImageOps, UnidentifiedImageError

load_dotenv(Path(__file__).with_name('.env'))
MAX_UPLOAD_BYTES = 5 * 1024 * 1024
MAX_IMAGE_PIXELS = 16_000_000
logger = logging.getLogger(__name__)


def require_service_key(x_service_key: str | None = Header(default=None)):
    expected = os.getenv('FACE_SERVICE_KEY', '')
    if not expected:
        raise HTTPException(503, 'Face verification is not configured.')
    if not x_service_key or not secrets.compare_digest(x_service_key, expected):
        raise HTTPException(401, 'Unauthorized service request.')


# Only the backend calls this service. No browser CORS access is needed.
app = FastAPI(title='Barangay Face Recognition API', dependencies=[Depends(require_service_key)])


def load_image_into_numpy_array(upload: UploadFile):
    data = upload.file.read(MAX_UPLOAD_BYTES + 1)
    if len(data) > MAX_UPLOAD_BYTES:
        raise HTTPException(413, 'Images must be no larger than 5 MB.')
    try:
        with Image.open(io.BytesIO(data)) as original:
            if original.format not in ('JPEG', 'PNG'):
                raise HTTPException(422, 'Use a JPEG or PNG image.')
            if original.width * original.height > MAX_IMAGE_PIXELS:
                raise HTTPException(422, 'Image dimensions are too large.')
            image = ImageOps.exif_transpose(original).convert('RGB')
            image.thumbnail((1200, 1200))
            return np.array(image)
    except (UnidentifiedImageError, OSError, Image.DecompressionBombError) as error:
        raise HTTPException(422, 'The uploaded image is invalid or damaged.') from error


def single_face(image, label):
    locations = face_recognition.face_locations(image)
    if not locations:
        locations = face_recognition.face_locations(image, number_of_times_to_upsample=2)
    if len(locations) != 1:
        raise HTTPException(422, f'{label} must contain exactly one clear face.')
    encodings = face_recognition.face_encodings(image, known_face_locations=locations)
    if len(encodings) != 1:
        raise HTTPException(422, f'Unable to read the face in {label}.')
    return encodings[0]


@app.post('/api/register_ekyc')
def register_ekyc(id_image: UploadFile = File(...), selfie_image: UploadFile = File(...),
                  first_name: str = Form(..., min_length=1, max_length=50),
                  last_name: str = Form(..., min_length=1, max_length=50)):
    try:
        id_encoding = single_face(load_image_into_numpy_array(id_image), 'ID image')
        selfie_encoding = single_face(load_image_into_numpy_array(selfie_image), 'Selfie')
        match = bool(face_recognition.compare_faces([id_encoding], selfie_encoding, tolerance=0.50)[0])
        if not match:
            return {'match': False, 'message': 'Selfie does not match the provided ID.'}
        return {'match': True, 'face_encoding': json.dumps(selfie_encoding.tolist()),
                'message': 'Face match successful. ID details require staff review.'}
    except HTTPException:
        raise
    except Exception as error:
        logger.exception('Face registration failed')
        raise HTTPException(503, 'Face verification is temporarily unavailable.') from error


@app.post('/api/verify_claimant')
def verify_claimant(live_image: UploadFile = File(...), saved_encoding: str = Form(..., max_length=10000)):
    try:
        parsed = json.loads(saved_encoding)
        if (not isinstance(parsed, list) or len(parsed) != 128
                or any(type(value) not in (int, float) for value in parsed)):
            raise ValueError('Invalid encoding')
        known_encoding = np.array(parsed, dtype=float)
        if not np.isfinite(known_encoding).all():
            raise ValueError('Nonfinite encoding')
    except (ValueError, TypeError, OverflowError) as error:
        raise HTTPException(422, 'Invalid saved face encoding.') from error
    try:
        live_encoding = single_face(load_image_into_numpy_array(live_image), 'Live image')
        match = bool(face_recognition.compare_faces([known_encoding], live_encoding, tolerance=0.50)[0])
        return {'match': match, 'message': 'Face match successful; confirm claimant details before release.'
                if match else 'This face does not match the registered resident.'}
    except HTTPException:
        raise
    except Exception as error:
        logger.exception('Claimant face verification failed')
        raise HTTPException(503, 'Face verification is temporarily unavailable.') from error
