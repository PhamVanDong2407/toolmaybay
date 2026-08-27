import { useState } from "react";
import GameAlert from "./GameAlert";

const GAME_KEYS = {
  5: ["A3F8_9B2K", "X7R9_2B4K", "M1N5_6P8Q", "C4V2_7X9Z", "L9K3_8J1H"],
  10: ["B6N2_5M9K", "P8Q3_1R7X", "Z4X9_6C2V", "H1J8_3K9L", "D7F2_8G4S"],
  15: ["T5Y9_2U4I", "O1P8_7L3K", "K9J4_6H2G", "F8S2_3D7A", "Z1X9_5C4V"],
  20: ["E3R7_9T1Y", "U5I2_8O4P", "L9K4_3J7H", "G2F8_6D1S", "A4S9_7D2F"],
  25: ["W1Q8_5E3R", "T7Y2_9U4I", "O6P3_1L8K", "K4J9_7H2G", "F5S8_3D1A"],
  30: ["Z2X7_9C1V", "B4N9_6M2K", "P1Q8_7R3X", "H5J2_9K4L", "D6F1_8G3S"],
  35: ["M7N3_1B9V", "C2X8_4Z6L", "K1J9_3H7G", "F4S2_8D6A", "Q9W3_5E7R"],
  40: ["T1Y8_4U2I", "O9P5_3L7K", "G6F2_1D8S", "A3S7_9D4F", "Z5X1_6C8V"],
  45: ["B3N7_9M1K", "P4Q9_2R6X", "H8J3_5K1L", "D2F7_6G9S", "W5Q1_8E3R"],
  50: ["U9I3_5O7P", "L2K8_4J6H", "G1F7_3D9S", "A5S2_8D4F", "Z3X9_7C1V"],
};

function Dashboard({ currentUser, onLogout, onUpdateCoins, onLaunchTool }) {
  const [adminKey, setAdminKey] = useState("");
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    message: "",
    type: "success",
  });

  const showAlert = (message, type = "success") => {
    setAlertConfig({ isOpen: true, message, type });
  };

  const handleApplyKey = () => {
    const inputKey = adminKey.trim().toUpperCase();

    if (!inputKey) {
      showAlert("Vui lòng nhập Key Admin Cấp!", "error");
      return;
    }

    let foundValue = null;
    let foundGroup = null;

    for (const [value, keysArray] of Object.entries(GAME_KEYS)) {
      if (keysArray.includes(inputKey)) {
        foundValue = parseInt(value);
        foundGroup = keysArray;
        break;
      }
    }

    if (!foundValue) {
      showAlert("❌ Mã Key không tồn tại hoặc sai cấu trúc!", "error");
      return;
    }

    const storageKeyName = `${currentUser.username}_used_keys`;
    let userUsedKeys = JSON.parse(localStorage.getItem(storageKeyName)) || [];

    if (userUsedKeys.includes(inputKey)) {
      showAlert("❌ Bạn đã nạp mã Key này rồi!", "error");
      return;
    }

    userUsedKeys.push(inputKey);

    const loadedKeysInGroup = foundGroup.filter((key) =>
      userUsedKeys.includes(key),
    );
    let isResetTriggered = false;

    if (loadedKeysInGroup.length === 5) {
      isResetTriggered = true;
      userUsedKeys = userUsedKeys.filter((key) => !foundGroup.includes(key));
    }

    localStorage.setItem(storageKeyName, JSON.stringify(userUsedKeys));

    const localUsers = JSON.parse(localStorage.getItem("game_users")) || [];
    const updatedUsers = localUsers.map((u) => {
      if (u.username === currentUser.username) {
        return { ...u, coins: (u.coins || 0) + foundValue };
      }
      return u;
    });
    localStorage.setItem("game_users", JSON.stringify(updatedUsers));

    const updatedUser = {
      ...currentUser,
      coins: (currentUser.coins || 0) + foundValue,
    };
    sessionStorage.setItem("game_user_current", JSON.stringify(updatedUser));
    onUpdateCoins(updatedUser);

    if (isResetTriggered) {
      showAlert(
        `🎉 Nạp thành công! +${foundValue} Xu. Hệ thống đã reset mở khóa vòng tiếp theo!`,
        "success",
      );
    } else {
      showAlert(
        `🎉 Nạp thành công! Bạn được cộng +${foundValue} Xu.`,
        "success",
      );
    }

    setAdminKey("");
  };

  const handleGoToTool = () => {
    if ((currentUser.coins || 0) <= 0) {
      showAlert(
        "❌ Số dư tài khoản bằng 0 Xu! Vui lòng nạp Key để KÍCH HOẠT VÀO TOOL.",
        "error",
      );
      return;
    }
    onLaunchTool();
  };

  return (
    <>
      <div className="login-box">
        <h2
          style={{
            color: "#fff",
            fontSize: "22px",
            fontWeight: "normal",
            marginBottom: "20px",
          }}
        >
          Xin chào,{" "}
          <strong style={{ fontWeight: "bold" }}>{currentUser.username}</strong>
          !
        </h2>

        {/* Khung số dư */}
        <div
          style={{
            background: "#131924",
            borderRadius: "16px",
            padding: "15px",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          <p
            style={{ color: "#8fa0b5", fontSize: "13px", marginBottom: "5px" }}
          >
            Số dư hiện tại
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span
              style={{ color: "#ffcc00", fontSize: "32px", fontWeight: "bold" }}
            >
              {currentUser.coins || 0}
            </span>
            <span style={{ fontSize: "24px" }}>🏛️</span>
          </div>
        </div>

        {/* Input Key */}
        <div className="input-container" style={{ marginBottom: "15px" }}>
          <label
            style={{
              color: "#a04ef6",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "13px",
              marginBottom: "10px",
              display: "block",
            }}
          >
            Nhập Key Admin Cấp
          </label>
          <input
            type="text"
            placeholder="Ví dụ: A3F8_9B2K"
            style={{
              textAlign: "center",
              background: "#171725",
              border: "1px solid #444",
            }}
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
          />
        </div>

        {/* Hàng nút bấm */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button
            className="btn-submit"
            style={{
              background: "linear-gradient(90deg, #7b42f6 0%, #f04ef6 100%)",
            }}
            onClick={handleApplyKey}
          >
            NẠP XU NGAY
          </button>

          <button
            className="btn-submit"
            style={{
              background: "linear-gradient(90deg, #7b42f6 0%, #f04ef6 100%)",
            }}
            onClick={handleGoToTool}
          >
            🚀 VÀO TOOL
          </button>

          <button
            className="btn-submit"
            style={{ background: "#e53e3e", marginTop: "5px" }}
            onClick={onLogout}
          >
            ĐĂNG XUẤT
          </button>
        </div>
      </div>

      <GameAlert
        isOpen={alertConfig.isOpen}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
      />
    </>
  );
}

export default Dashboard;
