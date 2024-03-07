import React, { useState, useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
import TextFinder from './TextFinder';

function EditableDiv({ onFocusChange }) {
  const [content, setContent] = useState("이곳의 텍스트를 편집해보세요.");
  const [showSearch, setShowSearch] = useState(false);
  const [isFocused, setIsFocused] = useState(false); // 포커스 상태 추가
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

  const handleBlur = (event) => {
    setContent(event.target.innerHTML);
  };

  useEffect(() => {
    contentRef.current.innerHTML = content;
  }, [content]);

  useEffect(() => {
    const handleFocus = () => {
      setIsFocused(true);
      onFocusChange(true);
    };
    const handleBlur = () => {
      setIsFocused(false);
      onFocusChange(false);
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
    const text = event.clipboardData.getData('text/plain');
    const cleanText = DOMPurify.sanitize(text);
    document.execCommand('insertText', false, cleanText);
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
      />
      <div className="text-finder-container">
        <TextFinder show={showSearch} onSearch={handleSearchChange} />
      </div>
    </div>
  );
}

export default EditableDiv;