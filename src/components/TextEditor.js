import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';

function TextEditor() {
  return (
    <CodeMirror
      value="// 여기에 코드를 입력하세요.\n"
      height="300px"
      extensions={[javascript()]}
      theme={oneDark}
      onChange={(value, viewUpdate) => {
        console.log('value:', value);
      }}
    />
  );
}

export default TextEditor;