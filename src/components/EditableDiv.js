import React, { useState } from 'react';

function EditableDiv() {
    const [content, setContent] = useState("이곳의 텍스트를 편집해보세요.");
  
    const handleBlur = (event) => {
      setContent(event.target.innerText);
    };
  
    return (
      <div
        contentEditable={true}
        onBlur={handleBlur}
        suppressContentEditableWarning={true}
        style={{
          width: '100%',
          height: '80vh',
          border: '1px solid #ccc',
          padding: '10px',
          overflow: 'auto'
        }}
      >
        {content}
      </div>
    );
  }
  

export default EditableDiv;