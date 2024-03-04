import React, { useState, useEffect } from 'react';

function ClipboardMonitor() {
  const [clipboardContents, setClipboardContents] = useState([]);
  const [nextId, setNextId] = useState(0); // 고유 ID 생성을 위한 상태

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.shiftKey && event.code === 'KeyC') {
        const selection = document.getSelection();
        if (selection.toString().length > 0) {
          const text = selection.toString();

          // Ctrl + Shift + C를 눌렀을 때의 동작 구현
          setClipboardContents((prevContents) => [
            ...prevContents,
            { id: nextId, title: 'Untitled', content: text, isEditing: true },
          ]);
          setNextId(nextId + 1);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [nextId]);

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

  const clearClipboard = () => {
    setClipboardContents([]); // 클립보드 내용을 초기화
  };

  const removeItem = (id) => {
    setClipboardContents(clipboardContents.filter(item => item.id !== id));
  };

  return (
    <div style={{ display: 'flex', height: '10vh' }}>
      <div style={{
        width: '40%',
        height: '90vh', // 전체 뷰포트 높이를 차지하도록 설정
        position: 'fixed', // 좌측 영역을 고정
      }}>
        <h2>복사 작업할 텍스트</h2>
        <textarea style={{ width: '100%', height: '90%' }} placeholder="Copy text from here..."></textarea>
      </div>
      <div style={{
        width: '45%',
        marginLeft: '50%', // 좌측 영역의 너비만큼 마진을 줘서 우측 영역이 겹치지 않게 함
        height: '800px' // 전체 뷰포트 높이를 차지하도록 설정
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Clipboard Contents</h2>
        </div>
        <button onClick={clearClipboard} style={{ marginBottom: '20px' }}>초기화</button>
        <ul>
        {
          clipboardContents.map((item, index) => (
            <li key={item.id} style={{ marginBottom: '10px', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
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
                  <strong>{item.title}<button style={{ marginLeft: '50px'}} onClick={() => removeItem(item.id)}>X</button></strong>
                </div>
              )}
              <br/>
              {/* 변경된 부분: item.content를 <pre> 태그로 래핑하여 코드 형식 유지 */}
              <pre style={{ marginLeft: '20px', marginRight: '20px', whiteSpace: 'pre-wrap' }}>{item.content}</pre>
              <br/>
            </li>
          ))
        }
        </ul>
      </div>
    </div>
  );
}

export default ClipboardMonitor;