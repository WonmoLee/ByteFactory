import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

class TextEditor extends React.Component {
  handleEditorChange = (content, editor) => {
    console.log('Content was updated:', content);
  }

  render() {
    return (
      <Editor
        apiKey='otpkea4d7ogncfks6cobhbypx8388nvicasrk335qrlsvo60'
        initialValue="<p>Initial content</p>"
        init={{
          height: 700,
          menubar: false,
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount'
          ],
          toolbar: 'undo redo | formatselect | ' +
          'bold italic backcolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help'
        }}
        onEditorChange={this.handleEditorChange}
      />
    );
  }
}

export default TextEditor;