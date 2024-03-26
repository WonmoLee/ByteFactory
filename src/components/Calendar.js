import React, { useState, useEffect } from 'react';
import '../assets/Calendar.css';

const Calendar = () => {
  const [days, setDays] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedPath, setSelectedPath] = useState([]);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, selectedDayId: null });
  const [ctrlPressed, setCtrlPressed] = useState(false); // ctrl 키 상태 추가

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Control') {
        setCtrlPressed(true);
      }
    };

    const handleKeyUp = (event) => {
      if (event.key === 'Control') {
        setCtrlPressed(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);


  useEffect(() => {
        const handleClickOutside = (event) => {
            // contextMenu가 보이는 경우, 이를 숨깁니다.
            if (contextMenu.visible) {
                setContextMenu({ ...contextMenu, visible: false });
            }
    
            // 클릭된 요소가 우측 패널의 일부인지 확인합니다.
            const cldTable = document.querySelector('.cld-table');
            if (cldTable && cldTable.contains(event.target)) {
                // 클릭된 요소가 node-container 내부인지 확인합니다.
                const isNodeContainerClick = event.target.closest('.cldTable');
    
                // node-container 내부가 아니라면, selectedPath를 초기화합니다.
                if (!isNodeContainerClick) {
                   // setSelectedPath([]); // 선택된 폴더의 포커스 해제
                }
            }
        };
    
        // 클릭 이벤트 리스너 등록
        document.addEventListener('click', handleClickOutside);
    
        // 클린업 함수에서 이벤트 리스너 제거
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [contextMenu]);    

  const handleContextMenu = (event, dayId) => {

    if (selectedPath.includes('b_' + dayId) === -1) {
      if (ctrlPressed) { // ctrl 키가 눌려있지 않을 때만 처리
        setSelectedPath([...selectedPath, 'b_' + dayId]);
      } else {
        setSelectedPath(['b_' + dayId]);
      }
    }

    event.preventDefault();
    event.stopPropagation();
    setContextMenu({
        visible: true,
        x: event.pageX,
        y: event.pageY,
        selectedDayId: dayId
    });
  };

  const renderContextMenu = () => {
    if (!contextMenu.visible) return null;

    return (
      <ul className="context-menu" style={{ top: contextMenu.y, left: contextMenu.x }}>
        <li onClick={() => handleCreateDay()}>추가</li>
        <li>이름 변경</li>
        <li>삭제</li>
      </ul>
    );
  };







  const renderDayView = (dayId) => {
    return (
      days.map(day => (
          day.day === dayId && (
              <div key={day.id} className={'new-day ' + day.id}>
                  {day.title}
              </div>
          )
      ))
    )
  }

  const handleCreateDay = () => {
    const uniqueId = Date.now().toString();
    const strippedDays = selectedPath.map(dayId => dayId.substring(2)); // 'b_' 제거
    const sortedDays = strippedDays.sort(); // 정렬
    
    const newDays = sortedDays.map(dayId => ({ // 정렬된 각 요소에 대해 새로운 일을 만듭니다.
        id: uniqueId,
        day: dayId,
        title: "새로운 일",
        content: null
    }));
    setDays(prevDays => [...prevDays, ...newDays]);
  };

  const handleDayClick = (event, dayId) => {
    let newPathIndex;

    if(String(dayId).substring(0, 1) !== 'b') {
      setSelectedPath([]);
    }

    if (event.ctrlKey && event.button === 0) {
      setSelectedPath([...selectedPath, dayId]);
    } else if (event.button === 0) {
      newPathIndex = selectedPath.indexOf(dayId);

      if (newPathIndex === -1) {
        setSelectedPath([dayId]);
      }
    }
    
  };
















  const goToPreviousMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
  };

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1).getDay();
  const lastDayOfLastMonth = new Date(currentYear, currentMonth - 1, 0).getDate();

  const getDayClassName = (year, month, day, isWeekend) => {
    let className = '';
    if (month < currentMonth || (month === currentMonth - 1 && day < currentDay)) {
      className = 'prev-month';
    } else if (month > currentMonth || (month === currentMonth - 1 && day > currentDay)) {
      className = 'next-month';
    } else {
      className = 'current-month';
    }
    if (day === currentDay && month === currentMonth && year === currentYear) {
      className += ' today';
    }
    if (isWeekend) {
      className += ' weekend';
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
        <button onClick={() => {goToPreviousMonth()}}>Previous Month</button>
        <button onClick={() => {goToNextMonth()}}>Next Month</button>
        <button onClick={() => {console.log(selectedPath + "     " + days)}}>아이디 확인</button>
      </div>
      <table className='cld-table'>
        <thead>
          <tr>
            <th className='weekend'>일</th>
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
                  day = previousMonthDates[previousMonthDates.length + day - 1];
                } else if (day > daysInMonth) {
                  month = currentMonth + 1;
                  year = currentYear;
                  day -= daysInMonth;
                } else {
                  month = currentMonth;
                  year = currentYear;
                }
                const isWeekend = dayIndex === 0; // Saturday (6) and Sunday (0)
                const dayId = year + '' + String(month).padStart(2, 0) + '' + String(day).padStart(2, 0);
                return (
                  <td key={dayIndex}
                      className={getDayClassName(year, month, day, isWeekend)
                        + ' ' + 'a_' + dayId}
                      onContextMenu={(e) => handleContextMenu(e, dayId)}
                  >
                    <div className='cdl-day'>
                      <div className={'cdl-top t_' + dayId}>
                        {day}
                      </div>
                      <div className={'cdl-body b_' + dayId}
                           onMouseDown={(e) => handleDayClick(e, 'b_' + dayId)}
                           style={{
                            backgroundColor: (selectedPath.includes('b_' + dayId) ? '#007bff' : 'transparent')
                           }}
                      >
                        {renderDayView(dayId)}
                      </div>
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {renderContextMenu()}
    </div>
  );
};

export default Calendar;
