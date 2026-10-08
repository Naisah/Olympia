import { useState, useEffect } from 'react';
import { MapPin, Clock, Mail } from 'lucide-react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import { servicesData } from '../utils/data';
import { useBookingCalendar } from '../hooks/useBookingCalendar';
import { useFadeUp } from '../hooks/useFadeUp';

const ServiceDetail = () => {
  useFadeUp();
  const { id } = useParams();
    const service = servicesData.find(s => s.id === id) || servicesData[0];
  
  const {
    currentDate,
    formattedSelectedDate,
    handlePrevMonth,
    handleNextMonth,
    handleMonthChange,
    handleYearChange,
    handleDateClick,
    getCalendarDays
  } = useBookingCalendar();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [schedule, setSchedule] = useState([]);
  const [loadingSchedule, setLoadingSchedule] = useState(false);

  useEffect(() => {
    const fetchSchedule = async () => {
      setLoadingSchedule(true);
      try {
        const encodedName = encodeURIComponent(service.title);
        const res = await api.get(`/public/service/${encodedName}/schedule`);
        setSchedule(res.data || []);
      } catch (err) {
        console.error("Failed to fetch schedule", err);
      } finally {
        setLoadingSchedule(false);
      }
    };
    if (service) fetchSchedule();
  }, [service]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const timeSlot = form.get('timeSlot');
    const purpose = form.get('purpose');

    try {
      await api.post('/public/service/reserve', {
        service_id: service.id,
        service_name: service.title,
        reservation_date: `${formattedSelectedDate} ${timeSlot}`,
        purpose: purpose
      });
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      alert('Failed to submit reservation.');
    }
  };

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentYear = new Date().getFullYear();
  const years = Array.from({length: 6}, (_, i) => currentYear + i);

  return (
    <div className="bg-gray-50 font-sans text-customBlack min-h-screen flex flex-col">
      <div className="max-w-6xl mx-auto w-full flex-grow px-4 md:px-10 py-8">
        
        <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden mb-16 shadow-lg fade-up">
          <img src={service.img} alt={service.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{service.title}</h1>
            <p className="text-gray-200 text-lg flex items-center gap-2">
              <MapPin size={20} className="text-red-400" /> Olympia Community Complex <span className="text-gray-400">|</span> <Clock size={20} className="text-blue-400" /> Open 6:00 AM - 10:00 PM
            </p>
            <div className="flex flex-wrap gap-2 mt-5">
              <span className="bg-customBlue text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow">{service.category}</span>
            </div>
          </div>
        </div>

        <div id="booking" className="scroll-mt-10 fade-up">
          <div className="mb-6 border-l-4 border-customYellow pl-4">
            <h2 className="text-2xl font-bold text-customBlue uppercase tracking-wide">Reserve / Book</h2>
            <p className="text-gray-500 text-sm mt-1">Select an open slot to submit a request.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 bg-blue-50 p-6 rounded-xl border border-blue-100 h-fit">
              <h3 className="font-bold text-lg mb-4 text-customBlue">Facility Rules</h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-customBlue font-bold">•</span> Must present valid Barangay ID upon entry.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-customBlue font-bold">•</span> Follow guidelines for booking.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-customBlue font-bold">•</span> Clean as you go. Dispose of trash properly.
                </li>
              </ul>
            </div>

            <div className="lg:col-span-3 bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/2">
                <div className="flex justify-between items-center mb-4">
                  <button onClick={handlePrevMonth} type="button" className="font-bold text-sm text-gray-400 hover:text-customBlack transition-colors">Prev</button>
                  <div className="flex gap-1 text-lg font-semibold text-customBlack">
                    <select value={currentDate.getMonth()} onChange={handleMonthChange} className="bg-transparent focus:outline-none cursor-pointer hover:text-customBlue transition-colors appearance-none">
                      {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
                    </select>
                    <select value={currentDate.getFullYear()} onChange={handleYearChange} className="bg-transparent focus:outline-none cursor-pointer hover:text-customBlue transition-colors appearance-none">
                      {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <button onClick={handleNextMonth} type="button" className="font-bold text-sm text-gray-400 hover:text-customBlack transition-colors">Next</button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-gray-400 text-xs font-semibold mb-2">
                  <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                  {getCalendarDays().map((day, idx) => {
                    if (day.empty) return <div key={idx} />;
                    
                    if (day.isPast) {
                      return (
                        <button key={idx} disabled className="w-8 h-8 rounded-full mx-auto flex items-center justify-center text-gray-300 cursor-not-allowed font-medium">
                          {day.day}
                        </button>
                      );
                    }
                    
                    const btnClass = day.isSelected 
                      ? 'w-8 h-8 rounded-full mx-auto flex items-center justify-center font-medium cursor-pointer bg-customBlue text-white' 
                      : 'w-8 h-8 rounded-full mx-auto flex items-center justify-center font-medium cursor-pointer text-gray-700 hover:bg-blue-100 hover:text-customBlue transition-colors';
                      
                    return (
                      <button key={idx} onClick={() => handleDateClick(day.day)} className={btnClass}>
                        {day.day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="w-full md:w-1/2 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
                <h3 className="font-semibold mb-4 text-customBlack">Selected: {formattedSelectedDate}</h3>
                
                
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Time Slot</label>
                      <select name="timeSlot" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:border-customBlue focus:ring-1 focus:ring-customBlue bg-white">
                        <option>06:00 AM - 08:00 AM</option>
                        <option>08:00 AM - 10:00 AM</option>
                        <option>10:00 AM - 12:00 PM</option>
                        <option>12:00 PM - 02:00 PM</option>
                        <option>02:00 PM - 04:00 PM</option>
                        <option>04:00 PM - 06:00 PM</option>
                        <option>06:00 PM - 08:00 PM</option>
                        <option>08:00 PM - 10:00 PM</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Purpose</label>
                      <input name="purpose" type="text" placeholder="e.g. Practice, Checkup, Certificate" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:border-customBlue focus:ring-1 focus:ring-customBlue" required />
                    </div>
                    <div className="pt-2">
                      <button type="submit" className="w-full bg-customBlue text-white font-bold py-3 rounded-lg hover:bg-customDarkBlue transition-colors shadow-md">
                        Submit Request
                      </button>
                    </div>
                  </form>
              </div>
            </div>
          </div>
        </div>

        
        <div className="mt-16 fade-up">
          <div className="mb-6 border-l-4 border-customBlue pl-4">
            <h2 className="text-2xl font-bold text-customDarkBlue uppercase tracking-wide">Live Schedule</h2>
            <p className="text-gray-500 text-sm mt-1">Check approved reservations for this facility.</p>
          </div>
          
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {loadingSchedule ? (
              <div className="p-10 text-center text-gray-400">Loading schedule...</div>
            ) : schedule.length === 0 ? (
              <div className="p-10 text-center text-gray-400 font-medium">No upcoming reservations found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-blue-50 text-xs text-blue-700 uppercase tracking-widest border-b border-gray-200">
                      <th className="px-6 py-4 font-bold">Date & Time</th>
                      <th className="px-6 py-4 font-bold">Purpose</th>
                      <th className="px-6 py-4 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-gray-100">
                    {schedule.map(item => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-bold text-customBlack">{item.reservation_date}</td>
                        <td className="px-6 py-4 text-gray-600">{item.purpose || '—'}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${item.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>

      <div className={`fixed inset-0 z-[100] ${isModalOpen ? 'flex' : 'hidden'} items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity duration-300`}>
        <div className="bg-customWhite p-8 md:p-10 rounded-2xl shadow-2xl border border-gray-100 max-w-lg w-full text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-50 mb-8 border-4 border-green-100">
            <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-customBlack mb-3">Request Submitted!</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">Your reservation request has been successfully sent to the Barangay Olympia Administration. A staff member will review your application shortly.</p>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-10 text-left">
            <p className="text-sm text-gray-700 font-medium flex items-center gap-2 mb-2">
              <Mail size={16} className="inline-block text-gray-500 mr-1" /> <span className="text-customBlack">Check your email:</span>
            </p>
            <p className="text-xs text-gray-600 pl-6 leading-normal">
              You will receive an email confirmation with your booking reference number and final approval within 24-48 hours.
            </p>
          </div>
          <button onClick={() => setIsModalOpen(false)} type="button" className="w-full bg-customBlue text-white font-bold py-3 rounded-lg hover:bg-customDarkBlue transition-colors shadow-md text-lg">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
