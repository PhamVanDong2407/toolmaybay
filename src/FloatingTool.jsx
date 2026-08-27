import { useState, useEffect, useRef } from "react";
import GameAlert from "./GameAlert";
import planeImg from "./assets/anhmb.png";

function FloatingTool({ coins, onBack }) {
  const [position, setPosition] = useState({ x: 10, y: 60 });
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
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

  // --- LOGIC DỰ ĐOÁN HACK GAME & RANDOM HỆ SỐ ---
  const handlePredict = () => {
    if (isPredicting) return;

    if (localCoins <= 0) {
      setAlertConfig({
        isOpen: true,
        message:
          "❌ Số dư tài khoản đã hết (0 Xu)! Vui lòng thoát ra Menu và nhập thêm Key do Admin cấp để tiếp tục sử dụng Tool.",
        type: "error",
      });
      return;
    }

    setIsPredicting(true);

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
      const randomItem = results[Math.floor(Math.random() * results.length)];
      const randomMultiplier = Math.floor(Math.random() * 401) + 100; // Random từ 100 - 500

      setPredictionResult({
        item: randomItem,
        multiplier: `x ${randomMultiplier}`,
      });
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
          height: "230px",
          backgroundImage: `url(${planeImg})`,
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: 100005,
          color: "#ffffff",
          userSelect: "none",
          fontFamily: "'Orbitron', sans-serif",
          touchAction: "none",
          cursor: "move",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "14px",
            top: "23px",
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
          {/* 1. TIÊU ĐỀ: MÀU XANH CYAN PHÁT SÁNG */}
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

          {/* 2. SỐ DƯ XU: MÀU VÀNG KIM */}
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

          {/* 3. Ô HIỂN THỊ KẾT QUẢ - ĐÃ BỎ LỚP PHỦ NỀN */}
          <div
            style={{
              width: "115px",
              height: "36px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent", /* Bỏ hoàn toàn màu nền/lớp phủ */
              padding: "2px 0",
            }}
          >
            {isPredicting ? (
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: "900",
                  color: "#ffffff",
                }}
              >
                ĐANG QUÉT...
              </span>
            ) : predictionResult ? (
              <>
                <span
                  style={{
                    fontSize: "9px",
                    fontWeight: "900",
                    color: "#ffffff",
                    lineHeight: "1.2",
                  }}
                >
                  {predictionResult.item}
                </span>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: "bold",
                    color: "#ffffff",
                    marginTop: "2px",
                  }}
                >
                  {predictionResult.multiplier}
                </span>
              </>
            ) : (
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: "900",
                  color: "#ffffff",
                }}
              >
                SẴN SÀNG
              </span>
            )}
          </div>

          {/* 4. CỤM NÚT BẤM */}
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
                color: "#ffffff",
                border: "none",
                borderRadius: "4px",
                fontWeight: "bold",
                fontSize: "10px",
                cursor: "pointer",
                opacity: isPredicting ? 0.6 : 1,
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
                color: "#ffffff",
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