import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const Home = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Hiệu ứng: Khi cuộn xuống, chữ ở Hero mờ dần và thu nhỏ lại chút xíu
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  return (
    <div
      ref={containerRef}
      className="relative bg-black text-slate font-body selection:bg-gray-500 selection:text-black"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden z-0 flex flex-col items-center justify-center">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: "url('/images/background/bg1.jpg')" }}
        ></div>
        <div className="absolute inset-0 bg-black/40"></div>
        {/* Nội dung chữ */}
        <motion.div
          style={{ opacity, scale }}
          className="relative z-10 text-center p-4 flex flex-col items-center" // Thêm flex-col để dễ căn chỉnh
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-400 tracking-[0.5em] text-sm md:text-xl font-bold mb-4 uppercase drop-shadow-md"
          >
            The King OF POP
          </motion.p>
          <h1
            className="text-8xl md:text-[12rem] font-dangerous leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 drop-shadow-[0_0_30px_rgba(255,255,255,0.3)] 
                   translate-x-40 md:-translate-x-24"
          >
            {" "}
            MICHAEL
          </h1>
          <h1
            className="text-8xl md:text-[12rem] font-dangerous leading-none text-slate mix-blend-overlay opacity-90 
                   -mt-4 md:-mt-16                 /* Vẫn giữ hiệu ứng lồng nhau dọc */
                   -translate-x-12 md:translate-x-24"
          >
            {" "}
            JACKSON
          </h1>
        </motion.div>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 text-gray-300 text-3xl opacity-80"
        >
          ↓
        </motion.div>
      </div>

      <div className="relative z-10 min-h-screen shadow-[0_-50px_100px_rgba(0,0,0,1)]">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center fixed-attachment"
          style={{ backgroundImage: "url('/images/background/bg2.jpg')" }}
        ></div>
        <div className="absolute inset-0 bg-black/80"></div>
        <div className="relative z-20 container mx-auto px-6 py-32">
          <div className="text-center mb-24 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-light italic mb-8 text-gray-200 leading-tight">
              "I'm going to search for my star until I find it. It's hidden in
              the drawer of innocence."
            </h2>
            <div className="w-24 h-1 bg-gray-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <Link
              to="/music"
              className="group h-[550px] relative overflow-hidden rounded-xl border border-slate/10 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition duration-500 shadow-2xl"
            >
              <div className="absolute inset-0 bg-[url('/images/background/card1.jpg')] bg-cover bg-center opacity-50 transition duration-700 group-hover:scale-105 group-hover:-rotate-3"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>

              <div className="absolute bottom-0 left-0 p-8 w-full">
                <h3 className="text-5xl font-dangerous text-slate mb-2 group-hover:text-gray-400 transition">
                  THE STUDIO
                </h3>
                <p className="text-gray-400 text-sm mb-6 border-l-2 border-gray-500 pl-4">
                  7 Kỷ nguyên âm nhạc. <br />
                  Từ Off The Wall đến Xscape.
                </p>
                <span className="inline-block text-xs font-bold tracking-widest bg-slate text-black px-6 py-3 rounded-full group-hover:bg-gray-400 transition">
                  ENTER PLAYER
                </span>
              </div>
            </Link>

            <Link
              to="/story"
              className="group h-[550px] relative overflow-hidden rounded-xl border border-white/10 opacity-80 hover:opacity-100 transition duration-500 shadow-2xl"
            >
              <div className="absolute inset-0 bg-[url('/images/background/card2.jpg')] bg-cover bg-center opacity-50 transition duration-700 group-hover:scale-105 group-hover:grayscale-0 grayscale"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <h3 className="text-5xl font-dangerous text-white mb-2 group-hover:text-yellow-400 transition">
                  THE STORY
                </h3>
                <p className="text-gray-400 text-sm mb-6 border-l-2 border-white pl-4 group-hover:border-yellow-400">
                  Tiểu sử & Những câu chuyện chưa kể.
                </p>
                <span className="inline-block text-xs font-bold tracking-widest bg-white text-black px-6 py-3 rounded-full group-hover:bg-yellow-400 transition">
                  EXPLORE LIFE
                </span>
              </div>
            </Link>

            {/* Card 3: THE VAULT (Coming Soon) */}
            <div className="group h-[550px] relative overflow-hidden rounded-xl border border-slate/10 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition duration-500 cursor-not-allowed">
              <div className="absolute inset-0 bg-[url('/images/background/card3.jpg')] bg-cover bg-center opacity-50 transition duration-700 group-hover:scale-105 group-hover:rotate-3"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <h3 className="text-5xl font-dangerous text-slate mb-2">
                  THE VAULT
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                  Phòng trưng bày trang phục & Di sản.
                </p>
                <span className="inline-block text-xs font-bold tracking-widest border border-slate/30 text-slate/50 px-6 py-3 rounded-full">
                  COMING SOON
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="relative z-15 text-center py-5 border-t border-slate/10 text-gray-500 text-xs tracking-widest">
          <p className="mb-2">MJ INTERACTIVE ARCHIVE © 2025</p>
          <p className="opacity-50">
            Designed with passion for the King of Pop
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Home;
