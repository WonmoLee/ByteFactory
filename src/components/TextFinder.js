import React, { useState } from 'react';

function TextFinder({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    onSearch(newSearchTerm); // 입력할 때마다 상위 컴포넌트에 검색어 전달
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Search text..."
      />
    </form>
  );
}

export default TextFinder;