import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { NavLink } from "react-router-dom";

const HERO_IMAGES = { uiux: "/images/Sketch.jpg", graphic: "/images/unnamed.jpg" };

const SKILLS = [
  { icon: "◉", name: "Figma",              type: "Design Tool",  lv: 97, color: "#FF9B71" },
  { icon: "◈", name: "After Effects",      type: "Motion",       lv: 92, color: "#FFB75E" },
  { icon: "▸", name: "Lottie / Rive",      type: "Micro-anim",   lv: 90, color: "#FF9B71" },
  { icon: "✧", name: "Photoshop",          type: "Creative",     lv: 88, color: "#E2B086" },
  { icon: "◆", name: "Illustrator",        type: "Creative",     lv: 86, color: "#FF9B71" },
  { icon: "▣", name: "Premiere Pro",       type: "Video",        lv: 85, color: "#FFB75E" },
  { icon: "⚛", name: "React.js",           type: "Frontend",     lv: 82, color: "#FFB75E" },
  { icon: "◎", name: "Node.js",            type: "Backend",      lv: 74, color: "#FF9B71" },
  { icon: "✦", name: "HTML5 / CSS3",       type: "Web",          lv: 90, color: "#E2B086" },
  { icon: "◐", name: "Interaction Design", type: "UX",           lv: 94, color: "#FF9B71" },
  { icon: "▲", name: "UI Animation",       type: "Motion",       lv: 92, color: "#FFB75E" },
  { icon: "⬡", name: "AI Tools",           type: "Productivity", lv: 88, color: "#E2B086" },
];

const EASE = [0.16, 1, 0.3, 1];

/* ─── INJECTED CSS ─── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Figtree:wght@700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap');

  /* Removed scroll-behavior: smooth to prevent auto-scroll to anchors on load */
  html, body { overflow-x: hidden; cursor: auto; }

  /* ── AMBIENT BLOBS ── */
  .blob {
    position: absolute; border-radius: 50%; filter: blur(100px);
    animation: blobDrift 18s ease-in-out infinite alternate; will-change: transform;
  }
  .blob-1 { width: 600px; height: 600px; top: -10%; left: -15%; background: radial-gradient(ellipse, rgba(255,155,113,0.06) 0%, transparent 70%); animation-duration: 22s; }
  .blob-2 { width: 500px; height: 500px; bottom: -15%; right: -10%; background: radial-gradient(ellipse, rgba(255,183,94,0.05) 0%, transparent 70%); animation-duration: 28s; animation-delay: -8s; }
  .blob-3 { width: 350px; height: 350px; top: 40%; left: 50%; background: radial-gradient(ellipse, rgba(226,176,134,0.04) 0%, transparent 70%); animation-duration: 20s; animation-delay: -4s; }

  @keyframes blobDrift {
    0%   { transform: translate(0, 0) scale(1); }
    33%  { transform: translate(40px, -30px) scale(1.06); }
    66%  { transform: translate(-20px, 40px) scale(0.96); }
    100% { transform: translate(20px, -20px) scale(1.03); }
  }

  /* ── HERO TYPOGRAPHY ── */
  .hero-headline {
    font-family: 'Figtree', system-ui, sans-serif;
    font-weight: 900;
    font-size: clamp(2.75rem, 7.5vw, 5.5rem);
    line-height: 1.05;
    letter-spacing: -0.02em;
    margin: 0; padding: 0;
  }
  .hero-headline--accent {
    background: linear-gradient(95deg, #FF9B71 0%, #FFB75E 50%, #FF9B71 100%);
    background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text; animation: gradientShift 5s linear infinite;
    filter: drop-shadow(0 2px 15px rgba(255,155,113,0.2));
  }
  .hype{
    font-family: 'Figtree', system-ui, sans-serif;
    font-weight: 900;
    font-size: clamp(2.5rem, 3.5vw, 5.5rem);
    line-height: 1.05;
    letter-spacing: -0.02em;
    margin: 0; padding: 0;
  }
  @keyframes gradientShift { 0% { background-position: 0% center; } 100% { background-position: 200% center; } }

  /* ── SPOTLIGHT SKILLS TITLE ── */
  .spotlight-title {
    font-family: 'Figtree', system-ui, sans-serif; font-weight: 900;
    font-size: clamp(5rem, 14vw, 12rem); line-height: 0.9; letter-spacing: -0.04em;
    cursor: default; display: block;
  }

  /* ── SCANLINES & EFFECTS ── */
  .scanlines { background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px); pointer-events: none; }
  @keyframes shimmerSlide { 0% { transform: translateX(-150%) skewX(12deg); } 100% { transform: translateX(250%) skewX(12deg); } }
  .scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  ::selection { background: rgba(255,155,113,0.25); color: #FFB75E; }
`;

/* ─── NOISE ─── */
const Noise = () => (
  <svg className="fixed inset-0 w-full h-full pointer-events-none z-1 opacity-[0.032]" xmlns="http://www.w3.org/2000/svg">
    <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
    <rect width="100%" height="100%" filter="url(#n)"/>
  </svg>
);

/* ─── NEW SPOTLIGHT HOVER TITLE ─── */
const SpotlightTitle = ({ allUnlocked }) => {
  const containerRef = useRef(null);
  const inView = useInView(containerRef, { once: true, margin: "-10%" });
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div 
      ref={containerRef} 
      initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: EASE }}
      onMouseMove={handleMouseMove} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} 
      className="relative select-none text-center lg:text-left w-full lg:w-max mb-6"
    >
      {/* 1. Base Layer (Outline Only) */}
      <h2 className="spotlight-title" style={{ WebkitTextStroke: "2px rgba(255,255,255,0.15)", color: "transparent" }}>
        SKILLS
      </h2>

      {/* 2. Hover Reveal Layer (Solid Fill) */}
      <motion.h2 
        className="spotlight-title absolute top-0 left-0 w-full pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: allUnlocked || isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: "linear-gradient(95deg, #FF9B71, #FFB75E, #E2B086, #FF9B71)",
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          animation: "gradientShift 5s linear infinite",
          WebkitMaskImage: allUnlocked ? "none" : `radial-gradient(180px circle at ${mouse.x}px ${mouse.y}px, black 30%, transparent 100%)`,
          maskImage: allUnlocked ? "none" : `radial-gradient(180px circle at ${mouse.x}px ${mouse.y}px, black 30%, transparent 100%)`
        }}
      >
        SKILLS
      </motion.h2>
    </motion.div>
  );
};

/* ─── HOLOGRAPHIC HERO CARD ─── */
const HoloCard = ({ src, alt }) => {
  const cardRef = useRef(null);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const [active, setActive] = useState(false);
  const [spot, setSpot] = useState({ x: 0, y: 0 });

  const handleMove = useCallback((e) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    setMouse({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
    setSpot({ x: e.clientX - r.left, y: e.clientY - r.top });
  }, []);

  const rx = (mouse.y - 0.5) * -16;
  const ry = (mouse.x - 0.5) * 16;

  return (
    <motion.div ref={cardRef} onMouseMove={handleMove} onMouseEnter={() => setActive(true)} onMouseLeave={() => { setActive(false); setMouse({ x: 0.5, y: 0.5 }); }}
      animate={{ rotateX: active ? rx : 0, rotateY: active ? ry : 0, scale: active ? 1.03 : 1 }} transition={{ type: "spring", stiffness: 180, damping: 22 }}
      className="relative w-full aspect-[3/3] rounded-2xl overflow-hidden border border-white/10 backdrop-blur-md shadow-2xl" style={{ transformStyle: "preserve-3d", perspective: 1000 }}
    >
      <img src={src} alt={alt} className="absolute inset-0 w-full h-full object-cover opacity-[0.25] grayscale blur-[2px]"/>
      <div className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: active ? 1 : 0,
          background: `radial-gradient(ellipse at ${mouse.x*100}% ${mouse.y*100}%, rgba(255,255,255,0.14) 0%, transparent 55%), linear-gradient(${mouse.x*360}deg, rgba(255,155,113,0.1) 0%, rgba(255,183,94,0.07) 25%, rgba(226,176,134,0.09) 50%, rgba(201,145,97,0.07) 75%, rgba(255,155,113,0.1) 100%)`,
          mixBlendMode: "screen",
        }}/>
      {active && (
        <div className="absolute inset-0 z-20 pointer-events-none" style={{ maskImage: `radial-gradient(100px circle at ${spot.x}px ${spot.y}px, black, transparent)`, WebkitMaskImage: `radial-gradient(160px circle at ${spot.x}px ${spot.y}px, black, transparent)` }}>
          <img src={src} alt={alt} className="w-full h-full object-cover scale-105"/>
        </div>
      )}
      <div className="absolute inset-0 z-30 pointer-events-none scanlines opacity-15"/>
      <div className="absolute inset-0 rounded-2xl pointer-events-none z-40 transition-all duration-300"
        style={{ boxShadow: active ? "0 0 0 1px rgba(255,155,113,0.35), 0 0 50px rgba(255,183,94,0.12), inset 0 0 60px rgba(255,155,113,0.04)" : "0 0 0 1px rgba(255,255,255,0.07)" }} />
      {!active && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center pointer-events-none">
        </div>
      )}
    </motion.div>
  );
};

/* ─── SKILL BADGE ─── */
const Badge = ({ skill, unlocked, onUnlock }) => {
  const [flash, setFlash] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const trigger = useCallback(() => {
    if (unlocked) return; onUnlock(); setFlash(true); setTimeout(() => setFlash(false), 500);
  }, [unlocked, onUnlock]);

  return (
    <motion.div onMouseEnter={trigger} onTouchStart={trigger} onMouseMove={(e) => { if (!unlocked) return; const r = e.currentTarget.getBoundingClientRect(); setTilt({ x: ((e.clientY - r.top) / r.height - 0.5) * -14, y: ((e.clientX - r.left) / r.width - 0.5) * 14 }); }}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })} animate={{ rotateX: tilt.x, rotateY: tilt.y, scale: unlocked ? 1 : 0.97 }} transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className={`relative h-28 p-4 rounded-xl cursor-pointer overflow-hidden flex flex-col justify-between transition-all duration-300 backdrop-blur-md ${!unlocked ? "opacity-55 grayscale hover:grayscale-0 hover:opacity-80" : ""}`}
      style={{ transformStyle: "preserve-3d", background: unlocked ? "rgba(255,255,255,0.04)" : "rgba(10,10,10,0.5)", border: unlocked ? `1px solid ${skill.color}40` : "1px solid rgba(255,255,255,0.08)", boxShadow: unlocked ? `0 4px 24px ${skill.color}15, inset 0 0 20px ${skill.color}05` : "none" }}>
      {flash && <motion.div initial={{ opacity: 0.5 }} animate={{ opacity: 0 }} transition={{ duration: 0.4 }} className="absolute inset-0 pointer-events-none rounded-xl" style={{ background: skill.color }} />}
      {unlocked && <div className="absolute inset-0 pointer-events-none rounded-xl" style={{ background: `linear-gradient(135deg, ${skill.color}08 0%, transparent 50%, ${skill.color}05 100%)` }} />}
      <div className="flex justify-between items-start relative z-10">
        <motion.span className="text-xl" style={{ color: unlocked ? skill.color : "#CBD5E1" }} animate={unlocked ? { rotate: [0, 12, -8, 4, 0] } : {}} transition={{ duration: 0.45 }}>{skill.icon}</motion.span>
        {unlocked && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }} className="text-[10px]" style={{ color: skill.color }}>✓</motion.span>}
      </div>
      <div className="mt-auto flex flex-col gap-1 w-full relative z-10">
        <span className="font-bold text-[13px] leading-tight" style={{ color: unlocked ? skill.color : "#94A3B8" }}>{skill.name}</span>
        <span className="text-[9px] tracking-[0.1em] uppercase font-mono" style={{ color: unlocked ? `${skill.color}90` : "#64748B" }}>{skill.type}</span>
        <div className="mt-1.5 flex items-end gap-2 w-full">
          <div className="h-[2px] bg-white/10 flex-1 mb-[3px] rounded-full overflow-hidden">
            {unlocked && <motion.div initial={{ width: 0 }} animate={{ width: `${skill.lv}%` }} transition={{ delay: 0.1, duration: 1, ease: EASE }} className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${skill.color}70, ${skill.color})` }} />}
          </div>
          {unlocked && <span className="text-[10px] font-mono tracking-wider" style={{ color: skill.color }}>LV{skill.lv}</span>}
        </div>
      </div>
    </motion.div>
  );
};

/* ─── TERMINAL ─── */
const getTS = () => new Date().toTimeString().slice(0, 8);
const TerminalContact = () => {
  const ref = useRef(null); const inView = useInView(ref, { once: true, margin: "-10%" }); const inputRef = useRef(null); const bottomRef = useRef(null);
  const [step, setStep] = useState(0); const formRef = useRef({ name: "", email: "", message: "" }); const [inputValue, setInputValue] = useState("");
  const [history, setHistory] = useState([{ type: "sys", text: "Initializing secure channel...", ts: getTS(), status: "info" }, { type: "sys", text: "Connection to nimesh.design established.", ts: getTS(), status: "ok" }, { type: "prompt", text: "Enter your name to begin.", ts: getTS() }]);
  const push = useCallback((line) => setHistory((p) => [...p, { ...line, ts: getTS() }]), []);
 useEffect(() => {
  if (history.length > 3) {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }
}, [history]);
  const handleKeyDown = useCallback((e) => {
    if (e.key !== "Enter") return; const val = inputValue.trim(); if (!val) return;
    push({ type: "user", text: val }); setInputValue("");
    if (step === 0) { formRef.current.name = val; setTimeout(() => push({ type: "sys", text: `Hey ${val}! What's your email?`, status: "ok" }), 120); setStep(1); }
    else if (step === 1) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) { setTimeout(() => push({ type: "sys", text: "⚠ Invalid email format. Try again.", status: "warn" }), 120); return; }
      formRef.current.email = val; setTimeout(() => push({ type: "sys", text: "Got it. What's your message?", status: "ok" }), 120); setStep(2);
    } else if (step === 2) {
      formRef.current.message = val; setStep(3); const { name, email, message: msg } = formRef.current;
      setTimeout(() => { push({ type: "sys", text: "Encrypting payload...", status: "info" });
        setTimeout(() => { push({ type: "sys", text: "Transmitting to nimesh.design...", status: "info" });
          setTimeout(() => { push({ type: "success", text: "✓ Message delivered! Reply within 24h." }); push({ type: "meta", text: `FROM: ${name} <${email}>` }); push({ type: "meta", text: `BODY: ${msg.slice(0, 60)}${msg.length > 60 ? "…" : ""}` }); window.location.href = `mailto:nimeshjaiswal884@gmail.com?subject=${encodeURIComponent(`Portfolio Contact from ${name}`)}&body=${encodeURIComponent(`${msg}\n\nFrom: ${email}`)}`; }, 900);
        }, 700); }, 300);
    }
  }, [inputValue, step, push]);

  /* ── FIX: removed onClick auto-focus on the outer div.
     Focus only happens when user explicitly clicks the input field itself. ── */
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: EASE }} className="w-full max-w-3xl mx-auto mt-16 mb-2 rounded-2xl overflow-hidden border border-white/10 bg-[rgba(15,15,15,0.7)] backdrop-blur-[16px] font-mono text-sm shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-white/5">
        <div className="flex gap-2.5">{["#FF5F56","#FFBD2E","#27C93F"].map((c,i) => <div key={i} className="w-3.5 h-3.5 rounded-full" style={{background:c}}/>)}</div>
        <span className="text-[#94A3B8] text-xs tracking-widest hidden sm:block">nimesh@portfolio ~ ssh contact</span>
        <div className="flex items-center gap-2 text-xs"><span className="w-2 h-2 rounded-full" style={{ background: step===3?"#FFB75E":"#FF9B71", boxShadow:`0 0 8px ${step===3?"#FFB75E":"#FF9B71"}` }}/><span className="text-[#94A3B8]">{step===3?"SENT":step===0?"READY":`STEP ${step}/3`}</span></div>
      </div>
      <div className="p-6 h-[360px] overflow-y-auto flex flex-col gap-3 scrollbar-hide text-xs sm:text-sm">
        {history.map((line, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.18 }} className="flex gap-3 items-start leading-relaxed">
            <span className="text-[#64748B] text-xs mt-[3px] shrink-0">{line.ts}</span>
            {line.type==="sys"    && <><span className="text-[11px] mt-[2px] shrink-0 px-2 py-0.5 rounded font-bold" style={{color:line.status==="warn"?"#FFBD2E":line.status==="ok"?"#FFB75E":"#FF9B71",background:line.status==="warn"?"#FFBD2E15":line.status==="ok"?"#FFB75E15":"#FF9B7115"}}>{line.status==="warn"?"WARN":line.status==="ok"?" OK ":"INFO"}</span><span style={{color:line.status==="warn"?"#FFBD2E":line.status==="ok"?"#FFB75E":"#FF9B71"}}>{line.text}</span></>}
            {line.type==="prompt" && <><span className="text-[11px] mt-[2px] px-2 py-0.5 rounded text-[#FF9B71] bg-[#FF9B7115] shrink-0 font-bold">INIT</span><span className="text-[#FF9B71]/90">{line.text}</span></>}
            {line.type==="user"   && <><span className="text-[11px] mt-[2px] px-2 py-0.5 rounded text-[#94a3b8] bg-white/10 shrink-0 font-bold">SELF</span><span className="text-white"><span className="text-[#FFB75E] mr-2">$</span>{line.text}</span></>}
            {line.type==="success"&& <><span className="text-[11px] mt-[2px] px-2 py-0.5 rounded text-[#FFB75E] bg-[#FFB75E20] border border-[#FFB75E30] shrink-0 font-bold">DONE</span><span className="text-[#FFB75E] font-bold">{line.text}</span></>}
            {line.type==="meta"   && <><span className="text-[11px] mt-[2px] px-2 py-0.5 rounded text-[#64748b] bg-white/5 shrink-0 font-bold">META</span><span className="text-[#64748b]">{line.text}</span></>}
          </motion.div>
        ))}
        {step < 3 && (
          <div className="flex gap-3 items-center mt-2" onClick={() => inputRef.current?.focus()}>
            <span className="text-[#64748B] text-xs shrink-0">{getTS()}</span>
            <span className="text-[11px] px-2 py-0.5 rounded text-[#94a3b8] bg-white/10 shrink-0 font-bold">{["NAME","MAIL"," MSG"][step]}</span>
            <span className="text-[#FFB75E] shrink-0 font-bold">$</span>
            <input ref={inputRef} type={step===1?"email":"text"} value={inputValue} onChange={e=>setInputValue(e.target.value)} onKeyDown={handleKeyDown} placeholder={["Type your name...","Type your email...","Type your message..."][step]} className="flex-1 bg-transparent outline-none text-white font-mono placeholder:text-[#64748B] caret-[#FFB75E]" autoComplete="off" spellCheck={false}/>
            <span className="text-[#64748B] text-xs hidden sm:inline border border-white/10 px-2 py-1 rounded bg-white/5">ENTER ↵</span>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>
    </motion.div>
  );
};

/* ─── SKILLS SECTION ─── */
const Skills = ({ setXp }) => {
  const ref = useRef(null); const inView = useInView(ref, { once: true, margin: "-10%" }); const [unlocked, setUnlocked] = useState(new Set());
  const handleUnlock = useCallback((i) => { setUnlocked((prev) => { if (prev.has(i)) return prev; const next = new Set(prev); next.add(i); setXp(Math.round((next.size / SKILLS.length) * 100)); return next; }); }, [setXp]);
  const allUnlocked = unlocked.size === SKILLS.length; const pct = Math.round((unlocked.size / SKILLS.length) * 100);
  return (
    <section id="skills" ref={ref} className="relative py-24 md:py-32 z-10 px-6 md:px-12 lg:px-20 max-w-[1400px] mx-auto">
      <AnimatePresence>
        {allUnlocked && ( <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 pointer-events-none z-[-1]"><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full" style={{ background: "radial-gradient(ellipse, rgba(255,155,113,0.07) 0%, rgba(255,183,94,0.04) 40%, transparent 70%)", filter: "blur(50px)" }}/></motion.div> )}
      </AnimatePresence>
      
      <SpotlightTitle allUnlocked={allUnlocked} />
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.15, ease: EASE }} className="mt-6 mb-10 flex flex-wrap items-center justify-center lg:justify-start gap-4 font-mono text-xs tracking-widest uppercase text-[#94A3B8]">
        <span className="bg-white/5 px-3 py-1.5 rounded-full border border-white/10">Hover to Unlock</span>
        <span className="opacity-40">·</span>
        <span>{unlocked.size}/{SKILLS.length} Active</span>
        <span className="opacity-40">·</span>
        <div className="flex items-center gap-3">
          <div className="w-32 h-[4px] bg-white/10 rounded-full overflow-hidden">
            <motion.div className="h-full rounded-full" animate={{ width: `${pct}%` }} transition={{ duration: 0.4, ease: EASE }} style={{ background: allUnlocked ? "linear-gradient(90deg,#FF9B71,#FFB75E,#E2B086)" : "linear-gradient(90deg,#FF9B71,#FFB75E)" }}/>
          </div>
          <span className="font-bold" style={{ color: allUnlocked ? "#FFB75E" : "#94A3B8" }}>{pct}%</span>
        </div>
        {allUnlocked && ( <motion.span initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 300 }} className="text-[#FFB75E] ml-2 animate-pulse">★ COMPLETE</motion.span> )}
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 lg:gap-4 font-mono">
        {SKILLS.map((s, i) => ( <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 + i * 0.04, duration: 0.5, ease: EASE }}><Badge skill={s} unlocked={unlocked.has(i)} onUnlock={() => handleUnlock(i)}/></motion.div> ))}
      </div>

      
    </section>
  );
};

/* ─── CHESS PROMO EASTER EGG SECTION ─── */
const ChessPromo = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section ref={ref} className="relative pb-32 pt-16 z-10 px-6 md:px-12 lg:px-20 max-w-[1400px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: EASE }}
        className="relative w-full rounded-[2rem] overflow-hidden border border-white/10 bg-[rgba(15,15,15,0.6)] backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] group"
      >
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(#aad751 1.5px, transparent 1.5px)", backgroundSize: "28px 28px", backgroundPosition: "center" }} />
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF9B71]/5 via-transparent to-[#FFB75E]/10 pointer-events-none" />

        <div className="relative p-10 md:p-14 lg:p-20 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 space-y-6 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#FFB75E] tracking-[0.2em] uppercase shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#FFB75E] animate-pulse"></span>
              MY THINKING PLAYGROUND ♟️
            </div>
            
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Strategic <span className="bg-gradient-to-r from-[#FF9B71] to-[#FFB75E] bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(255,155,113,0.2)]">Design</span><br/>
              Strategic <span className="bg-gradient-to-r from-[#FF9B71] to-[#FFB75E] bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(255,155,113,0.2)]">Thinking.</span>
            </h3>
            
            <p className="text-[#CBD5E1] text-base lg:text-lg max-w-lg mx-auto md:mx-0 leading-relaxed font-mono">
              Great design is like chess every move matters. Take a break and challenge the CPU in a custom-built, retro-styled Pixel Chess engine directly in my portfolio.
            </p>
          </div>

          <div className="shrink-0 relative mt-4 md:mt-0">
            <motion.div animate={{ y: [-8, 8, -8], rotate: [-6, 6, -6] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-16 -left-16 text-7xl text-white/5 blur-[2px] select-none pointer-events-none">♞</motion.div>
            <motion.div animate={{ y: [8, -8, 8], rotate: [6, -6, 6] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute -bottom-12 -right-12 text-8xl text-[#FFB75E]/5 blur-[2px] select-none pointer-events-none">♜</motion.div>

            <NavLink to="/chess" className="relative inline-flex items-center justify-center gap-4 px-8 py-5 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-white/20 hover:border-[#FFB75E]/50 text-white font-bold rounded-2xl transition-all duration-500 hover:shadow-[0_10px_40px_rgba(255,155,113,0.25)] overflow-hidden backdrop-blur-md cursor-pointer group/btn">
              <span className="relative z-10 text-lg tracking-wide">Play for a Break</span>
              <span className="relative z-10 text-2xl group-hover/btn:rotate-12 group-hover/btn:scale-110 transition-all duration-300 text-[#FFB75E] drop-shadow-[0_0_10px_rgba(255,183,94,0.5)]">♚</span>
              <div className="absolute top-0 bottom-0 w-16 -translate-x-[250px] group-hover/btn:animate-[shimmerSlide_2s_ease-out_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
            </NavLink>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

/* ─── FLOATING AMBIENT TAGS ─── */
const FloatTag = ({ text, style, delay = 0 }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: [0.7, 1, 1, 0.7], y: [10, 0, -6, 0] }} transition={{ delay, duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute z-20 hidden lg:flex items-center gap-2 bg-[rgba(15,15,15,0.8)] border border-white/10 px-4 py-2 rounded-full backdrop-blur-md text-xs font-mono tracking-widest text-[#CBD5E1] uppercase pointer-events-none shadow-[0_10px_20px_rgba(0,0,0,0.4)]" style={style}>
    <span className="w-2 h-2 rounded-full bg-[#FFB75E] shadow-[0_0_8px_rgba(255,183,94,0.6)]"/>{text}
  </motion.div>
);

/* ─── HOME ─── */
export default function Home() {
  const [mode, setMode] = useState("uiux");
  const [xp, setXp] = useState(0);

  /* ── FIX: scroll to top on mount so page always opens at the hero ── */
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const containerV = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.11, delayChildren: 0.1 } } };
  const itemV = { hidden: { y: 28, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.65, ease: EASE } } };

  return (
    <main className="home relative text-[#E2E8F0] min-h-screen overflow-x-hidden pt-24">
      <style>{styles}</style>
      
      {/* Background & Overlays */}
      <div className="fixed inset-0 bg-cover bg-center z-[-3]" style={{ backgroundImage: "url('/images/OverallBG.jpg')" }} />
      <div className="fixed inset-0 bg-[#0a0a0a]/80 backdrop-blur-[4px] z-[-2]" />
      <div className="fixed inset-0 bg-gradient-to-br from-black/50 via-transparent to-black/90 z-[-1]" />
      
      <Noise />
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0"><div className="blob blob-1"/><div className="blob blob-2"/><div className="blob blob-3"/></div>

      {/* ── HERO ── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 relative z-10 min-h-[70vh] flex items-center pb-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-center w-full">

          <motion.div variants={containerV} initial="hidden" animate="visible" className="space-y-8 lg:space-y-10">
            
            {/* BADGE */}
            <motion.div variants={itemV} className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              <span className="text-sm font-medium text-slate-300">Available for freelance & full-time</span>
            </motion.div>

            {/* HEADLINES */}
            <motion.div variants={itemV} className="flex flex-col gap-0">
              <h1 className="hero-headline text-white leading-none">Designing</h1>
              <h1 className="hero-headline hero-headline--accent leading-none">Experiences</h1><br></br>
              <h2 className="hype text-white leading-none">That Inspire & Convert</h2>
            </motion.div>

            {/* SUBTEXT LIST */}
            <motion.div variants={itemV} className="font-mono text-sm lg:text-base text-slate-400 space-y-3 pt-6">
              {[
                "WEB TECH ENTHUSIAST",
                "TURNS IDEAS INTO REALITY",
                "KEEN ON FRONT-END INNOVATIONS",
                "LOVES BUILDING DIGITAL EXPERIENCE",
              ].map((line, i) => (
                <motion.p key={i} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55 + i * 0.09, duration: 0.5 }} className="flex items-start gap-3 group">
                  <span className="text-slate-500 font-bold transition-colors duration-300 text-base leading-none mt-[2px]">&gt;</span>
                  <span className="group-hover:text-white transition-colors duration-300 tracking-[0.15em] font-normal leading-tight">{line}</span>
                </motion.p>
              ))}
            </motion.div>

            {/* TOGGLE BUTTONS */}
            <motion.div variants={itemV} className="flex items-center gap-4 pt-4">
              <button onClick={() => setMode("uiux")} className={`flex items-center gap-3 px-8 py-3.5 rounded-xl font-bold text-base transition-all duration-300 ${mode === "uiux" ? "bg-[#FF9B71] text-[#05080A] shadow-[0_0_30px_rgba(255,155,113,0.3)] hover:scale-105" : "bg-[#0B1110] border border-white/10 text-slate-400 hover:border-[#FF9B71]/50 hover:text-white"}`}>
                <span className="text-xl">◧</span> UI/UX
              </button>
              <button onClick={() => setMode("graphic")} className={`flex items-center gap-3 px-8 py-3.5 rounded-xl font-bold text-base transition-all duration-300 ${mode === "graphic" ? "bg-[#FF9B71] text-[#05080A] shadow-[0_0_30px_rgba(255,155,113,0.3)] hover:scale-105" : "bg-[#111] border border-white/10 text-white hover:border-white/30 hover:bg-[#1a1a1a]"}`}>
                <span className="text-xl">◆</span> Graphic
              </button>
            </motion.div>
          </motion.div>

          {/* RIGHT - HERO CARD */}
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 32 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.85, ease: EASE, delay: 0.2 }} className="relative mt-12 lg:mt-0">
            <FloatTag text="UI/UX Design"  style={{ top: "-5%",  left: "-6%"  }} delay={0.5}/>
            <FloatTag text="Motion"        style={{ top: "15%",  right: "-8%" }} delay={0.9}/>
            <FloatTag text="React Dev"     style={{ bottom: "8%",left: "-6%"  }} delay={1.3}/>

            <AnimatePresence mode="wait">
              <motion.div key={mode} initial={{ opacity: 0, scale: 0.93, rotateY: 14 }} animate={{ opacity: 1, scale: 1, rotateY: 0 }} exit={{ opacity: 0, scale: 0.93, rotateY: -14 }} transition={{ duration: 0.42, ease: EASE }}>
                <HoloCard src={HERO_IMAGES[mode]} alt={mode === "uiux" ? "UI/UX Preview" : "Graphic Design Preview"}/>
              </motion.div>
            </AnimatePresence>

            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-4/5 h-32 rounded-full blur-[60px] pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(255,155,113,0.15), transparent 70%)" }}/>
          </motion.div>
        </div>
      </div>

      <Skills setXp={setXp} />
<ChessPromo />

{/* Terminal at absolute bottom */}
<div className="pb-16 px-6 md:px-12 lg:px-20 max-w-[1400px] mx-auto">
  <TerminalContact />
</div>
    </main>
  );
}
