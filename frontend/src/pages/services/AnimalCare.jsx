import { useState, useEffect } from 'react';
import { MapPin, Clock, Calendar, Syringe, Stethoscope, FileSignature, AlertTriangle, PawPrint, Activity, Shield, Pin } from 'lucide-react';
import { useFadeUp } from '../../hooks/useFadeUp';
import Modal from '../../components/Modal';
import api, { getApiError, todayInManila } from '../../utils/api';

const AnimalCare = () => {
    useFadeUp();
  const [showReqModal, setShowReqModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [petName, setPetName] = useState('');
  const [species, setSpecies] = useState('');
  const [serviceRequired, setServiceRequired] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/public/service/reserve', {
        service_name: 'Animal Care',
        reservation_date: preferredDate,
        purpose: `Pet: ${petName} (${species}) - Service: ${serviceRequired}`,
        first_name: firstName,
        last_name: lastName,
        email: email,
        contact_number: contactNumber,
        address: address || 'N/A', 
      });
      setShowSuccessModal(true);
      
      
      setFirstName('');
      setLastName('');
      setContactNumber('');
      setEmail('');
      setAddress('');
      setPetName('');
      setSpecies('');
      setServiceRequired('');
      setPreferredDate('');
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto w-full px-4 md:px-10 py-8 mb-20">
    
    <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden mb-12 shadow-lg bg-customDarkBlue">
      <img src="/assets/images/animalhealthcare.jpg" alt="Animal Care Facility" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Animal Health Care</h1>
        <p className="text-gray-200 text-lg flex items-center gap-2 mb-4">
          <MapPin size={20} className="text-red-400" /> Olympia Community Complex <span className="text-gray-400">|</span> <Clock size={20} className="text-blue-400" /> Mon - Fri: 8:00 AM - 5:00 PM
        </p>
        <div className="flex flex-wrap gap-2 mt-2">
           <span className="bg-customYellow text-customBlack text-xs font-bold px-3 py-1.5 rounded-full shadow uppercase tracking-wide">Free Anti-Rabies</span>
           <span className="bg-customBlue text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow">Basic Consultations</span>
           <span className="bg-customBlue text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow">Pet Registration</span>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        <div className="lg:col-span-1 space-y-8">
            
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold text-customBlue border-b-2 border-gray-200 pb-2 mb-4">Available Services</h3>
                <ul className="space-y-4">
                    <li className="flex gap-4 items-start">
                        <div className="text-2xl"><Syringe size={24} className='text-blue-500' /></div>
                        <div>
                            <h4 className="font-bold text-gray-800 text-sm">Anti-Rabies Vaccination</h4>
                            <p className="text-xs text-gray-500 mt-1">Free annual shots for dogs and cats aged 3 months and older.</p>
                        </div>
                    </li>
                    <li className="flex gap-4 items-start">
                        <div className="text-2xl"><Stethoscope size={24} className='text-blue-500' /></div>
                        <div>
                            <h4 className="font-bold text-gray-800 text-sm">General Check-up</h4>
                            <p className="text-xs text-gray-500 mt-1">Basic physical examination, deworming, and health advice.</p>
                        </div>
                    </li>
                    <li className="flex gap-4 items-start">
                        <div className="text-2xl"><FileSignature size={24} className='text-blue-500' /></div>
                        <div>
                            <h4 className="font-bold text-gray-800 text-sm">LGU Pet Registration</h4>
                            <p className="text-xs text-gray-500 mt-1">Register your pet to receive their official barangay tag.</p>
                        </div>
                    </li>
                </ul>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold text-customBlue border-b pb-2 mb-4 flex items-center gap-2">
                    <Calendar size={20} /> Weekly Schedule
                </h3>
                <ul className="space-y-3 text-sm">
                    <li className="flex justify-between items-center border-b border-gray-50 pb-2">
                        <span className="font-bold text-gray-700">Anti-Rabies Shots</span>
                        <span className="text-customBlue font-medium">Mon, Wed, Fri</span>
                    </li>
                    <li className="flex justify-between items-center border-b border-gray-50 pb-2">
                        <span className="font-bold text-gray-700">General Check-up</span>
                        <span className="text-customBlue font-medium">Tue & Thu</span>
                    </li>
                    <li className="flex justify-between items-center">
                        <span className="font-bold text-gray-700">Registration</span>
                        <span className="text-customBlue font-medium">Daily</span>
                    </li>
                </ul>
            </div>

            <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                <h3 className="font-bold text-lg mb-3 text-yellow-800 flex items-center gap-2">
                    <AlertTriangle size={20} className='inline-block' /> Clinic Guidelines
                </h3>
                <ul className="space-y-3 text-sm text-yellow-900">
                    <li className="flex items-start gap-2">
                        <span className="font-bold">•</span> Dogs must be on a leash. Cats must be in a secure carrier or cage.
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="font-bold">•</span> Bring your valid Barangay ID for verification.
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="font-bold">•</span> Bring previous vaccination cards if applicable.
                    </li>
                </ul>
            </div>
            
            <div>
                <a href="https://www.google.com/maps/search/?api=1&query=Olympia+Health+Center,+Makati" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-customDarkBlue font-bold py-2.5 px-6 rounded-lg transition-colors border border-gray-200">
                  <MapPin size={18} className="text-red-500" /> Open in Google Maps
                </a>
            </div>

        </div>

        <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-customBlue uppercase tracking-wide">Book an Appointment</h2>
                    <p className="text-gray-500 text-sm mt-1">Skip the line by scheduling your visit in advance.</p>
                </div>
                
                {error && <div className="mb-6 bg-red-50 text-red-600 text-sm p-4 rounded-lg border border-red-200">{error}</div>}

                
              <form id="booking-form"  className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-gray-100 pb-6">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Owner First Name</label>
                            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Juan" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-customBlue focus:ring-1 focus:ring-customBlue bg-white" required={true} pattern="^[A-Za-z\s\-ñÑ]+$" title="Only letters, spaces, and hyphens are allowed" minLength="2" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Owner Last Name</label>
                            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Dela Cruz" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-customBlue focus:ring-1 focus:ring-customBlue bg-white" required={true} pattern="^[A-Za-z\s\-ñÑ]+$" title="Only letters, spaces, and hyphens are allowed" minLength="2" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Email Address</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="juan@example.com" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-customBlue focus:ring-1 focus:ring-customBlue bg-white" required={true} />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Contact Number</label>
                            <input type="tel" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} placeholder="09XX XXX XXXX" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-customBlue focus:ring-1 focus:ring-customBlue bg-white" required={true} pattern="^09\d{9}$" title="Must be an 11-digit mobile number starting with 09" maxLength="11" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Address</label>
                            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Barangay St." className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-customBlue focus:ring-1 focus:ring-customBlue bg-white" required={true} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Pet's Name</label>
                            <input type="text" value={petName} onChange={(e) => setPetName(e.target.value)} placeholder="Bantay" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-customBlue focus:ring-1 focus:ring-customBlue bg-white" required={true} />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Species / Type</label>
                            <select value={species} onChange={(e) => setSpecies(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-customBlue focus:ring-1 focus:ring-customBlue bg-white cursor-pointer text-gray-700" required={true}>
                                <option value="" disabled={true} >Select Pet Type</option>
                                <option value="dog">Dog</option>
                                <option value="cat">Cat</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 pt-6">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Service Required</label>
                            <select value={serviceRequired} onChange={(e) => setServiceRequired(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-customBlue focus:ring-1 focus:ring-customBlue bg-white cursor-pointer text-gray-700" required={true}>
                                <option value="" disabled={true} >Select Service</option>
                                <option value="anti-rabies">Anti-Rabies Vaccination</option>
                                <option value="checkup">General Check-up</option>
                                <option value="registration">LGU Pet Registration</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Preferred Date</label>
                            <input type="date" min={todayInManila()} value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-customBlue focus:ring-1 focus:ring-customBlue bg-white text-gray-700 cursor-pointer" required={true}  title="Please select a valid future date" />
                        </div>
                    </div>

                    <div className="pt-6 mt-4">
                        <button type="submit" disabled={loading} className="w-full bg-customBlue text-white font-bold py-4 rounded-xl hover:bg-customDarkBlue transition-colors shadow-md text-lg disabled:opacity-50">
                            {loading ? 'Confirming...' : 'Confirm Appointment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>

    </div>

    <div className="mt-12 mb-20">
    <div className="flex items-center justify-between mb-8 border-b-2 border-gray-200 pb-4">
        <h2 className="text-3xl font-extrabold text-customBlue flex items-center gap-3">
            <PawPrint size={24} className='inline-block' /> Community Pet Updates
        </h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <img src="https://images.pexels.com/photos/6235136/pexels-photo-6235136.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Vet examining dog" className="w-full h-48 object-cover" />
            <div className="p-6">
                <h4 className="text-lg font-bold text-customDarkBlue mb-2">Mass Anti-Rabies Drive</h4>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">The Makati City Veterinary Services Office will conduct a mass anti-rabies vaccination at the Olympia Covered Court this Saturday. Open to all residents.</p>
                <button type="button" className="text-customBlue font-semibold text-sm hover:underline">Read full post</button>
            </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <img src="https://images.pexels.com/photos/6833139/pexels-photo-6833139.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Cat at vet" className="w-full h-48 object-cover" />
            <div className="p-6">
                <h4 className="text-lg font-bold text-customDarkBlue mb-2">Free Spay & Neuter</h4>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">Pre-registration is now open for our upcoming Kapon (Spay/Neuter) Campaign. Limited to 50 cats and dogs. Visit the clinic to secure your slot.</p>
                <button type="button" className="text-customBlue font-semibold text-sm hover:underline">Read full post</button>
            </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <img src="https://images.pexels.com/photos/7288674/pexels-photo-7288674.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Happy dog" className="w-full h-48 object-cover" />
            <div className="p-6">
                <h4 className="text-lg font-bold text-customDarkBlue mb-2">Importance of Pet Tags</h4>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">Make sure your furry friends are registered! Official barangay pet tags help us identify lost pets and ensure our community is safe from rabies.</p>
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
                <span className="text-customBlue">Q:</span> Can I bring multiple pets at once?
            </h4>
            <p className="text-gray-600 text-sm ml-6">Yes, you may bring up to three (3) pets per visit. However, you must submit a separate booking form for each pet so we can accurately prepare their records and vaccines.</p>
        </div>
        <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
            <h4 className="font-bold text-gray-800 text-lg mb-2 flex items-center gap-2">
                <span className="text-customBlue">Q:</span> What should I do if my pet bites someone?
            </h4>
            <p className="text-gray-600 text-sm ml-6">Secure your pet immediately and do not harm them. Bring the bitten person to the nearest Animal Bite Treatment Center (like OsMak) and report the incident to the Barangay desk for monitoring.</p>
        </div>
        <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
            <h4 className="font-bold text-gray-800 text-lg mb-2 flex items-center gap-2">
                <span className="text-customBlue">Q:</span> Do you offer grooming services?
            </h4>
            <p className="text-gray-600 text-sm ml-6">No. The barangay animal health care facility focuses strictly on public health services (vaccinations, basic medical consults, and registration). We do not provide grooming or boarding.</p>
        </div>
    </div>
    </div>

    <div className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-10">
    <div className="bg-gray-200 rounded-3xl flex items-center justify-center min-h-[320px] overflow-hidden shadow-lg border border-gray-200 relative group cursor-pointer">
        <a href="https://www.google.com/maps/place/Makati+City+Animal+Care+Facility/@14.574563,121.023784,17z/data=!3m1!4b1!4m6!3m5!1s0x3397c9007c749285:0xa5481a753a753975!8m2!3d14.574563!4d121.023784!16s%2Fg%2F11xkx8cdh9!5m1!1e4?entry=ttu" target="_blank" className="absolute inset-0 z-10 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors duration-300">
            <div className="bg-white text-customBlue font-bold py-3 px-6 rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 flex items-center gap-2">
                📍 Open in Google Maps
            </div>
        </a>
        <iframe 
            className="w-full h-full min-h-[320px] pointer-events-none opacity-90 group-hover:opacity-100 transition-opacity" 
            src="https://maps.google.com/maps?q=14.574563,121.023784+(Makati+City+Animal+Care+Facility)&t=&z=17&ie=UTF8&iwloc=B&output=embed" 
            frameBorder="0" 
            scrolling="no" 
            marginHeight="0" 
            marginWidth="0">
        </iframe>
    </div>
    
    <div className="bg-customDarkBlue rounded-3xl p-8 md:p-12 text-white shadow-lg flex flex-col justify-center">
        <h2 className="text-3xl font-extrabold text-customYellow mb-2">Important Hotlines</h2>
        <p className="text-gray-300 mb-8 text-sm">Save these numbers for animal bites, stray reports, or veterinary emergencies.</p>
        
        <ul className="space-y-6">
            <li className="flex items-center gap-4 border-b border-white/10 pb-4">
                <div className="bg-red-500/20 p-3 rounded-full text-red-400 text-xl"><Activity size={24} /></div>
                <div>
                    <h4 className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">OsMak Animal Bite Center</h4>
                    <p className="text-2xl font-black">(02) 8882-6316</p>
                </div>
            </li>
            <li className="flex items-center gap-4 border-b border-white/10 pb-4">
                <div className="bg-blue-500/20 p-3 rounded-full text-blue-300 text-xl">🏢</div>
                <div>
                    <h4 className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">Makati City Vet Office</h4>
                    <p className="text-2xl font-black">(02) 8870-1234</p>
                </div>
            </li>
            <li className="flex items-center gap-4">
                <div className="bg-yellow-500/20 p-3 rounded-full text-customYellow text-xl"><Shield size={24} className='inline-block' />️</div>
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
            <div className="bg-yellow-50 p-3 rounded-full text-yellow-600 shadow-sm text-2xl"><PawPrint size={24} className='inline-block' /></div>
            <div>
              <h2 className="text-2xl font-extrabold text-customBlack">Requirements</h2>
              <p className="text-xs font-semibold text-customBlue uppercase tracking-wider mt-1">Animal Health Care</p>
            </div>
          </div>
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">Please ensure you have the following ready before bringing your pet to the facility:</p>
          <ul className="space-y-4 mb-8 bg-gray-50 p-5 rounded-xl border border-gray-100">
            <li className="flex items-start gap-3"><svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg><span className="text-gray-800 text-sm font-medium">Valid Barangay ID of the pet owner</span></li>
            <li className="flex items-start gap-3"><svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg><span className="text-gray-800 text-sm font-medium">Previous Pet Vaccination Card (if applicable)</span></li>
            <li className="flex items-start gap-3"><svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg><span className="text-gray-800 text-sm font-medium">Dogs must be on a leash. Cats must be inside a secure carrier or cage.</span></li>
          </ul>
          <button onClick={() => setShowReqModal(false)} type="button" className="w-full border-2 border-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors">Got it, Close</button>
        </div>
      </Modal>

      <Modal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
        <div className="bg-customWhite p-8 md:p-10 rounded-3xl shadow-2xl border border-gray-100 max-w-md w-full text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-50 mb-6 border-4 border-green-100">
            <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h2 className="text-2xl font-extrabold text-customBlack mb-2">Appointment Set! <PawPrint size={24} className='inline-block' /></h2>
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">Your visit to the Animal Health Care facility has been scheduled. You will receive an email confirmation once a staff member reviews the details.</p>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 text-left">
            <p className="text-sm font-semibold text-customDarkBlue mb-1 flex items-center gap-2"><Pin size={16} className='inline-block' /> Important Reminder</p>
            <p className="text-xs text-customBlue leading-relaxed">Please don't forget to bring your pet's previous vaccination card (if any) and your valid Barangay ID on the day of your visit.</p>
          </div>
          <button onClick={() => setShowSuccessModal(false)} type="button" className="w-full bg-customBlue text-white font-bold py-3 rounded-xl hover:bg-customDarkBlue transition-colors shadow-md text-base">Done</button>
        </div>
      </Modal>

  </div>
  );
};

export default AnimalCare;
