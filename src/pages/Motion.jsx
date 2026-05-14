import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

/* ================= HERO VIDEOS ================= */
const heroVideos = [
  {
    title: "Broke Hours - Free Delivery",
    file: "/videos/Broke Hours Free Delivery.mp4",
  },
  {
    title: "Spice with Rizz",
    file: "/videos/Frame 2147227231.mp4",
  },
  {
    title: "Interactive Spin",
    file: "/videos/Spinning wheel.mp4",
  }
];

/* ================= GALLERY ================= */
const galleryVideos = [
  { title: "Cafe Coffee Day", file: "/videos/CCD_3.mp4" },
  { title: "Harsh Gujral", file: "/videos/Harsh Gujral.mp4" },
  { title: "Republic Day", file: "/videos/Frame 2147227265_4.mp4" },
  { title: "Sonam Bajwa", file: "/videos/gradient.mp4" },
  { title: "49 Offer", file: "/videos/2 4.mp4" },
  { title: "DJ Chetas", file: "/videos/Dj Chetas.mp4" },
  { title: "Cricket", file: "/videos/Broke Hours.mp4" },
  { title: "Toing", file: "/videos/Broken Lottie Adapts.mp4" },
  { title: "Evening Promo", file: "/videos/WhatsApp Video 2026-01-08 at 6.36.01 PM.mp4" }
];

/* ================= SCROLL TRIGGERED VIDEO COMPONENT ================= */
const ScrollTriggeredVideo = ({ video }) => {
  const ref = useRef(null);
  // Starts loading the video when it is 300px away from entering the viewport
  const isInView = useInView(ref, { once: true, margin: "300px" });

  return (
    <div ref={ref} className="w-full h-full">
      {isInView ? (
        <video
          src={video.file}
          muted
          loop
          autoPlay
          className="w-full h-auto object-contain bg-black/40"
        />
      ) : (
        // Placeholder maintaining the aspect ratio to prevent layout shift
        <div className="w-full aspect-video bg-[rgba(255,255,255,0.02)]" />
      )}
    </div>
  );
};

export default function Motion() {
  /* ================= STATES ================= */
  const [activeIndex, setActiveIndex] = useState(0);
  const [likedVideos, setLikedVideos] = useState({});

  /* ================= AUTO SLIDE ================= */
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroVideos.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  /* ================= LIKE ================= */
  const toggleLike = (index) => {
    setLikedVideos(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  /* ================= POSITION ================= */
  const getPosition = (index) => {
    if (index === activeIndex) return "center";
    if (index === (activeIndex - 1 + heroVideos.length) % heroVideos.length)
      return "left";
    if (index === (activeIndex + 1) % heroVideos.length)
      return "right";
    return "hidden";
  };

  return (
    <main className="relative min-h-screen pt-28 pb-20 overflow-hidden">
      
      {/* ================= BACKGROUND ================= */}
      <div
        className="absolute inset-0 bg-cover bg-center md:bg-fixed"
        style={{
          backgroundImage: "url('/images/OverallBG.jpg')"
        }}
      />
      
      <div className="absolute inset-0 bg-[rgba(10,10,10,0.75)] backdrop-blur-[2px]" />
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-black/80" />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        
        {/* ================= TITLE ================= */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12"
        >
          <h1 className="
            text-5xl sm:text-6xl 
            font-black 
            pb-2
            tracking-tight
            bg-gradient-to-r 
            from-[#FF9068] 
            to-[#FFB75E] 
            bg-clip-text 
            text-transparent
            drop-shadow-[0_2px_15px_rgba(255,144,104,0.15)]
          ">
            Motion Console
          </h1>
        </motion.div>

        {/* ================= CINEMATIC CAROUSEL ================= */}
        <div className="relative min-h-[360px] sm:min-h-[250px] flex items-center justify-center">
          {heroVideos.map((video, i) => {
            const position = getPosition(i);
            let styleClass = "";

            if (position === "center")
              styleClass = "scale-100 z-30 opacity-100 shadow-[0_20px_50px_rgba(255,144,104,0.15)] border-[rgba(255,255,255,0.2)]";
            if (position === "left")
              styleClass = "-translate-x-[380px] scale-90 opacity-40 z-20 border-[rgba(255,255,255,0.05)]";
            if (position === "right")
              styleClass = "translate-x-[380px] scale-90 opacity-40 z-20 border-[rgba(255,255,255,0.05)]";
            if (position === "hidden")
              styleClass = "opacity-0 pointer-events-none";

            return (
              <motion.div
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`absolute cursor-pointer
                  w-[500px] max-w-[85vw]
                  aspect-video
                  rounded-2xl overflow-hidden
                  border 
                  bg-[rgba(255,255,255,0.03)]
                  backdrop-blur-[12px]
                  transition-all duration-700 ease-in-out ${styleClass}
                `}
              >
                {/* VIDEO - Only autoPlay the center video */}
                <video
                  src={video.file}
                  autoPlay={position === "center"}
                  muted
                  loop
                  className="w-full h-full object-contain bg-black/40"
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"/>

                {/* TEXT */}
                <div className="absolute bottom-5 left-5">
                  <span className="text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#FF9068] to-[#FFB75E] bg-clip-text text-transparent">
                    {video.tag}
                  </span>
                  <h3 className="text-[#E2E8F0] font-bold text-lg mt-1">
                    {video.title}
                  </h3>
                </div>

                {/* LIKE BUTTON */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(i);
                  }}
                  className={`
                    absolute bottom-5 right-5
                    text-sm font-medium
                    transition-all duration-300
                    border-b pb-0.5
                    ${likedVideos[i]
                      ? "text-[#FFB75E] border-[#FFB75E] drop-shadow-[0_0_10px_rgba(255,183,94,0.4)]"
                      : "text-[#CBD5E1] border-white/20 hover:text-white hover:border-white"}
                  `}
                >
                  {likedVideos[i] ? "Liked ♥" : "Like"}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* ================= FULL VIDEO GRID ================= */}
        <h2 className="text-[#CBD5E1] text-lg mb-10 mt-28 text-center max-w-2xl mx-auto font-medium">
          Maximum Engagement, Lightweight Lottie Animations Built To Convert
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {galleryVideos.map((video, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03, y: -4 }}
              transition={{ duration: 0.3 }}
              className="relative rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] backdrop-blur-[12px] group hover:border-[rgba(255,255,255,0.3)] hover:shadow-[0_15px_30px_rgba(255,144,104,0.1)]"
            >
              {/* Subtle top glare */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />

              {/* IMPLEMENTED: ScrollTriggeredVideo replacing standard video tag */}
              <ScrollTriggeredVideo video={video} />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"/>

              <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-400 translate-y-2 group-hover:translate-y-0">
                <div className="bg-black/60 border border-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg">
                  <p className="text-[#E2E8F0] text-sm font-medium tracking-wide">
                    {video.title}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
