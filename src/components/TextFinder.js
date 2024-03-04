import React, { useState, useEffect } from 'react';
import '../assets/TextFinder.css'; // 애니메이션을 위한 CSS

function TextFinder({ show, onSearch }) {
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 'f') {
        event.preventDefault(); // 기본 브라우저 검색 기능 방지
        setIsVisible(!isVisible); // TextFinder 표시/숨김 토글
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible]);

  useEffect(() => {
    if (!show) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300); // CSS 애니메이션 지속 시간과 일치해야 합니다.
      return () => clearTimeout(timer);
    }
  }, [show]);

  // TextFinder 컴포넌트 내에서
  useEffect(() => {
    onSearch(searchQuery); // 검색 쿼리 변경 시 부모에 전달
  }, [searchQuery, onSearch]);

  return (
    <div
      className={`text-finder ${show && isVisible ? 'show slideDown' : 'slideUp'}`}
      onAnimationEnd={() => {
        if (!show) setIsVisible(false);
      }}
      style={{ display: isVisible ? 'block' : 'none' }}
    >
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for text..."
      />
    </div>
  );
}

export default TextFinder;