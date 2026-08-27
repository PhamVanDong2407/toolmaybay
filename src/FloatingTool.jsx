import { useState, useEffect, useRef } from "react";
import GameAlert from "./GameAlert";
import planeImg from "./assets/anhmb.png";

function FloatingTool({ coins, onBack }) {
  const [position, setPosition] = useState({ x: 10, y: 60 });
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionResult, setPredictionResult] = useState("");
  const [localCoins, setLocalCoins] = useState(coins);
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    message: "",
    type: "error",
  });

  const toolRef = useRef(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);

  useEffect(() => {
    setLocalCoins(coins);
  }, [coins]);

  // --- HỆ THỐNG KÉO THẢ TOÀN DIỆN ---
  const handleStart = (e) => {
    if (e.target.tagName === "BUTTON") return;

    isDragging.current = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    dragStart.current = {
      x: clientX - position.x,
      y: clientY - position.y,
    };
  };

  const handleMove = (e) => {
    if (!isDragging.current) return;
    if (e.cancelable) e.preventDefault();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    let newX = clientX - dragStart.current.x;
    let newY = clientY - dragStart.current.y;

    const maxWidth = window.innerWidth - (toolRef.current?.offsetWidth || 280);
    const maxHeight =
      window.innerHeight - (toolRef.current?.offsetHeight || 230);

    newX = Math.max(0, Math.min(newX, maxWidth));
    newY = Math.max(0, Math.min(newY, maxHeight));

    setPosition({ x: newX, y: newY });
  };

  const handleEnd = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleEnd);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [position]);

  // --- LOGIC DỰ ĐOÁN HACK GAME ---
  const handlePredict = () => {
    if (isPredicting) return;

    if (localCoins <= 0) {
      setPredictionResult("HẾT XU!");
      setAlertConfig({
        isOpen: true,
        message:
          "❌ Số dư tài khoản đã hết (0 Xu)! Vui lòng thoát ra Menu và nhập thêm Key do Admin cấp để tiếp tục sử dụng Tool.",
        type: "error",
      });
      return;
    }

    setIsPredicting(true);
    setPredictionResult("ĐANG QUÉT...");

    const updatedCoins = Math.max(0, localCoins - 1);
    setLocalCoins(updatedCoins);

    const currentUser = JSON.parse(sessionStorage.getItem("game_user_current"));
    if (currentUser) {
      const updatedUser = { ...currentUser, coins: updatedCoins };
      sessionStorage.setItem("game_user_current", JSON.stringify(updatedUser));

      const localUsers = JSON.parse(localStorage.getItem("game_users")) || [];
      const updatedUsers = localUsers.map((u) => {
        if (u.username === currentUser.username) {
          return { ...u, coins: updatedCoins };
        }
        return u;
      });
      localStorage.setItem("game_users", JSON.stringify(updatedUsers));
    }

    setTimeout(() => {
      const results = [
        "NITRO ⚡",
        "SÚNG LAZE 🔫",
        "HỆ SỐ LỚN 📈",
        "NAM CHÂM 🧲",
      ];
      const randomResult = results[Math.floor(Math.random() * results.length)];
      setPredictionResult(randomResult);
      setIsPredicting(false);
    }, 1200);
  };

  return (
    <>
      <div
        ref={toolRef}
        onTouchStart={handleStart}
        onMouseDown={handleStart}
        style={{
          position: "fixed",
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: "280px",
          height:
            "230px" /* Hạ từ 260px xuống 230px để ảnh thu lại đúng tỷ lệ box */,
          backgroundImage: `url(${planeImg})`,
          backgroundSize: "100% 100%" /* Ép ảnh phủ khít khịt theo khung div */,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: 100005,
          color: "#fff",
          userSelect: "none",
          fontFamily:
            "'Orbitron', sans-serif" /* Đổi hẳn sang font Gaming cho đẹp chữ */,
          touchAction: "none",
          cursor: "move",
        }}
      >
        {/* VÙNG NỘI DUNG ĐÃ ĐƯỢC DỊCH LÊN TRÊN VÀ CO GỌN ĐỂ CHUI VÀO KHUNG HOLOGRAM */}
        <div
          style={{
            position: "absolute",
            left: "14px",
            top: "23px" /* Đẩy từ 32px lên 18px để căn đúng vào lõi bảng xanh */,
            width: "135px",
            height: "165px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "2px 0",
            cursor: "default",
          }}
        >
          {/* 1. HACK SYSTEM TEXT */}
          <div
            style={{
              fontSize: "10px",
              fontWeight: "900",
              color: "#00f2ff",
              textShadow: "0 0 5px #00f2ff",
              textAlign: "center",
              letterSpacing: "0.5px",
            }}
          >
            TOOL HACK
          </div>

          {/* 2. SỐ DƯ XU */}
          <div
            style={{
              fontSize: "11px",
              color: "#ffcc00",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Xu: {localCoins} 🪙
          </div>

          {/* 3. Ô HIỂN THỊ KẾT QUẢ - Đã căn tỷ lệ rơi trúng hàng kẻ ô thứ 4 */}
          <div
            style={{
              fontSize: "11px",
              fontWeight: "900",
              color: isPredicting ? "#ff007f" : "#3fb487bb",
              textAlign: "center",
              width: "115px",
              height: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0, 242, 255, 0.05)",
              textTransform: "uppercase",
            }}
          >
            {predictionResult || "SẴN SÀNG"}
          </div>

          {/* 4. CỤM NÚT BẤM DỆT - Co lại để nằm gọn trong mảng đáy của bảng */}
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              alignItems: "center",
            }}
          >
            <button
              onClick={handlePredict}
              disabled={isPredicting}
              style={{
                width: "115px",
                padding: "6px 0",
                background: "linear-gradient(90deg, #00a2ff, #00f2ff)",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                fontWeight: "bold",
                fontSize: "10px",
                cursor: "pointer",
                opacity: isPredicting ? 0.6 : 1,
                textShadow: "0 1px 2px rgba(0,0,0,0.5)",
              }}
            >
              {isPredicting ? "MÁY QUÉT..." : "DỰ ĐOÁN"}
            </button>

            <button
              onClick={onBack}
              style={{
                width: "115px",
                padding: "5px 0",
                background: "#b91c1c",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                fontWeight: "bold",
                fontSize: "9px",
                cursor: "pointer",
              }}
            >
              ĐÓNG TOOL
            </button>
          </div>
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

export default FloatingTool;
