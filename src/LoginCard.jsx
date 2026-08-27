import { useState } from 'react';
import GameAlert from './GameAlert';

function LoginCard({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // State quản lý Dialog thông báo mới
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, message: '', type: 'success' });

  const showAlert = (message, type = 'success') => {
    setAlertConfig({ isOpen: true, message, type });
  };

  const handleCloseAlert = () => {
    setAlertConfig({ ...alertConfig, isOpen: false });
    // Nếu vừa đăng ký thành công xong thì tự động chuyển sang tab đăng nhập sau khi đóng thông báo
    if (alertConfig.message.includes("Đăng ký tài khoản Game thành công")) {
      setPassword('');
      setConfirmPassword('');
      setIsRegister(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !password) {
      showAlert("Vui lòng nhập đầy đủ tài khoản và mật khẩu!", "error");
      return;
    }

    const localUsers = JSON.parse(localStorage.getItem('game_users')) || [];

    if (isRegister) {
      if (password !== confirmPassword) {
        showAlert("Mật khẩu nhập lại không trùng khớp!", "error");
        return;
      }

      const isExist = localUsers.find(u => u.username.toLowerCase() === username.toLowerCase());
      if (isExist) {
        showAlert("Tên tài khoản này đã tồn tại trong Game!", "error");
        return;
      }

      const newUser = { username, password, coins: 0, role: "user" }; 
      localUsers.push(newUser);
      localStorage.setItem('game_users', JSON.stringify(localUsers));

      showAlert("🎉 Đăng ký tài khoản Game thành công! Hãy đăng nhập ngay.", "success");

    } else {
      if (username === 'admin' && password === '123') {
        const adminData = { username: 'Admin Đông', role: 'admin', coins: 999999 };
        sessionStorage.setItem('game_auth', 'true');
        sessionStorage.setItem('game_user_current', JSON.stringify(adminData));
        onLoginSuccess(adminData);
        return;
      }

      const userFound = localUsers.find(u => u.username === username && u.password === password);

      if (userFound) {
        sessionStorage.setItem('game_auth', 'true');
        sessionStorage.setItem('game_user_current', JSON.stringify(userFound));
        onLoginSuccess(userFound);
      } else {
        showAlert("❌ Sai tài khoản hoặc mật khẩu! Vui lòng kiểm tra lại.", "error");
      }
    }
  };

  const switchMode = () => {
    setIsRegister(!isRegister);
    setUsername('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <>
      <div className={`login-box ${isRegister ? 'register-mode' : ''}`}>
        <h1 className="login-title">{isRegister ? "TẠO CHIẾN BINH" : "VÀO TRÒ CHƠI"}</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <label>Tên tài khoản</label>
            <input type="text" placeholder="Nhập ID nhân vật..." value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="input-container">
            <label>Mật khẩu mật mã</label>
            <input type="password" placeholder="Nhập mật khẩu bí mật..." value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {isRegister && (
            <div className="input-container">
              <label>Xác nhận mật mã</label>
              <input type="password" placeholder="Nhập lại mật khẩu..." value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
          )}
          <button type="submit" className="btn-submit">{isRegister ? "Bắt đầu đăng ký" : "Đăng nhập ngay"}</button>
        </form>
        <p className="toggle-text">
          {isRegister ? "Đã có tài khoản?" : "Chưa có tài khoản?"}
          <span className="toggle-link" onClick={switchMode}>{isRegister ? "Đăng nhập" : "Tạo ngay tài khoản"}</span>
        </p>
      </div>

      {/* Gọi ghim Dialog thông báo của Card Login */}
      <GameAlert 
        isOpen={alertConfig.isOpen} 
        message={alertConfig.message} 
        type={alertConfig.type} 
        onClose={handleCloseAlert} 
      />
    </>
  );
}

export default LoginCard;