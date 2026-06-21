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
  const [isAnimating, setIsAnimating] = useState(false);
  const [isRendered, setIsRendered] = useState(true);

  const handleStepInside = () => {
    if (isOpen || isAnimating) return;
    setIsAnimating(true);
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
      }, 1800); // match transition duration
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
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.15) 100%);
          pointer-events: none;
        }
      `}} />
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden transition-all duration-[1.6s] ease-in-out select-none ${
          isOpen ? "opacity-0 scale-[1.12] pointer-events-none" : "opacity-100 scale-100"
        }`}
        style={{
          background: "linear-gradient(135deg, #f5efe8 0%, #ffffff 50%, #eae3dc 100%)",
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(255,255,255,0.85) 0%, transparent 100%),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500' viewBox='0 0 500 500'%3E%3Cpath d='M10 80 Q150 40 320 180 T490 100 M80 250 Q280 220 380 320 T490 280 M20 400 Q180 370 350 450 T480 390' fill='none' stroke='%23d6c8be' stroke-width='1.5' stroke-opacity='0.45'/%3E%3Cpath d='M20 90 Q140 50 310 190 T480 110' fill='none' stroke='%23d4af37' stroke-width='0.5' stroke-opacity='0.25'/%3E%3C/svg%3E")
          `,
        }}
      >
        {/* --- LUXURY MARBLE FLOOR WITH GOLD PATTERN --- */}
        <div
          className={`absolute bottom-0 inset-x-0 h-[15vh] bg-[linear-gradient(to_bottom,rgba(252,250,248,0.98),rgba(230,224,218,1))] border-t-2 border-[#d4af37]/45 transition-all duration-[1.6s] ease-in-out ${
            isOpen ? "translate-y-full opacity-0" : "translate-y-0 opacity-100"
          }`}
          style={{
            backgroundImage: `
              radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.9), transparent 75%),
              url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M0 0 L100 100 M100 0 L0 100' stroke='rgba(183,110,121,0.05)' stroke-width='0.5'/%3E%3C/svg%3E")
            `,
          }}
        >
          {/* Geometric gold lines on the floor */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-80">
            <svg className="w-full h-full" width="100%" height="100%">
              <path
                d="M 0,25 L 2000,25 M 0,45 L 2000,45"
                stroke="url(#gold-floor-gradient)"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M 120,25 L 180,45 M 420,25 L 480,45 M 720,25 L 780,45 M 1020,25 L 1080,45 M 1320,25 L 1380,45 M 1620,25 L 1680,45"
                stroke="url(#gold-floor-gradient)"
                strokeWidth="1"
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
        <div className="absolute left-[3%] sm:left-[8%] xl:left-[12%] top-[15%] flex flex-col items-center z-20">
          {/* Off-white illuminated wall panel behind the sconce */}
          <div 
            className="absolute -top-20 w-28 h-[55vh] rounded-md pointer-events-none -z-10"
            style={{
              background: "linear-gradient(to bottom, #faf8f5 0%, #f5f0eb 40%, #ede6df 100%)",
              boxShadow: "0 0 30px rgba(255, 240, 225, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.3)",
              border: "1px solid rgba(212, 175, 55, 0.15)"
            }}
          />
          {/* Warm cone of light casting down */}
          <div 
            className="absolute -top-10 w-44 h-64 blur-md pointer-events-none opacity-85"
            style={{
              background: "linear-gradient(to bottom, rgba(255, 235, 204, 0.45) 0%, rgba(255, 235, 204, 0) 80%)",
              clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)"
            }}
          />
          {/* Wall light glow circle */}
          <div 
            className="absolute -top-16 w-36 h-36 rounded-full blur-md pointer-events-none opacity-80"
            style={{
              background: "radial-gradient(circle, rgba(255, 227, 209, 0.75) 0%, rgba(255, 227, 209, 0) 70%)"
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
        <div className="absolute right-[3%] sm:right-[8%] xl:right-[12%] top-[15%] flex flex-col items-center z-20">
          {/* Off-white illuminated wall panel behind the sconce */}
          <div 
            className="absolute -top-20 w-28 h-[55vh] rounded-md pointer-events-none -z-10"
            style={{
              background: "linear-gradient(to bottom, #faf8f5 0%, #f5f0eb 40%, #ede6df 100%)",
              boxShadow: "0 0 30px rgba(255, 240, 225, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.3)",
              border: "1px solid rgba(212, 175, 55, 0.15)"
            }}
          />
          {/* Warm cone of light casting down */}
          <div 
            className="absolute -top-10 w-44 h-64 blur-md pointer-events-none opacity-85"
            style={{
              background: "linear-gradient(to bottom, rgba(255, 235, 204, 0.45) 0%, rgba(255, 235, 204, 0) 80%)",
              clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)"
            }}
          />
          {/* Wall light glow circle */}
          <div 
            className="absolute -top-16 w-36 h-36 rounded-full blur-md pointer-events-none opacity-80"
            style={{
              background: "radial-gradient(circle, rgba(255, 227, 209, 0.75) 0%, rgba(255, 227, 209, 0) 70%)"
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
          className={`relative w-full max-w-[580px] h-[88vh] flex flex-col justify-end items-center transition-all duration-[1.6s] ease-in-out ${
            isOpen ? "scale-[1.18] opacity-0" : "scale-100 opacity-100"
          }`}
          style={{
            perspective: "1200px",
            transformStyle: "preserve-3d",
          }}
        >
          {/* WHITE MARBLE ARCH ARCHWAY HEADER (surrounds the transom window) */}
          <div className="absolute top-0 inset-x-0 h-[24vh] border-t-8 border-x-8 border-t-[#eae3dc] border-x-[#eae3dc] rounded-t-full bg-transparent pointer-events-none z-20 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
            {/* Inner Gold trim line */}
            <div className="w-full h-full border-t border-x border-[#d4af37]/40 rounded-t-full" />
          </div>

          {/* --- TRANSOM ARCH WINDOW (above doors) --- */}
          <div
            className="absolute top-1.5 inset-x-1.5 h-[23vh] rounded-t-full bg-gradient-to-b from-[#ffeef0] via-[#ffd1dc]/80 to-[#1c0c0e]/30 overflow-hidden flex flex-col items-center justify-center border-b border-[#d4af37]/40 z-10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)]"
            style={{
              backgroundImage: "linear-gradient(to bottom, rgba(255, 238, 240, 0.9) 0%, rgba(255, 209, 220, 0.75) 50%, rgba(28, 12, 14, 0.3) 100%)",
              boxShadow: "0 -2px 20px rgba(255, 191, 163, 0.25)"
            }}
          >
            {/* Gold Sunburst Grille lines */}
            <div className="absolute inset-0 opacity-55 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 50">
                <path d="M 50,50 L 12,5" stroke="#d4af37" strokeWidth="0.6" />
                <path d="M 50,50 L 31,1" stroke="#d4af37" strokeWidth="0.6" />
                <path d="M 50,50 L 50,0" stroke="#d4af37" strokeWidth="0.6" />
                <path d="M 50,50 L 69,1" stroke="#d4af37" strokeWidth="0.6" />
                <path d="M 50,50 L 88,5" stroke="#d4af37" strokeWidth="0.6" />
                <circle cx="50" cy="50" r="42" stroke="#d4af37" strokeWidth="0.8" fill="none" />
                <circle cx="50" cy="50" r="28" stroke="#d4af37" strokeWidth="0.6" fill="none" />
              </svg>
            </div>

            {/* Transom Branding Text */}
            <div className="relative text-center mt-7 flex flex-col items-center z-10">
              {/* Gold flourishes */}
              <svg className="w-16 h-4 text-[#d4af37] opacity-80" viewBox="0 0 100 20" fill="currentColor">
                <path d="M 10 10 Q 50 0 90 10 M 20 12 Q 50 4 80 12 M 40 14 Q 50 10 60 14" fill="none" stroke="currentColor" strokeWidth="0.75"/>
                <circle cx="50" cy="7" r="1.5"/>
              </svg>
              <p 
                className="font-display text-[0.85rem] tracking-[0.35em] uppercase text-[#734b26] font-bold text-shadow-tight"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Grace And Go
              </p>
              <p className="text-[0.42rem] tracking-[0.25em] uppercase text-[#d4af37] font-bold mt-0.5">
                Salon
              </p>
            </div>
          </div>

          {/* --- LEFT SIDELIGHT WINDOW (showing blurred salon interior) --- */}
          <div
            className="absolute left-[-80px] bottom-0 w-[72px] h-[57vh] hidden sm:block border-t-4 border-x-4 border-t-[#eae3dc] border-x-[#eae3dc] overflow-hidden sidelight-glare z-10 shadow-lg"
            style={{
              backgroundImage: "url('/salon_interior_blur.png')",
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

          {/* --- RIGHT SIDELIGHT WINDOW (showing blurred salon interior) --- */}
          <div
            className="absolute right-[-80px] bottom-0 w-[72px] h-[57vh] hidden sm:block border-t-4 border-x-4 border-t-[#eae3dc] border-x-[#eae3dc] overflow-hidden sidelight-glare z-10 shadow-lg"
            style={{
              backgroundImage: "url('/salon_interior_blur.png')",
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
            className="relative w-full h-[57vh] flex bg-black/5 border-t-4 border-[#eae3dc] z-10"
            style={{
              perspective: "1200px",
              transformStyle: "preserve-3d",
            }}
          >
            {/* LEFT DOOR */}
            <div
              className="w-1/2 h-full border-r border-[#b76e79]/30 relative p-3 flex flex-col justify-between items-end transition-transform duration-[1.8s] ease-[cubic-bezier(0.2,0.85,0.25,1)]"
              style={{
                transformOrigin: "left center",
                transform: isOpen ? "rotateY(-110deg)" : "rotateY(0deg)",
                boxShadow: "inset -2px 0 12px rgba(0,0,0,0.35), 5px 0 25px rgba(0,0,0,0.15)",
                background: "linear-gradient(135deg, #f7c5c5 0%, #e2949f 50%, #a8525f 100%)"
              }}
            >
              {/* Upper Ornate Gold Panel Molding */}
              <div className="w-[88%] h-[62%] border border-[#d4af37] bg-gradient-to-br from-[#f7c5c5]/25 to-[#a8525f]/25 rounded-xs relative p-2 flex items-center justify-center shadow-inner">
                {/* Gold inner panel border */}
                <div className="absolute inset-1.5 border-2 border-double border-[#d4af37]/70 rounded-xs" />
                {/* Gold Baroque corner designs inside the upper panel */}
                <svg className="absolute top-2.5 left-2.5 w-6 h-6 text-[#ffd700]/80" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M 0 0 C 4 0, 4 4, 4 8 C 4 4, 8 4, 8 0 Z" />
                </svg>
                <svg className="absolute top-2.5 right-2.5 w-6 h-6 text-[#ffd700]/80 scale-x-[-1]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M 0 0 C 4 0, 4 4, 4 8 C 4 4, 8 4, 8 0 Z" />
                </svg>
                <svg className="absolute bottom-2.5 left-2.5 w-6 h-6 text-[#ffd700]/80 scale-y-[-1]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M 0 0 C 4 0, 4 4, 4 8 C 4 4, 8 4, 8 0 Z" />
                </svg>
                <svg className="absolute bottom-2.5 right-2.5 w-6 h-6 text-[#ffd700]/80 scale-x-[-1] scale-y-[-1]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M 0 0 C 4 0, 4 4, 4 8 C 4 4, 8 4, 8 0 Z" />
                </svg>
              </div>

              {/* Lower Ornate Gold Panel Molding */}
              <div className="w-[88%] h-[28%] border border-[#d4af37] bg-gradient-to-br from-[#f7c5c5]/25 to-[#a8525f]/25 rounded-xs relative p-1 flex items-center justify-center shadow-inner">
                <div className="absolute inset-1 border border-[#d4af37]/65 rounded-xs" />
                {/* Geometric gold lines in lower panel */}
                <div className="w-[80%] h-[60%] border border-[#d4af37]/45 rounded-xs opacity-65 flex items-center justify-center">
                  <div className="w-[80%] h-[50%] border border-[#d4af37]/30 rounded-xs" />
                </div>
              </div>

              {/* Vertical Door Handle (Gold) */}
              <div className="absolute right-2 top-[52%] -translate-y-1/2 w-2.5 h-[16vh] bg-gradient-to-b from-[#ffd1dc] via-[#d4af37] to-[#b76e79] border border-[#b76e79]/50 rounded-full shadow-md z-20 flex flex-col justify-between items-center py-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffd700] border border-[#ffffff]/70 shadow-sm" />
                <div className="w-1 h-8 bg-black/15 rounded-full" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffd700] border border-[#ffffff]/70 shadow-sm" />
              </div>

              {/* Split Medallion (Left Half) */}
              <div className="absolute right-0 top-[40%] -translate-y-1/2 w-[24px] h-[48px] overflow-hidden z-25">
                <div className="w-[48px] h-[48px] rounded-full bg-[#1a1412] border-2 border-[#d4af37] flex items-center justify-end pr-1 shadow-lg translate-x-[24px] relative">
                  <span 
                    className="text-md font-bold text-[#ffd700] absolute right-2.5 select-none"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    G
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT DOOR */}
            <div
              className="w-1/2 h-full border-l border-[#b76e79]/30 relative p-3 flex flex-col justify-between items-start transition-transform duration-[1.8s] ease-[cubic-bezier(0.2,0.85,0.25,1)]"
              style={{
                transformOrigin: "right center",
                transform: isOpen ? "rotateY(110deg)" : "rotateY(0deg)",
                boxShadow: "inset 2px 0 12px rgba(0,0,0,0.35), -5px 0 25px rgba(0,0,0,0.15)",
                background: "linear-gradient(135deg, #f7c5c5 0%, #e2949f 50%, #a8525f 100%)"
              }}
            >
              {/* Upper Ornate Gold Panel Molding */}
              <div className="w-[88%] h-[62%] border border-[#d4af37] bg-gradient-to-br from-[#f7c5c5]/25 to-[#a8525f]/25 rounded-xs relative p-2 flex items-center justify-center shadow-inner">
                {/* Gold inner panel border */}
                <div className="absolute inset-1.5 border-2 border-double border-[#d4af37]/70 rounded-xs" />
                {/* Gold Baroque corner designs inside the upper panel */}
                <svg className="absolute top-2.5 left-2.5 w-6 h-6 text-[#ffd700]/80" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M 0 0 C 4 0, 4 4, 4 8 C 4 4, 8 4, 8 0 Z" />
                </svg>
                <svg className="absolute top-2.5 right-2.5 w-6 h-6 text-[#ffd700]/80 scale-x-[-1]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M 0 0 C 4 0, 4 4, 4 8 C 4 4, 8 4, 8 0 Z" />
                </svg>
                <svg className="absolute bottom-2.5 left-2.5 w-6 h-6 text-[#ffd700]/80 scale-y-[-1]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M 0 0 C 4 0, 4 4, 4 8 C 4 4, 8 4, 8 0 Z" />
                </svg>
                <svg className="absolute bottom-2.5 right-2.5 w-6 h-6 text-[#ffd700]/80 scale-x-[-1] scale-y-[-1]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M 0 0 C 4 0, 4 4, 4 8 C 4 4, 8 4, 8 0 Z" />
                </svg>
              </div>

              {/* Lower Ornate Gold Panel Molding */}
              <div className="w-[88%] h-[28%] border border-[#d4af37] bg-gradient-to-br from-[#f7c5c5]/25 to-[#a8525f]/25 rounded-xs relative p-1 flex items-center justify-center shadow-inner">
                <div className="absolute inset-1 border border-[#d4af37]/65 rounded-xs" />
                {/* Geometric gold lines in lower panel */}
                <div className="w-[80%] h-[60%] border border-[#d4af37]/45 rounded-xs opacity-65 flex items-center justify-center">
                  <div className="w-[80%] h-[50%] border border-[#d4af37]/30 rounded-xs" />
                </div>
              </div>

              {/* Vertical Door Handle (Gold) */}
              <div className="absolute left-2 top-[52%] -translate-y-1/2 w-2.5 h-[16vh] bg-gradient-to-b from-[#ffd1dc] via-[#d4af37] to-[#b76e79] border border-[#b76e79]/50 rounded-full shadow-md z-20 flex flex-col justify-between items-center py-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffd700] border border-[#ffffff]/70 shadow-sm" />
                <div className="w-1 h-8 bg-black/15 rounded-full" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffd700] border border-[#ffffff]/70 shadow-sm" />
              </div>

              {/* Split Medallion (Right Half) */}
              <div className="absolute left-0 top-[40%] -translate-y-1/2 w-[24px] h-[48px] overflow-hidden z-25">
                <div className="w-[48px] h-[48px] rounded-full bg-[#1a1412] border-2 border-[#d4af37] flex items-center justify-start pl-1 shadow-lg -translate-x-[24px] relative">
                  <span 
                    className="text-md font-bold text-[#ffd700] absolute left-2.5 select-none"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    G
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- OVERLAID BRANDING TEXT & BUTTON (CENTER) --- */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center text-center z-30 transition-all duration-[1.4s] cubic-bezier(0.16,1,0.3,1) ${
            isOpen ? "opacity-0 scale-[1.1] pointer-events-none" : "opacity-100 scale-100"
          }`}
        >
          <div className="max-w-2xl px-6 flex flex-col items-center select-none pt-[14vh]">
            {/* Circular monogram emblem */}
            <div className="w-13 h-13 rounded-full bg-[#1a1412]/95 border-2 border-[#d4af37] flex items-center justify-center shadow-2xl mb-4 shrink-0 transition-transform duration-500 hover:rotate-[360deg] pulse-glow">
              <span 
                className="text-lg font-bold text-[#ffd700] tracking-normal mt-0.5"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                G
              </span>
            </div>

            <h1 className="font-display text-5xl leading-[1.05] sm:text-7xl text-shadow-luxe tracking-[0.18em] select-none gold-text-shimmer">
              GRACE
            </h1>
            
            <div className="flex items-center gap-4 my-2.5 w-full justify-center">
              <div className="h-px bg-gradient-to-r from-transparent via-[#d4af37] to-[#d4af37] flex-1 max-w-[60px]" />
              <p 
                className="text-[0.95rem] tracking-[0.3em] uppercase text-[#734b26] font-bold select-none text-shadow-tight"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                AND GO
              </p>
              <div className="h-px bg-gradient-to-l from-transparent via-[#d4af37] to-[#d4af37] flex-1 max-w-[60px]" />
            </div>

            <h1 className="font-display text-5xl leading-[1.05] sm:text-7xl text-shadow-luxe tracking-[0.18em] select-none mb-1 gold-text-shimmer">
              SALON
            </h1>

            <p className="text-[0.52rem] tracking-[0.45em] uppercase text-[#5a423a] text-shadow-tight font-bold mt-4">
              PARIS · TOKYO · NEW YORK
            </p>

            <div className="mt-14">
              <button
                onClick={handleStepInside}
                disabled={isOpen || isAnimating}
                className="group inline-flex items-center justify-center gap-3.5 rounded-full border border-[#d4af37]/70 bg-gradient-to-r from-[#1c1a19] to-[#252220] hover:brightness-110 px-10 py-4 text-xs font-semibold tracking-[0.45em] uppercase text-white text-shadow-tight shadow-luxe transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 relative overflow-hidden cursor-pointer pulse-glow"
              >
                {/* Shimmer overlay */}
                <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                
                STEP INSIDE
                <Sparkles className="w-4 h-4 text-[#ffd700] group-hover:rotate-12 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
