import React, { useState, useEffect } from 'react';
import '../assets/TextFinder.css'; // 애니메이션을 위한 외부 CSS 파일 임포트

// TextFinder 컴포넌트는 검색 입력창의 표시 여부를 조건부로 관리합니다.
function TextFinder({ show, onSearch }) {
  const [isVisible, setIsVisible] = useState(false); // 검색 입력창의 표시 여부 상태
  const [searchQuery, setSearchQuery] = useState(''); // 사용자의 검색 쿼리 상태

  // Ctrl + F를 눌렀을 때 검색 입력창을 토글하는 이벤트 리스너
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 'f') {
        event.preventDefault(); // 브라우저의 기본 검색 기능 방지
        setIsVisible(true); // 검색 입력창의 표시 여부 토글
      }
    };

    // 키다운 이벤트 리스너 등록
    document.addEventListener('keydown', handleKeyDown);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible]);

  // show 상태가 변경될 때 실행되는 효과
  // show가 false로 변경되면 애니메이션 후에 검색창을 숨깁니다.
  useEffect(() => {
    if (!show) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300); // CSS 애니메이션 지속 시간에 맞춰 검색 입력창 숨김 처리
      return () => clearTimeout(timer); // 타이머 클리어
    }
    onSearch(searchQuery); // show가 true이면 현재 쿼리를 부모 컴포넌트로 전달
  }, [show, searchQuery, onSearch]);

  // 검색 쿼리가 변경될 때 부모 컴포넌트에게 검색 쿼리 전달
  useEffect(() => {
    onSearch(searchQuery);
  }, [searchQuery, onSearch]);

  const handleClose = () => {
    setIsVisible(false); // 검색창을 숨김
  };

  return (
    <div
      className={`text-finder ${show && isVisible ? 'show slideDown' : 'slideUp'}`}
      onAnimationEnd={() => {
        if (!show) setIsVisible(false); // 애니메이션이 끝나고 show가 false인 경우 입력창 숨김 처리
      }}
      style={{ display: isVisible ? 'block' : 'none' }} // isVisible 상태에 따라 검색 입력창 표시 여부 결정
    >
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} // 입력 필드 값 변경 시 searchQuery 상태 업데이트
        placeholder="Search for text..."
      />
      <button onClick={handleClose} style={{ marginLeft: '10px' }}>X</button>
    </div>
  );
}

export default TextFinder;