import { useState } from 'react';
import { useFadeUp } from '../hooks/useFadeUp';
import api from '../utils/api';

const Contact = () => {
  useFadeUp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all fields.');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      await api.post('/public/contact', formData);
      setIsModalOpen(true);
      setFormData({ name: '', email: '', message: '' });
    } catch {
      setError('Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="page-banner bg-customDarkBlue py-8">
        <div className="banner-content w-[90%] max-w-[1200px] mx-auto">
          <div className="banner-title flex items-center gap-4">
            <span className="yellow-line w-[6px] h-[55px] bg-customYellow block"></span>
            <h1 className="text-white text-3xl font-bold m-0">GET IN TOUCH</h1>
          </div>
        </div>
      </div>

      <main className="w-[90%] max-w-[1200px] mx-auto my-12 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-8 md:p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="text-3xl font-extrabold text-customDarkBlue mb-4">We are here to help!</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                Have questions about our services, barangay IDs, or community programs? 
                Feel free to reach out to the Barangay Olympia council. We are always ready to assist you.
              </p>
            </div>

            <div className="flex flex-col gap-6 mt-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-customBlue">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">Our Location</h4>
                  <p className="text-gray-600 mt-1">Barangay Hall, Olympia, Makati City, Metro Manila</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-customBlue">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">Phone Numbers</h4>
                  <p className="text-gray-600 mt-1">Barangay Hall: (02) 8897-5555<br />Emergency: (02) 8897-9999</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-customBlue">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">Facebook Page</h4>
                  <a href="https://www.facebook.com/p/Barangay-Olympia-61553382107668/" target="_blank" rel="noreferrer" className="text-customBlue hover:underline mt-1 block">Barangay Olympia Official</a>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl overflow-hidden border border-gray-200 h-[250px] shadow-sm">
              <iframe 
                src="https://www.google.com/maps?q=Barangay+Olympia+Makati&output=embed" 
                className="w-full h-full border-0" 
                allowFullScreen="" 
                loading="lazy">
              </iframe>
            </div>
          </div>

          <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-customDarkBlue mb-6">Send us a Message</h3>
            
            <form className="flex flex-col gap-5">
              {error && <div className="p-3 bg-red-100 text-red-700 rounded-xl text-sm font-semibold">{error}</div>}
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">Full Name</label>
                <input 
                  type="text" 
                  placeholder="Juan Dela Cruz" 
                  className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-customBlue/50 focus:border-customBlue transition-all bg-white shadow-sm"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">Email Address</label>
                <input 
                  type="email" 
                  placeholder="juan@example.com" 
                  className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-customBlue/50 focus:border-customBlue transition-all bg-white shadow-sm"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">Message</label>
                <textarea 
                  rows="5" 
                  placeholder="How can we help you?" 
                  className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-customBlue/50 focus:border-customBlue transition-all bg-white shadow-sm resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>

              <button 
                type="button" 
                onClick={handleSubmit} 
                disabled={loading}
                id="send-btn" 
                className={`mt-4 w-full bg-customBlue hover:bg-customDarkBlue text-white font-bold py-4 rounded-xl transition-colors shadow-md hover:shadow-lg flex justify-center items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <span>{loading ? 'Sending...' : 'Send Message'}</span>
                {!loading && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>}
              </button>
            </form>
          </div>
        </div>
      </main>

      <div id="success-modal" className={`fixed inset-0 bg-black/60 z-50 ${isModalOpen ? 'flex' : 'hidden'} items-center justify-center transition-opacity duration-300`}>
        <div className="bg-white rounded-3xl p-8 max-w-sm w-[90%] flex flex-col items-center text-center transform scale-100 transition-transform duration-300 shadow-2xl relative">
          <button onClick={closeModal} id="close-modal-x" className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>

          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-500">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
          </div>
          
          <h3 className="text-2xl font-extrabold text-customDarkBlue mb-2">Message Sent!</h3>
          <p className="text-gray-600 text-sm mb-8 leading-relaxed">
            Thank you for reaching out to us. We have received your message and will get back to you shortly.
          </p>
          
          <button onClick={closeModal} id="close-modal-btn" className="w-full bg-customBlue hover:bg-customDarkBlue text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm hover:shadow-md">
            Got it, thanks!
          </button>
        </div>
      </div>
    </>
  );
};

export default Contact;
