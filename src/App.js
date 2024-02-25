import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Card from './components/Card';
import Sidebar from './components/Sidebar'; // 사이드바 컴포넌트 import
import TextDiffViewer from './pages/TextDiffViewer';
import DarkModeToggle from './components/DarkModeToggle';
import Modal from './components/Modal';
import './App.css';
import logo from './assets/imgs/logo.png';

const App = () => {
  const [showCards, setShowCards] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [navigateHome, setNavigateHome] = useState(false);
  const [logoClass, setLogoClass] = useState('');
  const [textClass, setTextClass] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [logoContainerStyle, setLogoContainerStyle] = useState({});

  const handleCardClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setShowCards(false);
    setNavigateHome(false);
    setLogoClass('logo-slide-out');
    setTextClass('text-fade-out');
    // 로고의 가로 길이만큼 영역을 부여합니다.
    setLogoContainerStyle({flexGrow: 0, flexShrink: 0, flexBasis: '100px', zIndex: 1000});
    setSidebarOpen(true);

    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  };

  const handleNotOpenCardClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleLogoClick = () => {
    if (isAnimating || showCards) return;
    setIsAnimating(true);
    setShowCards(true);
    setNavigateHome(true);
    setLogoClass('logo-slide-in');
    setTextClass('text-fade-in');
    setLogoContainerStyle({});
    setSidebarOpen(false);

    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header" style={logoContainerStyle}>
          <div className={`center-container ${logoClass}`} onClick={handleLogoClick}>
            <img src={logo} alt="ByteFactory" style={{cursor: 'pointer'}} />
            <p className={`${textClass}`} style={{fontWeight: 'bold', cursor: 'pointer'}}>B Y T E F A C T O R Y</p>
          </div>
          <div className="right-container">
            <DarkModeToggle />
          </div>
        </header>
        <Sidebar isOpen={sidebarOpen} />
        <div className={`content-area ${sidebarOpen ? 'content-shifted' : ''}`}> 
          {showCards && (
            <div>
              <Link to="/TextDiffViewer" onClick={handleCardClick}>
                <Card title="TextDiffViewer" description="텍스트 비교 프로그램입니다."/>
              </Link>
              <Link to="#" onClick={handleNotOpenCardClick}>
                <Card title="서비스 2" description="준비중입니다." />
              </Link>
              <Modal show={showModal} onClose={handleCloseModal}>
                <p>서비스 준비 중입니다! &gt;.&lt;</p>
              </Modal>
            </div>
          )}
          {navigateHome ? <Navigate to="/" replace={true} /> : null}
          {!navigateHome && (
            <Routes>
              <Route path="/TextDiffViewer" element={<TextDiffViewer />} />
            </Routes>
          )}
        </div>
      </div>
    </Router>
  );
};

export default App;