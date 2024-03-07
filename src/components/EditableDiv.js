import React, { useState, useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';

function EditableDivWithLineNumbers({ searchQuery }) {
  const [content, setContent] = useState("이곳의 텍스트를 편집해보세요.");
  const contentRef = useRef(null);
  const lineNumberRef = useRef(null);

  useEffect(() => {
    highlightText(searchQuery);
    updateLineNumbers();
  }, [searchQuery, content]);

  const handleContentChange = () => {
    const text = contentRef.current.innerText;
    setContent(text);
    updateLineNumbers();
  };

  const syncScroll = () => {
    const scrollPercentage = contentRef.current.scrollTop / contentRef.current.scrollHeight;
    lineNumberRef.current.scrollTop = lineNumberRef.current.scrollHeight * scrollPercentage;
  };

  const updateLineNumbers = () => {
    const lines = content.split('\n').length;
    const lineNumberHtml = Array.from({ length: lines }, (_, index) => `<div>${index + 1}</div>`).join('');
    lineNumberRef.current.innerHTML = lineNumberHtml;
  };

  const highlightText = (query) => {
    if (!query) {
      contentRef.current.innerHTML = content; // 검색어가 없으면 원래 상태로 복원
      updateLineNumbers();
      return;
    }
    const regex = new RegExp(`(${query})`, 'gi');
    const highlightedHTML = content.replace(regex, '<span style="background-color: yellow;">$1</span>');
    contentRef.current.innerHTML = DOMPurify.sanitize(highlightedHTML);
  };

  return (
    <div style={{ display: 'flex' }}>
      <div
        ref={lineNumberRef}
        style={{
          width: '70px',
          height: '80vh',
          background: '#535151',
          padding: '10px',
          textAlign: 'center',
          borderRight: '1px solid #ccc',
          overflow: 'hidden',
        }}
      ></div>
      <div
        ref={contentRef}
        contentEditable={true}
        onKeyUp={handleContentChange}
        onScroll={syncScroll}
        style={{
          width: '100%',
          height: '80vh',
          border: '1px solid #ccc',
          padding: '10px',
          overflowY: 'scroll',
          whiteSpace: 'pre-wrap',
        }}
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
      ></div>
    </div>
  );
}

export default EditableDivWithLineNumbers;