import { useRef, useState, useCallback, useEffect } from 'react';
import { API_BASE_URL } from '../utils/api';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import { Upload, Check, Lock, Camera, RefreshCw, Volume2 } from 'lucide-react';

const FaceRegistration = ({ onVerifySuccess, firstName, lastName }) => {
    const webcamRef = useRef(null);
    const [idType, setIdType] = useState('National ID (PhilSys)');
    const [frontIdImage, setFrontIdImage] = useState(null);
    const [backIdImage, setBackIdImage] = useState(null);
    const [selfieImage, setSelfieImage] = useState(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [result, setResult] = useState(null);

    // Liveness states
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [isSmiling, setIsSmiling] = useState(false);
    const [livenessMessage, setLivenessMessage] = useState("Loading AI Models...");
    const [hardwareBlocked, setHardwareBlocked] = useState(false);

    const selectIdImage = (event, setter) => {
        const file = event.target.files[0];
        if (!file) return;
        if (!['image/jpeg', 'image/png'].includes(file.type) || file.size > 5 * 1024 * 1024) {
            setResult({ error: 'Choose a JPEG or PNG image no larger than 5 MB.' });
            setter(null);
            event.target.value = '';
            return;
        }
        setter(file);
        setResult(null);
    };

    // HCI: Text-to-Speech Function
    const speakText = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Stop any currently playing speech
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9; // Slightly slower for better comprehension
            utterance.pitch = 1;
            window.speechSynthesis.speak(utterance);
        } else {
            alert("Sorry, your browser does not support text-to-speech.");
        }
    };

    useEffect(() => {
        const loadModels = async () => {
            try {
                await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
                await faceapi.nets.faceExpressionNet.loadFromUri('/models');
                setModelsLoaded(true);
                setLivenessMessage("Models Loaded! Please look at the camera and SMILE.");
            } catch (err) {
                console.error(err);
                setLivenessMessage("Failed to load Liveness AI.");
            }
        };
        loadModels();
    }, []);

    const detectSmile = async () => {
        if (webcamRef.current && webcamRef.current.video && webcamRef.current.video.readyState === 4) {
            const video = webcamRef.current.video;
            const detections = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();
            
            if (detections) {
                const box = detections.detection.box;
                const vWidth = video.videoWidth;
                const vHeight = video.videoHeight;
                
                // Calculate relative position and size
                const faceRatio = box.width / vWidth;
                const centerX = (box.x + box.width / 2) / vWidth;
                const centerY = (box.y + box.height / 2) / vHeight;

                if (centerX < 0.35 || centerX > 0.65 || centerY < 0.3 || centerY > 0.7) {
                    setIsSmiling(false);
                    setLivenessMessage("Please center your face inside the oval.");
                } else if (faceRatio < 0.25) {
                    setIsSmiling(false);
                    setLivenessMessage("Move closer to the camera.");
                } else if (faceRatio > 0.6) {
                    setIsSmiling(false);
                    setLivenessMessage("Move a little further back.");
                } else {
                    // Face is positioned correctly, now check for smile
                    if (detections.expressions.happy > 0.7) {
                        setIsSmiling(true);
                        setLivenessMessage("Perfect! Hold still and you can capture.");
                    } else {
                        setIsSmiling(false);
                        setLivenessMessage("Good positioning. Smile for a clear capture.");
                    }
                }
            } else {
                setIsSmiling(false);
                setLivenessMessage("No face detected. Please look at the camera.");
            }
        }
    };

    useEffect(() => {
        let interval;
        if (modelsLoaded && !selfieImage) {
            // Run the expression detection twice a second
            interval = setInterval(detectSmile, 500);
        }
        return () => clearInterval(interval);
    }, [modelsLoaded, selfieImage]);

    // Capture Selfie from Webcam
    const captureSelfie = useCallback((e) => {
        if (e) e.preventDefault();
        if (!isSmiling) {
            alert("Please follow the camera guidance before capturing.");
            return;
        }
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
                setSelfieImage(imageSrc);
                speakText("Selfie captured successfully.");
            }
        }
    }, [webcamRef, isSmiling]);

    // Convert Base64 to File
    const dataURLtoFile = (dataurl, filename) => {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type:mime});
    }

    const verifyFaces = async () => {
        if (!frontIdImage || !selfieImage) {
            alert("Please upload the front of your ID and capture a selfie.");
            return;
        }

        setIsVerifying(true);
        setResult(null);

        const formData = new FormData();
        formData.append("id_image", frontIdImage); // We send Front ID to Python AI
        formData.append("selfie_image", dataURLtoFile(selfieImage, "selfie.jpg"));
        
        // These would normally go to Laravel, but we append them just to simulate the complete payload
        formData.append("id_type", idType);
        if (backIdImage) formData.append("back_id_image", backIdImage);

        // Add the names to verify against OCR
        formData.append("first_name", firstName);
        formData.append("last_name", lastName);

        try {
            const response = await fetch(`${API_BASE_URL}/ekyc/verify`, {
                method: "POST",
                headers: { Accept: 'application/json' },
                body: formData
            });
            const data = await response.json();
            if (!response.ok) {
                setResult({ error: Object.values(data.errors || {}).flat()[0] || data.error || data.message || 'Verification failed. Please try again.' });
                return;
            }
            setResult(data);
            
            if (data.match) {
                speakText("Verification successful.");
                if (onVerifySuccess) await onVerifySuccess(data, formData);
            } else {
                speakText("Verification failed. " + (data.message || data.error));
            }
        } catch {
            setResult({ error: "Failed to connect to the AI server." });
            speakText("Failed to connect to the server.");
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <div style={{ maxWidth: '650px', margin: '40px auto', padding: '30px', fontFamily: 'sans-serif', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '25px' }}>ID and Selfie Submission</h2>
            
            {/* ID TYPE SELECTION */}
            <div style={{ marginBottom: '20px', padding: '20px', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h4 style={{ margin: 0, color: '#555' }}>Step 1: Select ID Type</h4>
                    <button onClick={() => speakText("Step 1: Select ID Type. Please choose the type of valid ID you will upload from the dropdown menu.")} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#007bff' }} title="Read Aloud"><Volume2 size={20} /></button>
                </div>
                <select 
                    value={idType} 
                    onChange={(e) => setIdType(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '1rem' }}
                >
                    <option>National ID (PhilSys)</option>
                    <option>UMID (SSS/GSIS)</option>
                    <option>Driver's License</option>
                    <option>Passport</option>
                    <option>Senior Citizen ID</option>
                    <option>Voter's ID</option>
                    <option>Postal ID</option>
                    <option>PRC ID</option>
                </select>
            </div>

            {/* FRONT ID */}
            <div style={{ marginBottom: '20px', padding: '20px', border: '2px dashed #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h4 style={{ margin: 0, color: '#555' }}>Step 2: Upload Front of ID</h4>
                    <button onClick={() => speakText("Step 2: Upload Front of ID. Click the button below to browse your files and select the front image of your " + idType + ".")} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#007bff' }} title="Read Aloud"><Volume2 size={20} /></button>
                </div>
                <input type="file" id="frontUpload" accept="image/jpeg,image/png" onChange={(e) => selectIdImage(e, setFrontIdImage)} style={{ display: 'none' }} />
                <label htmlFor="frontUpload" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '12px', backgroundColor: frontIdImage ? '#28a745' : '#6c757d', color: 'white', textAlign: 'center', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', boxSizing: 'border-box' }}>
                    {frontIdImage ? <><Check size={18} /> Front ID Selected</> : <><Upload size={18} /> Choose Front ID</>}
                </label>
            </div>

            {/* BACK ID */}
            <div style={{ marginBottom: '20px', padding: '20px', border: '2px dashed #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h4 style={{ margin: 0, color: '#555' }}>Step 3: Upload Back of ID (if applicable)</h4>
                    <button onClick={() => speakText("Step 3: Upload Back of ID (if applicable). Click the button below to upload the back image of your " + idType + ". Skip this step if your ID has no back.")} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#007bff' }} title="Read Aloud"><Volume2 size={20} /></button>
                </div>
                <input type="file" id="backUpload" accept="image/jpeg,image/png" onChange={(e) => selectIdImage(e, setBackIdImage)} style={{ display: 'none' }} />
                <label htmlFor="backUpload" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '12px', backgroundColor: backIdImage ? '#28a745' : '#6c757d', color: 'white', textAlign: 'center', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', boxSizing: 'border-box' }}>
                    {backIdImage ? <><Check size={18} /> Back ID Selected</> : <><Upload size={18} /> Choose Back ID</>}
                </label>
            </div>

            {/* LIVENESS SELFIE */}
            <div style={{ marginBottom: '20px', padding: '20px', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h4 style={{ margin: 0, color: '#555' }}>Step 4: Selfie Capture</h4>
                    <button onClick={() => speakText("Step 4: Selfie Capture. Current status: " + livenessMessage)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#007bff' }} title="Read Aloud Status"><Volume2 size={20} /></button>
                </div>
                <p style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', color: isSmiling ? '#28a745' : '#dc3545', fontWeight: 'bold', marginTop: 0 }}>
                    <Lock size={16} /> Camera guidance: {livenessMessage}
                </p>
                
                {!selfieImage ? (
                    !hardwareBlocked && (
                        <>
                            <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '8px', border: isSmiling ? '4px solid #28a745' : '4px solid #dc3545' }}>
                                <Webcam
                                    audio={false}
                                    onUserMediaError={() => { setHardwareBlocked(true); setLivenessMessage('Camera access is unavailable. Allow camera access and reload this page.'); }}
                                    onUserMedia={stream => {
                                        const label = stream.getVideoTracks()[0]?.label.toLowerCase() || '';
                                        if (['virtual', 'obs', 'epoccam', 'snap camera'].some(name => label.includes(name))) {
                                            setHardwareBlocked(true);
                                            setLivenessMessage('Choose a physical camera in your browser settings, then reload.');
                                        }
                                    }}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    width="100%"
                                    mirrored={true}
                                    videoConstraints={{ facingMode: "user" }}
                                />
                                {/* HCI Direct Manipulation: Camera Guide Overlay */}
                                <div style={{
                                    position: 'absolute',
                                    top: 0, left: 0, right: 0, bottom: 0,
                                    pointerEvents: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <div style={{
                                        width: '250px',
                                        height: '350px',
                                        maxWidth: '60%',
                                        maxHeight: '80%',
                                        border: `4px dashed ${isSmiling ? '#28a745' : 'rgba(255, 255, 255, 0.8)'}`,
                                        borderRadius: '50%',
                                        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)',
                                        transition: 'border-color 0.3s ease'
                                    }} />
                                </div>
                            </div>
                            <button 
                                onClick={captureSelfie}
                                disabled={!isSmiling}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '12px', marginTop: '15px', backgroundColor: isSmiling ? '#28a745' : '#ccc', color: 'white', border: 'none', borderRadius: '5px', cursor: isSmiling ? 'pointer' : 'not-allowed', fontWeight: 'bold' }}
                            >
                                <Camera size={18} /> Capture Selfie
                            </button>
                        </>
                    )
                ) : (
                    <>
                        <img src={selfieImage} alt="Selfie" style={{ width: '100%', borderRadius: '5px' }} />
                        <button 
                            onClick={() => { setSelfieImage(null); setIsSmiling(false); speakText("Retaking selfie."); }}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '12px', marginTop: '15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            <RefreshCw size={18} /> Retake Selfie
                        </button>
                    </>
                )}
            </div>

            <button 
                onClick={verifyFaces} 
                disabled={isVerifying || !frontIdImage || !selfieImage}
                style={{ width: '100%', padding: '15px', backgroundColor: (isVerifying || !frontIdImage || !selfieImage) ? '#ccc' : '#007bff', color: 'white', border: 'none', borderRadius: '5px', fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold' }}
            >
                {isVerifying ? "Verifying with AI..." : "Submit Verification"}
            </button>

            {result && (
                <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: result.match ? '#d4edda' : '#f8d7da' }}>
                    <h4 style={{ color: result.match ? '#155724' : '#721c24', margin: 0 }}>
                        {result.message || result.error}
                    </h4>
                </div>
            )}
        </div>
    );
};

export default FaceRegistration;
