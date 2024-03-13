import React from 'react';
import MonacoEditor from 'react-monaco-editor';

class TextEditor extends React.Component {
  
  constructor(props) {
    super(props);
    this.editorDidMount = this.editorDidMount.bind(this);
  }  

  editorDidMount(editor, monaco) {
    this.props.onEditorMounted(editor, monaco);
  }  

  onChange(newValue, e) {
    console.log('변경 사항:', newValue);
  }

  render() {
    const code = '// 여기에 코드를 입력하세요\n';
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
