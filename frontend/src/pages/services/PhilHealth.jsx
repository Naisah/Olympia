import { useState, useEffect } from 'react';
import { MapPin, Clock, Calendar, AlertTriangle, Printer } from 'lucide-react';
import { useFadeUp } from '../../hooks/useFadeUp';
import Modal from '../../components/Modal';
import api, { getApiError, todayInManila } from '../../utils/api';

const PhilHealth = () => {
    useFadeUp();
  const [showReqModal, setShowReqModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    contact_number: '',
    address: '',
    philhealth_no: '',
    service_needed: '',
    preferred_date: '',
    time_slot: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        service_name: 'PhilHealth', 
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        contact_number: formData.contact_number,
        address: formData.address,
        reservation_date: `${formData.preferred_date} (${formData.time_slot})`,
        purpose: `Service: ${formData.service_needed}, PhilHealth No: ${formData.philhealth_no || 'N/A'}`
      };
      await api.post('/public/service/reserve', payload);
      setShowSuccessModal(true);
      setFormData({
        first_name: '', last_name: '', email: '', contact_number: '', address: '',
        philhealth_no: '', service_needed: '', preferred_date: '', time_slot: ''
      });
    } catch (error) {
      console.error('Submission failed', error);
      alert(getApiError(error));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-6xl mx-auto w-full px-4 md:px-10 py-8 mb-20">
    
    <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden mb-12 shadow-lg bg-green-700">
      <img src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=1200" alt="PhilHealth Help Desk" className="w-full h-full object-cover opacity-60 mix-blend-overlay" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8 text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">PhilHealth & Konsulta</h1>
        <p className="text-gray-200 text-lg flex items-center gap-2 mb-4">
          <MapPin size={20} className="text-red-400" /> Olympia Health Center <span className="text-gray-400">|</span> <Clock size={20} className="text-blue-400" /> Mon - Fri: 8:00 AM - 4:00 PM
        </p>
        <div className="flex flex-wrap gap-2">
           <span className="bg-customYellow text-customBlack text-xs font-bold px-3 py-1.5 rounded-full shadow uppercase tracking-wide">Konsulta Registration</span>
           <span className="bg-green-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow">MDR Printing</span>
           <span className="bg-green-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow">Member Updating</span>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold text-customBlue border-b pb-2 mb-4">Assistance Services</h3>
                <ul className="space-y-4 text-sm">
                    <li><strong>📋 Konsulta Registration:</strong> Register our health center as your primary care provider for free checkups and meds.</li>
                    <li><strong><Printer size={16} className="inline-block mr-1" /> MDR Printing:</strong> Free printing of your Member Data Record for hospital use.</li>
                    <li><strong>✍️ Record Updating:</strong> Update your dependents, address, or marital status.</li>
                </ul>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold text-customBlue border-b pb-2 mb-4 flex items-center gap-2">
                    <Calendar size={20} /> Desk Schedule
                </h3>
                <ul className="space-y-3 text-sm">
                    <li className="flex justify-between items-center border-b border-gray-50 pb-2">
                        <span className="font-bold text-gray-700">MDR Printing</span>
                        <span className="text-customBlue font-medium">Daily</span>
                    </li>
                    <li className="flex justify-between items-center border-b border-gray-50 pb-2">
                        <span className="font-bold text-gray-700">New Registration</span>
                        <span className="text-customBlue font-medium">Mon, Wed, Fri</span>
                    </li>
                    <li className="flex justify-between items-center">
                        <span className="font-bold text-gray-700">Konsulta Profiling</span>
                        <span className="text-customBlue font-medium">Tue & Thu</span>
                    </li>
                </ul>
            </div>

            <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                <h3 className="font-bold text-lg mb-2 text-green-700 flex items-center gap-2">
                    <AlertTriangle size={20} /> Did you know?
                </h3>
                <p className="text-sm text-green-900 leading-relaxed">
                    Under the Universal Health Care Law, all Filipinos are automatically PhilHealth members. You just need to register to claim your benefits!
                </p>
                <a href="https://www.google.com/maps/search/?api=1&query=Olympia+Health+Center,+Makati" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-customDarkBlue font-bold py-2.5 px-6 rounded-lg transition-colors border border-gray-200 mt-4">
                  <MapPin size={18} className="text-red-500" /> Open in Google Maps
                </a>
            </div>

            <button id="view-req-btn" type="button" onClick={() => setShowReqModal(true)} className="w-full border-2 border-customBlue text-customBlue font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-sm text-base">
                View Full Requirements
            </button>
        </div>

        <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                <div className="mb-6 border-b border-gray-100 pb-4">
                    <h2 className="text-2xl font-bold text-customBlue uppercase tracking-wide">Request Assistance</h2>
                    <p className="text-sm text-gray-500 mt-2">Skip the line at the regional office. Process your basic PhilHealth requests right here at the barangay.</p>
                </div>
                
                
              <form id="booking-form"  className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">First Name</label>
                            <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="Juan" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-customBlue focus:ring-1 focus:ring-customBlue bg-white" required={true} />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Last Name</label>
                            <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Dela Cruz" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-customBlue focus:ring-1 focus:ring-customBlue bg-white" required={true} />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 pt-6">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Email Address</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="juan@example.com" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-customBlue focus:ring-1 focus:ring-customBlue bg-white" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Contact Number</label>
                            <input type="tel" name="contact_number" value={formData.contact_number} onChange={handleChange} placeholder="09XX XXX XXXX" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-customBlue focus:ring-1 focus:ring-customBlue bg-white" required={true} pattern="^09\d{9}$" title="Must be an 11-digit mobile number starting with 09" maxLength="11" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 border-t border-gray-100 pt-6">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Complete Address</label>
                            <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="123 Example St, Brgy. Olympia" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-customBlue focus:ring-1 focus:ring-customBlue bg-white" required={true} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 pt-6">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">PhilHealth Number (If known)</label>
                            <input type="text" name="philhealth_no" value={formData.philhealth_no} onChange={handleChange} placeholder="xx-xxxxxxxxx-x" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-customBlue focus:ring-1 focus:ring-customBlue bg-white" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Service Needed</label>
                            <select name="service_needed" value={formData.service_needed} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-customBlue focus:ring-1 focus:ring-customBlue bg-white text-gray-700 cursor-pointer" required={true}>
                                <option value="" disabled={true} >Select (MDR, Konsulta, Register)</option>
                                <option value="MDR Printing">MDR Printing</option>
                                <option value="Konsulta Registration">Konsulta Registration</option>
                                <option value="Member Registration/Updating">Member Registration/Updating</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 pt-6">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Preferred Date</label>
                            <input type="date" min={todayInManila()} name="preferred_date" value={formData.preferred_date} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-customBlue focus:ring-1 focus:ring-customBlue bg-white text-gray-700 cursor-pointer" required={true}  title="Please select a valid future date" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Time Preference</label>
                            <select name="time_slot" value={formData.time_slot} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-customBlue focus:ring-1 focus:ring-customBlue bg-white text-gray-700 cursor-pointer" required={true}>
                                <option value="" disabled={true} >Select an Hourly Slot</option>
                                <option value="8am - 9am">8:00 AM - 9:00 AM</option>
                                <option value="9am - 10am">9:00 AM - 10:00 AM</option>
                                <option value="10am - 11am">10:00 AM - 11:00 AM</option>
                                <option value="11am - 12pm">11:00 AM - 12:00 PM</option>
                                <option value="1pm - 2pm">1:00 PM - 2:00 PM</option>
                                <option value="2pm - 3pm">2:00 PM - 3:00 PM</option>
                                <option value="3pm - 4pm">3:00 PM - 4:00 PM</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-6 mt-4">
                        <button type="submit" disabled={isSubmitting} className="w-full bg-customBlue text-white font-bold py-4 rounded-xl hover:bg-customDarkBlue transition-colors shadow-md text-lg disabled:bg-blue-300 disabled:cursor-not-allowed">
                            {isSubmitting ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

      <div className="mt-12 mb-20">
    <div className="flex items-center justify-between mb-8 border-b-2 border-gray-200 pb-4">
        <h2 className="text-3xl font-extrabold text-customBlue flex items-center gap-3">
            📰 PhilHealth Updates
        </h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <img src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80" alt="Paperwork" className="w-full h-48 object-cover" />
            <div className="p-6">
                <h4 className="text-lg font-bold text-customDarkBlue mb-2">PMRF Form Updates</h4>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">The PhilHealth Member Registration Form (PMRF) has been updated. Please download the latest version from our portal before visiting the barangay desk.</p>
                <button type="button" className="text-customBlue font-semibold text-sm hover:underline">Read full post</button>
            </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80" alt="Konsulta Package Caravan" className="w-full h-48 object-cover" />
            <div className="p-6">
                <h4 className="text-lg font-bold text-customDarkBlue mb-2">Konsulta Package Caravan</h4>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">Register your family for the Konsulta package this weekend! Our health center will hold a mass registration caravan at the Barangay Olympia Covered Court.</p>
                <button type="button" className="text-customBlue font-semibold text-sm hover:underline">Read full post</button>
            </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <img src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=600&q=80" alt="Scam Warning" className="w-full h-48 object-cover" />
            <div className="p-6">
                <h4 className="text-lg font-bold text-customDarkBlue mb-2">Anti-Scam Advisory</h4>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">Beware of online fixers offering fake PhilHealth IDs for a fee. All PhilHealth IDs and MDR printing services at the barangay health center are 100% FREE.</p>
                <button type="button" className="text-customBlue font-semibold text-sm hover:underline">Read full post</button>
            </div>
        </div>
    </div>
      </div>

      <div className="mb-20 bg-white p-8 md:p-12 rounded-3xl border border-gray-200 shadow-sm">
        <h2 className="text-3xl font-extrabold text-customBlue text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4 max-w-3xl mx-auto">
        <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
            <h4 className="font-bold text-gray-800 text-lg mb-2 flex items-center gap-2">
                <span className="text-customBlue">Q:</span> Can I get the physical PhilHealth PVC ID here?
            </h4>
            <p className="text-gray-600 text-sm ml-6">No. The barangay health center can only print your Member Data Record (MDR), which acts as your official proof of membership. For the PVC Insurance ID card, you must visit a PhilHealth Local Health Insurance Office (LHIO).</p>
        </div>
        <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
            <h4 className="font-bold text-gray-800 text-lg mb-2 flex items-center gap-2">
                <span className="text-customBlue">Q:</span> What is the PhilHealth Konsulta Package?
            </h4>
            <p className="text-gray-600 text-sm ml-6">It is a primary care benefit package that provides free consultations, health screening, basic laboratory tests, and free medicines for specific conditions. You must assign our health center as your provider to claim it here.</p>
        </div>
        <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
            <h4 className="font-bold text-gray-800 text-lg mb-2 flex items-center gap-2">
                <span className="text-customBlue">Q:</span> Do I have to pay to print my MDR?
            </h4>
            <p className="text-gray-600 text-sm ml-6">No. All PhilHealth assistance services handled by the barangay desk are completely free of charge.</p>
        </div>
        </div>
      </div>

      <div className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-gray-200 rounded-3xl flex items-center justify-center min-h-[320px] overflow-hidden shadow-lg border border-gray-200 relative group cursor-pointer">
        <a href="https://www.google.com/maps/place/Oblisa+(Olympia)+Health+Center+-+Makati+City+Health+Department/@14.5745589,121.0184908,17z/data=!3m1!4b1!4m6!3m5!1s0x3397c9a54b920a89:0x65e00f1bb9d0ba9c!8m2!3d14.5745589!4d121.0210711!16s%2Fg%2F11bzvytmw9!5m1!1e4?entry=ttu" target="_blank" className="absolute inset-0 z-10 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors duration-300">
            <div className="bg-white text-customBlue font-bold py-3 px-6 rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 flex items-center gap-2">
                📍 Open in Google Maps
            </div>
        </a>
        <iframe 
            className="w-full h-full min-h-[320px] pointer-events-none opacity-90 group-hover:opacity-100 transition-opacity" 
            src="https://maps.google.com/maps?q=14.5745589,121.0210711+(Olympia+Health+Center)&t=&z=17&ie=UTF8&iwloc=B&output=embed" 
            frameBorder="0" 
            scrolling="no" 
            marginHeight="0" 
            marginWidth="0">
        </iframe>
        </div>

        <div className="bg-customDarkBlue rounded-3xl p-8 md:p-12 text-white shadow-lg flex flex-col justify-center">
            <h2 className="text-3xl font-extrabold text-customYellow mb-2">Important Contacts</h2>
            <p className="text-gray-300 mb-8 text-sm">For major PhilHealth concerns beyond the scope of the barangay.</p>
        
        <ul className="space-y-6">
            <li className="flex items-center gap-4 border-b border-white/10 pb-4">
                <div className="bg-green-500/20 p-3 rounded-full text-green-400 text-xl">🏛️</div>
                <div>
                    <h4 className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">PhilHealth Makati Branch</h4>
                    <p className="text-xl font-black">(02) 8441-7442</p>
                    <p className="text-sm font-medium text-gray-300">ITC Bldg, Sen. Gil Puyat Ave.</p>
                </div>
            </li>
            <li className="flex items-center gap-4 border-b border-white/10 pb-4">
                <div className="bg-blue-500/20 p-3 rounded-full text-blue-300 text-xl">📞</div>
                <div>
                    <h4 className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">PhilHealth Action Center</h4>
                    <p className="text-xl font-black">(02) 8662-2588</p>
                </div>
            </li>
            <li className="flex items-center gap-4">
                <div className="bg-yellow-500/20 p-3 rounded-full text-customYellow text-xl">🛡️</div>
                <div>
                    <h4 className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">Brgy. Olympia Rescue</h4>
                    <p className="text-xl font-black">(02) 8897-5967</p>
                </div>
            </li>
        </ul>
        </div>
      </div>
      <Modal isOpen={showReqModal} onClose={() => setShowReqModal(false)}>
        <div className="bg-customWhite p-8 rounded-3xl shadow-2xl border border-gray-100 max-w-md w-full">
          <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-4">
            <div className="bg-yellow-50 p-3 rounded-full text-yellow-600 shadow-sm text-2xl">🛡️</div>
            <div>
              <h2 className="text-2xl font-extrabold text-customBlack">Requirements</h2>
              <p className="text-xs font-semibold text-customBlue uppercase tracking-wider mt-1">PhilHealth Services</p>
            </div>
          </div>
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">Please ensure you have the following ready before your visit:</p>
          <ul className="space-y-4 mb-8 bg-gray-50 p-5 rounded-xl border border-gray-100">
            <li className="flex items-start gap-3"><svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg><span className="text-gray-800 text-sm font-medium">Valid Barangay ID</span></li>
            <li className="flex items-start gap-3"><svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg><span className="text-gray-800 text-sm font-medium">PhilHealth MDR or Member ID number</span></li>
            <li className="flex items-start gap-3"><svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg><span className="text-gray-800 text-sm font-medium">Recent 1x1 or 2x2 photo (for new registrations)</span></li>
          </ul>
          <button onClick={() => setShowReqModal(false)} type="button" className="w-full border-2 border-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors">Got it, Close</button>
        </div>
      </Modal>

      <Modal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
        <div className="bg-customWhite p-8 md:p-10 rounded-3xl shadow-2xl border border-gray-100 max-w-md w-full text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-50 mb-6 border-4 border-green-100">
            <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h2 className="text-2xl font-extrabold text-customBlack mb-2">Request Logged! 🛡️</h2>
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">Your PhilHealth request has been logged for processing. A staff member will review your submission and send a confirmation via SMS.</p>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 text-left">
            <p className="text-sm font-semibold text-customDarkBlue mb-1 flex items-center gap-2">📌 Important Reminder</p>
            <p className="text-xs text-customBlue leading-relaxed">Please bring original copies of all your documents on the day of your visit. Photocopies may not be accepted for certain transactions.</p>
          </div>
          <button onClick={() => setShowSuccessModal(false)} type="button" className="w-full bg-customBlue text-white font-bold py-3 rounded-xl hover:bg-customDarkBlue transition-colors shadow-md text-base">Done</button>
        </div>
      </Modal>

    </div>
  );
};

export default PhilHealth;
