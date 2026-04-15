import React, { useState, useEffect, useRef } from "react";
import { Chess } from "chess.js";

/* ─── PIXEL ART PIECES ─────────────────────────────────────────────────── */

const PIXEL_SIZE = 2;

function PixelGrid({ pixels, palette }) {
  return (
    <svg viewBox={`0 0 ${pixels[0].length * PIXEL_SIZE} ${pixels.length * PIXEL_SIZE}`} style={{ width: "80%", height: "80%", imageRendering: "pixelated" }}>
      {pixels.map((row, r) =>
        row.map((c, col) =>
          c ? (
            <rect
              key={`${r}-${col}`}
              x={col * PIXEL_SIZE}
              y={r * PIXEL_SIZE}
              width={PIXEL_SIZE}
              height={PIXEL_SIZE}
              fill={palette[c]}
            />
          ) : null
        )
      )}
    </svg>
  );
}

function makePalette(isWhite) {
  if (isWhite) {
    return {
      1: "#1a2a3a", // dark outline
      2: "#ffffff", // bright white highlight
      3: "#d8e8f0", // light fill
      4: "#b0c8d8", // mid tone
      5: "#88a8bc", // shadow
      6: "#607890", // dark accent
    };
  } else {
    return {
      1: "#0a1520", // dark outline
      2: "#8ab0c8", // bright highlight
      3: "#5888a8", // light fill
      4: "#3a6888", // mid tone
      5: "#245070", // shadow
      6: "#143858", // dark accent
    };
  }
}

const PIECE_PIXELS = {
  p: [ [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0], [0,0,0,0,1,3,2,3,4,5,1,0,0,0,0,0], [0,0,0,0,1,2,2,3,4,5,1,0,0,0,0,0], [0,0,0,0,1,3,3,4,5,5,1,0,0,0,0,0], [0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0], [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0], [0,0,0,0,0,1,3,3,4,1,0,0,0,0,0,0], [0,0,0,0,1,3,2,3,4,5,1,0,0,0,0,0], [0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0], [0,0,0,1,3,2,3,3,4,4,5,1,0,0,0,0], [0,0,0,1,3,2,3,3,4,4,5,1,0,0,0,0], [0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0], [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] ],
  r: [ [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], [0,0,1,1,0,1,1,1,1,0,1,1,0,0,0,0], [0,0,1,3,1,3,2,3,4,1,5,1,0,0,0,0], [0,0,1,3,1,3,2,3,4,1,5,1,0,0,0,0], [0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0], [0,0,0,1,3,2,3,3,4,4,5,1,0,0,0,0], [0,0,0,1,3,2,3,3,4,4,5,1,0,0,0,0], [0,0,0,1,3,2,3,3,4,4,5,1,0,0,0,0], [0,0,0,1,3,2,3,3,4,4,5,1,0,0,0,0], [0,0,0,1,3,2,3,3,4,4,5,1,0,0,0,0], [0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0], [0,0,1,3,2,3,3,3,4,4,4,5,1,0,0,0], [0,0,1,3,2,3,3,3,4,4,4,5,1,0,0,0], [0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0], [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] ],
  n: [ [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0], [0,0,0,0,1,2,2,3,4,1,1,0,0,0,0,0], [0,0,0,1,2,2,3,3,4,5,6,1,0,0,0,0], [0,0,1,1,2,2,1,3,4,5,6,1,0,0,0,0], [0,0,1,2,2,3,3,3,4,5,1,0,0,0,0,0], [0,0,1,3,2,3,3,4,5,1,0,0,0,0,0,0], [0,0,1,1,3,3,4,4,5,1,0,0,0,0,0,0], [0,0,0,1,3,3,3,4,5,1,0,0,0,0,0,0], [0,0,0,1,3,3,4,4,5,1,0,0,0,0,0,0], [0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0], [0,0,1,3,2,3,3,3,4,5,1,0,0,0,0,0], [0,0,1,2,2,3,3,3,4,5,1,0,0,0,0,0], [0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] ],
  b: [ [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,1,2,1,0,0,0,0,0,0,0,0], [0,0,0,0,1,2,2,3,1,0,0,0,0,0,0,0], [0,0,0,1,3,1,2,1,4,1,0,0,0,0,0,0], [0,0,0,0,1,2,1,2,4,1,0,0,0,0,0,0], [0,0,0,0,1,2,2,3,4,1,0,0,0,0,0,0], [0,0,0,1,3,2,2,3,4,5,1,0,0,0,0,0], [0,0,0,1,2,2,3,3,4,5,1,0,0,0,0,0], [0,0,0,1,3,2,3,4,5,5,1,0,0,0,0,0], [0,0,0,0,1,3,3,4,5,1,0,0,0,0,0,0], [0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0], [0,0,0,1,3,2,3,3,4,5,1,0,0,0,0,0], [0,0,0,1,2,2,3,3,4,5,1,0,0,0,0,0], [0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] ],
  q: [ [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], [0,0,1,0,0,1,0,1,0,0,1,0,0,1,0,0], [0,0,1,2,1,2,1,2,1,2,1,3,1,3,1,0], [0,0,1,2,3,2,2,2,3,3,4,4,5,1,0,0], [0,0,0,1,2,2,2,3,3,4,4,5,1,0,0,0], [0,0,0,1,2,2,3,3,4,4,5,5,1,0,0,0], [0,0,0,1,2,3,3,3,4,4,5,5,1,0,0,0], [0,0,0,1,3,3,3,3,4,5,5,5,1,0,0,0], [0,0,0,1,3,3,3,4,4,5,5,5,1,0,0,0], [0,0,0,1,3,3,3,4,4,5,5,5,1,0,0,0], [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0], [0,0,1,3,2,2,3,3,4,4,5,5,5,1,0,0], [0,0,1,2,2,3,3,3,4,4,4,5,5,1,0,0], [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0], [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] ],
  k: [ [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0], [0,0,0,0,0,1,2,1,1,0,0,0,0,0,0,0], [0,0,0,1,1,1,2,1,1,1,1,0,0,0,0,0], [0,0,0,1,1,1,2,1,1,1,1,0,0,0,0,0], [0,0,0,0,0,1,2,1,1,0,0,0,0,0,0,0], [0,0,0,1,3,2,3,3,4,5,1,0,0,0,0,0], [0,0,0,1,2,2,3,3,4,5,1,0,0,0,0,0], [0,0,0,1,3,2,3,3,4,5,1,0,0,0,0,0], [0,0,0,1,3,3,3,3,4,5,1,0,0,0,0,0], [0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0], [0,0,1,3,2,3,3,3,4,4,5,1,0,0,0,0], [0,0,1,3,2,3,3,3,4,4,5,1,0,0,0,0], [0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0], [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] ],
};

const Piece = ({ piece }) => {
  if (!piece) return null;
  const isWhite = piece[0] === "w";
  const type = piece[1];
  const pixels = PIECE_PIXELS[type];
  if (!pixels) return null;
  const palette = makePalette(isWhite);
  return <PixelGrid pixels={pixels} palette={palette} />;
};

/* ─── BOARD SQUARE ───────────────────────────────────────────────────── */

function Square({ sq, piece, isLight, isSelected, isLegal, isLastMove, onClick }) {
  // The premium dark slate chess board
  const lightColor = "#334155"; 
  const darkColor = "#0f172a";  

  let bg = isLight ? lightColor : darkColor;
  
  // Peach gold highlight colors
  if (isLastMove) bg = "rgba(255, 183, 94, 0.25)"; 
  if (isSelected) bg = "rgba(255, 144, 104, 0.4)"; 

  return (
    <div
      onClick={() => onClick(sq)}
      style={{
        width: "12.5%",
        paddingBottom: "12.5%",
        position: "relative",
        background: bg,
        cursor: "pointer",
        imageRendering: "pixelated",
        transition: "background 0.2s ease"
      }}
    >
      {isLegal && (
        <div
          style={{
            position: "absolute",
            inset: "35%",
            background: piece ? "rgba(255, 95, 86, 0.6)" : "rgba(255, 183, 94, 0.4)", 
            borderRadius: "50%",
            boxShadow: "0 0 10px rgba(255, 183, 94, 0.3)"
          }}
        />
      )}
      {piece && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Piece piece={piece} />
        </div>
      )}
    </div>
  );
}

/* ─── MAIN GAME ──────────────────────────────────────────────────────── */

export default function ChessGame() {
  const chessRef = useRef(new Chess());
  const chess = chessRef.current;

  const [fen, setFen] = useState(chess.fen());
  const [selected, setSelected] = useState(null);
  const [legalSquares, setLegalSquares] = useState([]);
  const [lastMove, setLastMove] = useState(null);

  const makeMove = (moveData) => {
    try {
      const move = chess.move(moveData);
      if (move) {
        setLastMove({ from: move.from, to: move.to });
        setFen(chess.fen());
        setSelected(null);
        setLegalSquares([]);
        return true;
      }
    } catch {
      return false;
    }
  };

  useEffect(() => {
    if (chess.turn() === "b" && !chess.isGameOver()) {
      const timer = setTimeout(() => {
        const moves = chess.moves();
        if (moves.length) {
          makeMove(moves[Math.floor(Math.random() * moves.length)]);
        }
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [fen]);

  const handleClick = (sq) => {
    if (chess.turn() !== "w") return;

    if (selected && legalSquares.includes(sq)) {
      makeMove({ from: selected, to: sq, promotion: "q" });
    } else {
      const p = chess.get(sq);
      if (p && p.color === "w") {
        setSelected(sq);
        setLegalSquares(chess.moves({ square: sq, verbose: true }).map((m) => m.to));
      } else {
        setSelected(null);
        setLegalSquares([]);
      }
    }
  };

  return (
    <main 
      className="relative min-h-screen pt-28 pb-16 flex flex-col items-center justify-center overflow-hidden"
      style={{
        /* YOUR ORIGINAL RETRO DOTTED GRID BACKGROUND */
        background: "#121212",
        backgroundImage: "radial-gradient(#1a331a 0.5px, transparent 0.5px)",
        backgroundSize: "4px 4px",
      }}
    >
      <div className="relative z-10 flex flex-col items-center w-full max-w-lg px-4">
        
        {/* Title */}
        <h1 className="text-2xl font-black mb-6 tracking-[0.2em] uppercase bg-gradient-to-r from-[#FF9068] to-[#FFB75E] bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(255,144,104,0.2)]">
          ★ Play Queen's Gambit ★
        </h1>

        {/* Glassmorphism Game Container */}
        <div className="bg-[rgba(255,255,255,0.03)] border border-white/10 p-4 sm:p-6 rounded-2xl backdrop-blur-[12px] shadow-[0_15px_40px_rgba(0,0,0,0.5)] w-full">
          
          {/* Status bar */}
          <div className="bg-black/40 border border-white/10 rounded-lg py-2 px-4 mb-5 text-center text-xs tracking-widest uppercase font-mono shadow-inner">
            <span style={{ color: chess.isGameOver() ? "#FF5F56" : chess.turn() === "w" ? "#FFB75E" : "#94A3B8" }}>
              {chess.isGameOver()
                ? "[ GAME OVER ]"
                : chess.turn() === "w"
                ? "▶ YOUR TURN"
                : "⚙ CPU THINKING..."}
            </span>
          </div>

          {/* Board Container */}
          <div className="w-full aspect-square flex flex-wrap border border-white/10 rounded overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.6)]">
            {[8, 7, 6, 5, 4, 3, 2, 1].map((rank) =>
              ["a", "b", "c", "d", "e", "f", "g", "h"].map((file) => {
                const sq = `${file}${rank}`;
                const p = chess.get(sq);
                return (
                  <Square
                    key={sq}
                    sq={sq}
                    piece={p ? `${p.color}${p.type}` : null}
                    isLight={(file.charCodeAt(0) - 97 + rank) % 2 === 1}
                    isSelected={selected === sq}
                    isLegal={legalSquares.includes(sq)}
                    isLastMove={lastMove?.from === sq || lastMove?.to === sq}
                    onClick={handleClick}
                  />
                );
              })
            )}
          </div>

          {/* Restart Button */}
          <button
            onClick={() => {
              chess.reset();
              setFen(chess.fen());
              setSelected(null);
              setLegalSquares([]);
              setLastMove(null);
            }}
            className="w-full mt-5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#FFB75E]/50 text-[#CBD5E1] hover:text-[#FFB75E] py-3 rounded-lg font-mono text-xs tracking-widest uppercase transition-all duration-300 shadow-sm"
          >
            ↺ Restart Match
          </button>
        </div>
      </div>
    </main>
  );
}