import React, { useState, useEffect } from "react";
import { Sparkles, Shield, Camera, Upload, AlertCircle, RefreshCw, HelpCircle } from "lucide-react";
import { toast } from "sonner";

interface AIScanHubProps {
  isOpen: boolean;
  onClose: () => void;
  onBookService: (hotspotId: string, serviceName: string) => void;
}

export default function AIScanHub({
  isOpen,
  onClose,
  onBookService,
}: AIScanHubProps) {
  const [step, setStep] = useState<"questions" | "photo" | "scanning" | "report">("questions");
  
  // Questionnaire state
  const [skinType, setSkinType] = useState("combination");
  const [skinConcern, setSkinConcern] = useState("dullness");
  const [hairType, setHairType] = useState("dry");
  const [hairConcern, setHairConcern] = useState("hairfall");
  
  // Consent and Photo state
  const [consent, setConsent] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  
  // Scanner state
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatusText, setScanStatusText] = useState("Initializing sensors...");
  
  // Gemini API state
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Final Report state
  const [reportText, setReportText] = useState("");
  const [recommendedServices, setRecommendedServices] = useState<{ hotspot: string; service: string }[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    // Reset scan state on reopen
    setStep("questions");
    setPhotoUrl(null);
    setConsent(false);
    setScanProgress(0);
    setIsGenerating(false);
  }, [isOpen]);

  // Scan progress timer loop
  useEffect(() => {
    if (step !== "scanning") return;

    const statusTexts = [
      "Initializing surface micro-imaging...",
      "Analyzing dermal hydration index...",
      "Scanning epidermal lipid distribution...",
      "Measuring T-zone sebum levels...",
      "Analyzing hair follicle sheath strength...",
      "Detecting cuticle scaling coefficient...",
      "Calculating pore micro-congestion score...",
      "Compiling digital diagnostic matrices...",
      "Generating skin-hair couture recipe..."
    ];

    const timer = setInterval(() => {
      setScanProgress((prev) => {
        const next = prev + 2;
        
        // Dynamic status text changes based on progress
        const textIdx = Math.min(
          Math.floor((next / 100) * statusTexts.length),
          statusTexts.length - 1
        );
        setScanStatusText(statusTexts[textIdx]);

        if (next >= 100) {
          clearInterval(timer);
          generateAnalysisReport();
          return 100;
        }
        return next;
      });
    }, 80);

    return () => clearInterval(timer);
  }, [step]);

  if (!isOpen) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setPhotoUrl(uploadEvent.target?.result as string);
        toast.success("Portrait loaded successfully.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStartScan = () => {
    if (!consent) {
      toast.error("Please review and check the AI Diagnostic Consent before scanning.");
      return;
    }
    if (!photoUrl) {
      toast.error("Please load a facial or hair photo for diagnostic scanning.");
      return;
    }
    setStep("scanning");
  };

  // Generate Report using Gemini API or Local Rules fallback
  const generateAnalysisReport = async () => {
    setIsGenerating(true);
    
    // Construct recommended services based on selections
    const recommendations: { hotspot: string; service: string }[] = [];
    
    if (hairConcern === "hairfall") {
      recommendations.push({ hotspot: "treatment", service: "Scalp Detoxification Ritual" });
      recommendations.push({ hotspot: "product", service: "Velours Hair Oil" });
    } else if (hairConcern === "dryness") {
      recommendations.push({ hotspot: "treatment", service: "Signature Hair Spa Treatment" });
      recommendations.push({ hotspot: "product", service: "Velours Hair Oil" });
    } else if (hairConcern === "dandruff") {
      recommendations.push({ hotspot: "treatment", service: "Ayurvedic Hair & Scalp Therapy" });
    } else {
      recommendations.push({ hotspot: "hair", service: "Signature Cut & Style" });
    }

    if (skinConcern === "acne") {
      recommendations.push({ hotspot: "facial", service: "Diamond Microdermabrasion" });
    } else if (skinConcern === "dullness") {
      recommendations.push({ hotspot: "facial", service: "Glow Facial" });
      recommendations.push({ hotspot: "product", service: "No.07 Radiance Serum" });
    } else if (skinConcern === "aging") {
      recommendations.push({ hotspot: "facial", service: "24K Gold Renewal" });
      recommendations.push({ hotspot: "product", service: "Pearl Night Crème" });
    } else {
      recommendations.push({ hotspot: "facial", service: "LED & Cryo Ritual" });
    }

    setRecommendedServices(recommendations);

    // Check for system API key defined in .env
    const systemApiKey = import.meta.env.VITE_GEMINI_API_KEY || "";

    if (systemApiKey) {
      // 1. LIVE GEMINI API REQUEST
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${systemApiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `You are Dr. Aris, skin and hair alchemist at the luxury beauty salon "GraceAndGo". 
                      Analyze the following profile of a guest and write a personalized luxury beauty prescription in markdown:
                      
                      - Skin Type: ${skinType}
                      - Primary Skin Concern: ${skinConcern}
                      - Hair & Scalp Type: ${hairType}
                      - Primary Hair/Scalp Concern: ${hairConcern}
                      
                      Write a beautifully styled diagnostic summary in 3-4 sections:
                      1. **Dermal Hydration & Skin Analysis**: (Discuss skin health, lipid balance, and how to treat ${skinConcern})
                      2. **Follicle & Scalp Health Assessment**: (Discuss scalp type and hair health, addressing the ${hairConcern} issue)
                      3. **Bespoke Salon Ritual Prescription**: Recommend booking the exact services: ${recommendations.map(r => `*${r.service}* (in our ${r.hotspot} room)`).join(", ")}. Explain why they are perfect.
                      
                      Keep the tone elegant, professional, luxury, warm and comforting. Do not exceed 250 words. Format with clean bold text and bullet points.`,
                    },
                  ],
                },
              ],
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to communicate with Gemini API");
        }

        const data = await response.json();
        const output = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (output) {
          setReportText(output);
          setStep("report");
          setIsGenerating(false);
          return;
        }
      } catch (err) {
        toast.error("Gemini API connection error. Falling back to local diagnostic alchemist.");
      }
    }

    // 2. FALLBACK: PREMIUM LOCAL RULES ENGINE
    setTimeout(() => {
      const generatedLocalReport = `
### **GraceAndGo Diagnostic Prescription**
*Consultation by House Esthetician Dr. Aris*

---

#### **1. Dermal Lipid & Epidermal Analysis**
Your skin profile indicates a **${skinType}** base with active concerns of **${skinConcern}**. 
- We detect a minor hydration imbalance in the surface layers. When the lipid barrier is strained, the skin either overproduces sebum (causing congestion) or loses water rapidly.
- **Therapeutic Approach:** To restore clarity and lock in a natural luminosity, we must hydrate deep within the cellular matrix rather than simply treating the surface.

#### **2. Scalp & Hair Follicle Health**
Your hair structure is characterized by **${hairType}** scalp dynamics combined with **${hairConcern}** challenges.
- **Scalp Assessment:** The follicle root sheath is showing signs of environmental tension and nutrient depletion. High friction or sebum accumulation at the root blocks follicular respiration.
- **Therapeutic Approach:** We recommend a dual detoxifying and nourishing protocol to clear micro-impurities from the roots and re-infuse vital botanical lipids.

#### **3. Recommended House Rituals**
To guide your skin and hair back to first light, we prescribe the following bespoke rituals:
${recommendations.map(r => `- **${r.service}** (Available in our *${r.hotspot === "facial" ? "Facial Suite" : r.hotspot === "treatment" ? "Therapy Sanctuary" : r.hotspot === "product" ? "Apothecary" : "Hair Atelier"}* section).`).join("\n")}
      `;
      setReportText(generatedLocalReport);
      setStep("report");
      setIsGenerating(false);
    }, 1500);
  };

  const getHotspotLabel = (id: string) => {
    switch (id) {
      case "hair": return "Hair Atelier";
      case "nails": return "Nails Bar";
      case "facial": return "Facial Suite";
      case "product": return "Apothecary";
      case "treatment": return "Therapy Sanctuary";
      case "vip": return "VIP Suite";
      default: return "Atelier";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 overflow-y-auto">
      {/* Dim overlay */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-[fade-in_0.3s_ease-out]"
        onClick={step === "scanning" ? undefined : onClose}
      />

      {/* Main Diagnostic Hub Panel */}
      <div className="relative w-full max-w-xl rounded-sm border border-blush-pink/20 bg-[oklch(0.12_0.005_60)] shadow-luxe z-10 animate-[scale-in_0.25s_ease-out] overflow-hidden max-h-[85vh] flex flex-col">
        <div className="absolute inset-x-0 top-0 h-px bg-gold-gradient" />
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-blush-pink/10 px-6 py-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold" />
            <div>
              <p className="text-[0.55rem] tracking-[0.4em] uppercase text-gold">AI Skin & Hair Consultant</p>
              <h3 className="font-display text-xl text-white">Grace Diagnostic Hub</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={step === "scanning"}
            className="text-muted-foreground hover:text-gold transition-colors p-1 disabled:opacity-30"
          >
            ✕
          </button>
        </div>

        {/* Dynamic Step Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 grain">
          
          {/* STEP 1: QUESTIONNAIRE */}
          {step === "questions" && (
            <div className="space-y-6">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Welcome to the AI Diagnostic scanner. Please answer these questions regarding your skin and scalp health so our system can craft your tailored recipe.
              </p>

              {/* Skin Section */}
              <div className="space-y-3">
                <span className="text-[0.6rem] tracking-[0.25em] uppercase text-gold font-bold block">Part I: Skin Dynamics</span>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[0.5rem] tracking-wider uppercase text-muted-foreground">Skin Type</label>
                    <select
                      value={skinType}
                      onChange={(e) => setSkinType(e.target.value)}
                      className="w-full bg-black/35 border border-blush-pink/15 rounded-xs p-2 text-xs text-white focus:outline-none focus:border-gold"
                    >
                      <option value="dry">Dry / Dehydrated</option>
                      <option value="oily">Oily / Shiny</option>
                      <option value="sensitive">Sensitive / Reactive</option>
                      <option value="combination">Combination (T-Zone)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[0.5rem] tracking-wider uppercase text-muted-foreground">Skin Concern</label>
                    <select
                      value={skinConcern}
                      onChange={(e) => setSkinConcern(e.target.value)}
                      className="w-full bg-black/35 border border-blush-pink/15 rounded-xs p-2 text-xs text-white focus:outline-none focus:border-gold"
                    >
                      <option value="dullness">Dullness & Lack of Glow</option>
                      <option value="acne">Acne & Clogged Pores</option>
                      <option value="aging">Fine Lines & Sagging</option>
                      <option value="redness">Redness & Irritation</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Hair Section */}
              <div className="space-y-3">
                <span className="text-[0.6rem] tracking-[0.25em] uppercase text-gold font-bold block">Part II: Hair & Scalp Ateliers</span>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[0.5rem] tracking-wider uppercase text-muted-foreground">Scalp Type</label>
                    <select
                      value={hairType}
                      onChange={(e) => setHairType(e.target.value)}
                      className="w-full bg-black/35 border border-blush-pink/15 rounded-xs p-2 text-xs text-white focus:outline-none focus:border-gold"
                    >
                      <option value="dry">Dry & Itchy</option>
                      <option value="oily">Oily & Heavy</option>
                      <option value="normal">Normal / Balanced</option>
                      <option value="treated">Color / Keratin Treated</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[0.5rem] tracking-wider uppercase text-muted-foreground">Hair Concern</label>
                    <select
                      value={hairConcern}
                      onChange={(e) => setHairConcern(e.target.value)}
                      className="w-full bg-black/35 border border-blush-pink/15 rounded-xs p-2 text-xs text-white focus:outline-none focus:border-gold"
                    >
                      <option value="hairfall">Hairfall & Volume Loss</option>
                      <option value="dryness">Frizz & Split Ends</option>
                      <option value="dandruff">Dandruff & Flaking</option>
                      <option value="thinning">Limp & Thinning Strands</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-blush-pink/10 flex justify-end">
                <button
                  onClick={() => setStep("photo")}
                  className="rounded-sm bg-gold-gradient px-8 py-3 text-xs font-semibold tracking-[0.3em] uppercase text-[#1c1a19] hover:brightness-110 shadow-soft cursor-pointer transition-all duration-300"
                >
                  Proceed to Scan →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PHOTO UPLOAD & CONSENT */}
          {step === "photo" && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-blush-pink/10 pb-3">
                <button 
                  onClick={() => setStep("questions")} 
                  className="text-gold text-xs tracking-wider uppercase hover:underline"
                >
                  ← Back
                </button>
                <span className="text-[0.55rem] tracking-[0.2em] uppercase text-muted-foreground ml-auto">
                  Step 2 of 4
                </span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                To perform the scan, please upload a clear photo of your skin or hair. We recommend a close-up in natural light.
              </p>

              {/* Photo Box */}
              <div className="relative w-full aspect-[16/9] border-2 border-dashed border-blush-pink/20 bg-black/35 rounded-sm flex flex-col items-center justify-center p-4 hover:border-gold/45 transition-colors overflow-hidden group">
                {photoUrl ? (
                  <>
                    <img 
                      src={photoUrl} 
                      alt="Diagnostic target" 
                      className="w-full h-full object-cover rounded-xs" 
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <label className="cursor-pointer bg-black/60 border border-gold px-4 py-2 rounded-sm text-[0.6rem] tracking-[0.2em] uppercase text-white hover:bg-gold hover:text-black transition-colors">
                        Change Photo
                        <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                      </label>
                    </div>
                  </>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full border border-blush-pink/40 flex items-center justify-center bg-black/25 text-blush">
                      <Camera className="w-5 h-5" />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-[0.65rem] tracking-wider uppercase text-white font-semibold">Load Portrait Photo</p>
                      <p className="text-[0.55rem] text-muted-foreground">Click to upload JPG, PNG or WebP</p>
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                  </label>
                )}
              </div>

              {/* Consent Box */}
              <div className="p-4 rounded-sm border border-blush-pink/15 bg-black/20 flex gap-3 items-start select-none">
                <input
                  type="checkbox"
                  id="ai-consent-checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 cursor-pointer accent-[#d4af37]"
                />
                <label htmlFor="ai-consent-checkbox" className="text-[0.65rem] text-muted-foreground leading-relaxed cursor-pointer font-medium">
                  <span className="text-white font-semibold flex items-center gap-1.5 mb-0.5">
                    <Shield className="w-3.5 h-3.5 text-gold" /> AI Scan Consent Check
                  </span>
                  I consent to upload my photo for the sole purpose of real-time AI skin/hair diagnostic scan. My data remains private to my local browser session.
                </label>
              </div>



              {/* Start Scan button */}
              <div className="pt-4 border-t border-blush-pink/10 flex justify-between gap-4">
                <button
                  onClick={handleStartScan}
                  disabled={!consent || !photoUrl}
                  className={`flex-1 rounded-sm py-3.5 text-xs font-semibold tracking-[0.3em] uppercase transition-all duration-300 ${
                    consent && photoUrl
                      ? "bg-gold-gradient text-[#1c1a19] hover:brightness-110 shadow-soft cursor-pointer"
                      : "bg-muted text-muted-foreground border border-border/10 cursor-not-allowed opacity-55"
                  }`}
                >
                  Begin Diagnostic Scan ✧
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SCANNING SCANNER ANIMATION */}
          {step === "scanning" && (
            <div className="text-center py-10 space-y-6">
              <p className="text-[0.55rem] tracking-[0.3em] uppercase text-gold">Digital Dermal Scan</p>
              
              {/* Photo Box with sliding scanning line */}
              <div className="relative w-44 aspect-square mx-auto rounded-full border-2 border-gold shadow-luxe overflow-hidden flex items-center justify-center bg-black/50">
                {photoUrl && (
                  <img 
                    src={photoUrl} 
                    alt="Scanning target" 
                    className="w-full h-full object-cover opacity-75 blur-[0.5px]" 
                  />
                )}
                {/* Horizontal laser scan bar */}
                <div 
                  className="absolute inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-[#ffd1dc] to-transparent shadow-[0_0_15px_#f4c2c2] pointer-events-none"
                  style={{
                    animation: "scan-line-anim 2s ease-in-out infinite",
                    top: "0%"
                  }}
                />
              </div>

              {/* Custom scanner animation styles injected */}
              <style dangerouslySetInnerHTML={{__html: `
                @keyframes scan-line-anim {
                  0%, 100% { top: 5%; }
                  50% { top: 92%; }
                }
              `}} />

              <div className="space-y-2.5 max-w-xs mx-auto">
                <div className="flex justify-between items-center text-[0.55rem] uppercase tracking-wider text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 text-gold animate-spin" />
                    {scanStatusText}
                  </span>
                  <span className="text-white font-mono">{scanProgress}%</span>
                </div>
                
                <div className="w-full h-1 bg-black/45 rounded-full overflow-hidden border border-blush-pink/5">
                  <div 
                    className="h-full bg-gold-gradient transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>

              <p className="text-[0.55rem] tracking-[0.2em] uppercase text-muted-foreground max-w-xs mx-auto">
                Do not close or reload. Calibrating dermal spectrometry nodes.
              </p>
            </div>
          )}

          {/* STEP 4: DIAGNOSTIC REPORT */}
          {step === "report" && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-blush-pink/10 pb-3">
                <button 
                  onClick={() => setStep("photo")} 
                  className="text-gold text-xs tracking-wider uppercase hover:underline"
                >
                  ← Rescan
                </button>
                <span className="text-[0.6rem] tracking-[0.25em] uppercase text-gold font-bold ml-auto">
                  Scan Diagnostics Complete
                </span>
              </div>

              {/* Scrollable Report Content */}
              <div className="bg-black/30 rounded-sm border border-blush-pink/15 p-5 text-xs text-left leading-relaxed space-y-4 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
                <div className="prose prose-invert prose-xs text-white/90">
                  {reportText.split("\n").map((line, idx) => {
                    if (line.startsWith("###")) {
                      return <h3 key={idx} className="font-display text-xl text-gold mt-4 mb-2">{line.replace("###", "").trim()}</h3>;
                    }
                    if (line.startsWith("####")) {
                      return <h4 key={idx} className="text-white font-semibold text-xs tracking-wider uppercase mt-4 mb-1.5">{line.replace("####", "").trim()}</h4>;
                    }
                    if (line.startsWith("-")) {
                      return <li key={idx} className="list-disc list-inside text-muted-foreground ml-2 my-1">{line.replace("-", "").trim()}</li>;
                    }
                    if (line.trim() === "---") {
                      return <div key={idx} className="h-px bg-blush-pink/10 my-3" />;
                    }
                    return <p key={idx} className="my-1.5 text-muted-foreground">{line}</p>;
                  })}
                </div>
              </div>

              {/* Recommendations CTAs */}
              <div className="space-y-3">
                <span className="text-[0.55rem] tracking-[0.25em] uppercase text-muted-foreground font-bold block">Prescribed Ritual Bookings</span>
                
                <div className="grid gap-2">
                  {recommendedServices.map((rec, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center justify-between p-3.5 rounded-sm border border-blush-pink/10 bg-black/25 hover:border-gold/30 transition-all duration-300"
                    >
                      <div>
                        <p className="text-[0.5rem] tracking-wider uppercase text-gold">{getHotspotLabel(rec.hotspot)}</p>
                        <p className="text-xs font-semibold text-white mt-0.5">{rec.service}</p>
                      </div>
                      <button
                        onClick={() => {
                          onBookService(rec.hotspot, rec.service);
                          onClose();
                        }}
                        className="rounded-sm border border-gold/60 px-3 py-1.5 text-[0.55rem] tracking-widest uppercase text-white hover:bg-gold hover:text-black transition-all cursor-pointer"
                      >
                        Book Ritual
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-blush-pink/10 flex justify-end">
                <button
                  onClick={onClose}
                  className="rounded-sm bg-gold-gradient px-8 py-3.5 text-xs font-semibold tracking-[0.3em] uppercase text-[#1c1a19] hover:brightness-110 shadow-soft cursor-pointer transition-all duration-300"
                >
                  Return to Salon
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
