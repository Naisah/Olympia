import { useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getApiError, todayInManila } from '../utils/api';

import Modal from '../components/Modal';

import imgId from '../assets/images/doc_id_new.png';
import imgCert from '../assets/images/doc_certificate_new.png';
import imgClear from '../assets/images/doc_clipboard_new.png';

const Documents = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    address: '',
    email: '',
    contact_number: '',
    purpose: '',
    sex: '',
    dob: '',
    full_name: '', 
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openModal = (modalId) => {
    setActiveModal(modalId);
    
    setFormData({
      first_name: '', last_name: '', address: '', email: '', contact_number: '', purpose: '', sex: '', dob: '', full_name: ''
    });
  };
  
  const closeModal = () => setActiveModal(null);

  const handleSubmit = async (e, documentName) => {
    e.preventDefault();
    setLoading(true);

    try {
      
      let fName = formData.first_name;
      let lName = formData.last_name;
      if (formData.full_name) {
        const parts = formData.full_name.split(',');
        if (parts.length > 1) {
          lName = parts[0].trim();
          fName = parts[1].trim();
        } else {
          fName = formData.full_name.trim();
          lName = "N/A";
        }
      }

      let finalPurpose = formData.purpose;
      if (documentName === 'Barangay ID') {
        finalPurpose = `Sex: ${formData.sex}, DOB: ${formData.dob}`;
      }

      await api.post('/public/document/request', {
        document_name: documentName,
        purpose: finalPurpose || 'General Request',
        sex: formData.sex || null,
        dob: formData.dob || null,
        first_name: fName || 'Guest',
        last_name: lName || 'User',
        email: formData.email || null,
        contact_number: formData.contact_number || 'N/A',
        address: formData.address || 'N/A',
      });
      
      closeModal();
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Submission error:', error);
      alert(getApiError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-banner">
        <div className="banner-content">
          <Link to="/documents" className="banner-btn active" id="btn-documents">
            <span className="yellow-line"></span> DOCUMENTS
          </Link>
          <Link to="/services" className="banner-btn" id="btn-facility">
            FACILITY SERVICES <span className="yellow-line"></span>
          </Link>
        </div>
      </div>

      <main className="container">
        <div className="doc-cards-grid">
          <div className="doc-card">
            <img src={imgId} alt="Barangay ID" className="w-full h-[200px] object-contain bg-white p-4" />
            <div className="doc-info">
              <h3>Barangay ID Request</h3>
              <span className="doc-subtitle">ONLINE BARANGAY ID REQUEST</span>
              <p>Make a request to get your Barangay ID Online!</p>
              <button className="btn-request" onClick={() => openModal('modal-id')}>Request Now!</button>
            </div>
          </div>

          <div className="doc-card">
            <img src={imgCert} alt="Barangay Certificate" className="w-full h-[200px] object-contain bg-white p-4" />
            <div className="doc-info">
              <h3>Barangay Certificate Request</h3>
              <span className="doc-subtitle">ONLINE BARANGAY CERTIFICATE REQUEST</span>
              <p>Easily get your Barangay Certificate for your intended purpose online!</p>
              <button className="btn-request" onClick={() => openModal('modal-cert')}>Request Now!</button>
            </div>
          </div>

          <div className="doc-card">
            <img src={imgClear} alt="Barangay Clearance" className="w-full h-[200px] object-contain bg-white p-4" />
            <div className="doc-info">
              <h3>Barangay Clearance Request</h3>
              <span className="doc-subtitle">ONLINE BARANGAY CLEARANCE REQUEST</span>
              <p>An alternative way to request a Barangay Clearance for your intended purpose!</p>
              <button className="btn-request" onClick={() => openModal('modal-clear')}>Request Now!</button>
            </div>
          </div>
        </div>
      </main>

      
      <div 
        id="modal-id" 
        className="modal-overlay" 
        style={{ display: activeModal === 'modal-id' ? 'flex' : 'none' }}
        onClick={(e) => { if(e.target.className === 'modal-overlay') closeModal(); }}
      >
        <div className="modal-box">
          <div className="modal-header">
            <span className="yellow-bar"></span> Barangay ID Forms
            <span className="close-btn" onClick={closeModal}>&times;</span>
          </div>
          <div className="modal-body">
            <h2 className="modal-title">BARANGAY ID REQUEST</h2>
            <p className="modal-desc">Request the creation of your Barangay ID at home.</p>
            
            <form className="doc-form" onSubmit={(e) => handleSubmit(e, 'Barangay ID')}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Fill in the blank" required />
                </div>
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="Fill in the Blank" required />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter Email" required />
                </div>
                <div className="form-group">
                  <label>Contact Number</label>
                  <input type="text" name="contact_number" value={formData.contact_number} onChange={handleChange} placeholder="09xxxxxxxxx" pattern="09[0-9]{9}" maxLength="11" title="Please enter a valid 11-digit Philippine mobile number starting with 09" required />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Current Address" required />
                </div>
                <div className="form-group">
                  <label>Sex</label>
                  <select name="sex" value={formData.sex} onChange={handleChange} required>
                    <option value="" disabled>Sex</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input type="date" max={todayInManila()} name="dob" value={formData.dob} onChange={handleChange} required />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-confirm">{loading ? 'Confirming...' : 'Confirm'}</button>
            </form>
          </div>
        </div>
      </div>

      
      <div 
        id="modal-cert" 
        className="modal-overlay" 
        style={{ display: activeModal === 'modal-cert' ? 'flex' : 'none' }}
        onClick={(e) => { if(e.target.className === 'modal-overlay') closeModal(); }}
      >
        <div className="modal-box">
          <div className="modal-header">
            <span className="yellow-bar"></span> Barangay Certificate Forms
            <span className="close-btn" onClick={closeModal}>&times;</span>
          </div>
          <div className="modal-body">
            <h2 className="modal-title">BARANGAY CERTIFICATE REQUEST</h2>
            <p className="modal-desc">Request the creation of your Barangay Certificate for your intended purpose, at home!</p>
            
            <form className="doc-form" onSubmit={(e) => handleSubmit(e, 'Barangay Certificate')}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Last name, First name M.I." required />
                </div>
                <div className="form-group">
                  <label>Full Address</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Enter Full Address" required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter Email" required />
                </div>
                <div className="form-group">
                  <label>Contact Number</label>
                  <input type="text" name="contact_number" value={formData.contact_number} onChange={handleChange} placeholder="09xxxxxxxxx" pattern="09[0-9]{9}" maxLength="11" title="Please enter a valid 11-digit Philippine mobile number starting with 09" required />
                </div>
                <div className="form-group">
                  <label>Purpose</label>
                  <select name="purpose" value={formData.purpose} onChange={handleChange} required>
                    <option value="" disabled>Intended Purpose</option>
                    <option value="Employment">Employment</option>
                    <option value="Bank Requirement">Bank Requirement</option>
                    <option value="School Requirement">School Requirement</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input type="date" required />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-confirm">{loading ? 'Confirming...' : 'Confirm'}</button>
            </form>
          </div>
        </div>
      </div>

      
      <div 
        id="modal-clear" 
        className="modal-overlay" 
        style={{ display: activeModal === 'modal-clear' ? 'flex' : 'none' }}
        onClick={(e) => { if(e.target.className === 'modal-overlay') closeModal(); }}
      >
        <div className="modal-box">
          <div className="modal-header">
            <span className="yellow-bar"></span> Barangay Clearance Forms
            <span className="close-btn" onClick={closeModal}>&times;</span>
          </div>
          <div className="modal-body">
            <h2 className="modal-title">BARANGAY CLEARANCE REQUEST</h2>
            <p className="modal-desc">Request the creation of your Barangay Clearance for your intended purpose, at home!</p>
            
            <form className="doc-form" onSubmit={(e) => handleSubmit(e, 'Barangay Clearance')}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Last name, First name M.I." required />
                </div>
                <div className="form-group">
                  <label>Full Address</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Enter Full Address" required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter Email" required />
                </div>
                <div className="form-group">
                  <label>Contact Number</label>
                  <input type="text" name="contact_number" value={formData.contact_number} onChange={handleChange} placeholder="09xxxxxxxxx" pattern="09[0-9]{9}" maxLength="11" title="Please enter a valid 11-digit Philippine mobile number starting with 09" required />
                </div>
                <div className="form-group">
                  <label>Purpose</label>
                  <select name="purpose" value={formData.purpose} onChange={handleChange} required>
                    <option value="" disabled>Intended Purpose</option>
                    <option value="Employment">Employment</option>
                    <option value="Business Permit">Business Permit</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input type="date" required />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-confirm">{loading ? 'Confirming...' : 'Confirm'}</button>
            </form>
          </div>
        </div>
      </div>

      <Modal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
        <div className="bg-customWhite p-8 md:p-10 rounded-3xl shadow-2xl border border-gray-100 max-w-md w-full text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-50 mb-6 border-4 border-green-100">
            <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h2 className="text-2xl font-extrabold text-customBlack mb-2">Request Submitted!</h2>
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">Your document request has been received. You will receive an email confirmation once a staff member reviews it.</p>
          <button onClick={() => setShowSuccessModal(false)} type="button" className="w-full bg-customBlue text-white font-bold py-3 rounded-xl hover:bg-customDarkBlue transition-colors shadow-md text-base">Done</button>
        </div>
      </Modal>
    </>
  );
};

export default Documents;
