import React, { useState, useEffect } from 'react';
import TextEditor from '../components/TextEditor';

function ClipboardMonitor() {
  const [clipboardItems, setClipboardItems] = useState([]);

  // 컴포넌트 마운트 시 로컬 스토리지에서 클립보드 항목을 불러오기
  useEffect(() => {
    const loadClipboardItems = () => {
      const savedItems = localStorage.getItem('clipboardItems');
      if (savedItems) {
        setClipboardItems(JSON.parse(savedItems));
      }
    };

    loadClipboardItems();
  }, []);

  // 클립보드 항목이 변경될 때 로컬 스토리지를 업데이트
  useEffect(() => {
    if (clipboardItems.length > 0) {
      localStorage.setItem('clipboardItems', JSON.stringify(clipboardItems));
    }
  }, [clipboardItems]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'C') {
        event.preventDefault();
        const selectedText = document.getSelection()?.toString();
        if (selectedText) {
          const newItem = {
            title: "Untitle",
            text: selectedText,
          };
          setClipboardItems(prevItems => [...prevItems, newItem]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [clipboardItems]);

  const handleTitleChange = (index, newTitle) => {
    const newItems = clipboardItems.map((item, idx) =>
      idx === index ? { ...item, title: newTitle } : item
    );
    setClipboardItems(newItems);
  };  

  const handleDelete = (index) => {
    const newItems = clipboardItems.filter((_, idx) => idx !== index);
    setClipboardItems(newItems);
  };

  const handleClearAll = () => {
    setClipboardItems([]);
    localStorage.removeItem('clipboardItems');
  };

  return (
    <div style={{ marginTop: '20px', marginRight: '20px', display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ position: 'relative', width: '40%' }}> {/* position: relative로 설정하여, 내부 fixed 포지셔닝의 기준점을 제공 */}
        <div style={{ position: 'fixed', top: '80px', left: '200px' }}>
          <p>간편 복사 (Ctrl + Shift + C 또는 Cmd + Shift + C)</p>
          <TextEditor />
        </div>
      </div>
      <div style={{ marginLeft: '45%', width: '50%', paddingLeft: '20px' }}> {/* <TextEditor /> 공간을 고려해 marginLeft 조정 및 padding 추가 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>클립보드 히스토리</h2>
          <button onClick={handleClearAll}>전체 초기화</button>
        </div>
        <ul>
          {clipboardItems.map((item, index) => (
            <li key={index} style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div
                  contentEditable={true}
                  onBlur={(e) => handleTitleChange(index, e.target.innerText)}
                  onDoubleClick={(e) => {e.currentTarget.contentEditable = true;}}
                  style={{ flex: 1, flexShrink: 1, fontWeight: 'bold', cursor: 'text', maxWidth: '50%' }}
                >
                  {item.title}
                </div>
                <button onClick={() => handleDelete(index)} style={{ marginLeft: '5px' }}>삭제</button>
              </div>
              <span style={{ display: 'block', whiteSpace: 'pre-wrap', marginLeft: '20px', marginTop: '20px', marginBottom: '40px' }}>{item.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ClipboardMonitor;