import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/Sidebar.css'; // 사이드바 CSS 스타일을 여기에 정의

const Sidebar = ({ isOpen, setHeaderTitle, headerTitle }) => {
  const navigate = useNavigate();

  const handleItemClick = (path, title) => {
    navigate(path);
    setHeaderTitle(title);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className={headerTitle === "TextDiffViewer" ? "sidebar-item click-item" : "sidebar-item"}
        onClick={() => handleItemClick('/TextDiffViewer', 'TextDiffViewer')}
      >
        <i className="icon-home"></i> {/* 이곳에 홈 아이콘 SVG 또는 Font Awesome 아이콘을 사용할 수 있습니다 */}
        <span>텍스트 비교</span>
      </div>
      <div className={headerTitle === "ClipboardMonitor" ? "sidebar-item click-item" : "sidebar-item"}
        onClick={() => handleItemClick('/ClipboardMonitor', 'ClipboardMonitor')}
      >
        <i className="icon-messages"></i> {/* 이곳에 메시지 아이콘 SVG 또는 Font Awesome 아이콘을 사용할 수 있습니다 */}
        <span>간편 복사</span>
      </div>
      <div className={headerTitle === "BookMark" ? "sidebar-item click-item" : "sidebar-item"}
           onClick={() => handleItemClick('/BookMark', 'BookMark')}
      >
        <i className="icon-messages"></i> {/* 이곳에 메시지 아이콘 SVG 또는 Font Awesome 아이콘을 사용할 수 있습니다 */}
        <span>북마크</span>
      </div>
      <div className={headerTitle === "Calendar" ? "sidebar-item click-item" : "sidebar-item"}
           onClick={() => handleItemClick('/Calendar', 'Calendar')}
      >
        <i className="icon-messages"></i> {/* 이곳에 메시지 아이콘 SVG 또는 Font Awesome 아이콘을 사용할 수 있습니다 */}
        <span>달력</span>
      </div>
      {/* 추가적인 사이드바 아이템들을 여기에 구성할 수 있습니다 */}
    </div>
  );
};

export default Sidebar;
