import React from 'react';
import '../assets/Sidebar.css'; // 사이드바 전용 CSS 파일

const Sidebar = ({ isOpen }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* 아이콘들을 여기에 추가 */}
      <div className="icon">1</div>
      <div className="icon">2</div>
    </div>
  );
};

export default Sidebar;