import React from 'react';

function GameAlert({ isOpen, message, type, onClose }) {
  if (!isOpen) return null;

  // Đổi màu viền và tiêu đề theo loại thông báo (Thành công: xanh Neon, Thất bại: hồng Neon)
  const isSuccess = type === 'success';
  const themeColor = isSuccess ? '#00f2ff' : '#ff007f';
  const titleText = isSuccess ? '⚡ HỆ THỐNG THÔNG BÁO ⚡' : '⚠️ CẢNH BÁO HỆ THỐNG ⚠️';

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(0, 0, 0, 0.8)', display: 'flex', justifyContent: 'center',
      alignItems: 'center', zIndex: 9999, backdropFilter: 'blur(5px)'
    }}>
      <div className="login-box" style={{
        width: '380px', padding: '30px', borderRadius: '12px',
        borderColor: themeColor,
        boxShadow: `0 0 25px ${themeColor}40, inset 0 0 15px ${themeColor}20`,
        textAlign: 'center'
      }}>
        {/* Tiêu đề Dialog */}
        <h3 style={{ 
          color: themeColor, fontSize: '16px', fontWeight: 'bold', 
          marginBottom: '15px', letterSpacing: '1px', textShadow: `0 0 8px ${themeColor}`
        }}>
          {titleText}
        </h3>

        {/* Nội dung thông báo */}
        <p style={{ color: '#fff', fontSize: '14px', marginBottom: '25px', lineHeight: '1.6' }}>
          {message}
        </p>

        {/* Nút bấm xác nhận */}
        <button 
          className="btn-submit" 
          style={{ 
            marginTop: 0, padding: '10px 20px', fontSize: '14px', borderRadius: '20px',
            background: isSuccess ? 'linear-gradient(90deg, #0055ff, #00f2ff)' : 'linear-gradient(90deg, #7f00ff, #ff007f)',
            boxShadow: 'none'
          }}
          onClick={onClose}
        >
          XÁC NHẬN
        </button>
      </div>
    </div>
  );
}

export default GameAlert;