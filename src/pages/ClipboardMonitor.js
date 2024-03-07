import React, { useState, useEffect } from 'react';
import TextFinder from '../components/TextFinder'; // TextFinder 컴포넌트 import
import EditableDiv from '../components/EditableDiv'; // TextFinder 컴포넌트 import

function ClipboardMonitor() {
  const [clipboardContents, setClipboardContents] = useState([]);
  const [nextId, setNextId] = useState(0); // 고유 ID 생성을 위한 상태
  const [showTextFinder, setShowTextFinder] = useState(false);
  // ClipboardMonitor 컴포넌트 내에서
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.shiftKey && event.code === 'KeyC') {
        const selection = document.getSelection();
        if (selection.toString().length > 0) {
          const text = selection.toString();
          const newItem = { id: nextId, title: 'Untitled', content: text, isEditing: true };
    
          setClipboardContents((prevContents) => {
            const newContents = [...prevContents, newItem];
            localStorage.setItem('clipboardContents', JSON.stringify(newContents)); // localStorage에 저장
            return newContents;
          });
          
          setNextId(nextId + 1);
        }
      }

      if (!isFocused && event.ctrlKey && event.key === 'f') {
        event.preventDefault(); // 기본 브라우저 검색 기능 방지
        setShowTextFinder(true); // TextFinder 표시/숨김 토글
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [nextId, showTextFinder, isFocused]);

  useEffect(() => {
    const savedContents = localStorage.getItem('clipboardContents');
    if (savedContents) {
        const parsedContents = JSON.parse(savedContents);
        // 모든 항목의 isEditing 상태를 false로 설정
        const contentsWithEditingDisabled = parsedContents.map(item => ({
            ...item,
            isEditing: false
        }));
        setClipboardContents(contentsWithEditingDisabled);
    }
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

  const clearClipboard = () => {
    setClipboardContents([]); // 클립보드 내용을 초기화
    localStorage.removeItem('clipboardContents');
  };

  const removeItem = (id) => {
      // 상태에서 항목을 제거
      const updatedContents = clipboardContents.filter(item => item.id !== id);
      setClipboardContents(updatedContents);

      // 변경된 상태를 로컬 스토리지에 저장
      localStorage.setItem('clipboardContents', JSON.stringify(updatedContents));
  };

  // 검색 쿼리와 일치하는 부분을 하이라이트하는 함수
  const highlightText = (text, query) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} style={{ backgroundColor: 'yellow' }}>{part}</span>
      ) : (
        part
      )
    );
  };

  const handleFocusChange = (focused) => {
    setIsFocused(focused);
  };

  return (
    <div style={{ display: 'flex', height: '10vh' }}>
      <div style={{
        width: '40%',
        height: '90vh', // 전체 뷰포트 높이를 차지하도록 설정
        position: 'fixed', // 좌측 영역을 고정
      }}>
        <h2>복사 작업할 텍스트</h2>
        <EditableDiv searchQuery={searchQuery} onFocusChange={handleFocusChange}/>
      </div>
      <div style={{
        width: '45%',
        marginLeft: '50%', // 좌측 영역의 너비만큼 마진을 줘서 우측 영역이 겹치지 않게 함
        height: '800px' // 전체 뷰포트 높이를 차지하도록 설정
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <h2>Clipboard Contents</h2>
          <TextFinder show={showTextFinder} onSearch={setSearchQuery} />
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
              <pre style={{ marginLeft: '20px', marginRight: '20px', whiteSpace: 'pre-wrap' }}>
                {highlightText(item.content, searchQuery)}
              </pre>
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