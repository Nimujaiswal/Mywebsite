import React, { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when clicking a link on mobile
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="fixed top-0 inset-x-0 h-20 bg-[rgba(10,10,10,0.6)] border-b border-white/5 z-50 flex items-center justify-between px-6 sm:px-12 backdrop-blur-xl transition-all duration-300">
      
      {/* ===================== */}
      {/* LOGO */}
      {/* ===================== */}
      <NavLink
        to="/"
        onClick={closeMenu}
        className="font-black uppercase tracking-widest text-2xl text-white hover:scale-105 transition-transform origin-left"
      >
        Nimesh
      </NavLink>

      {/* ===================== */}
      {/* MOBILE TOGGLE BUTTON */}
      {/* ===================== */}
      <button
        className="md:hidden flex items-center justify-center w-10 h-10 text-slate-300 hover:text-white transition-colors z-50"
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-300 ${isMenuOpen ? "rotate-90" : "rotate-0"}`}
        >
          {isMenuOpen ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            <>
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </>
          )}
        </svg>
      </button>

      {/* ===================== */}
      {/* DESKTOP NAVIGATION */}
      {/* ===================== */}
      <nav className="hidden md:flex gap-8 items-center">
        {[
          { path: "/", label: "Home", end: true },
          { path: "/video", label: "Video" },
          { path: "/projects", label: "Projects" },
          { path: "/about", label: "About" },
        ].map((link) => (
          <NavLink
            key={link.label}
            end={link.end}
            to={link.path}
            className={({ isActive }) =>
              `text-sm font-semibold tracking-wide transition-all duration-300 ${
                isActive
                  ? "text-[#FFB75E] drop-shadow-[0_0_10px_rgba(255,183,94,0.4)]"
                  : "text-slate-300 hover:text-white"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* ===================== */}
      {/* MOBILE NAVIGATION */}
      {/* ===================== */}
      <nav
        className={`fixed top-20 right-0 w-full max-w-sm h-screen md:hidden flex flex-col items-center gap-2 pt-8 pb-8 bg-[rgba(15,15,15,0.95)] backdrop-blur-2xl border-l border-white/5 transform transition-transform duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] z-40 shadow-2xl ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="w-full px-6 flex flex-col gap-2">
          {[
            { path: "/", label: "Home", end: true },
            { path: "/video", label: "Video" },
            { path: "/projects", label: "Projects" },
            { path: "/about", label: "About" },
          ].map((link) => (
            <NavLink
              key={link.label}
              end={link.end}
              to={link.path}
              onClick={closeMenu}
              className={({ isActive }) =>
                `w-full text-center py-4 text-lg font-medium tracking-wide rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-[rgba(255,183,94,0.1)] text-[#FFB75E] font-bold"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Mobile Overlay Background */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 top-20 bg-black/60 backdrop-blur-sm md:hidden z-30 transition-opacity duration-300"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </header>
  );
}