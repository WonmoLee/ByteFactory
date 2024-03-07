import React, { useState, useEffect } from 'react';

function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 100) { // 여기서 100px는 임계값으로, 필요에 따라 조정할 수 있습니다.
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    isVisible && (
      <button onClick={scrollToTop} style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: 'green',
        color: 'white',
        borderRadius: '50%',
        border: 'none',
        width: '50px',
        height: '50px',
        cursor: 'pointer',
        // 추가 스타일링 옵션
      }}>
        ↑
      </button>
    )
  );
}

export default ScrollToTopButton;