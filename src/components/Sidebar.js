import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/Sidebar.css'; // 사이드바 전용 CSS 파일

const Sidebar = ({ isOpen, onIconClick }) => {

  const navigate = useNavigate();

  const handleIconClick = (path) => {
    navigate(path);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="icon" onClick={() => handleIconClick('/TextDiffViewer')}>T</div>
      <div className="icon" onClick={() => handleIconClick('/ClipboardMonitor')}>2</div>
    </div>
  );
};

export default Sidebar;