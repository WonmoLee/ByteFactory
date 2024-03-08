import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { python } from '@codemirror/lang-python';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';

function TextEditor() {
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
        extensions={[selectedLanguage]}
        theme={oneDark}
      />
    </div>
  );
}

export default TextEditor;