import React, { useState, useEffect } from 'react';
import TextEditor from '../components/TextEditor';
import TextFinder from '../components/TextFinder';

function ClipboardMonitor() {
  const [clipboardItems, setClipboardItems] = useState([]);
  const [search, setSearch] = useState({ term: '', visible: false });
  const [isTextEditorFocused, setIsTextEditorFocused] = useState(false);
  const [selectedText, setSelectedText] = useState('');

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
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'c') {
        event.preventDefault();
        if (selectedText) {
          const newItem = {
            title: "Untitle",
            text: selectedText,
          };
          setClipboardItems(prevItems => [...prevItems, newItem]);
        }
      }

      if (event.ctrlKey && event.key.toLowerCase() === 'f') {
        if (!isTextEditorFocused) {
          event.preventDefault();
          if (!search.visible) {
            setSearch({ ...search, visible: true });
          }
        }
      }

      if (event.key === 'Escape') {
        if (search.visible) {
          event.preventDefault(); // 기본 이벤트를 막습니다.
          setSearch({ ...search, visible: false }); // 검색 UI를 숨깁니다.
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [clipboardItems, isTextEditorFocused, search, selectedText]);

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

  const highlightText = (text) => {
    if (!search.term) return text;

    const parts = text.split(new RegExp(`(${search.term})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === search.term.toLowerCase() ? <span key={index} style={{ backgroundColor: 'yellow' }}>{part}</span> : part
    );
  };

  const handleTextEditorFocus = () => setIsTextEditorFocused(true);
  const handleTextEditorBlur = () => setIsTextEditorFocused(false);

  const handleClose = () => {
    setSearch({ ...search, visible: false });
  };

  const handleTextSelected = (updatedText) => {
    setSelectedText(updatedText);
  };

  return (
    <div style={{ marginTop: '20px', marginRight: '20px', display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ position: 'relative', width: '40%' }}> {/* position: relative로 설정하여, 내부 fixed 포지셔닝의 기준점을 제공 */}
        <div style={{ position: 'fixed', top: '80px', left: '200px' }}>
          <p>간편 복사 (Ctrl + Shift + C 또는 Cmd + Shift + C)</p>
          <TextEditor onFocus={handleTextEditorFocus} onBlur={handleTextEditorBlur} onTextSelect={handleTextSelected}/>
        </div>
      </div>
      <div style={{ marginLeft: '30%', width: '100%', paddingLeft: '20px' }}> {/* <TextEditor /> 공간을 고려해 marginLeft 조정 및 padding 추가 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>클립보드 히스토리</h2>
          <TextFinder 
            search={search} 
            onSearchChange={setSearch} 
            onClose={handleClose}
          />
          <button onClick={handleClearAll}>전체 초기화</button>
        </div>
        <ul>
        {clipboardItems.map((item, index) => (
          <li key={index} style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {/* 변경된 부분: contentEditable 대신 input 사용 */}
              <input
                type="text"
                value={item.title}
                onChange={(e) => handleTitleChange(index, e.target.value)}
                style={{ flex: 1, flexShrink: 1, fontWeight: 'bold', cursor: 'text', maxWidth: '50%' }}
              />
              <button onClick={() => handleDelete(index)} style={{ marginLeft: '5px' }}>삭제</button>
            </div>
            <span style={{ display: 'block', whiteSpace: 'pre-wrap', marginLeft: '20px', marginTop: '20px', marginBottom: '40px' }}>{highlightText(item.text)}</span>
          </li>
        ))}
        </ul>
      </div>
    </div>
  );
}

export default ClipboardMonitor;