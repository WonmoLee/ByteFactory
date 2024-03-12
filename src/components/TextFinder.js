import React, { useState } from 'react';

function TextFinder({ search, onSearchChange }) {
  return (
    <div style={{ display: search.visible ? 'block' : 'none' }}>
      <input
        type="text"
        placeholder="검색..."
        value={search.term}
        onChange={e => onSearchChange({ ...search, term: e.target.value })}
        style={{ width: '100%', padding: '10px' }}
      />
    </div>
  );
}

export default TextFinder;