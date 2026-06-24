import { useState, useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";

interface StorefrontOverlayProps {
  isOpen: boolean;
  onOpen: () => void;
  onOpenComplete: () => void;
}

export default function StorefrontOverlay({
  isOpen,
  onOpen,
  onOpenComplete,
}: StorefrontOverlayProps) {
  const [isRendered, setIsRendered] = useState(true);

  const handleStepInside = () => {
    if (isOpen) return;
    onOpen();
  };

  // Use a ref for onOpenComplete so the effect doesn't re-fire on every render
  const onOpenCompleteRef = useRef(onOpenComplete);
  onOpenCompleteRef.current = onOpenComplete;

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsRendered(false);
        onOpenCompleteRef.current();
      }, 850); // match transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isRendered) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes gold-shimmer-anim {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .gold-text-shimmer {
          background: linear-gradient(90deg, #b8860b 0%, #e6ca65 25%, #996515 50%, #e6ca65 75%, #b8860b 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gold-shimmer-anim 6s linear infinite;
          text-shadow: 0 1px 4px rgba(212,175,55,0.25);
        }
        .pulse-glow {
          box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.45);
          animation: pulse-glow-anim 2.5s infinite;
        }
        @keyframes pulse-glow-anim {
          0% {
            box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.5);
          }
          70% {
            box-shadow: 0 0 0 15px rgba(212, 175, 55, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(212, 175, 55, 0);
          }
        }
        .sidelight-glare::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 100%);
          pointer-events: none;
        }
        @keyframes wall-glow-pulse {
          0%, 100% {
            opacity: 0.65;
            transform: scale(0.96);
          }
          50% {
            opacity: 0.85;
            transform: scale(1.03);
          }
        }
        @keyframes light-cone-pulse {
          0%, 100% {
            opacity: 0.75;
            transform: scaleY(0.96) scaleX(0.98);
          }
          50% {
            opacity: 0.95;
            transform: scaleY(1.04) scaleX(1.02);
          }
        }
        @keyframes ambient-wall-shimmer {
          0%, 100% {
            opacity: 0.75;
          }
          50% {
            opacity: 0.95;
          }
        }
      `}} />
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden transition-all duration-[0.8s] ease-in-out select-none ${
          isOpen ? "opacity-0 scale-[1.12] pointer-events-none" : "opacity-100 scale-100"
        }`}
        style={{
          background: `
            radial-gradient(circle at 50% 50%, rgba(255, 240, 230, 0.25) 0%, rgba(0, 0, 0, 0.45) 100%),
            url('/marble_wall.png')
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Animated Ambient Wall Shimmer Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: "radial-gradient(circle at 50% 30%, rgba(255, 248, 240, 0.3) 0%, rgba(255, 255, 255, 0) 80%)",
            animation: "ambient-wall-shimmer 8s ease-in-out infinite",
          }}
        />

        {/* --- LUXURY MARBLE FLOOR WITH GOLD PATTERN --- */}
        <div
          className={`absolute bottom-0 inset-x-0 h-[15vh] border-t-2 border-[#d4af37]/45 transition-all duration-[0.8s] ease-in-out ${
            isOpen ? "translate-y-full opacity-0" : "translate-y-0 opacity-100"
          }`}
          style={{
            backgroundImage: `
              radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.9), transparent 75%),
              url('/marble_wall.png')
            `,
            backgroundSize: "cover",
            backgroundPosition: "center bottom",
          }}
        >
          {/* Geometric gold lines on the floor */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-85">
            <svg className="w-full h-full" width="100%" height="100%">
              <path
                d="M 0,25 L 2000,25 M 0,45 L 2000,45"
                stroke="url(#gold-floor-gradient)"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M 120,25 L 180,45 M 420,25 L 480,45 M 720,25 L 780,45 M 1020,25 L 1080,45 M 1320,25 L 1380,45 M 1620,25 L 1680,45"
                stroke="url(#gold-floor-gradient)"
                strokeWidth="1.2"
                fill="none"
              />
              <defs>
                <linearGradient id="gold-floor-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#b76e79" />
                  <stop offset="50%" stopColor="#ffd1dc" />
                  <stop offset="100%" stopColor="#d4af37" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* --- LEFT LIGHTING SCONCE --- */}
        <div className="absolute left-[3%] sm:left-[8%] xl:left-[12%] top-[25%] flex flex-col items-center z-20">
          {/* Warm cone of light casting down */}
          <div 
            className="absolute -top-10 w-44 h-64 blur-md pointer-events-none opacity-85"
            style={{
              background: "linear-gradient(to bottom, rgba(255, 235, 204, 0.45) 0%, rgba(255, 235, 204, 0) 80%)",
              clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
              animation: "light-cone-pulse 4s ease-in-out infinite",
              transformOrigin: "top center"
            }}
          />
          {/* Wall light glow circle */}
          <div 
            className="absolute -top-16 w-36 h-36 rounded-full blur-md pointer-events-none opacity-80"
            style={{
              background: "radial-gradient(circle, rgba(255, 227, 209, 0.75) 0%, rgba(255, 227, 209, 0) 70%)",
              animation: "wall-glow-pulse 4s ease-in-out infinite"
            }}
          />
          {/* White fabric tapered shade */}
          <div className="w-12 h-14 bg-gradient-to-b from-[#ffffff] to-[#f4ede6] border border-[#d4af37]/35 rounded-t-sm shadow-lg flex items-end justify-center relative z-10">
            <div className="w-9 h-px bg-[#ffd1dc]/70" />
          </div>
          {/* Ornate Gold bracket stem */}
          <div className="w-2 h-14 bg-gradient-to-b from-[#d4af37] via-[#ffd1dc] to-[#b76e79] rounded-b-md shadow-md -mt-0.5" />
          {/* Circular Gold wall mount plate */}
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#ffd700] to-[#b76e79] border border-[#d4af37]/50 shadow-md -mt-7 z-0" />
        </div>

        {/* --- RIGHT LIGHTING SCONCE --- */}
        <div className="absolute right-[3%] sm:right-[8%] xl:right-[12%] top-[25%] flex flex-col items-center z-20">
          {/* Warm cone of light casting down */}
          <div 
            className="absolute -top-10 w-44 h-64 blur-md pointer-events-none opacity-85"
            style={{
              background: "linear-gradient(to bottom, rgba(255, 235, 204, 0.45) 0%, rgba(255, 235, 204, 0) 80%)",
              clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
              animation: "light-cone-pulse 4s ease-in-out infinite",
              transformOrigin: "top center"
            }}
          />
          {/* Wall light glow circle */}
          <div 
            className="absolute -top-16 w-36 h-36 rounded-full blur-md pointer-events-none opacity-80"
            style={{
              background: "radial-gradient(circle, rgba(255, 227, 209, 0.75) 0%, rgba(255, 227, 209, 0) 70%)",
              animation: "wall-glow-pulse 4s ease-in-out infinite"
            }}
          />
          {/* White fabric tapered shade */}
          <div className="w-12 h-14 bg-gradient-to-b from-[#ffffff] to-[#f4ede6] border border-[#d4af37]/35 rounded-t-sm shadow-lg flex items-end justify-center relative z-10">
            <div className="w-9 h-px bg-[#ffd1dc]/70" />
          </div>
          {/* Ornate Gold bracket stem */}
          <div className="w-2 h-14 bg-gradient-to-b from-[#d4af37] via-[#ffd1dc] to-[#b76e79] rounded-b-md shadow-md -mt-0.5" />
          {/* Circular Gold wall mount plate */}
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#ffd700] to-[#b76e79] border border-[#d4af37]/50 shadow-md -mt-7 z-0" />
        </div>

        {/* --- CENTRAL PORTAL CONTAINER --- */}
        <div
          className={`relative w-full max-w-[580px] h-[88vh] flex flex-col justify-end items-center transition-all duration-[0.8s] ease-in-out ${
            isOpen ? "scale-[1.18] opacity-0" : "scale-100 opacity-100"
          }`}
          style={{
            perspective: "1200px",
            transformStyle: "preserve-3d",
          }}
        >
          {/* WHITE MARBLE ARCH ARCHWAY HEADER (surrounds the transom window) */}
          <div className="absolute top-[7vh] inset-x-0 h-[24vh] border-t-8 border-x-8 border-t-[#faecee] border-x-[#faecee] rounded-t-full bg-transparent pointer-events-none z-20 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
            {/* Inner Gold trim line */}
            <div className="w-full h-full border-t border-x border-[#d4af37]/45 rounded-t-full" />
          </div>

          {/* --- TRANSOM ARCH WINDOW (above doors) --- */}
          <div
            className="absolute top-[8vh] inset-x-1.5 h-[23vh] rounded-t-full overflow-hidden flex flex-col items-center justify-center border-b border-[#d4af37]/45 z-15 shadow-[inset_0_2px_10px_rgba(0,0,0,0.15)]"
            style={{
              background: "linear-gradient(to bottom, #fbc5cb 0%, #e89ca9 45%, #20080d 100%)",
              boxShadow: "0 -2px 20px rgba(255, 191, 163, 0.35)"
            }}
          >
            {/* Sunburst Grille and Arched Text in SVG */}
            <div className="absolute inset-0 z-10 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 50">
                {/* Sunburst lines */}
                <path d="M 50,50 L 12,5" stroke="#d4af37" strokeWidth="0.4" opacity="0.45" />
                <path d="M 50,50 L 31,1" stroke="#d4af37" strokeWidth="0.4" opacity="0.45" />
                <path d="M 50,50 L 50,0" stroke="#d4af37" strokeWidth="0.4" opacity="0.45" />
                <path d="M 50,50 L 69,1" stroke="#d4af37" strokeWidth="0.4" opacity="0.45" />
                <path d="M 50,50 L 88,5" stroke="#d4af37" strokeWidth="0.4" opacity="0.45" />
                <circle cx="50" cy="50" r="44" stroke="#d4af37" strokeWidth="0.7" fill="none" opacity="0.5" />
                <circle cx="50" cy="50" r="32" stroke="#d4af37" strokeWidth="0.5" fill="none" opacity="0.4" />
                
                {/* Curve path for the text */}
                <path id="archTextPath" d="M 16,42 A 34,34 0 0,1 84,42" fill="none" />
              </svg>
            </div>

            {/* Transom Branding Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-15 mt-3.5">
              <svg className="w-full h-full" viewBox="0 0 100 50" fill="currentColor">
                {/* Arched Text using SVG textPath */}
                <text className="font-display fill-[#d4af37] text-[4.2px] tracking-[0.25em] font-semibold uppercase">
                  <textPath href="#archTextPath" startOffset="50%" textAnchor="middle">
                    Grace And Go
                  </textPath>
                </text>
                {/* Straight Text */}
                <text x="50" y="32" textAnchor="middle" className="font-display fill-[#ffd1dc] text-[2.2px] tracking-[0.35em] uppercase font-bold">
                  Salon
                </text>
                {/* Gold flourish design under Salon */}
                <path d="M 40,36 Q 50,34 60,36 M 44,38 Q 50,36 56,38" fill="none" stroke="#d4af37" strokeWidth="0.3" opacity="0.8" />
                <circle cx="50" cy="35" r="0.4" fill="#d4af37" />
              </svg>
            </div>
          </div>

          {/* LEFT TRANSOM WINDOW */}
          <div className="absolute -left-[114px] top-[14vh] w-[114px] h-[17vh] hidden sm:block border-4 border-[#faecee] bg-gradient-to-b from-[#ffeef0] to-[#1c0c0e]/30 overflow-hidden z-10 shadow-md">
            <svg className="w-full h-full" viewBox="0 0 100 50">
              <path d="M 0,25 L 100,25 M 33,0 L 33,50 M 66,0 L 66,50" stroke="#d4af37" strokeWidth="0.8" />
            </svg>
            <div className="absolute inset-1.5 border border-[#d4af37]/40 pointer-events-none" />
          </div>

          {/* RIGHT TRANSOM WINDOW */}
          <div className="absolute -right-[114px] top-[14vh] w-[114px] h-[17vh] hidden sm:block border-4 border-[#faecee] bg-gradient-to-b from-[#ffeef0] to-[#1c0c0e]/30 overflow-hidden z-10 shadow-md">
            <svg className="w-full h-full" viewBox="0 0 100 50">
              <path d="M 0,25 L 100,25 M 33,0 L 33,50 M 66,0 L 66,50" stroke="#d4af37" strokeWidth="0.8" />
            </svg>
            <div className="absolute inset-1.5 border border-[#d4af37]/40 pointer-events-none" />
          </div>

          {/* LEFT PILLAR */}
          <div className="absolute -left-[36px] bottom-0 w-[36px] h-[57vh] hidden sm:block bg-[#faecee] border-l border-t border-[#d4af37]/30 z-15 shadow-md">
            {/* Pillar fluting lines */}
            <div className="absolute inset-y-0 left-2 w-px bg-[#d4af37]/20" />
            <div className="absolute inset-y-0 left-4 w-px bg-[#d4af37]/20" />
            <div className="absolute inset-y-0 right-4 w-px bg-[#d4af37]/20" />
            <div className="absolute inset-y-0 right-2 w-px bg-[#d4af37]/20" />
            {/* Gold capital at top */}
            <div className="absolute top-0 inset-x-[-2px] h-[24px] bg-gradient-to-b from-[#ffd700] to-[#b76e79] border border-[#d4af37]/70 shadow-sm" />
            {/* Base at bottom */}
            <div className="absolute bottom-0 inset-x-[-2px] h-[30px] bg-[#faecee] border-t border-x border-[#d4af37]/45" />
          </div>

          {/* RIGHT PILLAR */}
          <div className="absolute -right-[36px] bottom-0 w-[36px] h-[57vh] hidden sm:block bg-[#faecee] border-r border-t border-[#d4af37]/30 z-15 shadow-md">
            {/* Pillar fluting lines */}
            <div className="absolute inset-y-0 left-2 w-px bg-[#d4af37]/20" />
            <div className="absolute inset-y-0 left-4 w-px bg-[#d4af37]/20" />
            <div className="absolute inset-y-0 right-4 w-px bg-[#d4af37]/20" />
            <div className="absolute inset-y-0 right-2 w-px bg-[#d4af37]/20" />
            {/* Gold capital at top */}
            <div className="absolute top-0 inset-x-[-2px] h-[24px] bg-gradient-to-b from-[#ffd700] to-[#b76e79] border border-[#d4af37]/70 shadow-sm" />
            {/* Base at bottom */}
            <div className="absolute bottom-0 inset-x-[-2px] h-[30px] bg-[#faecee] border-t border-x border-[#d4af37]/45" />
          </div>

          {/* --- LEFT SIDELIGHT WINDOW (showing empty salon interior) --- */}
          <div
            className="absolute -left-[114px] bottom-0 w-[78px] h-[57vh] hidden sm:block border-t-4 border-x-4 border-t-[#faecee] border-x-[#faecee] overflow-hidden sidelight-glare z-10 shadow-lg"
            style={{
              backgroundImage: "url('/salon_interior_empty.png')",
              backgroundSize: "cover",
              backgroundPosition: "left center",
              boxShadow: "0 0 20px rgba(255,191,163,0.15)"
            }}
          >
            {/* Diamond leaded glass overlay */}
            <div className="absolute inset-0 opacity-40">
              <svg className="w-full h-full" width="100%" height="100%">
                <pattern id="diamonds-left" width="18" height="36" patternUnits="userSpaceOnUse">
                  <path d="M 9 0 L 18 18 L 9 36 L 0 18 Z" fill="none" stroke="#ffd700" strokeWidth="0.75" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#diamonds-left)" />
              </svg>
            </div>
            {/* Inner gold molding frame */}
            <div className="absolute inset-1.5 border border-[#d4af37]/45 pointer-events-none" />
          </div>

          {/* --- RIGHT SIDELIGHT WINDOW (showing empty salon interior) --- */}
          <div
            className="absolute -right-[114px] bottom-0 w-[78px] h-[57vh] hidden sm:block border-t-4 border-x-4 border-t-[#faecee] border-x-[#faecee] overflow-hidden sidelight-glare z-10 shadow-lg"
            style={{
              backgroundImage: "url('/salon_interior_empty.png')",
              backgroundSize: "cover",
              backgroundPosition: "right center",
              boxShadow: "0 0 20px rgba(255,191,163,0.15)"
            }}
          >
            {/* Diamond leaded glass overlay */}
            <div className="absolute inset-0 opacity-40">
              <svg className="w-full h-full" width="100%" height="100%">
                <pattern id="diamonds-right" width="18" height="36" patternUnits="userSpaceOnUse">
                  <path d="M 9 0 L 18 18 L 9 36 L 0 18 Z" fill="none" stroke="#ffd700" strokeWidth="0.75" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#diamonds-right)" />
              </svg>
            </div>
            {/* Inner gold molding frame */}
            <div className="absolute inset-1.5 border border-[#d4af37]/45 pointer-events-none" />
          </div>

          {/* --- DOUBLE DOORS FRAME & PANEL --- */}
          <div
            className="relative w-full h-[57vh] flex bg-black/5 border-t-4 border-[#faecee] z-10"
            style={{
              perspective: "1200px",
              transformStyle: "preserve-3d",
            }}
          >
            {/* LEFT DOOR */}
            <div
              className="w-1/2 h-full border-r border-[#b76e79]/30 relative p-3 flex flex-col justify-between items-end transition-transform duration-[0.8s] ease-[cubic-bezier(0.2,0.85,0.25,1)]"
              style={{
                transformOrigin: "left center",
                transform: isOpen ? "rotateY(-110deg)" : "rotateY(0deg)",
                boxShadow: "inset -2px 0 12px rgba(0,0,0,0.35), 5px 0 25px rgba(0,0,0,0.15)",
                background: "linear-gradient(135deg, #f5b0bc 0%, #eb97a7 50%, #d47787 100%)"
              }}
            >
              {/* Upper Ornate Glass/Gold Reflection Panel */}
              <div 
                className="w-[88%] h-[64%] border-2 border-[#d4af37] rounded-xs relative flex items-center justify-center shadow-inner overflow-hidden"
                style={{
                  backgroundImage: "linear-gradient(rgba(255, 192, 203, 0.1), rgba(183, 110, 121, 0.3)), url('/salon_interior_empty.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "left center"
                }}
              >
                {/* Gold inner panel border */}
                <div className="absolute inset-1 border border-[#d4af37]/50 rounded-xs" />
                {/* Gold Baroque corner designs inside the upper panel */}
                <svg className="absolute top-1.5 left-1.5 w-5 h-5 text-[#ffd700]/75" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M 0 0 C 4 0, 4 4, 4 8 C 4 4, 8 4, 8 0 Z" />
                </svg>
                <svg className="absolute top-1.5 right-1.5 w-5 h-5 text-[#ffd700]/75 scale-x-[-1]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M 0 0 C 4 0, 4 4, 4 8 C 4 4, 8 4, 8 0 Z" />
                </svg>
                <svg className="absolute bottom-1.5 left-1.5 w-5 h-5 text-[#ffd700]/75 scale-y-[-1]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M 0 0 C 4 0, 4 4, 4 8 C 4 4, 8 4, 8 0 Z" />
                </svg>
                <svg className="absolute bottom-1.5 right-1.5 w-5 h-5 text-[#ffd700]/75 scale-x-[-1] scale-y-[-1]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M 0 0 C 4 0, 4 4, 4 8 C 4 4, 8 4, 8 0 Z" />
                </svg>
              </div>

              {/* Lower Ornate Gold Panel Molding */}
              <div className="w-[88%] h-[26%] border border-[#d4af37] bg-gradient-to-br from-[#ffd3db]/20 to-[#e593a2]/20 rounded-xs relative p-1 flex items-center justify-center shadow-inner">
                <div className="absolute inset-1 border border-[#d4af37]/65 rounded-xs" />
                {/* Geometric gold lines in lower panel */}
                <div className="w-[80%] h-[60%] border border-[#d4af37]/45 rounded-xs opacity-65 flex items-center justify-center">
                  <div className="w-[80%] h-[50%] border border-[#d4af37]/30 rounded-xs" />
                </div>
              </div>

              {/* Vertical Door Handle (Gold) */}
              <div className="absolute right-2.5 top-[52%] -translate-y-1/2 w-3 h-[18vh] bg-gradient-to-b from-[#ffd1dc] via-[#d4af37] to-[#b76e79] border border-[#b76e79]/50 rounded-full shadow-md z-20 flex flex-col justify-between items-center py-3">
                <div className="w-2 h-2 rounded-full bg-[#ffd700] border border-[#ffffff]/70 shadow-sm" />
                <div className="w-1.5 h-10 bg-black/15 rounded-full" />
                <div className="w-2 h-2 rounded-full bg-[#ffd700] border border-[#ffffff]/70 shadow-sm" />
              </div>
            </div>

            {/* RIGHT DOOR */}
            <div
              className="w-1/2 h-full border-l border-[#b76e79]/30 relative p-3 flex flex-col justify-between items-start transition-transform duration-[0.8s] ease-[cubic-bezier(0.2,0.85,0.25,1)]"
              style={{
                transformOrigin: "right center",
                transform: isOpen ? "rotateY(110deg)" : "rotateY(0deg)",
                boxShadow: "inset 2px 0 12px rgba(0,0,0,0.35), -5px 0 25px rgba(0,0,0,0.15)",
                background: "linear-gradient(135deg, #f5b0bc 0%, #eb97a7 50%, #d47787 100%)"
              }}
            >
              {/* Upper Ornate Glass/Gold Reflection Panel */}
              <div 
                className="w-[88%] h-[64%] border-2 border-[#d4af37] rounded-xs relative flex items-center justify-center shadow-inner overflow-hidden"
                style={{
                  backgroundImage: "linear-gradient(rgba(255, 192, 203, 0.1), rgba(183, 110, 121, 0.3)), url('/salon_interior_empty.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "right center"
                }}
              >
                {/* Gold inner panel border */}
                <div className="absolute inset-1 border border-[#d4af37]/50 rounded-xs" />
                {/* Gold Baroque corner designs inside the upper panel */}
                <svg className="absolute top-1.5 left-1.5 w-5 h-5 text-[#ffd700]/75" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M 0 0 C 4 0, 4 4, 4 8 C 4 4, 8 4, 8 0 Z" />
                </svg>
                <svg className="absolute top-1.5 right-1.5 w-5 h-5 text-[#ffd700]/75 scale-x-[-1]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M 0 0 C 4 0, 4 4, 4 8 C 4 4, 8 4, 8 0 Z" />
                </svg>
                <svg className="absolute bottom-1.5 left-1.5 w-5 h-5 text-[#ffd700]/75 scale-y-[-1]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M 0 0 C 4 0, 4 4, 4 8 C 4 4, 8 4, 8 0 Z" />
                </svg>
                <svg className="absolute bottom-1.5 right-1.5 w-5 h-5 text-[#ffd700]/75 scale-x-[-1] scale-y-[-1]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M 0 0 C 4 0, 4 4, 4 8 C 4 4, 8 4, 8 0 Z" />
                </svg>
              </div>

              {/* Lower Ornate Gold Panel Molding */}
              <div className="w-[88%] h-[26%] border border-[#d4af37] bg-gradient-to-br from-[#ffd3db]/20 to-[#e593a2]/20 rounded-xs relative p-1 flex items-center justify-center shadow-inner">
                <div className="absolute inset-1 border border-[#d4af37]/65 rounded-xs" />
                {/* Geometric gold lines in lower panel */}
                <div className="w-[80%] h-[60%] border border-[#d4af37]/45 rounded-xs opacity-65 flex items-center justify-center">
                  <div className="w-[80%] h-[50%] border border-[#d4af37]/30 rounded-xs" />
                </div>
              </div>

              {/* Vertical Door Handle (Gold) */}
              <div className="absolute left-2.5 top-[52%] -translate-y-1/2 w-3 h-[18vh] bg-gradient-to-b from-[#ffd1dc] via-[#d4af37] to-[#b76e79] border border-[#b76e79]/50 rounded-full shadow-md z-20 flex flex-col justify-between items-center py-3">
                <div className="w-2 h-2 rounded-full bg-[#ffd700] border border-[#ffffff]/70 shadow-sm" />
                <div className="w-1.5 h-10 bg-black/15 rounded-full" />
                <div className="w-2 h-2 rounded-full bg-[#ffd700] border border-[#ffffff]/70 shadow-sm" />
              </div>
            </div>

            {/* --- OVERLAID BRANDING TEXT & BUTTON (FRAMED AROUND DOOR DETAILS) --- */}
            <div
              className={`absolute inset-0 flex flex-col items-center justify-between text-center z-30 transition-all duration-[0.8s] cubic-bezier(0.16,1,0.3,1) pointer-events-none ${
                isOpen ? "opacity-0 scale-[1.05]" : "opacity-100 scale-100"
              }`}
            >
              {/* Upper Text Group (Centered on the upper glass panels) */}
              <div className="w-full max-w-lg px-6 flex flex-col items-center select-none pointer-events-auto mt-[4vh] gap-1 sm:gap-2">
                {/* Centered G Medallion */}
                <div className="w-[44px] h-[44px] rounded-full bg-[#1a1412] border-2 border-[#d4af37] flex items-center justify-center shadow-lg mb-2 relative z-25">
                  <span 
                    className="text-md font-bold text-[#ffd700] select-none"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    G
                  </span>
                </div>

                <h1 
                  className="font-display text-white text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-normal leading-none tracking-[0.25em]"
                  style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
                >
                  GRACE
                </h1>
                
                {/* Flanked gold lines AND GO */}
                <div className="flex items-center gap-3 my-1 w-full justify-center">
                  <div className="h-[1px] bg-[#d4af37] w-8 sm:w-12" />
                  <span 
                    className="font-display text-[#ffd700] text-xs xs:text-sm sm:text-base font-bold tracking-[0.3em] uppercase"
                    style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
                  >
                    AND GO
                  </span>
                  <div className="h-[1px] bg-[#d4af37] w-8 sm:w-12" />
                </div>

                <h1 
                  className="font-display text-white text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-normal leading-none tracking-[0.25em]"
                  style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
                >
                  SALON
                </h1>

                <p 
                  className="text-[0.5rem] sm:text-[0.55rem] tracking-[0.45em] uppercase text-[#fff] font-semibold mt-3 text-shadow-tight"
                  style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}
                >
                  BANGALORE · MUMBAI · DELHI
                </p>
              </div>

              {/* Bottom part: button below the handles */}
              <div className="w-full max-w-lg px-6 flex flex-col items-center select-none pointer-events-auto mb-[5vh]">
                <button
                  onClick={handleStepInside}
                  disabled={isOpen}
                  className="group inline-flex items-center justify-center gap-2.5 rounded-full border border-[#d4af37]/80 bg-gradient-to-r from-[#1c1a19]/95 to-[#2c2826]/95 hover:brightness-110 px-8 py-3 text-[0.65rem] font-semibold tracking-[0.35em] uppercase text-white text-shadow-tight shadow-luxe transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 relative overflow-hidden cursor-pointer pulse-glow pointer-events-auto"
                >
                  <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                  STEP INSIDE
                  <Sparkles className="w-3.5 h-3.5 text-[#ffd700] group-hover:rotate-12 transition-transform duration-300" />
                </button>
              </div>
            </div>


          </div>
        </div>
      </div>
    </>
  );
}
