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

      {/* Main Gateway Card */}
      <div className="relative w-full max-w-2xl rounded-sm border border-blush-pink/15 bg-[oklch(0.12_0.005_60)]/90 shadow-luxe p-8 sm:p-12 z-10 text-center animate-[scale-in_0.35s_cubic-bezier(0.16,1,0.3,1)] overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gold-gradient" />
        
        {/* VIEW 1: MEN OR WOMEN SELECTION */}
        {step === "gender" && (
          <div className="space-y-10 py-6 animate-[fade-in_0.4s_ease-out]">
            <div className="space-y-4">
              <div className="mx-auto w-[52px] h-[52px] rounded-full bg-[#1a1412] border-2 border-[#d4af37] flex items-center justify-center shadow-lg animate-pulse">
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
                className="group relative p-8 rounded-sm border border-[#ffd1dc]/25 bg-black/35 hover:border-[#ffd1dc]/60 hover:bg-[#ffd1dc]/5 transition-all duration-500 flex flex-col items-center justify-center gap-4 cursor-pointer overflow-hidden shadow-soft hover:scale-[1.03]"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#ffd1dc]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-12 h-12 rounded-full border border-[#ffd1dc]/40 flex items-center justify-center bg-[#ffd1dc]/5 text-[#ffd1dc] group-hover:scale-110 transition-transform">
                  ✦
                </div>
                <div>
                  <h3 className="font-display text-2xl text-white tracking-widest uppercase">LADIES</h3>
                  <p className="text-[0.55rem] text-[#ffd1dc] tracking-wider uppercase mt-1 opacity-70">Sanctuary</p>
                </div>
              </button>

              {/* Gentlemen Button */}
              <button
                onClick={() => handleGenderSelect("male")}
                className="group relative p-8 rounded-sm border border-[#d4af37]/25 bg-black/35 hover:border-[#d4af37]/60 hover:bg-[#d4af37]/5 transition-all duration-500 flex flex-col items-center justify-center gap-4 cursor-pointer overflow-hidden shadow-soft hover:scale-[1.03]"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#d4af37]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-12 h-12 rounded-full border border-[#d4af37]/40 flex items-center justify-center bg-[#d4af37]/5 text-gold group-hover:scale-110 transition-transform">
                  ✧
                </div>
                <div>
                  <h3 className="font-display text-2xl text-white tracking-widest uppercase">GENTLEMEN</h3>
                  <p className="text-[0.55rem] text-gold tracking-wider uppercase mt-1 opacity-70">Atelier</p>
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
                className="group p-6 rounded-sm border border-blush-pink/15 bg-black/20 hover:border-gold/45 hover:bg-[oklch(0.15_0.006_60)] text-left transition-all duration-300 flex flex-col justify-between h-48 cursor-pointer"
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
                className="group p-6 rounded-sm border border-blush-pink/15 bg-black/20 hover:border-gold/45 hover:bg-[oklch(0.15_0.006_60)] text-left transition-all duration-300 flex flex-col justify-between h-48 cursor-pointer"
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
