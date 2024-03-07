import React, { useState, useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
import TextFinder from './TextFinder';

function EditableDiv({ onFocusChange }) {
  const [content, setContent] = useState("이곳의 텍스트를 편집해보세요.");
  const [showSearch, setShowSearch] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isFocused && event.ctrlKey && event.key === 'f') {
        event.preventDefault();
        setShowSearch(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFocused]);

  useEffect(() => {
    const handleFocus = () => {
      setIsFocused(true);
      onFocusChange(true);
    };
    const handleBlur = (event) => {
      setIsFocused(false);
      onFocusChange(false);
      setContent(event.target.innerHTML);
      // 상태 업데이트를 제거하여 브라우저의 기본 실행 취소 기능을 유지
    };

    const el = contentRef.current;
    el.addEventListener('focus', handleFocus, true);
    el.addEventListener('blur', handleBlur, true);

    return () => {
      el.removeEventListener('focus', handleFocus, true);
      el.removeEventListener('blur', handleBlur, true);
    };
  }, [onFocusChange]);

  const handlePaste = (event) => {
    event.preventDefault();
    const clipboardData = event.clipboardData;
    let pasteContent;
    if (clipboardData.types.includes('text/html')) {
      pasteContent = clipboardData.getData('text/html');
    } else {
      pasteContent = clipboardData.getData('text/plain');
      pasteContent = pasteContent.replace(/(?:\r\n|\r|\n)/g, '<br>');
    }
    const cleanContent = DOMPurify.sanitize(pasteContent);
    document.execCommand('insertHTML', false, cleanContent);
  };

  const handleSearchChange = (query) => {
    if (!query) {
      contentRef.current.innerHTML = content;
    } else {
      const regex = new RegExp(`(${query})`, 'gi');
      const highlightedContent = content.replace(regex, '<span style="background-color: yellow;">$1</span>');
      contentRef.current.innerHTML = highlightedContent;
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div
        ref={contentRef}
        contentEditable={true}
        onPaste={handlePaste}
        suppressContentEditableWarning={true}
        style={{
          width: '100%',
          height: '80vh',
          border: '1px solid #ccc',
          padding: '10px',
          overflow: 'auto',
          whiteSpace: 'pre-wrap'
        }}
      />
      {showSearch && (
        <div className="text-finder-container">
          <TextFinder show={showSearch} onSearch={handleSearchChange} />
        </div>
      )}
    </div>
  );
}

export default EditableDiv;