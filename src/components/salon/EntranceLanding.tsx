import React, { useState } from "react";
import { Sparkles, Compass, UserCheck } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

interface EntranceLandingProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTour: (gender: "male" | "female") => void;
}

export default function EntranceLanding({
  isOpen,
  onClose,
  onSelectTour,
}: EntranceLandingProps) {
  const [step, setStep] = useState<"gender" | "options">("gender");
  const [selectedGender, setSelectedGender] = useState<"male" | "female" | null>(null);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleGenderSelect = (gender: "male" | "female") => {
    setSelectedGender(gender);
    setStep("options");
  };

  const handleSelectTour = () => {
    if (selectedGender) {
      onSelectTour(selectedGender);
      onClose();
    }
  };

  const handleSelectVIPPortal = () => {
    if (selectedGender) {
      // Persist choice so the VIP page knows the pre-selected gender
      localStorage.setItem("gg_selected_gender", selectedGender);
      // Navigate to separate /vip route
      navigate({ to: "/vip" });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 overflow-hidden select-none">
      {/* Background glassmorphic layer */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-[fade-in_0.4s_ease-out]"
        style={{
          backgroundImage: "radial-gradient(circle at 50% 50%, rgba(30, 20, 20, 0.6) 0%, rgba(10, 8, 8, 0.95) 100%)"
        }}
      />

      {/* Custom Styles for aesthetic animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer-sweep {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(100%) skewX(-15deg); }
        }
        .shimmer-sweep-effect {
          animation: shimmer-sweep 3.5s infinite;
        }
        @keyframes float-icon {
          0%, 100% { transform: translateY(0) scale(1) rotate(0deg); }
          50% { transform: translateY(-5px) scale(1.05) rotate(5deg); }
        }
        .animate-float-icon {
          animation: float-icon 4s ease-in-out infinite;
        }
      `}} />

      {/* Main Gateway Card */}
      <div className="relative w-full max-w-2xl rounded-xl border border-blush-pink/15 bg-[oklch(0.10_0.005_60)]/90 shadow-luxe p-8 sm:p-12 z-10 text-center animate-[scale-in_0.35s_cubic-bezier(0.16,1,0.3,1)] overflow-hidden backdrop-blur-md">
        <div className="absolute inset-x-0 top-0 h-px bg-gold-gradient animate-pulse" />
        
        {/* VIEW 1: MEN OR WOMEN SELECTION */}
        {step === "gender" && (
          <div className="space-y-10 py-6 animate-[fade-in_0.4s_ease-out]">
            <div className="space-y-4">
              <div className="mx-auto w-[52px] h-[52px] rounded-full bg-[#1a1412] border-2 border-[#d4af37] flex items-center justify-center shadow-lg shadow-gold/10">
                <span className="font-display text-xl text-gold font-bold">G</span>
              </div>
              <p className="text-[0.6rem] tracking-[0.5em] uppercase text-gold font-semibold">Welcome to GraceAndGo</p>
              <h2 className="font-display text-4xl sm:text-5xl text-white tracking-[0.05em] leading-tight">
                SELECT YOUR SALON ATELIER
              </h2>
              <div className="h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/35 to-transparent w-44 mx-auto" />
            </div>

            <p className="text-[0.7rem] sm:text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed uppercase tracking-widest">
              Please choose your preferred salon experience to enter.
            </p>

            <div className="grid gap-6 sm:grid-cols-2 max-w-lg mx-auto pt-4">
              {/* Ladies Button */}
              <button
                onClick={() => handleGenderSelect("female")}
                className="group relative p-8 rounded-xl border border-[#ffd1dc]/10 bg-[#0e090a]/60 hover:border-[#ffd1dc]/45 hover:bg-[#1a1113]/85 transition-all duration-500 flex flex-col items-center justify-center gap-5 cursor-pointer overflow-hidden shadow-soft hover:scale-[1.03] backdrop-blur-md"
              >
                {/* Glow Border Sweep */}
                <div className="absolute inset-0 border border-transparent group-hover:border-[#ffd1dc]/30 rounded-xl transition-all duration-500 pointer-events-none" />
                
                {/* Soft background light */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-[#ffd1dc]/3 blur-3xl pointer-events-none group-hover:bg-[#ffd1dc]/8 transition-colors duration-500" />
                
                {/* Visual Glare Sweep */}
                <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-[#ffd1dc]/10 to-transparent -translate-x-full group-hover:shimmer-sweep-effect pointer-events-none" />
                
                {/* Icon Container */}
                <div className="w-14 h-14 rounded-full border border-[#ffd1dc]/25 flex items-center justify-center bg-[#181112] text-[#ffd1dc] shadow-[0_0_15px_rgba(255,209,220,0.15)] group-hover:shadow-[0_0_25px_rgba(255,209,220,0.35)] group-hover:scale-110 transition-all duration-500 z-10 relative">
                  <Sparkles className="w-6 h-6 animate-pulse group-hover:animate-float-icon" />
                </div>
                
                <div className="z-10">
                  <h3 className="font-display text-2xl text-white tracking-[0.2em] uppercase font-light group-hover:text-[#ffd1dc] transition-colors">LADIES</h3>
                  <div className="h-[1px] bg-gradient-to-r from-transparent via-[#ffd1dc]/30 to-transparent w-16 mx-auto mt-2" />
                  <p className="text-[0.6rem] text-[#ffd1dc] tracking-[0.25em] uppercase mt-2 opacity-80">Sanctuary</p>
                </div>
              </button>

              {/* Gentlemen Button */}
              <button
                onClick={() => handleGenderSelect("male")}
                className="group relative p-8 rounded-xl border border-[#d4af37]/10 bg-[#0c0a08]/60 hover:border-[#d4af37]/50 hover:bg-[#181410]/85 transition-all duration-500 flex flex-col items-center justify-center gap-5 cursor-pointer overflow-hidden shadow-soft hover:scale-[1.03] backdrop-blur-md"
              >
                {/* Glow Border Sweep */}
                <div className="absolute inset-0 border border-transparent group-hover:border-[#d4af37]/35 rounded-xl transition-all duration-500 pointer-events-none" />
                
                {/* Soft background light */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-[#d4af37]/3 blur-3xl pointer-events-none group-hover:bg-[#d4af37]/8 transition-colors duration-500" />
                
                {/* Visual Glare Sweep */}
                <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-[#d4af37]/10 to-transparent -translate-x-full group-hover:shimmer-sweep-effect pointer-events-none" />
                
                {/* Icon Container */}
                <div className="w-14 h-14 rounded-full border border-[#d4af37]/25 flex items-center justify-center bg-[#14120f] text-gold shadow-[0_0_15px_rgba(212,175,55,0.15)] group-hover:shadow-[0_0_25px_rgba(212,175,55,0.35)] group-hover:scale-110 transition-all duration-500 z-10 relative">
                  <Compass className="w-6 h-6 animate-pulse group-hover:animate-float-icon" />
                </div>
                
                <div className="z-10">
                  <h3 className="font-display text-2xl text-white tracking-[0.2em] uppercase font-light group-hover:text-gold transition-colors">GENTLEMEN</h3>
                  <div className="h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent w-16 mx-auto mt-2" />
                  <p className="text-[0.6rem] text-gold tracking-[0.25em] uppercase mt-2 opacity-80">Atelier</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* VIEW 2: OPTIONS SELECTOR (TOUR vs VIP) */}
        {step === "options" && selectedGender && (
          <div className="space-y-8 py-4 animate-[fade-in_0.5s_cubic-bezier(0.16,1,0.3,1)]">
            <div className="space-y-3">
              <div className="mx-auto w-[44px] h-[44px] rounded-full bg-[#1a1412] border border-[#d4af37] flex items-center justify-center shadow-lg">
                <span className="font-display text-lg text-gold font-bold">G</span>
              </div>
              <p className="text-[0.55rem] tracking-[0.4em] uppercase text-gold">GraceAndGo Salon</p>
              <h2 className="font-display text-3xl sm:text-4xl text-white tracking-[0.1em] uppercase">
                {selectedGender === "male" ? "THE GENTLEMEN'S ATELIER" : "THE LADIES' SANCTUARY"}
              </h2>
              <button 
                onClick={() => setStep("gender")} 
                className="text-[0.55rem] tracking-widest text-[#b76e79] hover:text-[#ffd1dc] uppercase transition-colors"
              >
                ← Switch Atelier
              </button>
            </div>

            <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
              Step into a customized experience. Select your preferred journey below to begin.
            </p>

            <div className="grid gap-6 sm:grid-cols-2 pt-4">
              {/* Option I: 3D Tour */}
              <button
                onClick={handleSelectTour}
                className="group p-6 rounded-sm border border-blush-pink/15 bg-black/20 hover:border-gold/45 hover:bg-[oklch(0.15_0.006_60)] text-left transition-all duration-300 flex flex-col justify-between min-h-[15.5rem] h-auto cursor-pointer"
              >
                <div>
                  <span className="text-[0.6rem] tracking-[0.3em] uppercase text-gold font-bold mb-2.5 block">Option I</span>
                  <h3 className="font-display text-2xl text-white group-hover:text-gold transition-colors flex items-center gap-2">
                    <Compass className="w-5 h-5 text-gold" /> 3D Virtual Tour
                  </h3>
                  <p className="text-[0.7rem] text-muted-foreground mt-3 leading-relaxed">
                    Wander down the marble corridors, inspect the Apothecary showcase, and view the treatment suites at your own pace.
                  </p>
                </div>
                <span className="text-[0.6rem] tracking-[0.2em] uppercase text-white/50 group-hover:text-white transition-colors mt-4 block">
                  EXPLORE TOUR →
                </span>
              </button>

              {/* Option II: VIP Portal */}
              <button
                onClick={handleSelectVIPPortal}
                className="group p-6 rounded-sm border border-blush-pink/15 bg-black/20 hover:border-gold/45 hover:bg-[oklch(0.15_0.006_60)] text-left transition-all duration-300 flex flex-col justify-between min-h-[15.5rem] h-auto cursor-pointer"
              >
                <div>
                  <span className="text-[0.6rem] tracking-[0.3em] uppercase text-gold font-bold mb-2.5 block">Option II</span>
                  <h3 className="font-display text-2xl text-white group-hover:text-gold transition-colors flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-gold" /> VIP Booking Portal
                  </h3>
                  <p className="text-[0.7rem] text-muted-foreground mt-3 leading-relaxed">
                    Register to get a unique digital membership card, unlock birthday discounts, access scratch-off rewards, and run our AI scan.
                  </p>
                </div>
                <span className="text-[0.6rem] tracking-[0.2em] uppercase text-white group-hover:text-white transition-colors mt-4 block">
                  REGISTER & BOOK →
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
