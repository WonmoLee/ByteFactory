import React, { useState, useEffect } from 'react';
import '../assets/DarkModeToggle.css'; // CSS 파일을 불러옵니다.

const DarkModeToggle = () => {
  // 현재 테마 상태를 저장하고, 시스템 테마 설정을 기본값으로 사용합니다.
  const [darkMode, setDarkMode] = useState(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

  // 시스템 테마 변경을 감지하기 위한 useEffect
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
    // 변경사항을 처리할 이벤트 리스너 함수
    const handleChange = (event) => {
      setDarkMode(event.matches);
    };
  
    // 이벤트 리스너 추가
    mediaQuery.addEventListener('change', handleChange);
  
    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);
  

  // 테마를 토글하는 함수
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // 페이지의 클래스를 업데이트하여 스타일을 적용합니다.
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  return (
    <div className={`toggle-container ${darkMode ? 'dark-mode' : ''}`} onClick={toggleTheme}>
      <div className="toggle-switch" />
    </div>
  );
};

export default DarkModeToggle;