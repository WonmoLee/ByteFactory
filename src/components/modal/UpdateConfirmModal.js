import React from 'react';
import '../../assets/css/modal/UpdateConfirmModal.css';

const UpdateConfirmModal = ({ onClose }) => {
  return (
    <div className="update-confirm-modal">
      <p>새로운 업데이트가 있습니다. 적용하시겠습니까?</p>
      <button onClick={() => window.electron.send('apply-update')} className="update-confirm-button">예</button>
      <button onClick={onClose} className="update-confirm-button">나중에</button>
    </div>
  );
};

export default UpdateConfirmModal;