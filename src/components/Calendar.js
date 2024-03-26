import React, { useState } from 'react';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const goToPreviousMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
  };

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const lastDayOfLastMonth = new Date(currentYear, currentMonth, 0).getDate();

  const getDayClassName = (year, month, day) => {
    let className = '';
    if (month < currentMonth || (month === currentMonth && day < currentDay)) {
      className = 'prev-month';
    } else if (month > currentMonth || (month === currentMonth && day > currentDay)) {
      className = 'next-month';
    } else {
      className = 'current-month';
    }
    if (day === currentDay && month === currentMonth && year === currentYear) {
      className += ' today';
    }
    return className;
  };

  // Get the dates of the previous month
  const previousMonthDates = [];
  const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Convert Sunday (0) to 6
  for (let i = startDay; i >= 0; i--) {
    previousMonthDates.push(lastDayOfLastMonth - i);
  }

  return (
    <div>
      <div>
        <button onClick={goToPreviousMonth}>Previous Month</button>
        <button onClick={goToNextMonth}>Next Month</button>
      </div>
      <table className='cld-table'>
        <thead>
          <tr>
            <th>일</th>
            <th>월</th>
            <th>화</th>
            <th>수</th>
            <th>목</th>
            <th>금</th>
            <th>토</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(6)].map((_, weekIndex) => (
            <tr key={weekIndex}>
              {[...Array(7)].map((_, dayIndex) => {
                let day = weekIndex * 7 + dayIndex + 1 - firstDayOfMonth;
                let year, month;
                if (day <= 0) {
                  month = currentMonth - 1;
                  year = currentYear;
                  day = previousMonthDates[previousMonthDates.length + day];
                } else if (day > daysInMonth) {
                  month = currentMonth + 1;
                  year = currentYear;
                  day -= daysInMonth;
                } else {
                  month = currentMonth;
                  year = currentYear;
                }
                return (
                  <td key={dayIndex} className={getDayClassName(year, month, day)}>
                    {day}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Calendar;
