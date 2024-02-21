import React from 'react';
import TextDiffViewer from './pages/TextDiffViewer'; // TextDiffViewer 컴포넌트를 임포트합니다.

const App = () => {
  return (
    <div className="App" style={{padding: '20px'}}>
      <h1>TextDiffViewer</h1>
      <TextDiffViewer/>
    </div>
  );
};

export default App;