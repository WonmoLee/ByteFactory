import React from 'react';
import MonacoEditor from 'react-monaco-editor';

class TextEditor extends React.Component {
  editorDidMount(editor, monaco) {
    editor.focus();

    // 사용자 정의 단축키 설정
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_F, () => {
      const findAction = editor.getAction('actions.find');
      if (findAction) {
        findAction.run();
      }
    });
  }

  onChange(newValue, e) {
    console.log('onChange', newValue, e);
  }

  render() {
    const code = "// 여기에 코드를 입력하세요.\n";
    const options = {
      selectOnLineNumbers: true
    };
    return (
      <MonacoEditor
        width="800"
        height="600"
        language="javascript"
        theme="vs-dark"
        value={code}
        options={options}
        onChange={this.onChange}
        editorDidMount={this.editorDidMount}
      />
    );
  }
}

export default TextEditor;