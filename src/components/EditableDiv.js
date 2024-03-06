import React, { useState, useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';

function EditableDiv() {
  const [content, setContent] = useState("이곳의 텍스트를 편집해보세요.");
  const [showSearch, setShowSearch] = useState(false); // 검색 UI 표시 여부
  const [searchQuery, setSearchQuery] = useState(''); // 검색 쿼리
  const contentRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 'f') {
        event.preventDefault();
        setShowSearch(!showSearch); // 검색 UI 토글
      }
      // 여기에 Ctrl+Z 등 다른 단축키 처리 로직을 추가할 수 있습니다.
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showSearch]);

  const handleBlur = (event) => {
    const cleanHtml = DOMPurify.sanitize(event.target.innerHTML);
    setContent(cleanHtml);
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const html = event.clipboardData.getData('text/html') || event.clipboardData.getData('text/plain');
    const cleanHtml = DOMPurify.sanitize(html, {
      FORBID_ATTR: ['style', 'class'],
      FORBID_TAGS: ['script', 'iframe'],
    });
    document.execCommand('insertHTML', false, cleanHtml);
  };

  // 검색 쿼리 변경 처리
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // 여기에 검색 쿼리에 따른 검색 로직을 구현할 수 있습니다.
    // 예: content에서 searchQuery를 검색하고 결과를 하이라이트하는 로직
  };

  return (
    <div>
      <div
        ref={contentRef}
        contentEditable={true}
        onBlur={handleBlur}
        onPaste={handlePaste}
        suppressContentEditableWarning={true}
        style={{
          width: '100%',
          height: '80vh',
          border: '1px solid #ccc',
          padding: '10px',
          overflow: 'auto'
        }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      {showSearch && (
        <div className="text-finder">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search for text..."
          />
          {/* 검색 결과 및 네비게이션 UI를 여기에 추가할 수 있습니다. */}
        </div>
      )}
    </div>
  );
}

export default EditableDiv;