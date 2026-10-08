import { useState } from 'react';

export const useBookingCalendar = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const cutoffDate = new Date(today);
  cutoffDate.setDate(cutoffDate.getDate() - 1);
  
  let initialDate = new Date();
  if (initialDate <= cutoffDate) {
    initialDate = new Date(); 
  }

  const [currentDate, setCurrentDate] = useState(initialDate);
  const [selectedDate, setSelectedDate] = useState(initialDate);

  const selectFirstAvailable = (newDate) => {
    const year = newDate.getFullYear();
    const month = newDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const candidate = new Date(year, month, d);
      if (candidate > cutoffDate) {
        setSelectedDate(candidate);
        return;
      }
    }
    
    setSelectedDate(new Date(year, month, 1));
  };

  const handlePrevMonth = () => {
    changeMonth(currentDate.getFullYear(), currentDate.getMonth() - 1);
  };

  const handleNextMonth = () => changeMonth(currentDate.getFullYear(), currentDate.getMonth() + 1);
  const handleMonthChange = (e) => changeMonth(currentDate.getFullYear(), Number(e.target.value));
  const handleYearChange = (e) => changeMonth(Number(e.target.value), currentDate.getMonth());
  const changeMonth = (year, month) => {
    const next = new Date(year, month, 1);
    if (next < new Date(today.getFullYear(), today.getMonth(), 1)) return;
    setCurrentDate(next);
    selectFirstAvailable(next);
  };

  const handleDateClick = (day) => {
    const next = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    if (next >= today) setSelectedDate(next);
  };

  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    
    
    for (let i = 0; i < firstDay; i++) {
      days.push({ empty: true });
    }

    
    for (let i = 1; i <= daysInMonth; i++) {
      const thisDayDate = new Date(year, month, i);
      const isPast = thisDayDate <= cutoffDate;
      const isSelected = selectedDate.getFullYear() === year && selectedDate.getMonth() === month && selectedDate.getDate() === i;

      days.push({
        empty: false,
        day: i,
        isPast,
        isSelected
      });
    }

    return days;
  };

  const formattedSelectedDate = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  });

  return {
    currentDate,
    selectedDate,
    formattedSelectedDate,
    handlePrevMonth,
    handleNextMonth,
    handleMonthChange,
    handleYearChange,
    handleDateClick,
    getCalendarDays,
    cutoffDate
  };
};
