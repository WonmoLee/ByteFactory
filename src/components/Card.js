import React from 'react';
import '../assets/Card.css'; // CSS 파일을 불러옵니다.
import image1 from '../assets/imgs/service1.png';
import image2 from '../assets/imgs/service2.png';

const Card = ({ No, title, description }) => {

  const getBackgroundImage = (No) => {
    const images = {
      '1': image1,
      '2': image2,
    };

    if(No == null) {
      return 'none';
    } else {
      return `url(${images[No]})`;
    }
  };

  const cardStyle = {
    cursor: 'pointer',
    backgroundImage: getBackgroundImage(No),
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    margin: '32px',
    padding: '16px',
    transition: 'transform 0.3s ease-in-out',
    willChange: 'transform',
    position: 'relative', // 오버레이 위치 설정을 위해 relative 추가
    color: 'white', // 텍스트 색상을 밝게 설정합니다.
    zIndex: 2, // 텍스트가 오버레이 위에 오도록 z-index 설정
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 검은색 오버레이
    borderRadius: '8px', // cardStyle의 borderRadius와 동일하게 설정
    zIndex: 1, // 오버레이가 텍스트 아래에 오도록 z-index 설정
  };

  return (
    <div className="card" style={cardStyle}>
      <div style={overlayStyle} /> {/* 오버레이 추가 */}
      <div style={{ position: 'relative', zIndex: 3 }}> {/* 텍스트 컨테이너 */}
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
      </div>
    </div>
  );
};

export default Card;