import React from 'react';
import '../assets/Card.css'; // CSS 파일을 불러옵니다.

const Card = ({ title, description }) => {
  return (
    <div className="card">
      <h3 className="card-title">{title}</h3>
      <p className="card-description">{description}</p>
    </div>
  );
};

export default Card;