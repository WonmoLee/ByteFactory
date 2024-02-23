import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Card from './components/Card';
import DarkModeToggle from './components/DarkModeToggle';
import TextDiffViewer from './pages/TextDiffViewer';
import './App.css';
import logo from './assets/imgs/logo.png';

const App = () => {
  // 카드의 표시 여부를 관리하는 상태
  const [showCards, setShowCards] = useState(true);

  // 카드 클릭 이벤트 핸들러
  const handleCardClick = () => {
    setShowCards(false); // 모든 카드를 숨깁니다.
  };

  return (
    <Router>
      <div className="App" style={{padding: '20px'}}>
        <header className="App-header">
          <div className="center-container">
            <img src={logo} alt="ByteFactory" />B Y T E F A C T O R Y
          </div>
          <div className="right-container">
            <DarkModeToggle />
          </div>
        </header>
        {showCards && (
          <div onClick={handleCardClick}>
            <Link to="/TextDiffViewer">
              <Card title="TextDiffViewer" description="텍스트 비교 프로그램입니다."/>
            </Link>
            <Link to="/b">
              <Card title="서비스 2" description="준비중입니다." />
            </Link>
          </div>
        )}
        <Routes>
          <Route path="/TextDiffViewer" element={<TextDiffViewer />} />
          {/* <Route path="/b" component={B} /> 여기서도 B 컴포넌트를 element로 수정해야 합니다. */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;