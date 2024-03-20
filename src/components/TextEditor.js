import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { search } from "@codemirror/search"; // 검색 기능을 위한 import
import { oneDark } from '@codemirror/theme-one-dark';
import { python } from '@codemirror/lang-python';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';

function TextEditor({ onFocus, onBlur, onTextSelect }) {
  const [selectedLanguage, setSelectedLanguage] = useState([]);
  
  const handleChangeLanguage = (event) => {
    const language = event.target.value;
    switch (language) {
      case 'plaintext':
        setSelectedLanguage([]); // 일반 텍스트 모드는 언어 확장 없이 설정
        break;
      case 'python':
        setSelectedLanguage(python());
        break;
      case 'javascript':
        setSelectedLanguage(javascript());
        break;
      case 'html':
        setSelectedLanguage(html());
        break;
      case 'css':
        setSelectedLanguage(css());
        break;
      default:
        setSelectedLanguage([]);
    }
  };

  const handleUpdate = (update) => {
    if (update.selectionSet) { // 사용자가 선택한 경우
      const selection = update.state.selection;
      if (!selection.empty) { // 선택 영역이 비어있지 않은 경우
        const selectedText = update.state.doc.sliceString(selection.ranges[0].from, selection.ranges[0].to);
        onTextSelect(selectedText);
      }
    }
  };

  return (
    <div>
      <select onChange={handleChangeLanguage} defaultValue="plaintext">
        <option value="plaintext">일반 텍스트</option>
        <option value="python">Python</option>
        <option value="javascript">JavaScript</option>
        <option value="html">HTML</option>
        <option value="css">CSS</option>
      </select>
      <CodeMirror
        value=""
        width="700px"
        height="700px"
        extensions={[selectedLanguage, search()]}
        theme={oneDark}
        onFocus={onFocus} // CodeMirror에 onFocus 이벤트 핸들러 추가
        onBlur={onBlur} // CodeMirror에 onBlur 이벤트 핸들러 추가
        onUpdate={handleUpdate}
      />
    </div>
  );
}

export default TextEditor;