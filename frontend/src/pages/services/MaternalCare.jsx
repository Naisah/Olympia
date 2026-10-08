import { useState, useEffect } from 'react';
import { MapPin, Clock, Calendar, AlertTriangle, Heart } from 'lucide-react';
import { useFadeUp } from '../../hooks/useFadeUp';
import Modal from '../../components/Modal';
import api, { getApiError, todayInManila } from '../../utils/api';

const MaternalCare = () => {
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
    patient_type: '',
    service_required: '',
    preferred_date: '',
    time_slot: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        service_name: 'Maternal Care', 
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        contact_number: formData.contact_number,
        address: formData.address,
        reservation_date: `${formData.preferred_date} (${formData.time_slot})`,
        purpose: `Patient: ${formData.patient_type}, Service: ${formData.service_required}`
      };
      await api.post('/public/service/reserve', payload);
      setShowSuccessModal(true);
      setFormData({
        first_name: '', last_name: '', email: '', contact_number: '', address: '',
        patient_type: '', service_required: '', preferred_date: '', time_slot: ''
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
    
    <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden mb-12 shadow-lg">
      <img src="https://images.unsplash.com/photo-1531983412531-1f49a365ffed?q=80&w=1200&auto=format&fit=crop" alt="Mother and Baby" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-8 text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">Maternal & Child Care</h1>
        <p className="text-gray-200 text-lg mb-4 flex items-center gap-2"><MapPin size={20} className="text-red-400" /> Olympia Health Center | <Clock size={20} className="text-blue-400" /> Wed & Fri: 8:00 AM - 12:00 NN</p>
        <div className="flex flex-wrap gap-2">
           <span className="bg-customYellow text-customBlack text-xs font-bold px-3 py-1.5 rounded-full shadow uppercase tracking-wide">Free Immunization</span>
           <span className="bg-customBlue text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow">Prenatal Care</span>
           <span className="bg-customBlue text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow">Family Planning</span>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold text-customBlue border-b pb-2 mb-4">Clinic Services</h3>
                <ul className="space-y-4 text-sm">
                    <li><strong>🤰 Prenatal Care:</strong> Regular check-ups and vitamins for expecting mothers.</li>
                    <li><strong>👶 Immunization:</strong> Scheduled free vaccines for infants and toddlers.</li>
                    <li><strong>🤱 Family Planning:</strong> Free counseling and reproductive health services.</li>
                </ul>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold text-customBlue border-b pb-2 mb-4 flex items-center gap-2">
                    <Calendar size={20} /> Weekly Schedule
                </h3>
                <ul className="space-y-3 text-sm">
                    <li className="flex justify-between items-center border-b border-gray-50 pb-2">
                        <span className="font-bold text-gray-700">Prenatal (OB-GYN)</span>
                        <span className="text-customBlue font-medium">Wednesdays</span>
                    </li>
                    <li className="flex justify-between items-center border-b border-gray-50 pb-2">
                        <span className="font-bold text-gray-700">Immunization</span>
                        <span className="text-customBlue font-medium">Fridays</span>
                    </li>
                    <li className="flex justify-between items-center">
                        <span className="font-bold text-gray-700">Family Planning</span>
                        <span className="text-customBlue font-medium">Mon & Thu</span>
                    </li>
                </ul>
            </div>

            <div className="bg-pink-50 p-6 rounded-xl border border-pink-200">
                <h3 className="font-bold text-lg mb-2 text-pink-800 flex items-center gap-2">
                    💕 Health Reminders
                    <Heart size={20} /> Health Reminders
                </h3>
                <p className="text-sm text-pink-900 leading-relaxed">
                    Maternal and child consultations are strictly scheduled to protect infants from crowding. Please arrive exactly on your given time slot.
                </p>
                <a href="https://www.google.com/maps/search/?api=1&query=Olympia+Health+Center,+Makati" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-customDarkBlue font-bold py-2.5 px-6 rounded-lg transition-colors border border-gray-200">
                  <MapPin size={18} className="text-red-500" /> Open in Google Maps
                </a>
            </div>

            <button id="view-req-btn" type="button" onClick={() => setShowReqModal(true)} className="w-full border-2 border-customBlue text-customBlue font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-sm text-base">
                View Full Requirements
            </button>
        </div>

        <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                <h2 className="text-2xl font-bold text-customBlue mb-6 uppercase tracking-wide">Schedule a Visit</h2>
                
              <form id="booking-form"  className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">First Name</label>
                            <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="Maria" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-customBlue focus:ring-1 focus:ring-customBlue bg-white" required={true} />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Last Name</label>
                            <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Dela Cruz" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-customBlue focus:ring-1 focus:ring-customBlue bg-white" required={true} />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 pt-6">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Email Address</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="maria@example.com" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-customBlue focus:ring-1 focus:ring-customBlue bg-white" />
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
                            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Patient Type</label>
                            <select name="patient_type" value={formData.patient_type} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-customBlue focus:ring-1 focus:ring-customBlue bg-white text-gray-700 cursor-pointer" required={true}>
                                <option value="" disabled={true} >Expecting Mother / Infant</option>
                                <option value="Expecting Mother">Expecting Mother</option>
                                <option value="Infant / Toddler">Infant / Toddler</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Service Required</label>
                            <select name="service_required" value={formData.service_required} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-customBlue focus:ring-1 focus:ring-customBlue bg-white text-gray-700 cursor-pointer" required={true}>
                                <option value="" disabled={true} >Select Service</option>
                                <option value="Prenatal Care">Prenatal Care</option>
                                <option value="Immunization">Immunization</option>
                                <option value="Family Planning">Family Planning</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 pt-6">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Preferred Date</label>
                            <input type="date" min={todayInManila()} name="preferred_date" value={formData.preferred_date} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-customBlue focus:ring-1 focus:ring-customBlue bg-white text-gray-700 cursor-pointer" required={true}  title="Please select a valid future date" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Time Slot</label>
                            <select name="time_slot" value={formData.time_slot} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-customBlue focus:ring-1 focus:ring-customBlue bg-white text-gray-700 cursor-pointer" required={true}>
                                <option value="" disabled={true} >Morning Only</option>
                                <option value="8am - 9am">8:00 AM - 9:00 AM</option>
                                <option value="9am - 10am">9:00 AM - 10:00 AM</option>
                                <option value="10am - 11am">10:00 AM - 11:00 AM</option>
                                <option value="11am - 12pm">11:00 AM - 12:00 PM</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-6 mt-4">
                        <button type="submit" disabled={isSubmitting} className="w-full bg-customBlue text-white font-bold py-4 rounded-xl hover:bg-customDarkBlue transition-colors shadow-md text-lg disabled:bg-blue-300 disabled:cursor-not-allowed">
                            {isSubmitting ? 'Confirming...' : 'Confirm Appointment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>

    </div>

    <div className="mt-12 mb-20">
    <div className="flex items-center justify-between mb-8 border-b-2 border-gray-200 pb-4">
        <h2 className="text-3xl font-extrabold text-customBlue flex items-center gap-3">
            📢 Barangay Olympia Updates
        </h2>
        <a href="https://www.facebook.com/p/Barangay-Olympia-61553382107668/" target="_blank" className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1">
            View on Facebook 
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
        </a>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <img src="https://images.unsplash.com/photo-1584515933487-779824d29309?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Health Drive" className="w-full h-48 object-cover" />
            <div className="p-6">
                <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">3 days ago</p>
                <h4 className="text-lg font-bold text-customDarkBlue mb-2">Sabayang Patak Kontra Polio</h4>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">Attention moms! Bring your babies (0-59 months old) to the Pio Del Pilar Health Center this coming Friday for our free Vitamin A supplementation and Polio drops.</p>
                <button type="button" className="text-customBlue font-semibold text-sm hover:underline">Read full post</button>
            </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <img src="https://picsum.photos/seed/maternity/600/400" alt="Buntis Kit Essentials" className="w-full h-48 object-cover" />
            <div className="p-6">
                <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">1 week ago</p>
                <h4 className="text-lg font-bold text-customDarkBlue mb-2">Free Buntis Kits Distribution</h4>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">The Makati City Government and Barangay Olympia are distributing free maternity kits for all registered pregnant women holding a valid Makati Yellow Card.</p>
                <button type="button" className="text-customBlue font-semibold text-sm hover:underline">Read full post</button>
            </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-48 bg-customBlue flex items-center justify-center p-6 text-center">
                <h3 className="text-2xl font-black text-white uppercase tracking-wider">Family Planning<br />Seminar</h3>
            </div>
            <div className="p-6">
                <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">2 weeks ago</p>
                <h4 className="text-lg font-bold text-customDarkBlue mb-2">Monthly Orientation</h4>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">Join us for a free orientation regarding reproductive health and family planning methods available at our health center.</p>
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
                <span className="text-customBlue">Q:</span> Do I need a Makati Yellow Card for free vaccines?
            </h4>
            <p className="text-gray-600 text-sm ml-6">No, basic immunizations for infants are free for all residents regardless of Yellow Card status. However, the card is highly recommended for additional hospital benefits at OsMak.</p>
        </div>
        
        <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
            <h4 className="font-bold text-gray-800 text-lg mb-2 flex items-center gap-2">
                <span className="text-customBlue">Q:</span> What if I miss my baby's scheduled vaccine?
            </h4>
            <p className="text-gray-600 text-sm ml-6">Please contact the health center immediately to be rescheduled on the next available Friday slot. Do not wait for the next month to avoid delaying their protection.</p>
        </div>

        <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
            <h4 className="font-bold text-gray-800 text-lg mb-2 flex items-center gap-2">
                <span className="text-customBlue">Q:</span> Are walk-ins allowed for prenatal checkups?
            </h4>
            <p className="text-gray-600 text-sm ml-6">Walk-ins are accommodated for emergencies. For regular monthly checkups, please use the online booking form above to secure your slot and minimize waiting times in the clinic.</p>
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
        <h2 className="text-3xl font-extrabold text-customYellow mb-2">Emergency Hotlines</h2>
        <p className="text-gray-300 mb-8 text-sm">Save these numbers on your phone for immediate medical response inside Makati City.</p>
        
        <ul className="space-y-6">
            <li className="flex items-center gap-4 border-b border-white/10 pb-4">
                <div className="bg-red-500/20 p-3 rounded-full text-red-400 text-xl"><AlertTriangle size={24} /></div>
                <div>
                    <h4 className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">Makati Command Center</h4>
                    <p className="text-2xl font-black">168 / (02) 8870-1920</p>
                </div>
            </li>
            <li className="flex items-center gap-4 border-b border-white/10 pb-4">
                <div className="bg-blue-500/20 p-3 rounded-full text-blue-300 text-xl">🏥</div>
                <div>
                    <h4 className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">Ospital ng Makati (OsMak)</h4>
                    <p className="text-2xl font-black">(02) 8882-6316</p>
                </div>
            </li>
            <li className="flex items-center gap-4">
                <div className="bg-yellow-500/20 p-3 rounded-full text-customYellow text-xl">🛡️</div>
                <div>
                    <h4 className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">Brgy. Olympia Rescue</h4>
                    <p className="text-2xl font-black">(02) 8897-5967</p>
                </div>
            </li>
        </ul>
      </div>
    </div>
      <Modal isOpen={showReqModal} onClose={() => setShowReqModal(false)}>
        <div className="bg-customWhite p-8 rounded-3xl shadow-2xl border border-gray-100 max-w-md w-full">
          <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-4">
            <div className="bg-yellow-50 p-3 rounded-full text-yellow-600 shadow-sm text-2xl">👶</div>
            <div>
              <h2 className="text-2xl font-extrabold text-customBlack">Requirements</h2>
              <p className="text-xs font-semibold text-customBlue uppercase tracking-wider mt-1">Maternal & Child Care</p>
            </div>
          </div>
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">Please ensure you have the following ready before your visit:</p>
          <ul className="space-y-4 mb-8 bg-gray-50 p-5 rounded-xl border border-gray-100">
            <li className="flex items-start gap-3"><svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg><span className="text-gray-800 text-sm font-medium">Valid Yellow Card (Barangay ID)</span></li>
            <li className="flex items-start gap-3"><svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg><span className="text-gray-800 text-sm font-medium">Previous prenatal/postnatal records</span></li>
            <li className="flex items-start gap-3"><svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg><span className="text-gray-800 text-sm font-medium">Child's immunization booklet (for child checkups)</span></li>
          </ul>
          <button onClick={() => setShowReqModal(false)} type="button" className="w-full border-2 border-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors">Got it, Close</button>
        </div>
      </Modal>

      <Modal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
        <div className="bg-customWhite p-8 md:p-10 rounded-3xl shadow-2xl border border-gray-100 max-w-md w-full text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-50 mb-6 border-4 border-green-100">
            <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h2 className="text-2xl font-extrabold text-customBlack mb-2">Appointment Set! 👶</h2>
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">Your prenatal/child checkup has been scheduled. A staff member will review the details and send a final confirmation via SMS.</p>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 text-left">
            <p className="text-sm font-semibold text-customDarkBlue mb-1 flex items-center gap-2">📌 Important Reminder</p>
            <p className="text-xs text-customBlue leading-relaxed">Please bring your previous prenatal/postnatal records and your child's immunization booklet on the day of your visit.</p>
          </div>
          <button onClick={() => setShowSuccessModal(false)} type="button" className="w-full bg-customBlue text-white font-bold py-3 rounded-xl hover:bg-customDarkBlue transition-colors shadow-md text-base">Done</button>
        </div>
      </Modal>

  </div>
  );
};

export default MaternalCare;
