import React, { useState, useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';

function EditableDiv({ searchQuery }) {
  const [content, setContent] = useState("");
  const contentRef = useRef(null);

  useEffect(() => {
    if (!searchQuery) {
      // 검색 쿼리가 없으면 원본 내용으로 복원
      contentRef.current.innerHTML = content;
    } else {
      // 검색 쿼리의 특수 문자를 이스케이프 처리
      const escapedSearchQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escapedSearchQuery})`, 'gi');
      const highlightedHtml = content.replace(regex, `<mark style="background-color: yellow;">$1</mark>`);
      contentRef.current.innerHTML = highlightedHtml;
    }
  }, [searchQuery, content]);  

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
    document.execCommand('insertHTML', false, cleanHtml.trim());
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
    </div>
  );
}

export default EditableDiv;