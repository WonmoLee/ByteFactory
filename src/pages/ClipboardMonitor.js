import React, { useState, useEffect } from 'react';

function ClipboardMonitor() {
  const [clipboardContents, setClipboardContents] = useState([]);

  useEffect(() => {
    const handleCopy = (event) => {
      const selection = document.getSelection();
      if (selection.toString().length > 0) {
        const text = selection.toString();

        event.clipboardData.setData('text/plain', text);
        event.preventDefault(); // 기본 클립보드 동작을 막아 중복을 방지
        // 새로운 항목 추가 시 기본 타이틀을 임시 타이틀로 설정하고 편집 가능 상태로 지정
        setClipboardContents((prevContents) => [
          ...prevContents,
          { title: 'Untitle', content: text, isEditing: true },
        ]);
      }
    };

    document.addEventListener('copy', handleCopy);

    return () => {
      document.removeEventListener('copy', handleCopy);
    };
  }, []);

  const handleTitleChange = (index, newTitle) => {
    setClipboardContents((prevContents) =>
      prevContents.map((item, idx) => (idx === index ? { ...item, title: newTitle } : item))
    );
  };

  const toggleEditing = (index, isEditing = false) => {
    setClipboardContents((prevContents) =>
      prevContents.map((item, idx) => (idx === index ? { ...item, isEditing } : item))
    );
  };

  const handleKeyDown = (event, index) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // 엔터 키 기본 동작 방지
      toggleEditing(index, false); // 편집 모드 종료
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ width: '60%', height: '700px' }}>
        <h2>복사 작업할 텍스트</h2>
        <textarea style={{ width: '90%', height: '100%' }} placeholder="Copy text from here..."></textarea>
      </div>
      <div style={{ width: '45%' }}>
        <h2>Clipboard Contents</h2>
        <ul>
          {clipboardContents.map((item, index) => (
            <li key={index} style={{ marginBottom: '10px', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
              {item.isEditing ? (
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => handleTitleChange(index, e.target.value)}
                  onBlur={() => toggleEditing(index, false)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  autoFocus
                />
              ) : (
                <div onDoubleClick={() => toggleEditing(index, true)}>
                  <strong>{item.title}</strong>
                </div>
              )}
              <br/>
              <div style={{ marginLeft: '20px', marginRight:'20px' }}>{item.content}</div>
              <br/>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ClipboardMonitor;