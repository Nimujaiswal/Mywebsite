import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Header from "./components/Header.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Projects from "./pages/Projects.jsx";
import Motion from "./pages/Motion.jsx";
import Video from "./pages/Video.jsx";
import ChessGame from "./pages/ChessGame.jsx";
import "./index.css";

export default function App() {
  const location = useLocation();

  return (
    <>
      <Header />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/video" element={<Video />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/motion" element={<Motion />} />
          <Route path="/about" element={<About />} />
          <Route path="/chess" element={<ChessGame />} />
          </Routes>
      </AnimatePresence>
    </>
  );
}
