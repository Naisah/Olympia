import { useState, useEffect } from 'react';
import { MapPin, Clock, Activity } from 'lucide-react';
import { useFadeUp } from '../../hooks/useFadeUp';
import Modal from '../../components/Modal';
import { useBookingCalendar } from '../../hooks/useBookingCalendar';
import api, { getApiError } from '../../utils/api';

  const timeSlots = [
    "06:00 AM - 08:00 AM",
    "08:00 AM - 10:00 AM",
    "10:00 AM - 12:00 PM",
    "12:00 PM - 02:00 PM",
    "02:00 PM - 04:00 PM",
    "04:00 PM - 06:00 PM",
    "06:00 PM - 08:00 PM",
    "08:00 PM - 10:00 PM"
  ];

  const getDefaultEvent = (dayOfWeek, time) => {
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isMWF = dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5;
    const isTTh = dayOfWeek === 2 || dayOfWeek === 4;

    if (time === "06:00 AM - 08:00 AM") {
      if (isMWF) return { name: "Senior Zumba", type: "community" };
      return { name: "Open Play", type: "open" };
    }

    const eveningSlots = ["04:00 PM - 06:00 PM", "06:00 PM - 08:00 PM", "08:00 PM - 10:00 PM"];
    if (eveningSlots.includes(time)) {
      if (isTTh) return { name: "Barangay Training", type: "community" };
      if (isWeekend) return { name: "SK Basketball Liga", type: "community" };
      return { name: "Open Play", type: "open" };
    }

    return { name: "Open Play", type: "open" };
  };

const CoveredCourt = () => {
    useFadeUp();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [schedule, setSchedule] = useState([]);
  
  
  const [timeSlot, setTimeSlot] = useState('06:00 AM - 08:00 AM');
  const [purpose, setPurpose] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [address, setAddress] = useState('');

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchSchedule = async () => {
      setLoadingSchedule(true);
      try {
        const res = await api.get(`/public/service/Covered%20Court/schedule`);
        setSchedule(res.data || []);
      } catch (err) {
        console.error("Failed to fetch schedule", err);
      } finally {
        setLoadingSchedule(false);
      }
    };
    fetchSchedule();
  }, [formattedSelectedDate]);

  const dayOfWeek = new Date(formattedSelectedDate).getDay();
  const isBooked = (slot) => schedule.some(r => r.reservation_date === `${formattedSelectedDate} ${slot}`)
    || getDefaultEvent(dayOfWeek, slot).type === 'community';
  const availableTimeSlot = timeSlots.includes(timeSlot) && !isBooked(timeSlot)
    ? timeSlot : timeSlots.find(slot => !isBooked(slot)) || '';

  const get7Days = () => {
    const days = [];
    const baseDate = currentDate.getMonth() === new Date(formattedSelectedDate).getMonth() 
      ? new Date(formattedSelectedDate) 
      : new Date();
    
    for (let i = 0; i < 7; i++) {
      const d = new Date(baseDate);
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!availableTimeSlot) { setError('No court slots are available for this date.'); return; }
    setLoading(true);
    setError('');

    try {
      await api.post('/public/service/reserve', {
        service_name: 'Covered Court',
        reservation_date: `${formattedSelectedDate} ${availableTimeSlot}`,
        purpose: purpose,
        first_name: firstName,
        last_name: lastName,
        email: email,
        contact_number: contactNumber,
        address: address,
      });
      setSchedule(previous => [...previous, { reservation_date: `${formattedSelectedDate} ${availableTimeSlot}`, status: 'Pending' }]);
      setShowDetailsModal(false);
      setShowSuccessModal(true);
      
      
      setPurpose('');
      setFirstName('');
      setLastName('');
      setEmail('');
      setContactNumber('');
      setAddress('');
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const isDateFullyBooked = (year, month, day) => {
    if (!schedule) return false;
    const dateObj = new Date(year, month, day);
    const dayOfWeek = dateObj.getDay();
    const dateString = dateObj.toLocaleDateString('en-US', {
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });

    for (let t of timeSlots) {
      const matchString = `${dateString} ${t}`;
      const isDbBooked = schedule.some(r => r.reservation_date === matchString);
      const defaultEv = getDefaultEvent(dayOfWeek, t);
      const isCommunityBooked = defaultEv.type === 'community';
      if (!isDbBooked && !isCommunityBooked) {
        return false;
      }
    }
    return true;
  };

  return (
    <div className="max-w-6xl mx-auto w-full px-4 md:px-10 py-8">

      
      <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden mb-16 shadow-lg">
        <img src="/assets/images/baranggay.png" alt="Barangay Covered Court" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Barangay Covered Court</h1>
          <p className="text-gray-200 text-lg flex items-center gap-2">
            <MapPin size={20} className="text-red-400" /> Olympia Community Complex <span className="text-gray-400">|</span> <Clock size={20} className="text-blue-400" /> Open 6:00 AM - 10:00 PM
          </p>
          <div className="flex flex-wrap gap-2 mt-5">
            <span className="bg-customBlue text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow">Basketball &amp; Volleyball</span>
            <span className="bg-customBlue text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow">Bleacher Seating</span>
            <span className="bg-customBlue text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow">Public Restrooms</span>
            <span className="bg-customBlue text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow">Floodlights</span>
          </div>
        </div>
      </div>

      
      <div id="schedule" className="mb-16 scroll-mt-10">
        <div className="mb-6 border-l-4 border-customYellow pl-4">
          <h2 className="text-2xl font-bold text-customBlue uppercase tracking-wide">Live Weekly Schedule</h2>
          <p className="text-gray-500 text-sm mt-1">Showing the 7-day schedule starting from your selected date ({formattedSelectedDate}). Check real-time availability here.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden overflow-x-auto">
          {loadingSchedule ? (
            <div className="p-10 text-center text-gray-400 font-medium">Loading live schedule...</div>
          ) : (
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-4 font-bold min-w-[150px]">Time Slot</th>
                  {get7Days().map((dateObj, idx) => (
                    <th key={idx} className="px-4 py-4 font-bold text-center border-l border-gray-200 min-w-[120px]">
                      {dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((time, rowIdx) => (
                  <tr key={rowIdx} className="border-b border-gray-100 last:border-b-0">
                    <td className="px-4 py-4 font-semibold text-gray-600 bg-gray-50">{time}</td>
                    {get7Days().map((dateObj, colIdx) => {
                      const dayOfWeek = dateObj.getDay();
                      const dateStrForMatch = dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                      const matchString = `${dateStrForMatch} ${time}`;
                      const reservation = schedule.find(r => r.reservation_date === matchString);
                      
                      let cellContent;
                      let cellClass = "px-4 py-4 text-center border-l border-gray-100 font-medium";

                      if (reservation) {
                        cellContent = 'Reserved';
                        cellClass += " bg-red-50 text-red-600 text-xs";
                      } else {
                        const defaultEvent = getDefaultEvent(dayOfWeek, time);
                        cellContent = defaultEvent.name;
                        if (defaultEvent.type === 'community') {
                          cellClass += " bg-yellow-50 text-yellow-700 text-xs";
                        } else {
                          cellClass += " text-green-600";
                        }
                      }

                      return (
                        <td key={colIdx} className={cellClass}>
                          {cellContent}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      
      <div id="booking" className="scroll-mt-10 mb-16">
        <div className="mb-6 border-l-4 border-customYellow pl-4">
          <h2 className="text-2xl font-bold text-customBlue uppercase tracking-wide">Reserve the Court</h2>
          <p className="text-gray-500 text-sm mt-1">Select an open slot to submit a reservation request.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <div className="lg:col-span-1 bg-blue-50 p-6 rounded-xl border border-blue-100 h-fit">
            <h3 className="font-bold text-lg mb-4 text-customBlue">Facility Rules</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-customBlue font-bold">•</span> Must present valid Barangay ID upon entry.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-customBlue font-bold">•</span> Maximum 3 hours per reservation.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-customBlue font-bold">•</span> Clean as you go. Dispose of trash properly.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-customBlue font-bold">•</span> Proper athletic footwear is required on the court.
              </li>
            </ul>
          </div>

          
          <div className="lg:col-span-3 bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-8">
            
            <div className="w-full md:w-1/2">
              <div className="flex justify-between items-center mb-4">
                <button onClick={handlePrevMonth} type="button" className="font-bold text-sm text-gray-400 hover:text-customBlack transition-colors">Prev</button>
                <div className="flex gap-1 text-lg font-semibold text-customBlack">
                  <select value={currentDate.getMonth()} onChange={handleMonthChange} className="bg-transparent focus:outline-none cursor-pointer hover:text-customBlue transition-colors appearance-none text-center">
                    {["January","February","March","April","May","June","July","August","September","October","November","December"].map((m, i) => (
                      <option key={i} value={i}>{m}</option>
                    ))}
                  </select>
                  <select value={currentDate.getFullYear()} onChange={handleYearChange} className="bg-transparent focus:outline-none cursor-pointer hover:text-customBlue transition-colors appearance-none text-center">
                    {[...Array(6)].map((_, i) => (
                      <option key={i} value={new Date().getFullYear() + i}>{new Date().getFullYear() + i}</option>
                    ))}
                  </select>
                </div>
                <button onClick={handleNextMonth} type="button" className="font-bold text-sm text-gray-400 hover:text-customBlack transition-colors">Next</button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-gray-400 text-xs font-semibold mb-2">
                <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {getCalendarDays().map((item, idx) => {
                  if (item.empty) return <div key={'empty-' + idx}></div>;
                  
                  let fullyBooked = false;
                  if (!item.isPast) {
                    fullyBooked = isDateFullyBooked(currentDate.getFullYear(), currentDate.getMonth(), item.day);
                  }

                  if (item.isPast || fullyBooked) {
                    return (
                      <button key={idx} disabled className="w-8 h-8 rounded-full mx-auto flex items-center justify-center text-gray-300 cursor-not-allowed font-medium" title={fullyBooked ? "Fully Booked" : ""}>
                        {item.day}
                      </button>
                    );
                  }
                  return (
                    <button
                      key={idx}
                      onClick={() => handleDateClick(item.day)}
                      className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center font-medium cursor-pointer transition-colors ${item.isSelected ? 'bg-customBlue text-white' : 'text-gray-700 hover:bg-blue-100 hover:text-customBlue'}`}
                    >
                      {item.day}
                    </button>
                  );
                })}
              </div>
            </div>

            
            <div className="w-full md:w-1/2 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
              <h3 className="font-semibold mb-4 text-customBlack">Selected: {formattedSelectedDate}</h3>
              
                <form className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Time Slot</label>
                    <select value={availableTimeSlot} onChange={(e) => setTimeSlot(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:border-customBlue focus:ring-1 focus:ring-customBlue bg-white">
                      {timeSlots.map((time, idx) => {
                        const matchString = `${formattedSelectedDate} ${time}`;
                        const isDbBooked = schedule.some(r => r.reservation_date === matchString);
                        const dayOfWeek = new Date(formattedSelectedDate).getDay();
                        const defaultEv = getDefaultEvent(dayOfWeek, time);
                        const isCommunityBooked = defaultEv.type === 'community';
                        
                        const isBooked = isDbBooked || isCommunityBooked;
                        const labelText = isDbBooked ? '(Booked)' : isCommunityBooked ? `(${defaultEv.name})` : '';

                        return (
                          <option key={idx} value={time} disabled={isBooked}>
                            {time} {labelText}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Purpose</label>
                    <input type="text" value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="e.g. Practice, Birthday, Liga" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:border-customBlue focus:ring-1 focus:ring-customBlue" />
                  </div>
                  <div className="pt-2">
                    <button id="submit-request-btn" type="button" disabled={!availableTimeSlot || loadingSchedule} onClick={() => setShowDetailsModal(true)} className="w-full bg-customBlue text-white font-bold py-3 rounded-lg hover:bg-customDarkBlue transition-colors shadow-md">
                      Submit Request
                    </button>
                  </div>
                </form>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)}>
        <div className="bg-customWhite p-8 md:p-10 rounded-3xl shadow-2xl border border-gray-100 max-w-md w-full text-left">
          <h2 className="text-2xl font-extrabold text-customBlack mb-2">Reserver Details</h2>
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">Please provide your details so we can record who reserved the court.</p>
          
          {error && <div className="mb-4 bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200">{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">First Name</label>
                <input required type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Juan" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:border-customBlue focus:ring-1 focus:ring-customBlue" />
              </div>
              <div className="w-1/2">
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Last Name</label>
                <input required type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Dela Cruz" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:border-customBlue focus:ring-1 focus:ring-customBlue" />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Email Address</label>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="juan@example.com" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:border-customBlue focus:ring-1 focus:ring-customBlue" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Contact Number</label>
              <input required type="tel" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} placeholder="09123456789" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:border-customBlue focus:ring-1 focus:ring-customBlue" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Address</label>
              <input required type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Barangay St." className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:border-customBlue focus:ring-1 focus:ring-customBlue" />
            </div>

            <div className="pt-4 flex gap-3">
              <button type="button" onClick={() => setShowDetailsModal(false)} disabled={loading} className="w-1/2 bg-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-300 transition-colors disabled:opacity-50">Cancel</button>
              <button type="submit" disabled={loading} className="w-1/2 bg-customBlue text-white font-bold py-3 rounded-xl hover:bg-customDarkBlue transition-colors shadow-md disabled:opacity-50">
                {loading ? 'Submitting...' : 'Proceed'}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
        <div className="bg-customWhite p-8 md:p-10 rounded-3xl shadow-2xl border border-gray-100 max-w-md w-full text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-50 mb-6 border-4 border-green-100">
            <Activity size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-extrabold text-customBlack mb-2 flex items-center justify-center gap-2">Reservation Submitted!</h2>
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">Your court reservation request has been received. You will receive an email confirmation once a barangay staff member approves your booking.</p>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 text-left">
            <p className="text-sm font-semibold text-customDarkBlue mb-1 flex items-center gap-2">📌 Important Reminder</p>
            <p className="text-xs text-customBlue leading-relaxed">Please bring a valid Barangay ID on the day of your reservation. The court must be vacated at the end of your reserved slot.</p>
          </div>
          <button onClick={() => setShowSuccessModal(false)} type="button" className="w-full bg-customBlue text-white font-bold py-3 rounded-xl hover:bg-customDarkBlue transition-colors shadow-md text-base">Done</button>
        </div>
      </Modal>

    </div>
  );
};

export default CoveredCourt;
