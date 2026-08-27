import { useState } from "react";
import LoginCard from "./LoginCard";
import Dashboard from "./Dashboard";
import FloatingTool from "./FloatingTool"; // Import Dialog di chuyển mới
import "./App.css";

function App() {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(sessionStorage.getItem("game_user_current")) || null,
  );
  const [showTool, setShowTool] = useState(false);

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
  };

  const handleUpdateCoins = (updatedUserData) => {
    setCurrentUser(updatedUserData);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("game_auth");
    sessionStorage.removeItem("game_user_current");
    setCurrentUser(null);
    setShowTool(false);
  };

  return (
    <div className="game-login-wrapper">
      {currentUser && showTool ? (
        /* MÀN HÌNH NHÚNG IFRAME HOÀN CHỈNH KÈM DIALOG DI CHUYỂN */
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 9999,
            background: "#000",
          }}
        >
          {/* Nhúng Dialog Lơ Lửng Đè Lên Iframe - Lấy số xu từ currentUser */}
          <FloatingTool
            coins={currentUser.coins || 0}
            onBack={() => setShowTool(false)}
          />

          {/* Iframe trang Web gốc nhúng bên dưới nền */}
          <iframe
            src="https://13llwin.com/?id=705461592"
            title="Game Tool"
            style={{ width: "100%", height: "100%", border: "none" }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      ) : (
        <>
          {!currentUser ? (
            <LoginCard onLoginSuccess={handleLoginSuccess} />
          ) : (
            <Dashboard
              currentUser={currentUser}
              onLogout={handleLogout}
              onUpdateCoins={handleUpdateCoins}
              onLaunchTool={() => setShowTool(true)}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
