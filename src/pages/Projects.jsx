import React, { useState } from "react";
import { projects } from "../data/projectsData";
import { motion } from "framer-motion";

export default function Projects() {
  // FILTER STATE
  const [filter, setFilter] = useState("all");

  // FILTER LOGIC
  const filteredProjects = projects.filter((project) => {
    if (filter === "figma") return project.type === "figma";
    if (filter === "dev") return project.type === "dev";
    return true;
  });

  return (
    <main className="relative min-h-screen pt-28 pb-16 overflow-hidden">
      {/* ===================== */}
      {/* BACKGROUND IMAGE */}
      {/* ===================== */}
      <div
        className="absolute inset-0 bg-center bg-cover md:bg-fixed"
        style={{
          backgroundImage: "url('/images/OverallBG.jpg')",
        }}
      />

      {/* DARK OVERLAY - Matched exactly to the System */}
      <div className="absolute inset-0 bg-[rgba(10,10,10,0.75)] backdrop-blur-[2px]" />

      {/* GRADIENT LAYER */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-black/80" />

      {/* ===================== */}
      {/* CONTENT */}
      {/* ===================== */}
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* ===================== */}
        {/* TITLE */}
        {/* ===================== */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 mt-6"
        >
          <h1
            className="
              text-5xl 
              sm:text-6xl 
              font-black 
              leading-tight
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
            My Projects
          </h1>
          <p className="text-[#CBD5E1] text-lg mt-3 tracking-wide">
            Explore my work across UI/UX and Development
          </p>
        </motion.div>

        {/* ===================== */}
        {/* FILTER TABS */}
        {/* ===================== */}
        <div className="flex justify-center gap-4 mb-14 flex-wrap">
          {["all", "figma", "dev"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-2.5 rounded-xl border backdrop-blur-[12px] transition-all duration-400 font-medium tracking-wide
                ${
                  filter === tab
                    ? "bg-gradient-to-r from-[#bb4206] to-[#ff791a] text-white font-bold border-transparent shadow-[0_5px_20px_rgba(255,144,104,0.25)] translate-y-[-2px]"
                    : "bg-white/5 border-white/10 text-[#E2E8F0] shadow-sm hover:bg-white/10 hover:border-white/30 hover:text-white"
                }
              `}
            >
              {tab === "all" ? "All Projects" : tab === "figma" ? "UI / UX (Figma)" : "Development"}
            </button>
          ))}
        </div>

        {/* ===================== */}
        {/* PROJECT GRID */}
        {/* ===================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-2xl overflow-hidden backdrop-blur-[12px] transition-all duration-400 hover:border-[rgba(255,255,255,0.3)] hover:shadow-[0_15px_30px_rgba(255,144,104,0.1)] relative h-full flex flex-col">
                
                {/* Subtle top glare effect on hover */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />

                {/* ===================== */}
                {/* IMAGE AREA */}
                {/* ===================== */}
                <div className="h-44 bg-black/40 flex items-center justify-center relative overflow-hidden border-b border-white/5">
                  {/* FIGMA IMAGE */}
                  {project.image && (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-contain p-6 group-hover:scale-105 transition duration-500"
                    />
                  )}

                  {/* FIGMA HOVER PREVIEW */}
                  {project.previewImage && (
                    <img
                      src={project.previewImage}
                      alt="preview"
                      className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition duration-500"
                    />
                  )}

                  {/* DEV ICON (Professional SVG Fallback) */}
                  {!project.image && (
                    <div className="flex flex-col items-center justify-center opacity-40 group-hover:opacity-80 group-hover:text-[#FFB75E] transition-all duration-500">
                      <svg 
                        className="w-12 h-12 mb-3" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor" 
                        strokeWidth="1.2"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                      </svg>
                      <span className="text-[10px] font-mono tracking-[0.2em] uppercase">
                        Development
                      </span>
                    </div>
                  )}
                </div>

                {/* ===================== */}
                {/* INFO */}
                {/* ===================== */}
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-[#E2E8F0] mb-2 group-hover:text-[#FFB75E] transition-colors duration-300">
                    {project.title}
                  </h3>

                  <p className="text-[#CBD5E1] text-sm leading-relaxed flex-grow">
                    {project.description}
                  </p>

                  {/* TAGS */}
                  {project.tags && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {project.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-xs px-3 py-1 border border-white/10 bg-white/5 text-[#CBD5E1] rounded-lg shadow-sm backdrop-blur-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* ===================== */}
                  {/* BUTTONS */}
                  {/* ===================== */}
                  <div className="flex gap-4 mt-5 flex-wrap border-t border-white/5 pt-4">
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-[#FFB75E] hover:text-[#FF9068] transition-colors duration-300 drop-shadow-sm flex items-center gap-1"
                    >
                      {project.type === "figma" ? "View Prototype" : "Live Site"} 
                      <span className="text-lg leading-none group-hover:translate-x-1 transition-transform">→</span>
                    </a>

                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-[#CBD5E1] hover:text-white transition-colors duration-300 flex items-center gap-1"
                      >
                        Source Code 
                        <span className="text-lg leading-none group-hover:translate-x-1 transition-transform">→</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}