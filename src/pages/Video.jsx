import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const videoList = [
  {
    src: "/images/motion.mp4",
    description: "Motion Animation",
    poster: "/images/thumb1.jpg"
  },
  {
    src: "/images/next.mp4",
    description: "School Management App",
    poster: "/images/thumb2.jpg"
  },
  {
    src: "/images/logo.mp4",
    description: "Logo Animation",
    poster: "/images/thumb3.jpg"
  },
  {
    src: "/images/Intro.mp4",
    description: "Digital Advertising",
    poster: "/images/thumb4.jpg"
  },
  {
    src: "/images/TSL.mp4",
    description: "Cricket Club",
    poster: "/images/thumb5.jpg"
  },
  {
    src: "/images/Final.mp4",
    description: "Short Ad",
    poster: "/images/thumb6.jpg"
  },
  {
    src: "/images/Viral_Reel.mp4",
    description: "Interactive Content",
    poster: "/images/thumb7.jpg"
  },
  {
    src: "/images/sf.mp4",
    description: "Short Film",
    poster: "/images/thumb8.jpg"
  },
  {
    src: "/images/Motion 2.mp4",
    description: "Name Play",
    poster: "/images/thumb9.jpg"
  },
  {
    src: "/images/Anime Swiggy.mp4",
    description: "Swiggy Anime",
    poster: "/images/thumb10.jpg"
  },
  {
    src: "/images/DONE.mp4",
    description: "Banner Outro",
    poster: "/images/thumb11.jpg"
  }
];

export default function VideoGallery() {
  const [modalVideo, setModalVideo] = useState(null);
  const [shuffledVideos, setShuffledVideos] = useState([]);
  const videoRefs = useRef([]);

  // Detect mobile
  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 768px)").matches;

  // Shuffle layout on refresh
  useEffect(() => {
    const shuffled = [...videoList].sort(() => Math.random() - 0.5);
    setShuffledVideos(shuffled);
  }, []);

  // Hover behavior
  const handleHover = (i) => {
    if (isMobile) return;
    const video = videoRefs.current[i];
    if (video) {
      video.muted = false;
      if (video.paused) {
        video.play();
      }
    }
  };

  // Leave behavior (mute only)
  const handleLeave = (i) => {
    if (isMobile) return;
    const video = videoRefs.current[i];
    if (video) {
      video.muted = true;
    }
  };

  return (
    <main className="relative min-h-screen pt-28 pb-20 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center md:bg-fixed"
        style={{
          backgroundImage: "url('/images/OverallBG.jpg')"
        }}
      />
      
      {/* Dark Overlay - Matched exactly to the system */}
      <div className="absolute inset-0 bg-[rgba(10,10,10,0.75)] backdrop-blur-[2px]" />
      
      {/* Gradient Layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-black/80" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            text-center 
            text-5xl sm:text-6xl 
            font-black 
            mb-16 
            pb-2
            tracking-tight
            bg-gradient-to-r 
            from-[#FF9068] 
            to-[#FFB75E] 
            bg-clip-text 
            text-transparent
            drop-shadow-[0_2px_15px_rgba(255,144,104,0.15)]
          "
        >
          Video Showcase
        </motion.h1>

        {/* Masonry Bento Layout */}
        <motion.div
          layout
          className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
        >
          {shuffledVideos.map((video, i) => (
            <motion.div
              layout
              key={video.src}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="break-inside-avoid cursor-pointer group"
              onMouseEnter={() => handleHover(i)}
              onMouseLeave={() => handleLeave(i)}
              onClick={() => setModalVideo(video.src)}
            >
              <div className="relative overflow-hidden rounded-2xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] backdrop-blur-[12px] transition-all duration-400 group-hover:border-[rgba(255,255,255,0.3)] group-hover:shadow-[0_15px_30px_rgba(255,144,104,0.1)] flex flex-col items-center justify-center">
                
                {/* Subtle top glare effect on hover */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />

                {/* Video */}
                <video
                  ref={(el) => videoRefs.current[i] = el}
                  src={video.src}
                  poster={video.poster}
                  muted
                  loop
                  playsInline
                  autoPlay
                  preload="metadata"
                  className="w-full h-auto object-contain transition duration-500 group-hover:scale-105 bg-black/40"
                />

                {/* Description Badge */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 z-30 pointer-events-none">
                  <div className="bg-black/60 border border-white/10 backdrop-blur-md px-4 py-2 rounded-xl shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
                    <p className="text-sm font-medium tracking-wide text-[#E2E8F0]">
                      {video.description}
                    </p>
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Cinematic Modal */}
      <AnimatePresence>
        {modalVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-[#0a0a0a]/90 backdrop-blur-xl z-50 flex items-center justify-center p-4 sm:p-8"
            onClick={() => setModalVideo(null)}
          >
            <motion.div 
              className="relative max-w-6xl w-full max-h-[85vh] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/10"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              onClick={(e) => e.stopPropagation()} // Prevent clicking the video from closing the modal
            >
              <video
                src={modalVideo}
                controls
                autoPlay
                className="w-full h-full object-contain bg-black"
              />
              
              {/* Close Button Overlay */}
              <button 
                onClick={() => setModalVideo(null)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 backdrop-blur-md text-white rounded-full p-2 transition-colors border border-white/10 z-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}