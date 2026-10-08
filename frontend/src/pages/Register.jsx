import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import FaceRegistration from '../components/FaceRegistration';
import { residentApi } from '../utils/api';

const Register = () => {
    const [step, setStep] = useState(1);
    
    // User details
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
        address: '',
        contact_number: ''
    });

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const nextStep = (e) => {
        e.preventDefault();
        setError('');
        if (formData.password !== formData.password_confirmation) {
            setError("Passwords do not match!");
            return;
        }
        setStep(2);
    };

    const handleVerifySuccess = async (_faceData, ekycFormData) => {
        setIsLoading(true);
        setError('');

        try {
            // Append basic user details to the eKYC form data
            // Since our backend accepts multipart/form-data now (to handle images)
            const finalData = new FormData();
            finalData.append('first_name', formData.first_name);
            finalData.append('last_name', formData.last_name);
            finalData.append('email', formData.email);
            finalData.append('password', formData.password);
            finalData.append('address', formData.address);
            finalData.append('contact_number', formData.contact_number);
            
            // Add biometric data
            finalData.append('selfie_image', ekycFormData.get('selfie_image'));
            finalData.append('password_confirmation', formData.password_confirmation);
            finalData.append('id_type', ekycFormData.get('id_type'));
            if (ekycFormData.get('back_id_image')) finalData.append('back_id_image', ekycFormData.get('back_id_image'));
            finalData.append('id_image', ekycFormData.get('id_image')); // This is the file

            // Use axios to send the final registration payload
            await residentApi.post('/user/register', finalData);
            
            // Registration successful! Log them in via useAuth or redirect
            // For now, redirect to login
            alert("Registration successful! Your ID details are pending review.");
            navigate('/login');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || err.response?.data?.message || 'Failed to register account.');
            setStep(1); // Go back to step 1 to fix errors
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: step === 1 ? '500px' : '700px', margin: '40px auto', fontFamily: 'sans-serif' }}>
            {/* Visual Progress Stepper (HCI Principle: Visibility of System Status) */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '30px', gap: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: step === 1 ? 1 : 0.5, transition: 'opacity 0.3s' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: step >= 1 ? '#28a745' : '#ccc', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>1</div>
                    <span style={{ fontWeight: 'bold', color: step >= 1 ? '#28a745' : '#ccc' }}>Account Details</span>
                </div>
                
                <div style={{ height: '4px', width: '50px', backgroundColor: step >= 2 ? '#28a745' : '#ccc', borderRadius: '2px', transition: 'background-color 0.3s' }}></div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: step === 2 ? 1 : 0.5, transition: 'opacity 0.3s' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: step >= 2 ? '#28a745' : '#ccc', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>2</div>
                    <span style={{ fontWeight: 'bold', color: step >= 2 ? '#28a745' : '#ccc' }}>Identity Verification</span>
                </div>
            </div>

            {step === 1 && (
                <div style={{ padding: '30px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '25px' }}>Resident Registration - Step 1</h2>
                    
                    {error && <div style={{ padding: '10px', marginBottom: '20px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '5px' }}>{error}</div>}

                    <form onSubmit={nextStep}>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>First Name</label>
                                <input type="text" name="first_name" maxLength={50} pattern="[\p{L}\p{M}\s\-']+" title="Only letters, spaces, hyphens, and apostrophes are allowed" required value={formData.first_name} onChange={handleInputChange} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', boxSizing: 'border-box' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Last Name</label>
                                <input type="text" name="last_name" maxLength={50} pattern="[\p{L}\p{M}\s\-']+" title="Only letters, spaces, hyphens, and apostrophes are allowed" required value={formData.last_name} onChange={handleInputChange} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', boxSizing: 'border-box' }} />
                            </div>
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email Address</label>
                            <input type="email" name="email" required maxLength="150" value={formData.email} onChange={handleInputChange} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', boxSizing: 'border-box' }} />
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Phone Number</label>
                            <input type="tel" pattern="^(09|\+639)\d{9}$" title="Must be a valid Philippine mobile number (e.g. 09123456789)" name="contact_number" required value={formData.contact_number} onChange={handleInputChange} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', boxSizing: 'border-box' }} />
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Address</label>
                            <textarea name="address" required maxLength="250" value={formData.address} onChange={handleInputChange} rows="2" style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', boxSizing: 'border-box' }}></textarea>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Password</label>
                                <input type="password" name="password" minLength={8} pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters" required value={formData.password} onChange={handleInputChange} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', boxSizing: 'border-box' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Confirm Password</label>
                                <input type="password" name="password_confirmation" minLength={8} required value={formData.password_confirmation} onChange={handleInputChange} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', boxSizing: 'border-box' }} />
                            </div>
                        </div>

                        <button type="submit" style={{ width: '100%', padding: '15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}>
                            Continue to Identity Verification
                        </button>
                    </form>
                    <div style={{ marginTop: '20px', textAlign: 'center', color: '#666' }}>
                        Already have an account? <Link to="/login" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>Login here</Link>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div>
                    {isLoading && (
                        <div style={{ padding: '20px', backgroundColor: '#e2e3e5', color: '#383d41', borderRadius: '8px', textAlign: 'center', marginBottom: '20px', fontWeight: 'bold' }}>
                            Processing Registration. Please wait...
                        </div>
                    )}
                    
                    {!isLoading && (
                        <>
                            <button onClick={() => setStep(1)} style={{ marginBottom: '20px', padding: '10px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                                &larr; Back to Details
                            </button>
                            <FaceRegistration 
                                onVerifySuccess={handleVerifySuccess} 
                                firstName={formData.first_name}
                                lastName={formData.last_name}
                            />
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default Register;
