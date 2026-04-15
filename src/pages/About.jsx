import React from "react";
import { motion } from "framer-motion";

export default function About() {
  const [linkHovered, setLinkHovered] = React.useState(null);
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== "undefined" ? window.innerWidth : 1280
  );

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth <= 768;
  const isTablet = windowWidth > 768 && windowWidth <= 1200;
  const isResponsive = isMobile || isTablet;

  /* ── .about-section ── */
  const sectionStyle = {
    position: "relative",
    minHeight: "100vh",
    backgroundImage: "url('/images/OverallBG.jpg')",
    backgroundSize: "cover",
    color: "#E2E8F0", // Updated to a crisper slate-white
    display: "flex",
    alignItems: "center",
    padding: isMobile ? "30px 15px" : "60px 20px",
  };

  /* ── .about-overlay ── */
  const overlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(10, 10, 10, 0.75)", // Deepened the tint for better contrast
    zIndex: 1,
  };

  /* ── .about-container ── */
  const containerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "40px",
    maxWidth: "1200px",
    margin: "0 auto",
    position: "relative",   // ← behance strip is absolute inside this
    zIndex: 2,
    flexWrap: "wrap",
    width: "100%",
    ...(isResponsive && {
      flexDirection: "column",
      textAlign: "center",
    }),
  };

  /* ── .about-text ── */
  const textStyle = {
    flex: 1,
    minWidth: "300px",
    ...(isResponsive && {
      order: -1,
      width: "100%",
    }),
    ...(isMobile && {
      marginTop: "40px",
    }),
  };

  /* ── .about-text h1 ── */
  const h1Style = {
    fontSize: isMobile ? "2.2rem" : "clamp(2rem, 5vw, 2.8rem)",
    marginBottom: "20px",
  };

  /* ── .highlight ── */
  const highlightStyle = { 
    // Replaced solid green with the premium illustration-matched gradient
    background: "linear-gradient(90deg, #FF512F 0%, #F09819 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textShadow: "0px 10px 30px rgba(255, 81, 47, 0.3)", // Added ambient glow
    display: "inline-block" // Required for text-gradients to render correctly
  };

  /* ── .about-text p ── */
  const paragraphStyle = {
    fontSize: "clamp(1rem, 2vw, 1.1rem)",
    marginBottom: "16px",
    lineHeight: "1.6",
    color: "#CBD5E1", // Softened paragraph color to make the white text pop
  };

  /* ── .social-links ── */
  const socialLinksStyle = {
    marginTop: "20px",
    display: "flex",
    gap: isMobile ? "8px" : "12px",
    flexWrap: "nowrap",   // Prevent LinkedIn from moving down
    justifyContent: isMobile ? "center" : "flex-start",
    paddingLeft: "0px",   // REMOVE large padding issue
    width: "100%",
  };

  /* ── .social-links a (base) ── */
  const linkBase = {
    padding: "10px 16px",
    border: "1px solid rgba(255, 255, 255, 0.1)", // Replaced 2px solid green with subtle glass border
    borderRadius: "8px",
    textDecoration: "none",
    background: "rgba(255, 255, 255, 0.03)", // Barely-there glass background
    backdropFilter: "blur(12px)", // The frosted glass effect
    WebkitBackdropFilter: "blur(12px)",
    color: "#FFFFFF", // Clean white text
    fontWeight: 600,
    transition: "all 0.3s ease",
    cursor: "pointer",
  };

  /* ── .social-links a:hover ── */
  const linkHoverStyle = {
    ...linkBase,
    background: "rgba(255, 255, 255, 0.1)", // Brighter glass on hover
    border: "1px solid rgba(255, 255, 255, 0.3)", // Stronger edge reflection
    color: "#F09819", // Subtle gradient match on text hover
    boxShadow: "0 0 20px rgba(240, 152, 25, 0.2)", // Warm ambient glow on hover
  };

  /* ── .about-image ── */
  const imageStyle = {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    position: "relative",
    zIndex: -1,
    ...(isResponsive && {
      order: 0,
      marginBottom: "20px",
    }),
    ...(isMobile && {
      marginTop: "-50px",
      marginBottom: "0px",
    }),
  };

  /* ── .about-image img ── */
  const imgStyle = {
    maxWidth: isMobile ? "300px" : "425px",
    width: "100%",
    borderRadius: "20px",
  };

  /* ── .behance-skills ── exact values from your CSS per breakpoint ── */
  const behanceSkillsStyle = {
    position: "absolute",
    bottom: isMobile ? "40px" : isTablet ? "40px" : "-65px",
    left: isMobile ? "0" : isTablet ? "-166px" : "-0",
    width: "111%",
    zIndex: -1,
    overflow: "hidden",
    display: "flex",
    justifyContent: "flex-end",
  };

  /* ── .behance-skills img ── */
  const behanceImgStyle = {
    width: isMobile ? "398px" : "1277px",
    maxWidth: "none",
    height: "auto",
    opacity: 1,
    objectFit: "cover",
  };

  const links = [
    { href: "https://own.page/nimesh", label: "Profile" },
    { href: "https://www.behance.net/nimeshjaiswal", label: "Behance" },
    { href: "https://www.linkedin.com/in/nimesh-jaiswal/", label: "LinkedIn" },
  ];

  return (
    <motion.main
      style={sectionStyle}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6 }}
    >
      <div style={overlayStyle} />

      <div style={containerStyle}>

        {/* LEFT — TEXT */}
        <div style={textStyle}>
          <h1 style={h1Style}>
            Hi, I'm <span style={highlightStyle}>Nimesh Jaiswal</span>
          </h1>
          <p style={paragraphStyle}>
            I'm a <strong style={{color: "#FFF"}}>UI/UX Designer</strong> and{" "}
            <strong style={{color: "#FFF"}}>Front-End Developer</strong> who transforms ideas into
            interactive and impactful digital experiences. I bring designs to
            life with clean, responsive code and craft user journeys that feel
            effortless.
          </p>
          <p style={paragraphStyle}>
            With expertise in <strong style={{color: "#FFF"}}>Figma</strong>,{" "}
            <strong style={{color: "#FFF"}}>Adobe Creative Suite</strong>, and modern web technologies
            like <strong style={{color: "#FFF"}}>React.js</strong> and <strong style={{color: "#FFF"}}>Node.js</strong>, I
            thrive in dynamic, fast-paced environments — especially startups.
          </p>

          <div style={socialLinksStyle}>
            {links.map(({ href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                style={linkHovered === label ? linkHoverStyle : linkBase}
                onMouseEnter={() => setLinkHovered(label)}
                onMouseLeave={() => setLinkHovered(null)}
              >
                {label}
              </a>
            ))}
          </div>

          <div style={{ color: "#A0AEC0" }}><br></br>
            <h3>📧 nimeshjaiswal884@gmail.com</h3>
            <h3>📞 +91 8169065601</h3>
          </div>
        </div>

        {/* RIGHT — IMAGE */}
        <div style={imageStyle}>
          <img src="/images/Nimu.png" alt="Nimesh Jaiswal" style={imgStyle} />
        </div>

        {/* BEHANCE STRIP — absolute inside .about-container, exactly as original */}
        <div style={behanceSkillsStyle}>
          <img
            src="/images/behance.png"
            alt="Adobe Creative Suite and Figma icons"
            style={behanceImgStyle}
          />
        </div>

      </div>
    </motion.main>
  );
}