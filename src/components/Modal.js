// Modal.js
import React from 'react';
import '../assets/Modal.css'; // Make sure the correct path to your Modal.css file is used

const Modal = ({ show, onClose, children }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="close-button">&times;</button>
        <div className="modal-image">💡</div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
