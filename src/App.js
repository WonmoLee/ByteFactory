import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Card from './components/Card';
import DarkModeToggle from './components/DarkModeToggle';
import TextDiffViewer from './pages/TextDiffViewer';
import './App.css';
import logo from './assets/imgs/logo.png';

const App = () => {
  const [showCards, setShowCards] = useState(true);
  const [navigateHome, setNavigateHome] = useState(false); // 홈으로 리다이렉트하는 상태 추가
  const [logoClass, setLogoClass] = useState(''); // 로고의 클래스 상태를 관리합니다

  const handleCardClick = () => {
    setShowCards(false);
    setNavigateHome(false); // 카드 클릭 시에는 홈으로 리다이렉트하지 않음
    setLogoClass('logo-slide-out'); // 로고에 애니메이션 클래스를 적용합니다
  };

  const handleLogoClick = () => {
    setShowCards(true); // 모든 카드를 다시 표시
    setNavigateHome(true); // 홈으로 리다이렉트
    setLogoClass(''); // 로고 애니메이션 클래스를 초기화합니다
  };

  return (
    <Router>
      <div className="App" style={{padding: '20px'}}>
        <header className="App-header">
          <div className={`center-container ${logoClass}`} onClick={handleLogoClick}>
            <img src={logo} alt="ByteFactory" style={{cursor: 'pointer'}}/><p style={{fontWeight: 'bold', cursor: 'pointer'}}>B Y T E F A C T O R Y</p>
          </div>
          <div className="right-container">
            <DarkModeToggle />
          </div>
        </header>
        {showCards && (
          <div>
            <Link to="/TextDiffViewer" onClick={handleCardClick}>
              <Card title="TextDiffViewer" description="텍스트 비교 프로그램입니다."/>
            </Link>
            <Link to="/b" onClick={handleCardClick}>
              <Card title="서비스 2" description="준비중입니다." />
            </Link>
          </div>
        )}
        {navigateHome ? <Navigate to="/" replace={true} /> : null}
        {!navigateHome && (
          <Routes>
            <Route path="/TextDiffViewer" element={<TextDiffViewer />} />
            {/* <Route path="/b" element={<B />} /> 여기서 B 컴포넌트를 정의하고 element로 추가해야 합니다. */}
          </Routes>
        )}
      </div>
    </Router>
  );
};

export default App;