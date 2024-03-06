import React, { useState } from 'react';
import DOMPurify from 'dompurify'; // DOMPurify 라이브러리를 설치해야 합니다.

function EditableDiv() {
  const [content, setContent] = useState("이곳의 텍스트를 편집해보세요.");

  const handleBlur = (event) => {
    // innerHTML을 사용하여 상태 업데이트
    setContent(event.target.innerHTML);
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const html = event.clipboardData.getData('text/html') || event.clipboardData.getData('text/plain');
    // 붙여넣기된 콘텐츠를 살균
    const cleanHtml = DOMPurify.sanitize(html);
    // 살균된 HTML을 상태로 설정
    setContent(cleanHtml);
  };

  return (
    <div
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
      dangerouslySetInnerHTML={{ __html: content }} // 상태를 사용하여 내용을 렌더링
    />
  );
}

export default EditableDiv;