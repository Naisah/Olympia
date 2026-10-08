import { useState } from 'react';
import { Link } from 'react-router-dom';

const Services = () => {
  const [filter, setFilter] = useState('all');

  return (
    <>
      <div className="page-banner">
        <div className="banner-content">
          <Link to="/services" className="banner-btn active" id="btn-facility">
            <span className="yellow-line"></span> FACILITY SERVICES 
          </Link>
          <Link to="/documents" className="banner-btn" id="btn-documents">
            DOCUMENTS <span className="yellow-line"></span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-8 py-10 px-6 flex-grow">
        
        <aside className="w-full md:w-1/4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h3 className="text-xl font-bold text-customBlue mb-4 border-b-2 border-customYellow pb-2">Service Categories</h3>
            <ul className="space-y-3 text-gray-700 font-medium">
              <li><button onClick={() => setFilter('all')} className={`filter-link block w-full text-left transition-all ${filter === 'all' ? 'text-customBlue font-bold pl-2' : 'hover:text-customBlue hover:pl-2'}`}>All Services</button></li>
              <li><button onClick={() => setFilter('recreation')} className={`filter-link block w-full text-left transition-all ${filter === 'recreation' ? 'text-customBlue font-bold pl-2' : 'hover:text-customBlue hover:pl-2'}`}>Recreation</button></li>
              <li><button onClick={() => setFilter('veterinary')} className={`filter-link block w-full text-left transition-all ${filter === 'veterinary' ? 'text-customBlue font-bold pl-2' : 'hover:text-customBlue hover:pl-2'}`}>Veterinary</button></li>
              <li><button onClick={() => setFilter('medical')} className={`filter-link block w-full text-left transition-all ${filter === 'medical' ? 'text-customBlue font-bold pl-2' : 'hover:text-customBlue hover:pl-2'}`}>Medical</button></li>
              <li><button onClick={() => setFilter('family-health')} className={`filter-link block w-full text-left transition-all ${filter === 'family-health' ? 'text-customBlue font-bold pl-2' : 'hover:text-customBlue hover:pl-2'}`}>Family Health</button></li>
              <li><button onClick={() => setFilter('prevention')} className={`filter-link block w-full text-left transition-all ${filter === 'prevention' ? 'text-customBlue font-bold pl-2' : 'hover:text-customBlue hover:pl-2'}`}>Prevention</button></li>
              <li><button onClick={() => setFilter('support')} className={`filter-link block w-full text-left transition-all ${filter === 'support' ? 'text-customBlue font-bold pl-2' : 'hover:text-customBlue hover:pl-2'}`}>Support</button></li>
              <li><button onClick={() => setFilter('administration')} className={`filter-link block w-full text-left transition-all ${filter === 'administration' ? 'text-customBlue font-bold pl-2' : 'hover:text-customBlue hover:pl-2'}`}>Administration</button></li>
            </ul>
            
            <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h4 className="font-bold text-customDarkBlue mb-2">Need Help?</h4>
              <p className="text-sm text-gray-600 mb-3">Contact the barangay hall for immediate assistance.</p>
              <p className="text-sm font-semibold text-customBlue flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                (02) 8897-5830
              </p>
            </div>
          </div>
        </aside>

        <main className="w-full md:w-3/4">
          <div className="mb-6">
            <p className="text-gray-500">Explore and book available services and facilities in Barangay Olympia.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">

            {(filter === 'all' || filter === 'recreation') && (
              <div id="recreation" className="bg-customWhite rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
                <div className="h-48 bg-gray-200 relative">
                  <img src="/assets/images/baranggay.png" alt="Olympia Community Complex" className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-customWhite px-3 py-1 rounded-full text-xs font-bold text-customBlue shadow">Recreation</div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">Barangay Covered Court</h3>
                  <p className="text-xs font-semibold text-customBlue mb-3 uppercase tracking-wider">Sports and Recreation Center</p>
                  <p className="text-gray-600 text-sm mb-6 flex-grow">A safe space for basketball, volleyball, and community events. Available for neighborhood tournaments and practice.</p>
                  <div className="flex justify-center mt-auto">
                    <Link to="/services/covered-court" className="border border-customBlue text-customBlue font-bold py-2 px-6 rounded-md hover:bg-blue-50 transition-colors text-sm shadow-sm" style={{display: 'block', textAlign: 'center'}}>View Schedule & Booking</Link>
                  </div>
                </div>
              </div>
            )}

            {(filter === 'all' || filter === 'veterinary') && (
              <div id="veterinary" className="bg-customWhite rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
                <div className="h-48 bg-gray-200 relative">
                  <img src="/assets/images/animalhealthcare.jpg" alt="Animal Care Facility" className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-customWhite px-3 py-1 rounded-full text-xs font-bold text-customBlue shadow">Veterinary</div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">Animal Health Care</h3>
                  <p className="text-xs font-semibold text-customBlue mb-3 uppercase tracking-wider">Anti-Rabies and Pet Care</p>
                  <p className="text-gray-600 text-sm mb-6 flex-grow">We host regular anti-rabies vaccination drives and health checkups to keep our animals healthy and safe.</p>
                  <div className="flex justify-center mt-auto">
                    <Link to="/services/animal-care" className="border border-customBlue text-customBlue font-bold py-2 px-6 rounded-md hover:bg-blue-50 transition-colors text-sm shadow-sm" style={{display: 'block', textAlign: 'center'}}>Facility Info & Booking</Link>
                  </div>
                </div>
              </div>
            )}

            {(filter === 'all' || filter === 'medical') && (
              <div id="medical" className="bg-customWhite rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
                <div className="h-48 bg-gray-200 relative">
                  <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Health Center" className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-customWhite px-3 py-1 rounded-full text-xs font-bold text-customBlue shadow">Medical</div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">General Medical Consult</h3>
                  <p className="text-xs font-semibold text-customBlue mb-3 uppercase tracking-wider">Pio Del Pilar Health Center</p>
                  <p className="text-gray-600 text-sm mb-6 flex-grow">We offer free basic checkups and medical advice for residents. Visit the health center during weekday mornings to consult with our available medical staff.</p>
                  <div className="flex justify-center mt-auto">
                    <Link to="/services/medical-consult" className="border border-customBlue text-customBlue font-bold py-2 px-6 rounded-md hover:bg-blue-50 transition-colors text-sm shadow-sm" style={{display: 'block', textAlign: 'center'}}>Requirements & Booking</Link>
                  </div>
                </div>
              </div>
            )}

            {(filter === 'all' || filter === 'family-health') && (
              <div id="family-health" className="bg-customWhite rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
                <div className="h-48 bg-gray-200 relative">
                  <img src="https://images.unsplash.com/photo-1584982751601-97dcc096659c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Maternal Care" className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-customWhite px-3 py-1 rounded-full text-xs font-bold text-customBlue shadow">Family Health</div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">Maternal and Child Care</h3>
                  <p className="text-xs font-semibold text-customBlue mb-3 uppercase tracking-wider">Health Services for Families</p>
                  <p className="text-gray-600 text-sm mb-6 flex-grow">This program provides prenatal checkups for expectant mothers and growth monitoring for children. We focus on ensuring the health of both the mother and the baby.</p>
                  <div className="flex justify-center mt-auto">
                    <Link to="/services/maternal-child" className="border border-customBlue text-customBlue font-bold py-2 px-6 rounded-md hover:bg-blue-50 transition-colors text-sm shadow-sm" style={{display: 'block', textAlign: 'center'}}>View Schedule & Requirements</Link>
                  </div>
                </div>
              </div>
            )}

            {(filter === 'all' || filter === 'prevention') && (
              <div id="prevention" className="bg-customWhite rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
                <div className="h-48 bg-gray-200 relative">
                  <img src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Vaccination" className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-customWhite px-3 py-1 rounded-full text-xs font-bold text-customBlue shadow">Prevention</div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">Vaccination Services</h3>
                  <p className="text-xs font-semibold text-customBlue mb-3 uppercase tracking-wider">Protection Against Diseases</p>
                  <p className="text-gray-600 text-sm mb-6 flex-grow">Get free vaccines for infants and seniors to stay protected against common illnesses. Check the monthly schedule for specific vaccination drives in the barangay.</p>
                  <div className="flex justify-center mt-auto">
                    <Link to="/services/vaccination" className="border border-customBlue text-customBlue font-bold py-2 px-6 rounded-md hover:bg-blue-50 transition-colors text-sm shadow-sm" style={{display: 'block', textAlign: 'center'}}>View Schedule & Requirements</Link>
                  </div>
                </div>
              </div>
            )}

            {(filter === 'all' || filter === 'support') && (
              <div id="support" className="bg-customWhite rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
                <div className="h-48 bg-gray-200 relative">
                  <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Counseling" className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-customWhite px-3 py-1 rounded-full text-xs font-bold text-customBlue shadow">Support</div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">Mental Health / YAKAP</h3>
                  <p className="text-xs font-semibold text-customBlue mb-3 uppercase tracking-wider">Mental Health & Wellness</p>
                  <p className="text-gray-600 text-sm mb-6 flex-grow">The YAKAP program provides free counseling and resources for residents. We aim to provide a supportive environment for those seeking emotional and psychological help.</p>
                  <div className="flex justify-center mt-auto">
                    <Link to="/services/mental-health" className="border border-customBlue text-customBlue font-bold py-2 px-6 rounded-md hover:bg-blue-50 transition-colors text-sm shadow-sm" style={{display: 'block', textAlign: 'center'}}>View Schedule & Requirements</Link>
                  </div>
                </div>
              </div>
            )}

            {(filter === 'all' || filter === 'administration') && (
              <div id="administration" className="bg-customWhite rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
                <div className="h-48 bg-gray-200 relative">
                  <img src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Documents" className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-customWhite px-3 py-1 rounded-full text-xs font-bold text-customBlue shadow">Administration</div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">PhilHealth Services</h3>
                  <p className="text-xs font-semibold text-customBlue mb-3 uppercase tracking-wider">Membership Support</p>
                  <p className="text-gray-600 text-sm mb-6 flex-grow">Need help with your PhilHealth membership benefits? Our staff can assist you with membership registration and inquiries regarding public health coverage.</p>
                  <div className="flex justify-center mt-auto">
                    <Link to="/services/philhealth" className="border border-customBlue text-customBlue font-bold py-2 px-6 rounded-md hover:bg-blue-50 transition-colors text-sm shadow-sm" style={{display: 'block', textAlign: 'center'}}>View Schedule & Requirements</Link>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </>
  );
};

export default Services;
