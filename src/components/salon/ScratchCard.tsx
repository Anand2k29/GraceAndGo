import React, { useRef, useEffect, useState } from "react";
import { Sparkles, Trophy } from "lucide-react";

interface ScratchCardProps {
  serviceName: string;
  servicePrice: string;
  onReveal: (discountPercentage: number, discountCode: string) => void;
  onClose: () => void;
}

export default function ScratchCard({
  serviceName,
  servicePrice,
  onReveal,
  onClose,
}: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scratchedPercent, setScratchedPercent] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Choose a random discount to assign: 10%, 15%, 20%, 25%
  const [reward] = useState(() => {
    const discounts = [10, 15, 20, 25];
    const randIdx = Math.floor(Math.random() * discounts.length);
    const pct = discounts[randIdx];
    const code = `GG-VIP-${pct}OFF-${Math.floor(1000 + Math.random() * 9000)}`;
    return { pct, code };
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions with high-DPI scaling
    const dpr = window.devicePixelRatio || 1;
    canvas.width = 320 * dpr;
    canvas.height = 180 * dpr;
    canvas.style.width = "320px";
    canvas.style.height = "180px";
    ctx.scale(dpr, dpr);

    // 1. Draw Gold Glitter background on canvas
    const gradient = ctx.createLinearGradient(0, 0, 320, 180);
    gradient.addColorStop(0, "#ffd1dc"); // Millennial pink
    gradient.addColorStop(0.3, "#d4af37"); // Gold
    gradient.addColorStop(0.7, "#b76e79"); // Dusty rose
    gradient.addColorStop(1, "#996515"); // Dark gold
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 320, 180);

    // Add some luxury speckles/dust on top of the foil
    ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
    for (let i = 0; i < 180; i++) {
      const rx = Math.random() * 320;
      const ry = Math.random() * 180;
      const radius = Math.random() * 2 + 0.5;
      ctx.beginPath();
      ctx.arc(rx, ry, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Draw border
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 2;
    ctx.strokeRect(4, 4, 312, 172);

    // 3. Write instruction text on foil
    ctx.fillStyle = "#1c1a19";
    ctx.font = "italic bold 10px 'Cormorant Garamond', serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("GRACE & GO EXCLUSIVE", 160, 45);

    ctx.fillStyle = "#1c1a19";
    ctx.font = "bold 13px 'Inter', sans-serif";
    ctx.fillText("SCRATCH GOLD FOIL", 160, 85);
    ctx.font = "9px 'Inter', sans-serif";
    ctx.fillText("to reveal your personal discount", 160, 105);

    ctx.fillStyle = "#1c1a19";
    ctx.font = "14px 'Inter', sans-serif";
    ctx.fillText("✧ ✧ ✧", 160, 135);
  }, []);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    // Check if touch or mouse
    if ("touches" in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || isRevealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e);

    // Use destination-out to erase pixels
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    // Check transparency ratio to calculate scratch percentage
    checkScratchPercentage();
  };

  const checkScratchPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 320;
    const height = 180;
    
    // Scale matching the DPR scale
    const dpr = window.devicePixelRatio || 1;
    const imgData = ctx.getImageData(0, 0, width * dpr, height * dpr);
    const data = imgData.data;
    let transparentCount = 0;
    const totalPixels = data.length / 4;

    // Check every 8th pixel to optimize computation speed
    for (let i = 3; i < data.length; i += 32) {
      if (data[i] === 0) {
        transparentCount++;
      }
    }

    const pct = Math.floor((transparentCount / (totalPixels / 8)) * 100);
    setScratchedPercent(pct);

    // If more than 45% scratched, reveal the entire card automatically
    if (pct > 45 && !isRevealed) {
      setIsRevealed(true);
      onReveal(reward.pct, reward.code);
      
      // Clear canvas fully with a beautiful transition
      if (canvas) {
        canvas.style.transition = "opacity 0.6s ease-out";
        canvas.style.opacity = "0";
        setTimeout(() => {
          const fullCtx = canvas.getContext("2d");
          if (fullCtx) {
            fullCtx.clearRect(0, 0, canvas.width, canvas.height);
          }
        }, 600);
      }
    }
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    e.preventDefault(); // Prevent scrolling on touch
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 sm:p-8">
      {/* Background Dim */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-[fade-in_0.3s_ease-out]"
        onClick={isRevealed ? undefined : onClose}
      />

      {/* Main card box */}
      <div className="relative w-full max-w-[380px] rounded-sm border border-blush-pink/20 bg-[oklch(0.14_0.005_60)] shadow-luxe p-6 sm:p-8 z-10 text-center animate-[scale-in_0.25s_ease-out]">
        <div className="absolute inset-x-0 top-0 h-px bg-gold-gradient" />
        
        <div className="space-y-1 mb-4">
          <p className="text-[0.55rem] tracking-[0.4em] uppercase text-gold">VIP Privilege Gift</p>
          <h3 className="font-display text-2xl text-white">Luxury Reward</h3>
          <p className="text-[0.65rem] text-muted-foreground">
            You selected <span className="text-white font-semibold">{serviceName}</span> ({servicePrice}).
          </p>
        </div>

        {/* Scratch Container */}
        <div className="relative w-[320px] h-[180px] mx-auto bg-black/45 rounded-sm border border-blush-pink/15 overflow-hidden flex items-center justify-center shadow-inner">
          {/* Underneath Reward content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 space-y-2 select-none animate-[pulse-glow-anim_2s_infinite]">
            <Trophy className="w-10 h-10 text-gold float" />
            <div>
              <p className="text-[0.6rem] tracking-[0.25em] uppercase text-white/50">YOUR PRIZE REVEALED</p>
              <h2 className="font-display text-4xl text-white font-bold tracking-wide mt-1">
                {reward.pct}% DISCOUNT
              </h2>
              <p className="font-mono text-[0.65rem] text-gold tracking-widest mt-1">
                CODE: {reward.code}
              </p>
            </div>
            <p className="text-[0.5rem] text-muted-foreground">
              Applied automatically to your current booking request!
            </p>
          </div>

          {/* Foreground Scratchable Canvas */}
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="absolute top-0 left-0 cursor-crosshair touch-none"
          />
        </div>

        <div className="mt-5 space-y-4">
          {!isRevealed ? (
            <div className="space-y-1">
              {/* Progress bar */}
              <div className="w-40 h-1 bg-black/45 mx-auto rounded-full overflow-hidden border border-blush-pink/5">
                <div 
                  className="h-full bg-gold-gradient transition-all duration-300"
                  style={{ width: `${(scratchedPercent / 45) * 100}%` }}
                />
              </div>
              <p className="text-[0.55rem] tracking-wider uppercase text-muted-foreground">
                Scratch to {Math.max(0, 45 - scratchedPercent)}% more to claim
              </p>
            </div>
          ) : (
            <div className="space-y-2 animate-[fade-in_0.5s_ease-out]">
              <div className="inline-flex items-center gap-1.5 text-xs text-gold font-semibold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-gold" /> Reward Claimed!
              </div>
              <button
                onClick={onClose}
                className="w-full overflow-hidden rounded-sm bg-gold-gradient py-3 text-xs font-semibold tracking-[0.3em] uppercase text-[#1c1a19] hover:brightness-110 shadow-soft cursor-pointer transition-all duration-300"
              >
                Proceed with booking
              </button>
            </div>
          )}

          {!isRevealed && (
            <button
              onClick={onClose}
              className="text-[0.55rem] tracking-[0.25em] uppercase text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              Skip & book at full price
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
