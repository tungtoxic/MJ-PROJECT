import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import axios from "axios";

const Biography = () => {
  const [bioData, setBioData] = useState([]);
  const [activeChapter, setActiveChapter] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ref để lưu vị trí của từng chương bên cột phải
  const chaptersRef = useRef({});

  // Gọi API
  useEffect(() => {
    axios
      .get("http://localhost:5001/api/bios")
      .then((res) => {
        const sortedData = res.data.sort((a, b) => a.chapterId - b.chapterId);
        setBioData(sortedData);
        if (sortedData.length > 0) setActiveChapter(sortedData[0]);
        setLoading(false);
      })
      .catch((err) => console.error("Lỗi lấy Bio:", err));
  }, []);

  const scrollToChapter = (id) => {
    const element = chaptersRef.current[id];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // Logic Style (Màu sắc và Font cho từng kỷ nguyên)
  const getChapterStyle = (id) => {
    const baseStyle = {
      font: "font-serif font-black",
      color: "text-white",
      border: "border-white",
      bg: "bg-white",
    };

    switch (id) {
      case 1:
        return {
          ...baseStyle,
          color: "text-gray-400",
          border: "border-gray-500",
          bg: "bg-gray-500",
        };
      case 2:
        return {
          font: "font-offthewall tracking-widest",
          color: "text-purple-400",
          border: "border-purple-500",
          bg: "bg-purple-500",
        };
      case 3:
        return {
          font: "font-thriller tracking-widest",
          color: "text-red-600",
          border: "border-red-600",
          bg: "bg-red-600",
        };
      case 4:
        return {
          font: "font-bad",
          color: "text-white",
          border: "border-white",
          bg: "bg-white",
        };
      case 5:
        return {
          font: "font-dangerous tracking-widest",
          color: "text-yellow-500",
          border: "border-yellow-500",
          bg: "bg-yellow-500",
        };
      case 6:
        return {
          font: "font-invincible tracking-widest",
          color: "text-blue-300",
          border: "border-blue-400",
          bg: "bg-blue-400",
        };
      case 7:
        return {
          font: "font-history tracking-widest",
          color: "text-gray-400",
          border: "border-gray-400",
          bg: "bg-gray-400",
        };
      default:
        return baseStyle;
    }
  };
  const currentStyle = activeChapter
    ? getChapterStyle(activeChapter.chapterId)
    : {};

  if (loading)
    return (
      <div className="h-screen w-full flex items-center justify-center text-yellow-500 font-mono text-2xl animate-pulse">
        LOADING HISTORY...
      </div>
    );

  return (
    <div className="flex flex-row w-full h-screen bg-black text-white font-sans overflow-hidden fixed inset-0 z-30">
      {/* --- CỘT GIỮA: TIMELINE --- */}
      <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 z-50 hidden md:flex flex-col justify-center items-center py-20 pointer-events-none">
        <div className="absolute top-0 bottom-0 w-[1px] bg-white/10 -z-10"></div>
        <div className="flex flex-col justify-between h-full w-80 pointer-events-auto">
          {bioData.map((item) => {
            const isActive = activeChapter?.chapterId === item.chapterId;
            const style = getChapterStyle(item.chapterId);

            return (
              <button
                key={item._id}
                onClick={() => scrollToChapter(item.chapterId)}
                className="group flex items-center justify-center relative focus:outline-none w-full"
              >
                <span
                  className={`absolute right-24 text-[11px] font-mono tracking-widest transition-all duration-300 text-right w-32
                        ${
                          isActive
                            ? `opacity-100 text-white font-bold scale-110`
                            : "opacity-40 text-gray-500 group-hover:opacity-80"
                        }
                    `}
                >
                  {item.year.split(" - ")[0]}
                </span>

                <div
                  className={`w-3 h-3 rounded-full border-2 transition-all duration-500 relative z-20 shrink-0
                        ${
                          isActive
                            ? `${style.bg} ${style.border} scale-150 shadow-[0_0_15px_currentColor]`
                            : "bg-black border-gray-700 group-hover:border-gray-400"
                        }
                    `}
                ></div>

                <span
                  className={`absolute left-5 text-[10px] uppercase tracking-widest transition-all duration-300 text-left w-32 leading-tight
                         ${
                           isActive
                             ? `opacity-100 ${style.color} ${style.font} scale-105`
                             : "opacity-0 group-hover:opacity-60 text-gray-500 translate-x-[-10px]"
                         }
                    `}
                >
                  {item.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* --- CỘT TRÁI (STICKY) --- */}
      <div className="w-1/2 h-full relative flex flex-col transition-all duration-1000 border-r border-white/5">
        <div className="absolute inset-0 bg-black">
          <motion.div
            key={activeChapter?.chapterId}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.5, scale: 1 }}
            transition={{ duration: 1.2 }}
            className="w-full h-full bg-cover bg-top"
            style={{ backgroundImage: `url('${activeChapter?.image}')` }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20 z-10"></div>

        <div className="relative z-20 h-full flex flex-col justify-center items-center text-center p-12 pr-48">
          <motion.div
            key={activeChapter?.chapterId + "text"}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h3
              className={`font-mono tracking-[0.3em] text-xl mb-6 uppercase border-b-2 inline-block pb-2 
                    ${currentStyle.color} ${currentStyle.border}`}
            >
              {activeChapter?.year}
            </h3>
            <h1
              className={`text-1xl md:text-5xl leading-tight drop-shadow-2xl 
                    ${currentStyle.font} ${currentStyle.color}`}
            >
              {activeChapter?.title}
            </h1>
          </motion.div>
        </div>
      </div>

      {/* --- CỘT PHẢI (SCROLL) --- */}
      <div className="w-1/2 h-full overflow-y-auto bg-[#0a0a0a] relative scroll-smooth custom-scrollbar">
        <div className="p-16 pl-24 pb-40 min-h-screen">
          <div className="mb-2 text-center border-b border-white/10 pb-0">
            <p className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">
              The Biography
            </p>
            <h1 className="text-4xl font-dangerous text-white">
              MICHAEL JACKSON
            </h1>
          </div>
          {bioData.map((chapter) => (
            <ChapterItem
              key={chapter._id}
              data={chapter}
              setActiveChapter={setActiveChapter}
              isActive={activeChapter?.chapterId === chapter.chapterId}
              style={getChapterStyle(chapter.chapterId)}
              setRef={(el) => (chaptersRef.current[chapter.chapterId] = el)}
            />
          ))}
          <div className="flex flex-col items-center justify-center text-gray-600 space-y-4 border-t border-white/10 bottom-2 pt-5 mr-20 py-20">
            <span className="text-4xl">♔</span>
            <p className="text-xs tracking-[0.5em] uppercase">
              The End of The Beginning
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component con
const ChapterItem = ({ data, setActiveChapter, isActive, style, setRef }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-50% 0px -50% 0px" });

  useEffect(() => {
    if (isInView) setActiveChapter(data);
  }, [isInView, data, setActiveChapter]);

  return (
    <div
      ref={(node) => {
        ref.current = node;
        setRef(node);
      }}
      className="min-h-screen flex flex-col justify-center mb-32 relative pl-10"
    >
      <span
        className={`absolute -left-10 -top-20 text-[10rem] font-black opacity-5 select-none -z-10 transition-colors duration-500 ${
          isActive ? style.color : "text-white"
        }`}
      >
        {data.chapterId}
      </span>

      <h4
        className={`text-sm font-bold uppercase tracking-widest mb-8 transition-colors duration-500 ${
          isActive ? "text-white" : "text-gray-600"
        }`}
      >
        Chapter {data.chapterId}: {data.year}
      </h4>

      <div className="space-y-12">
        {data.content.map((paragraph, idx) => (
          <motion.p
            key={idx}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            className={`text-gray-300 text-lg md:text-xl leading-loose font-light text-justify font-serif transition-opacity duration-500
                        ${isActive ? "opacity-100" : "opacity-40"}
                    `}
          >
            {paragraph}
          </motion.p>
        ))}
      </div>
    </div>
  );
};

export default Biography;
