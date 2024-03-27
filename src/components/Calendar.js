import React, { useState, useEffect } from 'react';
import CalenderNotepadpad from '../components/CalenderNotepad';
import '../assets/Calendar.css';

const Calendar = () => {
  const [days, setDays] = useState([]); // {type, id:uniqueId, day:dayId, firstDay, lastDay, index, title, context, length, backgroundColor, color}
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedPath, setSelectedPath] = useState([]);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, selectedDayId: null });
  const [ctrlPressed, setCtrlPressed] = useState(false); // ctrl 키 상태 추가

  const [showNotepad, setShowNotepad] = useState({visible : false, id: null, day: null, maintext: null, context: null});


  const baseColors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff", "#800000"
                    , "#008000", "#000080", "#808000", "#800080", "#008080", "#ff8000", "#ff0080"
                    , "#80ff00", "#80ff80", "#0080ff", "#8000ff", "#ff8080", "#80ffff"];

  // 로컬 스토리지에서 북마크 데이터 불러오기
  useEffect(() => {
      const savedDays = localStorage.getItem('CalendarDay');
      if (savedDays) {
        setDays(JSON.parse(savedDays));
      }
  }, []);

  // 로컬 스토리지에 북마크 데이터 저장하기
  useEffect(() => {
      if (days.length > 0) {
          localStorage.setItem('CalendarDay', JSON.stringify(days));
      }
  }, [days]);

  
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
    if (!selectedPath.includes('b_' + dayId)) {
     
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





  // 라인 그리기
  const renderDayLineView = (day, dayId, index) => {
    if (day.day === dayId && day.index === index) {
      return (
        <div key={day.id + "_" + index}
          className={'new_line ' + day.id + ' '
           + (day.firstDay === dayId && day.lastDay === dayId ? 'first_line last_line'
           : day.firstDay === dayId ? 'first_line'
           : day.lastDay === dayId ? 'last_line'
           : 'body_line'
           )
          }

          style={day.index === index ? {
            backgroundColor: day.backgroundColor,
            color: day.color,
            cursor: "pointer"
          } : null}

          onMouseDown={(e) => onMouseDown(e, day)}
        >
          {day.index === index ? day.title : ''}
        </div>
      )
    }
  };
  
  const onMouseDown = (e, day) => {
    setSelectedPath([]);
    e.preventDefault();
    e.stopPropagation();
    
    let firstDay = findFirstId(day.id, day.firstDay);
    setShowNotepad({visible : true, id: firstDay.id, day: firstDay.day, maintext: firstDay.title, context: firstDay.context});
  }

  // 첫날 찾기
  const findFirstId = (id, firstDay) => {
    let firstId = null;

    days.forEach(findDay => {
      if (findDay.id === id && findDay.day === firstDay) {
        firstId = findDay;
      }
    });

    return firstId; // 함수의 반환문으로 값을 반환합니다.
  }

  const renderDayView = (dayId, index) => {
    return (
      days.map(day => (
        renderDayLineView(day, dayId, index)
      ))
    )
  }

  // 새로운 Day 생성
  const handleCreateDay = () => {
    let createDays, newDays, uniqueId, bColor, fColor, dayIndex;
    const strippedDays = selectedPath.map(dayId => dayId.substring(2)); // 'b_' 제거
    const sortedDays = strippedDays.sort(); // 정렬
    
    createDays = createDayArray(sortedDays);  //[[], []]

    dayIndex = getIndexCheck(createDays);
    newDays = createDays.map((createDay, i) => {
      uniqueId = Number(Date.now().toString()) + i;
   
      bColor = getRandomColor();
      fColor = getRandomColor(bColor);

      return createDay.map((dayId) => ({
          type: "Notepad",
          id: uniqueId,
          day: dayId,
          firstDay: createDay[0],
          lastDay: createDay[createDay.length - 1],
          title: dayId === createDay[0] ? "새로운 일" : null,
          context: null,
          index: dayIndex[i],
          backgroundColor: bColor,
          color: fColor
      }));
    });

    newDays = [].concat(...newDays);
    setDays(prevDays => [...prevDays, ...newDays]);
  };

  // 인덱스 체크
  const getIndexCheck = (createDays) => {
    let dayIndexArr, dayIndex, returnIndex, dayIds;
    let dayIndexSet = new Set();
    dayIds = days.map(obj => [obj.day, obj.index]);
    returnIndex = [];

    createDays.forEach((createDay) => {
      dayIndex = 0;
      dayIndexSet.clear();

      for(let i = 0; i < createDay.length; i++) {
        if(days.length !== 0) {
          if(i !== 0) {
            if(!isNextDay(createDay[i - 1], createDay[i])) {
              break;
            }
          }

          dayIds.forEach(([day, index]) => {
            if(createDay[i] === day) {
              dayIndexSet.add(index);
            }
          });
        }
      }
    

      dayIndexArr = Array.from(dayIndexSet);
      dayIndexArr = dayIndexArr.sort();
      for(let i = 0; i < dayIndexArr.length; i++) {
        if(dayIndexArr.includes(dayIndex)) {
          dayIndex = dayIndex + 1;
        }
      }

      returnIndex.push(dayIndex);
    });

    return returnIndex;
  }

  // 랜덤 색깔 가져오기
  const getRandomColor = (color) => {
      if(!color) {
        return baseColors[Math.floor(Math.random() * baseColors.length)];
      } else {
        // 주어진 색상
        var givenColor = color.slice(1); // # 제거
        var r = parseInt(givenColor.substring(0, 2), 16); // 16진수를 10진수로 변환
        var g = parseInt(givenColor.substring(2, 4), 16);
        var b = parseInt(givenColor.substring(4, 6), 16);
        
        // 보색 계산
        var compR = 255 - r;
        var compG = 255 - g;
        var compB = 255 - b;
        
        // 16진수로 변환
        var compHex = "#" + ((1 << 24) + (compR << 16) + (compG << 8) + compB).toString(16).slice(1);
        return compHex;
      }
  }



  // 붙은 날짜끼리 처리.
  const createDayArray = (sortedDays) => {
    let nextDays, nextDay;
    nextDays = [];
    nextDay = [];

    sortedDays.forEach((e, i, a) => {
      if(i !== 0) {
        if(isNextDay(a[i - 1], e)) {
          nextDay.push(e);
        } else {
          nextDays.push(nextDay);
          nextDay = [];
          nextDay.push(e);
        }
      } else {
        nextDay.push(e);
      }

      if(i === a.length - 1) {
        nextDays.push(nextDay);
      }
    });

    return nextDays;
  }



  // 내일이랑 같은지
  const isNextDay = (todayDay , tomorrowDay) => {
    let dateString, year, month, day, tomorrow1, tomorrow2;

    dateString = todayDay;
    year = dateString.slice(0, 4);
    month = dateString.slice(4, 6);
    day = dateString.slice(6, 8);

    tomorrow1 = new Date(year, month - 1, day);
    tomorrow1.setDate(tomorrow1.getDate() + 1);

    dateString = tomorrowDay;
    year = dateString.slice(0, 4);
    month = dateString.slice(4, 6);
    day = dateString.slice(6, 8);
    tomorrow2 = new Date(year, month - 1, day);

    // 다음 날짜가 같은지 확인합니다.
    if (tomorrow1.getTime() === tomorrow2.getTime()) {
        return true;
    } else {
        return false;
    }
  }



  // 달력 클릭
  const handleDayClick = (event, dayId) => {
    let newPathIndex;
    
    if(String(dayId).substring(0, 1) !== 'b') {
      setSelectedPath([]);
    }
   
    if(selectedPath.includes(dayId)) {
      return false;
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
        <button onClick={() => {console.log(days)}}>아이디 확인</button>
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
                    className={`${getDayClassName(year, month, day, isWeekend)} a_${dayId}`}
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
                        <div className='new-day'>
                          {renderDayView(dayId, 0)}
                        </div>
                        <div className='new-day'>
                          {renderDayView(dayId, 1)}
                        </div>
                        <div className='new-day'>
                          {renderDayView(dayId, 2)}
                        </div>
                        
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
      <CalenderNotepadpad
          showNotepad={showNotepad}
          setShowNotepad={setShowNotepad}
          setDays={setDays}
          days={days}
      />
    </div>
  );
};

export default Calendar;
