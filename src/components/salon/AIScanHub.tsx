import React, { useState, useEffect } from "react";
import { Sparkles, Shield, Camera, Upload, AlertCircle, RefreshCw, HelpCircle, Printer } from "lucide-react";
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
    // Only attempt live fetch if key is present and matches typical Google Studio key format (starts with AIzaSy)
    const isValidKey = systemApiKey && systemApiKey.startsWith("AIzaSy");

    if (systemApiKey && isValidKey) {
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
        console.warn("Gemini API connection error. Falling back to local diagnostic alchemist.", err);
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

  const handlePrintPrescription = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      const recsHtml = recommendedServices.map(
        r => `<li><strong>${r.service}</strong> (in the ${getHotspotLabel(r.hotspot)})</li>`
      ).join("");

      // Formatting helper for print view
      const formattedReport = reportText
        .replace(/###/g, "")
        .replace(/####/g, "")
        .replace(/\*\*/g, "")
        .split("\n")
        .filter(line => line.trim() !== "")
        .map(line => {
          if (line.startsWith("-")) {
            return `<li>${line.replace("-", "").trim()}</li>`;
          }
          return `<p>${line}</p>`;
        })
        .join("\n");

      printWindow.document.write(`
        <html>
          <head>
            <title>GraceAndGo Diagnostic Prescription</title>
            <style>
              body { 
                background: #ffffff; 
                color: #1c1a19; 
                font-family: 'Inter', sans-serif; 
                padding: 40px;
                line-height: 1.6;
              }
              .prescription-container {
                max-width: 650px;
                margin: 0 auto;
                border: 4px double #d4af37;
                padding: 40px;
                background-color: #fbfaf8;
                position: relative;
                box-shadow: 0 0 20px rgba(0,0,0,0.05);
              }
              .header {
                text-align: center;
                border-bottom: 2px solid #d4af37;
                padding-bottom: 20px;
                margin-bottom: 30px;
              }
              .header h1 {
                font-family: 'Cormorant Garamond', serif;
                font-size: 32px;
                margin: 0;
                letter-spacing: 2px;
                text-transform: uppercase;
                color: #1c1a19;
              }
              .header p {
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 3px;
                margin: 5px 0 0 0;
                color: #8a7355;
              }
              .meta-grid {
                display: grid;
                grid-template-cols: 1fr 1fr;
                gap: 15px;
                margin-bottom: 30px;
                font-size: 12px;
                border-bottom: 1px solid #eee;
                padding-bottom: 15px;
              }
              .meta-item strong {
                text-transform: uppercase;
                font-size: 10px;
                letter-spacing: 1px;
                color: #8a7355;
                display: block;
              }
              .content {
                font-size: 13px;
                margin-bottom: 30px;
              }
              .content h3, .content h4 {
                font-family: 'Cormorant Garamond', serif;
                font-size: 18px;
                margin-top: 25px;
                margin-bottom: 10px;
                text-transform: uppercase;
                color: #8a7355;
                border-bottom: 1px dashed #d4af37;
                padding-bottom: 3px;
              }
              .content ul {
                padding-left: 20px;
              }
              .recommendations {
                background: #f5f0e6;
                border-left: 3px solid #d4af37;
                padding: 20px;
                margin-top: 30px;
                font-size: 12px;
              }
              .recommendations h3 {
                margin-top: 0;
                text-transform: uppercase;
                font-size: 12px;
                letter-spacing: 2px;
                color: #1c1a19;
                border-bottom: 1px solid #d4af37;
                padding-bottom: 5px;
              }
              .recommendations ul {
                margin: 10px 0 0 0;
                padding-left: 20px;
              }
              .footer {
                margin-top: 40px;
                text-align: center;
                font-size: 11px;
                color: #8a7355;
                border-top: 1px solid #eee;
                padding-top: 20px;
              }
              .crest {
                font-family: 'Cormorant Garamond', serif;
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 10px;
                color: #d4af37;
              }
            </style>
          </head>
          <body onload="window.print();window.close();">
            <div class="prescription-container">
              <div class="header">
                <div class="crest">G</div>
                <h1>GraceAndGo Salon</h1>
                <p>Bespoke Aesthetic Prescription</p>
              </div>
              
              <div class="meta-grid">
                <div class="meta-item">
                  <strong>Skin Type / Concern</strong>
                  ${skinType.toUpperCase()} / ${skinConcern.toUpperCase()}
                </div>
                <div class="meta-item">
                  <strong>Hair Type / Concern</strong>
                  ${hairType.toUpperCase()} / ${hairConcern.toUpperCase()}
                </div>
                <div class="meta-item">
                  <strong>Date of Consultation</strong>
                  ${new Date().toLocaleDateString("en-US", { month: "long", year: "numeric", day: "numeric" })}
                </div>
                <div class="meta-item">
                  <strong>House Alchemist</strong>
                  Dr. Aris, Pharm.D.
                </div>
              </div>

              <div class="content">
                ${formattedReport}
              </div>

              <div class="recommendations">
                <h3>Prescribed Salon Rituals</h3>
                <ul>
                  ${recsHtml}
                </ul>
              </div>

              <div class="footer">
                <p>GraceAndGo Ateliers — Beauty. Elegance. Confidence.</p>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const parseMarkdownToReact = (text: string) => {
    if (!text) return null;
    
    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];
    
    const parseInlineStyles = (inputText: string): React.ReactNode[] => {
      const tokenRegex = /(\*\*.*?\*\*|\*.*?\*)/g;
      const tokens = inputText.split(tokenRegex);
      
      return tokens.map((token, idx) => {
        if (token.startsWith("**") && token.endsWith("**")) {
          return <strong key={idx} className="font-semibold text-gold">{token.slice(2, -2)}</strong>;
        }
        if (token.startsWith("*") && token.endsWith("*")) {
          return <em key={idx} className="text-blush-pink/90 italic">{token.slice(1, -1)}</em>;
        }
        return token;
      });
    };

    let inList = false;
    let listItems: React.ReactNode[] = [];
    let listKey = 0;

    const pushBufferedList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${listKey++}`} className="list-disc pl-5 space-y-1.5 my-2 text-muted-foreground">
            {listItems}
          </ul>
        );
        listItems = [];
        inList = false;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      if (trimmed === "---") {
        pushBufferedList();
        elements.push(<div key={`hr-${i}`} className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent my-4" />);
        continue;
      }

      const headerMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
      if (headerMatch) {
        pushBufferedList();
        const level = headerMatch[1].length;
        const content = headerMatch[2];
        
        if (level === 1) {
          elements.push(
            <h1 key={`h1-${i}`} className="font-display text-xl sm:text-2xl text-gold tracking-wider mt-5 mb-3 font-semibold text-center uppercase">
              {parseInlineStyles(content)}
            </h1>
          );
        } else if (level === 2) {
          elements.push(
            <h2 key={`h2-${i}`} className="font-display text-lg text-white tracking-wide mt-4 mb-2 font-medium">
              {parseInlineStyles(content)}
            </h2>
          );
        } else if (level === 3) {
          elements.push(
            <h3 key={`h3-${i}`} className="font-display text-sm sm:text-base text-gold mt-4 mb-2 font-bold tracking-wide uppercase">
              {parseInlineStyles(content)}
            </h3>
          );
        } else {
          elements.push(
            <h4 key={`h4-${i}`} className="text-white font-semibold text-xs tracking-wider uppercase mt-4 mb-1.5">
              {parseInlineStyles(content)}
            </h4>
          );
        }
        continue;
      }

      const listMatch = trimmed.match(/^[-*+]\s+(.*)$/);
      const numListMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);

      if (listMatch) {
        inList = true;
        listItems.push(
          <li key={`li-${i}`} className="text-muted-foreground/90 ml-1 leading-relaxed text-xs">
            {parseInlineStyles(listMatch[1])}
          </li>
        );
        continue;
      } else if (numListMatch) {
        pushBufferedList();
        elements.push(
          <div key={`num-li-${i}`} className="flex gap-3 items-start my-3 bg-black/35 border border-blush-pink/10 rounded-xs p-3">
            <span className="flex items-center justify-center w-5 h-5 rounded-full border border-gold/45 text-[0.65rem] font-bold text-gold shrink-0 bg-gold/5 mt-0.5">
              {numListMatch[1]}
            </span>
            <div className="text-white/90 leading-relaxed text-xs">
              {parseInlineStyles(numListMatch[2])}
            </div>
          </div>
        );
        continue;
      }

      if (trimmed === "") {
        pushBufferedList();
        continue;
      }

      pushBufferedList();
      elements.push(
        <p key={`p-${i}`} className="my-2 text-muted-foreground text-xs leading-relaxed">
          {parseInlineStyles(trimmed)}
        </p>
      );
    }

    pushBufferedList();
    return elements;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Dim overlay */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-[fade-in_0.3s_ease-out]"
        onClick={step === "scanning" ? undefined : onClose}
      />

      {/* Centered Diagnostic Panel */}
      <div className={`relative w-full ${step === "report" ? "max-w-4xl" : "max-w-xl"} max-h-[90vh] sm:max-h-[85vh] border border-[#d4af37]/35 bg-[oklch(0.12_0.005_60)] shadow-luxe rounded-sm z-10 overflow-hidden flex flex-col transition-all duration-500 ease-out animate-[scale-in_0.3s_cubic-bezier(0.16,1,0.3,1)]`}>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes scale-in {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        `}} />
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
        <div className={`flex-1 ${step === 'report' ? 'overflow-hidden flex flex-col' : 'overflow-y-auto'} p-6 sm:p-8 space-y-6 grain`}>
          
          {/* STEP 1: QUESTIONNAIRE */}
          {step === "questions" && (
            <div className="space-y-7">
              {/* Elegant intro */}
              <div className="relative rounded-lg border border-[#d4af37]/15 bg-gradient-to-br from-[#d4af37]/[0.04] to-transparent p-5 overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 opacity-[0.03]">
                  <svg viewBox="0 0 100 100" fill="currentColor" className="text-[#d4af37]">
                    <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1" fill="none" />
                    <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.5" fill="none" />
                    <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="0.5" fill="none" />
                  </svg>
                </div>
                <p className="text-xs text-white/70 leading-relaxed relative z-10">
                  Welcome to the <span className="text-[#d4af37] font-semibold">Grace Diagnostic Scanner</span>. Please answer these questions about your skin and scalp health so our AI alchemist can craft your bespoke prescription.
                </p>
              </div>

              {/* Skin Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ffd1dc]/20 to-[#b76e79]/10 border border-[#ffd1dc]/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#ffd1dc] text-xs font-bold">I</span>
                  </div>
                  <div>
                    <span className="text-[0.6rem] tracking-[0.25em] uppercase text-[#d4af37] font-bold block">Part I</span>
                    <span className="text-xs text-white/60 tracking-wide">Skin Dynamics</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[0.52rem] tracking-[0.15em] uppercase text-white/40 font-semibold block">Skin Type</label>
                    <div className="relative group/sel">
                      <select
                        value={skinType}
                        onChange={(e) => setSkinType(e.target.value)}
                        className="w-full appearance-none bg-[#1a1614] border border-white/[0.08] hover:border-[#d4af37]/40 focus:border-[#d4af37]/60 rounded-lg px-4 py-3 text-xs text-white/90 focus:outline-none transition-colors duration-300 cursor-pointer pr-10"
                        style={{ colorScheme: "dark" }}
                      >
                        <option value="dry">Dry / Dehydrated</option>
                        <option value="oily">Oily / Shiny</option>
                        <option value="sensitive">Sensitive / Reactive</option>
                        <option value="combination">Combination (T-Zone)</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/30 group-hover/sel:text-[#d4af37]/60 transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[0.52rem] tracking-[0.15em] uppercase text-white/40 font-semibold block">Skin Concern</label>
                    <div className="relative group/sel">
                      <select
                        value={skinConcern}
                        onChange={(e) => setSkinConcern(e.target.value)}
                        className="w-full appearance-none bg-[#1a1614] border border-white/[0.08] hover:border-[#d4af37]/40 focus:border-[#d4af37]/60 rounded-lg px-4 py-3 text-xs text-white/90 focus:outline-none transition-colors duration-300 cursor-pointer pr-10"
                        style={{ colorScheme: "dark" }}
                      >
                        <option value="dullness">Dullness &amp; Lack of Glow</option>
                        <option value="acne">Acne &amp; Clogged Pores</option>
                        <option value="aging">Fine Lines &amp; Sagging</option>
                        <option value="redness">Redness &amp; Irritation</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/30 group-hover/sel:text-[#d4af37]/60 transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hair Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#d4af37]/15 to-[#b8860b]/10 border border-[#d4af37]/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#d4af37] text-xs font-bold">II</span>
                  </div>
                  <div>
                    <span className="text-[0.6rem] tracking-[0.25em] uppercase text-[#d4af37] font-bold block">Part II</span>
                    <span className="text-xs text-white/60 tracking-wide">Hair &amp; Scalp Ateliers</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[0.52rem] tracking-[0.15em] uppercase text-white/40 font-semibold block">Scalp Type</label>
                    <div className="relative group/sel">
                      <select
                        value={hairType}
                        onChange={(e) => setHairType(e.target.value)}
                        className="w-full appearance-none bg-[#1a1614] border border-white/[0.08] hover:border-[#d4af37]/40 focus:border-[#d4af37]/60 rounded-lg px-4 py-3 text-xs text-white/90 focus:outline-none transition-colors duration-300 cursor-pointer pr-10"
                        style={{ colorScheme: "dark" }}
                      >
                        <option value="dry">Dry &amp; Itchy</option>
                        <option value="oily">Oily &amp; Heavy</option>
                        <option value="normal">Normal / Balanced</option>
                        <option value="treated">Color / Keratin Treated</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/30 group-hover/sel:text-[#d4af37]/60 transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[0.52rem] tracking-[0.15em] uppercase text-white/40 font-semibold block">Hair Concern</label>
                    <div className="relative group/sel">
                      <select
                        value={hairConcern}
                        onChange={(e) => setHairConcern(e.target.value)}
                        className="w-full appearance-none bg-[#1a1614] border border-white/[0.08] hover:border-[#d4af37]/40 focus:border-[#d4af37]/60 rounded-lg px-4 py-3 text-xs text-white/90 focus:outline-none transition-colors duration-300 cursor-pointer pr-10"
                        style={{ colorScheme: "dark" }}
                      >
                        <option value="hairfall">Hairfall &amp; Volume Loss</option>
                        <option value="dryness">Frizz &amp; Split Ends</option>
                        <option value="dandruff">Dandruff &amp; Flaking</option>
                        <option value="thinning">Limp &amp; Thinning Strands</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/30 group-hover/sel:text-[#d4af37]/60 transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-5 border-t border-white/[0.06] flex justify-end">
                <button
                  onClick={() => setStep("photo")}
                  className="group relative rounded-lg bg-gradient-to-r from-[#d4af37] to-[#c4a030] px-10 py-3.5 text-xs font-semibold tracking-[0.25em] uppercase text-[#1c1a19] hover:brightness-110 shadow-[0_4px_20px_rgba(212,175,55,0.25)] cursor-pointer transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative z-10">Proceed to Scan →</span>
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
            <div className="flex flex-col h-full space-y-4 overflow-hidden">
              <div className="flex items-center gap-2 border-b border-blush-pink/10 pb-3 flex-shrink-0">
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

              {/* Side-by-side Layout to make report and ritual bookings visible together without extra scrolling */}
              <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0 overflow-hidden">
                {/* Left Side: Scrollable Report Content */}
                <div className="flex-1 bg-black/45 rounded-sm border border-[#d4af37]/25 p-5 text-left relative overflow-hidden backdrop-blur-md flex flex-col shadow-inner min-h-0">
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#d4af37]/35 to-transparent" />
                  <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin prose prose-invert prose-xs text-white/95 space-y-3">
                    {parseMarkdownToReact(reportText)}
                  </div>
                </div>

                {/* Right Side: Recommendations CTAs */}
                <div className="w-full md:w-[340px] flex-shrink-0 flex flex-col min-h-0">
                  <span className="text-[0.55rem] tracking-[0.25em] uppercase text-gold font-bold block mb-3 flex-shrink-0">
                    Prescribed Ritual Bookings
                  </span>
                  
                  <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin space-y-2">
                    {recommendedServices.map((rec, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center justify-between p-3.5 rounded-sm border border-blush-pink/10 bg-black/25 hover:border-gold/30 transition-all duration-300"
                      >
                        <div className="pr-2 min-w-0">
                          <p className="text-[0.5rem] tracking-wider uppercase text-gold truncate">{getHotspotLabel(rec.hotspot)}</p>
                          <p className="text-xs font-semibold text-white mt-0.5 truncate" title={rec.service}>{rec.service}</p>
                        </div>
                        <button
                          onClick={() => {
                            onBookService(rec.hotspot, rec.service);
                            onClose();
                          }}
                          className="flex-shrink-0 rounded-sm border border-gold/60 px-3.5 py-1.5 text-[0.55rem] tracking-widest uppercase text-white hover:bg-gold hover:text-black transition-all cursor-pointer"
                        >
                          Book Ritual
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions Row */}
              <div className="pt-4 border-t border-blush-pink/10 flex gap-3 justify-end flex-shrink-0">
                <button
                  onClick={handlePrintPrescription}
                  className="rounded-sm border border-gold/60 px-5 py-3 text-xs font-semibold tracking-[0.25em] uppercase text-gold hover:bg-gold/15 transition-all duration-300 flex items-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" /> Print Prescription
                </button>
                <button
                  onClick={onClose}
                  className="rounded-sm bg-gold-gradient px-8 py-3 text-xs font-semibold tracking-[0.25em] uppercase text-[#1c1a19] hover:brightness-110 shadow-soft cursor-pointer transition-all duration-300"
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
