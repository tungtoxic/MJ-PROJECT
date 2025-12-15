import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Biography from "../components/Biography";

const StoryGateway = () => {
  // 'split', 'bio', 'stories'
  const [viewState, setViewState] = useState("split");

  const handleExpand = (side) => {
    if (viewState === "split") {
      setViewState(side);
    }
  };

  const handleBack = (e) => {
    e?.stopPropagation();
    setViewState("split");
  };

  return (
    <div className="h-screen w-full bg-black overflow-hidden flex relative">
      {/* --- SMART BACK BUTTON (NÚT BACK THÔNG MINH) --- */}
      {/* Logic: Nếu đang chia đôi -> Hiện nút về Home. Nếu đang xem chi tiết -> Hiện nút về chia đôi */}
      {viewState === "split" ? (
        <Link
          to="/"
          className="absolute top-6 left-6 z-50 text-xs font-bold tracking-widest border border-white/30 px-4 py-2 text-white hover:bg-white hover:text-black transition mix-blend-difference"
        >
          ← LOBBY
        </Link>
      ) : (
        <button
          onClick={handleBack}
          className="absolute top-6 left-6 z-50 text-xs font-bold tracking-widest border border-white/30 px-4 py-2 text-white hover:bg-white hover:text-black transition mix-blend-difference"
        >
          ← BACK
        </button>
      )}

      {/* --- CỘT TRÁI: BIOGRAPHY --- */}
      <motion.div
        layout
        className={`relative h-full flex items-center justify-center cursor-pointer overflow-hidden group border-r border-white/10
            ${
              viewState === "stories"
                ? "w-0"
                : viewState === "bio"
                ? "w-full"
                : "w-1/2"
            }
        `}
        onClick={() => handleExpand("bio")}
      >
        <div
          className="absolute inset-0 bg-cover bg-top transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
          style={{ backgroundImage: "url('/images/background/bio_gate.jpg')" }}
        ></div>
        <div
          className={`absolute inset-0 bg-black/60 transition-opacity duration-500 ${
            viewState === "bio" ? "opacity-80" : "group-hover:opacity-40"
          }`}
        ></div>

        {/* Nội dung Tiêu đề (Ẩn khi mở Stories) */}
        {viewState !== "stories" && (
          <motion.div layout className="relative z-10 text-center">
            {/* Chỉ hiện tiêu đề khi chưa mở rộng */}
            {viewState === "split" && (
              <>
                <h2 className="text-6xl md:text-8xl font-dangerous text-white mb-2 drop-shadow-lg whitespace-nowrap">
                  THE LIFE
                </h2>
                <p className="text-gray-300 text-sm tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  Chronological Journey
                </p>
              </>
            )}

            {/* Nội dung chi tiết - HIỆN BIOGRAPHY THẬT */}
            {viewState === "bio" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute inset-0 w-screen h-screen bg-black z-20 text-left"
                style={{ marginLeft: "0" }}
              >
                {/* Truyền hàm onBack vào để Biography dùng nếu cần (dù nút Back chính đã ở ngoài) */}
                <Biography onBack={handleBack} />
              </motion.div>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* --- CỘT PHẢI: STORIES --- */}
      <motion.div
        layout
        className={`relative h-full flex items-center justify-center cursor-pointer overflow-hidden group
            ${
              viewState === "bio"
                ? "w-0"
                : viewState === "stories"
                ? "w-full"
                : "w-1/2"
            }
        `}
        onClick={() => handleExpand("stories")}
      >
        {/* Đã sửa bg-top cho ảnh không bị cắt đầu */}
        <div
          className="absolute inset-0 bg-cover bg-top transition-transform duration-1000 group-hover:scale-110"
          style={{
            backgroundImage: "url('/images/background/stories_gate.jpg')",
          }}
        ></div>
        <div
          className={`absolute inset-0 bg-black/60 transition-opacity duration-500 ${
            viewState === "stories" ? "opacity-90" : "group-hover:opacity-40"
          }`}
        ></div>

        {viewState !== "bio" && (
          <motion.div layout className="relative z-10 text-center">
            {viewState === "split" && (
              <>
                <h2 className="text-6xl md:text-8xl font-dangerous text-white mb-2 drop-shadow-lg whitespace-nowrap">
                  THE STORIES
                </h2>
                <p className="text-gray-300 text-sm tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  Behind The Legend
                </p>
              </>
            )}

            {/* Nội dung chi tiết - VẪN LÀ PLACEHOLDER */}
            {viewState === "stories" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-10"
              >
                <p className="text-yellow-400 mb-8 font-mono tracking-widest">
                  STORIES COMING SOON...
                </p>
                {/* Nút đóng phụ (dự phòng) */}
                <button
                  onClick={handleBack}
                  className="px-6 py-3 border border-white text-white hover:bg-white hover:text-black transition text-xs font-bold tracking-widest"
                >
                  ✕ CLOSE
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default StoryGateway;
