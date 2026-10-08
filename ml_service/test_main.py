import io
import json
import os
import unittest
from unittest.mock import patch

import numpy as np
from fastapi.testclient import TestClient
from PIL import Image
import main


class FaceServiceTests(unittest.TestCase):
    def setUp(self):
        self.env = patch.dict(os.environ, {'FACE_SERVICE_KEY': 'test-only-service-key'})
        self.env.start()
        self.addCleanup(self.env.stop)
        self.client = TestClient(main.app)
        self.headers = {'X-Service-Key': 'test-only-service-key'}
        image = io.BytesIO()
        Image.new('RGB', (32, 32), 'white').save(image, format='PNG')
        self.image = image.getvalue()
        self.files = {'id_image': ('id.png', self.image, 'image/png'), 'selfie_image': ('selfie.png', self.image, 'image/png')}
        self.data = {'first_name': 'Juan', 'last_name': 'Cruz'}

    def register(self, **kwargs):
        return self.client.post('/api/register_ekyc', files=kwargs.get('files', self.files), data=self.data, headers=kwargs.get('headers', self.headers))

    def test_missing_or_wrong_service_key_is_denied(self):
        self.assertEqual(self.register(headers={}).status_code, 401)
        self.assertEqual(self.register(headers={'X-Service-Key': 'wrong'}).status_code, 401)
        self.assertEqual(self.client.post('/api/verify_claimant', files={'live_image': self.files['id_image']}, data={'saved_encoding': '[]'}).status_code, 401)

    def test_missing_configuration_fails_closed(self):
        with patch.dict(os.environ, {'FACE_SERVICE_KEY': ''}):
            self.assertEqual(self.register().status_code, 503)

    def test_invalid_and_oversized_images_are_validation_errors(self):
        for content, expected in [(b'not-an-image', 422), (b'x' * (main.MAX_UPLOAD_BYTES + 1), 413)]:
            files = dict(self.files, id_image=('id.png', content, 'image/png'))
            self.assertEqual(self.register(files=files).status_code, expected)
        with patch.object(main, 'MAX_IMAGE_PIXELS', 10):
            self.assertEqual(self.register().status_code, 422)

    def test_blank_image_is_rejected_by_real_detector(self):
        self.assertEqual(self.register().status_code, 422)

    def test_multiple_faces_are_rejected(self):
        with patch.object(main.face_recognition, 'face_locations', return_value=[(1, 2, 3, 4), (5, 6, 7, 8)]):
            self.assertEqual(self.register().status_code, 422)

    def test_match_returns_encoding_without_claiming_id_authenticity(self):
        with patch.object(main, 'single_face', return_value=np.zeros(128)):
            result = self.register()
            self.assertEqual(result.status_code, 200)
            self.assertTrue(result.json()['match'])
            self.assertEqual(len(json.loads(result.json()['face_encoding'])), 128)
            self.assertIn('staff review', result.json()['message'])

    def test_mismatch_returns_false(self):
        with patch.object(main, 'single_face', side_effect=[np.zeros(128), np.ones(128)]):
            self.assertFalse(self.register().json()['match'])

    def test_claimant_encoding_types_lengths_and_nonfinite_values(self):
        for value in ['not-json', '{}', '[]', json.dumps([True] * 128), json.dumps([float('nan')] * 128)]:
            response = self.client.post('/api/verify_claimant', headers=self.headers, files={'live_image': self.files['id_image']}, data={'saved_encoding': value})
            self.assertEqual(response.status_code, 422)

    def test_unexpected_failure_does_not_expose_details(self):
        with patch.object(main, 'single_face', side_effect=RuntimeError('private diagnostic data')):
            with self.assertLogs(main.logger, level='ERROR'):
                result = self.register()
            self.assertEqual(result.status_code, 503)
            self.assertNotIn('private diagnostic', result.text)


if __name__ == '__main__':
    unittest.main()
