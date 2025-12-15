import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const Player = () => {
  const [eras, setEras] = useState([]);
  const [selectedEra, setSelectedEra] = useState(null);
  const [currentSong, setCurrentSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewMode, setViewMode] = useState("playlist"); // Chế độ xem: 'playlist' hoặc 'lyrics'
  const [lyricLines, setLyricLines] = useState([]); // Mảng chứa các dòng lyric đã xử lý
  const [activeLineIndex, setActiveLineIndex] = useState(0); // Dòng lyric đang hát (để tô màu)
  const [isLyricLoading, setIsLyricLoading] = useState(false); // Trạng thái đang tải (để hiện loading)
  // State quản lý việc hiển thị Story của bài hát
  const [showTrivia, setShowTrivia] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/eras")
      .then((res) => {
        const sortedEras = res.data.sort(
          (a, b) => parseInt(a.years) - parseInt(b.years)
        );
        setEras(sortedEras);
        if (sortedEras.length > 0) {
          setSelectedEra(sortedEras[0]);
          setCurrentSong(sortedEras[0].songs[0]);
        }
        setLoading(false);
      })
      .catch((err) => console.error("Lỗi API:", err));
  }, []);

  // --- LOGIC GIAO DIỆN ---
  const getFontClass = () => {
    if (!selectedEra) return "font-sans";
    const name = selectedEra.name.toLowerCase();
    if (name === "thriller")
      return "font-thriller tracking-widest text-red-500";
    if (name === "bad") return "font-bad";
    if (name === "dangerous")
      return "font-dangerous tracking-wider text-yellow-500";
    if (name === "history")
      return "font-history tracking-widest text-slate-300 uppercase";
    if (name === "invincible")
      return "font-invincible tracking-widest text-gray-200 uppercase";
    if (name === "xscape") return "font-xscape tracking-widest text-gray-300";
    if (name === "off the wall")
      return "font-offthewall tracking-widest text-purple-400";
    return "font-black tracking-tighter";
  };

  // --- LOGIC PLAYER ---
  const currentIndex = eras.findIndex((e) => e._id === selectedEra?._id);

  const goToNextEra = () => {
    if (currentIndex < eras.length - 1) {
      handleEraChange(eras[currentIndex + 1]);
    }
  };

  const goToPrevEra = () => {
    if (currentIndex > 0) {
      handleEraChange(eras[currentIndex - 1]);
    }
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleSeek = (e) => {
    const newTime = e.target.value;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleNext = () => {
    if (!selectedEra || !currentSong) return;
    const songIndex = selectedEra.songs.findIndex(
      (s) => s.title === currentSong.title
    );
    const nextIndex = (songIndex + 1) % selectedEra.songs.length;
    handleSongClick(selectedEra.songs[nextIndex]); // Dùng hàm này để reset trivia luôn
  };

  const handlePrev = () => {
    if (!selectedEra || !currentSong) return;
    const songIndex = selectedEra.songs.findIndex(
      (s) => s.title === currentSong.title
    );
    const prevIndex =
      songIndex === 0 ? selectedEra.songs.length - 1 : songIndex - 1;
    handleSongClick(selectedEra.songs[prevIndex]);
  };

  const handleEraChange = (era) => {
    setIsPlaying(false);
    setShowTrivia(false); // Reset đóng Trivia khi đổi kỷ nguyên
    setSelectedEra(era);
    setCurrentSong(era.songs[0]);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.load();
    }
  };

  const handleSongClick = (song) => {
    if (currentSong?.title === song.title) {
      togglePlay();
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
      setShowTrivia(false); // Reset đóng Trivia khi đổi bài để người dùng tự bấm mở
    }
  };

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      setTimeout(() => {
        audioRef.current
          .play()
          .catch((e) => console.log("Chờ người dùng tương tác:", e));
      }, 100);
    }
  }, [currentSong]);

  const togglePlay = () => {
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const getMusicSrc = () => {
    if (!selectedEra || !currentSong) return "";
    let folderName = selectedEra.name.toLowerCase();
    if (folderName === "invincible") folderName = "invincible";
    return `/music/${folderName}/${currentSong.title}.mp3`;
  };

  const getEraSlug = () => {
    if (!selectedEra) return "";
    return selectedEra.name.toLowerCase().replace(/ /g, "_");
  };

  const getEraBgImage = () => {
    const slug = getEraSlug();
    return `/images/era_${slug}/${slug}_bg.jpg`;
  };

  const getEraAvatarImage = () => {
    const slug = getEraSlug();
    return `/images/era_${slug}/${slug}_avatar.jpg`;
  };
  const parseLRC = (lrcString) => {
    if (!lrcString) return [];
    const regex = /^\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)$/; // Công thức Regex để bắt thời gian
    return lrcString
      .split("\n")
      .map((line) => {
        const match = line.match(regex);
        if (!match) return null;
        const minutes = parseInt(match[1], 10);
        const seconds = parseInt(match[2], 10);
        const milliseconds = parseInt(match[3], 10);
        const content = match[4].trim();
        // Quy đổi tất cả ra số giây (Ví dụ: 1 phút 30 giây -> 90.0 giây)
        const time = minutes * 60 + seconds + milliseconds / 1000;
        return { time, content };
      })
      .filter((line) => line !== null); // Lọc bỏ các dòng lỗi
  };

  // Hàm B: Gọi API lấy Lyric từ mạng
  const fetchLyrics = async (songTitle) => {
    setIsLyricLoading(true);
    setLyricLines([]); // Xóa lyric cũ trước khi tìm bài mới
    try {
      // Gọi API miễn phí Lrclib
      const response = await axios.get(`https://lrclib.net/api/get`, {
        params: {
          artist_name: "Michael Jackson",
          track_name: songTitle,
        },
      });

      // Ưu tiên lấy Lyric có thời gian (syncedLyrics)
      if (response.data?.syncedLyrics) {
        setLyricLines(parseLRC(response.data.syncedLyrics));
      }
      // Nếu không có, lấy Lyric thường (plainLyrics)
      else if (response.data?.plainLyrics) {
        setLyricLines([{ time: 0, content: response.data.plainLyrics }]);
      }
      // Không tìm thấy gì cả
      else {
        setLyricLines([
          { time: 0, content: "Instrumental or Lyrics unavailable." },
        ]);
      }
    } catch (error) {
      console.error("Lỗi lấy lyric:", error);
      setLyricLines([{ time: 0, content: "Lyrics not found for this track." }]);
    } finally {
      setIsLyricLoading(false);
    }
  };
  useEffect(() => {
    if (currentSong) {
      fetchLyrics(currentSong.title);
    }
  }, [currentSong]); // Chạy lại mỗi khi currentSong thay đổi

  // B. Khi nhạc chạy -> Tính toán dòng đang hát để Highlight
  useEffect(() => {
    // Chỉ chạy khi đang xem tab 'lyrics' và đã có dữ liệu
    if (viewMode === "lyrics" && lyricLines.length > 0) {
      const index = lyricLines.findIndex((line, i) => {
        const nextLine = lyricLines[i + 1];
        // Logic: Thời gian hiện tại >= dòng này VÀ < dòng kế tiếp
        return (
          currentTime >= line.time && (!nextLine || currentTime < nextLine.time)
        );
      });
      if (index !== -1) setActiveLineIndex(index);
    }
  }, [currentTime, lyricLines, viewMode]); // Chạy liên tục theo currentTime

  // C. Hàm click vào dòng lyric để tua nhạc (Karaoke style)
  const handleLyricClick = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  if (loading)
    return (
      <div className="bg-black h-screen flex items-center justify-center text-white text-xl tracking-widest">
        LOADING...
      </div>
    );
  ``;
  return (
    <div
      className="flex flex-col h-screen text-white font-sans overflow-hidden transition-colors duration-1000 ease-in-out"
      style={{ backgroundColor: selectedEra ? selectedEra.themeColor : "#000" }}
    >
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/40 mix-blend-multiply z-10"></div>
        <motion.div
          key={selectedEra._id + "_bg"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1 }}
          className="w-full h-full bg-cover bg-center blur-sm grayscale-[30%]"
          style={{ backgroundImage: `url('${getEraBgImage()}')` }}
        />
      </div>

      <audio
        ref={audioRef}
        src={getMusicSrc()}
        onEnded={handleNext}
        onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)}
        onLoadedMetadata={() => setDuration(audioRef.current.duration)}
        onError={(e) => console.log("Lỗi tải nhạc:", e)}
      />

      {/* HEADER */}
      <header className="relative z-20 h-28 border-b border-white/10 bg-black/20 backdrop-blur-md flex items-center px-6 gap-6">
        <Link
          to="/"
          className="text-xs font-bold tracking-widest border border-white/30 px-4 py-2 hover:bg-white hover:text-black transition whitespace-nowrap"
        >
          ← LOBBY
        </Link>

        <div className="flex-1 flex items-center justify-between gap-4">
          <button
            onClick={goToPrevEra}
            disabled={currentIndex === 0}
            className={`p-2 rounded-full border border-white/20 hover:bg-white hover:text-black transition ${
              currentIndex === 0
                ? "opacity-0 pointer-events-none"
                : "opacity-100"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>

          <div className="flex-1 relative mx-4">
            <div className="absolute top-[7px] left-0 w-full h-[2px] bg-white/20 z-0"></div>
            <div className="flex justify-between items-start relative z-10">
              {eras.map((era) => {
                const isActive = selectedEra.name === era.name;
                return (
                  <button
                    key={era._id}
                    onClick={() => handleEraChange(era)}
                    className="group flex flex-col items-center gap-3 focus:outline-none"
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 transition-all duration-300 relative
                                    ${
                                      isActive
                                        ? "bg-black border-slate-300 scale-125 shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                                        : "bg-black border-gray-600 hover:border-gray-400"
                                    }
                                `}
                    >
                      {isActive && (
                        <div className="absolute inset-0 m-auto w-1.5 h-1.5 bg-slate-300 rounded-full" />
                      )}
                    </div>

                    <div
                      className={`flex flex-col items-center transition-all duration-300
                                    ${
                                      isActive
                                        ? "opacity-100 transform translate-y-0"
                                        : "opacity-50 group-hover:opacity-80"
                                    }
                                `}
                    >
                      <span className="text-[10px] font-mono tracking-wider text-gray-300">
                        {era.years.split(" - ")[0]}
                      </span>
                      <span
                        className={`text-xs font-bold uppercase tracking-widest ${
                          isActive ? "text-white" : "text-gray-400"
                        }`}
                      >
                        {era.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={goToNextEra}
            disabled={currentIndex === eras.length - 1}
            className={`p-2 rounded-full border border-white/20 hover:bg-white hover:text-black transition ${
              currentIndex === eras.length - 1
                ? "opacity-0 pointer-events-none"
                : "opacity-100"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* BODY */}
      <div className="relative z-10 flex flex-1 overflow-hidden">
        {/* CỘT TRÁI */}
        <div className="w-full md:w-[40%] flex flex-col items-center justify-center relative p-6">
          <motion.div
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-[280px] h-[280px] md:w-[400px] md:h-[400px] rounded-full shadow-[0_10px_50px_rgba(0,0,0,0.8)] border-4 border-gray-800 relative z-10"
          >
            <img
              src="/images/vinyl_record.png"
              className="w-full h-full object-cover"
            />
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[38%] h-[38%] rounded-full bg-cover bg-center border border-white/20"
              style={{ backgroundImage: `url('${getEraAvatarImage()}')` }}
            ></div>
          </motion.div>

          <div className="mt-10 text-center relative z-20 w-full max-w-md">
            <h3
              className={`text-xs font-bold tracking-[0.4em] uppercase mb-3 transition-colors duration-300 ${
                isPlaying ? "text-slate-300 animate-pulse" : "text-gray-600"
              }`}
            >
              {isPlaying ? "Now Playing" : "Paused"}
            </h3>

            <h2 className="text-2xl md:text-3xl font-bold leading-tight drop-shadow-lg mb-6 truncate px-4">
              {currentSong?.title}
            </h2>

            <div className="flex items-center gap-3 text-xs font-mono text-gray-400 mb-6 px-8">
              <span>{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={handleSeek}
                className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-slate-400 hover:accent-white"
              />
              <span>{formatTime(duration)}</span>
            </div>

            <div className="flex items-center justify-center gap-8">
              <button
                onClick={handlePrev}
                className="text-gray-500 hover:text-white transition transform hover:scale-110 active:scale-95"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="w-8 h-8"
                  viewBox="0 0 16 16"
                >
                  <path d="M4 4a.5.5 0 0 1 1 0v3.248l6.238-3.809a.5.5 0 0 1 .762.43V7.926a.5.5 0 0 1 0 .148V12.074a.5.5 0 0 1-.762.43L5 8.752V12a.5.5 0 0 1-1 0V4z" />
                  <path d="M4 4a.5.5 0 0 1 1 0v8a.5.5 0 0 1-1 0V4z" />
                </svg>
              </button>
              <button
                onClick={togglePlay}
                className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:bg-slate-300 hover:scale-110 transition shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-95"
              >
                {isPlaying ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="w-6 h-6"
                    viewBox="0 0 16 16"
                  >
                    <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="w-6 h-6 ml-1"
                    viewBox="0 0 16 16"
                  >
                    <path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z" />
                  </svg>
                )}
              </button>
              <button
                onClick={handleNext}
                className="text-gray-500 hover:text-white transition transform hover:scale-110 active:scale-95"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="w-8 h-8"
                  viewBox="0 0 16 16"
                >
                  <path d="M12.5 4a.5.5 0 0 0-1 0v3.248L5.238 3.439A.5.5 0 0 0 4.476 3.87V7.926a.5.5 0 0 0 0 .148V12.074a.5.5 0 0 0 .762.43L11.5 8.752V12a.5.5 0 0 0 1 0V4z" />
                  <path d="M12.5 4a.5.5 0 0 0-1 0v8a.5.5 0 0 0 1 0V4z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* --- CỘT PHẢI: LIBRARY (Đã cập nhật Header) --- */}
        <div className="hidden md:flex w-[60%] flex-col bg-black/20 backdrop-blur-xl border-l border-white/10 h-full">
          {/* --- NÚT CHUYỂN TAB (MỚI) --- */}
          <div className="flex gap-6 mt-6 border-b border-white/10 pb-4">
            <button
              onClick={() => setViewMode("playlist")}
              className={`text-sm font-bold tracking-widest uppercase transition-all duration-300 hover:text-white ${
                viewMode === "playlist"
                  ? "text-white border-b-2 border-white pb-1 scale-105"
                  : "text-gray-500"
              }`}
            >
              Playlist
            </button>
            <button
              onClick={() => setViewMode("lyrics")}
              className={`text-sm font-bold tracking-widest uppercase transition-all duration-300 hover:text-yellow-400 ${
                viewMode === "lyrics"
                  ? "text-yellow-400 border-b-2 border-yellow-400 pb-1 scale-105"
                  : "text-gray-500"
              }`}
            >
              Lyrics
            </button>
          </div>
          <div className="p-8 md:p-10 pb-4 border-b border-white/5 relative">
            <h1
              className={`text-6xl md:text-7xl mb-2 drop-shadow-xl ${getFontClass()}`}
            >
              {selectedEra.name}
            </h1>
            <p className="text-gray-200 text-sm md:text-base leading-relaxed border-l-4 border-white/50 pl-6 max-w-2xl font-light">
              "{selectedEra.description}"
            </p>

            {/* Nút Toggle Trivia */}
            <button
              onClick={() => setShowTrivia(!showTrivia)}
              className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-300 border border-slate-500 px-4 py-2 rounded-full hover:bg-slate-700 transition"
            >
              {showTrivia ? "✕ Close Story" : "👁 Behind The Track"}
            </button>

            {/* HỘP TRIVIA (Chỉ hiện khi bấm nút) */}
            <AnimatePresence>
              {showTrivia && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-white/10 border border-white/20 p-5 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
                      <h4 className="text-yellow-400 font-bold text-xs uppercase tracking-widest">
                        Story of "{currentSong?.title}"
                      </h4>
                    </div>
                    <p className="text-white text-lg font-light leading-relaxed italic">
                      "{currentSong?.trivia}"
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* --- KHU VỰC NỘI DUNG CHÍNH (Thay đổi theo Tab) --- */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-8 pb-12 pt-4 relative">
            {/* TRƯỜNG HỢP 1: HIỂN THỊ PLAYLIST (Code cũ của bạn) */}
            {viewMode === "playlist" && (
              <>
                <table className="w-full text-left border-collapse">
                  <thead className="text-xs text-gray-500 uppercase tracking-wider border-b border-white/10 sticky top-0 bg-transparent z-10">
                    <tr>
                      <th className="py-4 w-12 text-center">#</th>
                      <th className="py-4">Title</th>
                      <th className="py-4 w-24 text-right">Time</th>
                      <th className="py-4 w-20 text-right">Year</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedEra.songs.map((song, idx) => (
                      <tr
                        key={idx}
                        onClick={() => handleSongClick(song)}
                        className={`group border-b border-white/5 cursor-pointer transition-colors duration-200 
                                    ${
                                      currentSong?.title === song.title
                                        ? "bg-white/10"
                                        : "hover:bg-white/5"
                                    }`}
                      >
                        <td className="py-4 text-center text-gray-500 group-hover:text-white transition">
                          {currentSong?.title === song.title && isPlaying ? (
                            <span className="text-slate-300 animate-pulse">
                              ♫
                            </span>
                          ) : (
                            idx + 1
                          )}
                        </td>
                        <td
                          className={`py-4 font-bold text-lg group-hover:text-white transition ${
                            currentSong?.title === song.title
                              ? "text-white"
                              : "text-gray-300"
                          }`}
                        >
                          {song.title}
                        </td>
                        <td className="py-4 text-sm text-gray-400 text-right font-mono">
                          {currentSong?.title === song.title
                            ? formatTime(duration)
                            : song.duration || "--:--"}
                        </td>
                        <td className="py-4 text-sm text-gray-500 text-right">
                          {song.year}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="h-20"></div>
              </>
            )}

            {/* TRƯỜNG HỢP 2: HIỂN THỊ LYRICS (Code Mới) */}
            {viewMode === "lyrics" && (
              <div className="flex flex-col items-center justify-start pt-10 min-h-full pb-40 space-y-8 text-center w-full">
                {isLyricLoading ? (
                  <div className="flex flex-col items-center gap-4 mt-20">
                    <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-yellow-500 font-mono tracking-widest text-xs animate-pulse">
                      SEARCHING LYRICS...
                    </p>
                  </div>
                ) : lyricLines.length > 0 ? (
                  lyricLines.map((line, index) => (
                    <motion.p
                      key={index}
                      // Hiệu ứng Highlight dòng đang hát
                      animate={{
                        opacity: index === activeLineIndex ? 1 : 0.3,
                        scale: index === activeLineIndex ? 1.1 : 1,
                        filter:
                          index === activeLineIndex
                            ? "blur(0px)"
                            : "blur(1.5px)",
                        y: index === activeLineIndex ? 0 : 0,
                      }}
                      transition={{ duration: 0.5 }}
                      // Click để tua nhạc
                      onClick={() => handleLyricClick(line.time)}
                      className={`cursor-pointer transition-colors duration-300 font-serif text-2xl md:text-3xl leading-relaxed max-w-3xl
                            ${
                              index === activeLineIndex
                                ? "text-yellow-400 font-bold drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]"
                                : "text-white hover:text-gray-300 hover:opacity-60"
                            }
                        `}
                    >
                      {line.content}
                    </motion.p>
                  ))
                ) : (
                  <div className="mt-20 text-gray-500 font-mono tracking-widest text-sm">
                    NO LYRICS FOUND FOR THIS TRACK
                  </div>
                )}
                {/* Khoảng trống để có thể cuộn dòng cuối lên giữa màn hình */}
                <div className="h-[50vh]"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
