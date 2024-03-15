import React from 'react';

function TextFinder({ search, onSearchChange, onClose }) {
  const buttonStyle = {
    cursor: 'pointer',
    padding: '10px',
    margin: '0 5px', // 양 옆의 여백을 조금 줍니다.
    lineHeight: '1', // 라인 높이를 조정하여 높이를 입력 필드에 맞춥니다.
    border: '1px solid #ccc', // 버튼의 테두리를 간단하게 스타일링합니다.
    background: '#fff', // 배경색을 하얀색으로 설정합니다.
    borderRadius: '4px' // 버튼의 모서리를 둥글게 합니다.
  };

  const inputStyle = {
    flexGrow: 1,
    padding: '10px',
    lineHeight: '1.5', // 입력 필드의 텍스트 라인 높이를 버튼과 같은 높이로 조정합니다.
    border: '1px solid #ccc',
    borderRadius: '4px'
  };

  const containerStyle = {
    display: search.visible ? 'flex' : 'none',
    alignItems: 'center',
    gap: '10px',
    background: '#f1f1f1', // 컨테이너 배경색을 조정합니다.
    padding: '5px', // 컨테이너 내부의 여백을 추가합니다.
    borderRadius: '4px' // 컨테이너 모서리를 둥글게 합니다.
  };

  return (
    <div style={containerStyle}>
      <input
        type="text"
        placeholder="검색..."
        value={search.term}
        onChange={e => onSearchChange({ ...search, term: e.target.value })}
        style={inputStyle}
      />
      {/* <button style={buttonStyle}>↑</button>
      <button style={buttonStyle}>↓</button> */}
      <button onClick={onClose} style={buttonStyle}>X</button>
    </div>
  );
}

export default TextFinder;
