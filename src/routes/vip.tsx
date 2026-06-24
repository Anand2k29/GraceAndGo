import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React, { useState, useEffect } from "react";
import { Sparkles, Printer, User, Phone, Calendar, Mail, Share2, Award, Copy, Check, ShieldCheck, HelpCircle, ArrowLeft, Trophy } from "lucide-react";
import { toast } from "sonner";
import AIScanHub from "@/components/salon/AIScanHub";
import ServiceOverlay from "@/components/salon/ServiceOverlay";
import type { HotspotId } from "@/components/salon/SalonScene";

export const Route = createFileRoute("/vip")({
  head: () => ({
    meta: [
      { title: "GraceAndGo VIP Portal — Luxury Salon Membership" },
      {
        name: "description",
        content: "Access your VIP membership card, dynamic rewards, personalized AI skin/hair consultation, and direct booking catalogs.",
      },
    ],
  }),
  component: VIPPortal,
});

interface UserProfile {
  name: string;
  phone: string;
  dob: string;
  email: string;
  gender: "male" | "female";
  memberId: string;
  joinedDate: string;
}

// Services data specifically formatted for cards
const SERVICES_CATALOG = [
  {
    category: "hair",
    atelier: "Hair Atelier",
    tagline: "Couture cuts, color & ceremonial styling by master stylists.",
    services: [
      { name: "Signature Cut & Style", duration: "75 min", price: "₹4,500", desc: "Signature ladies' cut with premium blow-out.", gender: "female" },
      { name: "Balayage Composition", duration: "180 min", price: "₹9,500", desc: "Bespoke hand-painted balayage composition.", gender: "female", note: "Most requested" },
      { name: "Silk Press Ritual", duration: "120 min", price: "₹6,500", desc: "Thermal hair straightening with moisture infusion.", gender: "female" },
      { name: "Bridal Atelier Package", duration: "240 min", price: "₹18,000", desc: "Ultimate wedding styling, veil placement & trial.", gender: "female" },
      { name: "Classic Contour Cut & Shave", duration: "60 min", price: "₹3,000", desc: "Contour shear cut combined with hot towel straight razor shave.", gender: "male" },
      { name: "Beard Grooming Ritual", duration: "45 min", price: "₹2,200", desc: "Beard trim, line up, styling, and essential oil treatment.", gender: "male" },
      { name: "Scalp Detox & Cut", duration: "75 min", price: "₹4,500", desc: "Clarifying scrub to clear scalp build-up with classic cut.", gender: "male" },
      { name: "Groom's Atelier Styling", duration: "150 min", price: "₹12,000", desc: "Executive grooming package: cut, shave, face mask & styling.", gender: "male" },
    ]
  },
  {
    category: "nails",
    atelier: "Nails Bar",
    tagline: "Hand-painted organic art on champagne-marble manicures.",
    services: [
      { name: "Grace Manicure", duration: "45 min", price: "₹2,200", desc: "File, cuticle care, hand massage & organic polish.", gender: "female" },
      { name: "Gel Sculpture", duration: "75 min", price: "₹3,500", desc: "UV extensions sculpted with customized art.", gender: "female" },
      { name: "Pedicure Grace", duration: "60 min", price: "₹2,800", desc: "Pedicure lounge foot soak, massage, and polish.", gender: "female" },
      { name: "Crystal Couture Set", duration: "120 min", price: "₹6,000", desc: "Full set acrylic extension with Swarovski gems.", gender: "female" },
      { name: "Gentleman's Hand Care & Buff", duration: "35 min", price: "₹1,800", desc: "Cuticle care, nail buff & shape, relaxing hand massage.", gender: "male" },
      { name: "Sports Pedicure & Massage", duration: "50 min", price: "₹2,400", desc: "Athlete foot scrub, callus clearing, and foot massage.", gender: "male" },
      { name: "Executive Hand & Foot Ritual", duration: "90 min", price: "₹3,800", desc: "Full grooming manicure and pedicure duo with warm massage.", gender: "male" },
    ]
  },
  {
    category: "facial",
    atelier: "Facial Suite",
    tagline: "Bespoke skincare protocols in private luxury chambers.",
    services: [
      { name: "Glow Facial", duration: "60 min", price: "₹6,500", desc: "Hydration treatment with botanical extracts for instant radiance.", gender: "female" },
      { name: "Diamond Microdermabrasion", duration: "75 min", price: "₹9,000", desc: "Resurfacing treatment for scars, fine lines & pores.", gender: "female" },
      { name: "LED & Cryo Ritual", duration: "90 min", price: "₹11,000", desc: "Cryo toning combined with LED cell therapy.", gender: "female", note: "VIP exclusive" },
      { name: "24K Gold Renewal", duration: "120 min", price: "₹16,500", desc: "Ultimate anti-aging facial with real 24k gold leaf compression.", gender: "female" },
      { name: "Active Charcoal Facial", duration: "60 min", price: "₹5,500", desc: "Deep pore charcoal extraction for blackheads and oil control.", gender: "male" },
      { name: "Skin Hydrating Beard Facial", duration: "70 min", price: "₹6,000", desc: "High-hydration facial formulated to treat skin under facial hair.", gender: "male" },
      { name: "Gentleman's Pore Refining Detox", duration: "90 min", price: "₹8,000", desc: "Microdermabrasion combined with dynamic oxygen infusion.", gender: "male" },
    ]
  },
  {
    category: "treatment",
    atelier: "Therapy Sanctuary",
    tagline: "Rejuvenating head spas, scalp detox & organic oil infusions.",
    services: [
      { name: "Signature Hair Spa Treatment", duration: "90 min", price: "₹5,800", desc: "Scalp exfoliation, steam treatment & nourishing cream mask.", gender: "female" },
      { name: "Scalp Detoxification Ritual", duration: "60 min", price: "₹4,200", desc: "Micro-peel treatment for scalp dryness and build-up.", gender: "female" },
      { name: "Ayurvedic Hair & Scalp Therapy", duration: "75 min", price: "₹4,800", desc: "Authentic warm herbal oil infusion & pressure point massage.", gender: "female" },
      { name: "Keratin Restorative Treatment", duration: "120 min", price: "₹8,500", desc: "Restructure protein levels in dry/damaged hair.", gender: "female" },
      { name: "Gentleman's Scalp Oil Infusion", duration: "60 min", price: "₹3,800", desc: "Scalp mask combined with therapeutic warm oil massage.", gender: "male" },
      { name: "Deep-Tissue Head & Shoulder Massage", duration: "75 min", price: "₹4,500", desc: "Tension clearing massage targeting neck, scalp, and shoulders.", gender: "male" },
      { name: "Activated Charcoal Scalp Spa", duration: "90 min", price: "₹5,200", desc: "Oily scalp therapy with charcoal scrub and ozone steam.", gender: "male" },
    ]
  },
  {
    category: "vip",
    atelier: "VIP Suite",
    tagline: "Private studio suites for exclusive treatments & styling.",
    services: [
      { name: "Royal Pedicure & Manicure Duo", duration: "90 min", price: "₹7,500", desc: "Luxury hand/foot treatments served with champagne.", gender: "female" },
      { name: "Private Suite Custom Styling", duration: "120 min", price: "₹12,000", desc: "Private stylist room access for custom hair cuts & styling.", gender: "female" },
      { name: "VIP Champagne Grooming Experience", duration: "150 min", price: "₹15,000", desc: "Signature styling, pedicure, and skin glow in private suite.", gender: "female" },
      { name: "The Royal Executive Grooming", duration: "90 min", price: "₹8,500", desc: "Private room cut, shave, face mask & shoulder massage.", gender: "male" },
      { name: "Private Styling & Beard Spa", duration: "120 min", price: "₹10,000", desc: "Custom styling, beard shaping, and deep conditioning scalp massage.", gender: "male" },
      { name: "Elite Groom & Champagne Ritual", duration: "150 min", price: "₹14,000", desc: "Private VIP suite cut, shave, pedicure & scalp treatment.", gender: "male" },
    ]
  }
];

export default function VIPPortal() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  // Registration Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [genderSelection, setGenderSelection] = useState<"female" | "male">("female");
  const [hasPreselectedGender, setHasPreselectedGender] = useState(false);
  
  // App variables
  const [bookingCount, setBookingCount] = useState(() => {
    if (typeof window === "undefined") return 0;
    return parseInt(localStorage.getItem("gg_booking_count") || "0", 10);
  });
  const [referralCount, setReferralCount] = useState(() => {
    if (typeof window === "undefined") return 0;
    return parseInt(localStorage.getItem("gg_referral_count") || "0", 10);
  });
  
  const [copied, setCopied] = useState(false);
  const [selectedGenderFilter, setSelectedGenderFilter] = useState<"male" | "female">("female");
  
  // Modals state
  const [activeBookingId, setActiveBookingId] = useState<HotspotId | null>(null);
  const [activeBookingService, setActiveBookingService] = useState<string | null>(null);
  const [showAIHub, setShowAIHub] = useState(false);

  // Sync state from localStorage on load
  useEffect(() => {
    const rawProfile = localStorage.getItem("gg_user_profile");
    if (rawProfile) {
      try {
        const parsed = JSON.parse(rawProfile);
        setProfile(parsed);
        setSelectedGenderFilter(parsed.gender || "female");
      } catch (e) {
        console.error("Error parsing user profile:", e);
      }
    } else {
      // Fallback check if user selected gender on door
      const doorGender = localStorage.getItem("gg_selected_gender") as "male" | "female" | null;
      if (doorGender) {
        setGenderSelection(doorGender);
        setSelectedGenderFilter(doorGender);
        setHasPreselectedGender(true);
      }
    }
  }, []);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email || !dob) {
      toast.error("Please fill in all details to generate your VIP Member Card.");
      return;
    }

    const randomId = `GG-VIP-${genderSelection === "male" ? "GENT" : "LADY"}-${Math.floor(100000 + Math.random() * 900000)}`;
    const joined = new Date().toLocaleDateString("en-US", { month: "short", year: "numeric", day: "numeric" });

    const newProfile: UserProfile = {
      name,
      phone,
      email,
      dob,
      gender: genderSelection,
      memberId: randomId,
      joinedDate: joined,
    };

    localStorage.setItem("gg_user_profile", JSON.stringify(newProfile));
    setProfile(newProfile);
    setSelectedGenderFilter(genderSelection);
    toast.success("Welcome to the club! Your VIP Membership card is active.");
  };

  // Determine VIP Card Tier dynamically
  const getTierInfo = () => {
    const totalPoints = bookingCount + referralCount;
    
    // Tier Unlock Levels:
    // Bronze: Default (0 points)
    // Silver: >= 1 bookings
    // Gold: >= 3 bookings or >= 1 referral
    // Platinum: >= 5 bookings or >= 3 referrals
    
    if (bookingCount >= 5 || referralCount >= 3) {
      return {
        name: "Platinum Elite",
        class: "from-slate-700 via-slate-500 to-zinc-800 text-[#f7fafc]",
        border: "border-slate-400/60 shadow-[0_0_20px_rgba(148,163,184,0.35)] animate-[premium-glow_4s_infinite]",
        pointsNeeded: 0,
        nextTier: "",
        badgeColor: "bg-slate-500/10 text-slate-300 border-slate-400/40",
        img: ""
      };
    } else if (bookingCount >= 3 || referralCount >= 1) {
      return {
        name: "Gold Member",
        class: "from-[#b8860b] via-[#e2b74c] to-[#996515] text-[#1c1a19]",
        border: "border-yellow-400/60 shadow-[0_0_20px_rgba(234,179,8,0.35)] animate-[premium-glow_4s_infinite]",
        pointsNeeded: 5 - bookingCount,
        nextTier: "Platinum Elite (Reach 5 Bookings or 3 Referrals)",
        badgeColor: "bg-yellow-400/10 text-yellow-100 border-yellow-400/40",
        img: ""
      };
    } else if (bookingCount >= 1) {
      return {
        name: "Silver Tier",
        class: "from-zinc-500 via-slate-400 to-zinc-600 text-white",
        border: "border-zinc-300/60 shadow-[0_0_15px_rgba(203,213,225,0.25)]",
        pointsNeeded: 3 - bookingCount,
        nextTier: "Gold Member (Reach 3 Bookings or 1 Referral)",
        badgeColor: "bg-slate-400/10 text-slate-200 border-slate-400/40",
        img: ""
      };
    } else {
      return {
        name: "Bronze Starter",
        class: "from-[#2d1b2e] via-[#3a1f2b] to-[#1a0e1c] text-white",
        border: "border-[#8b6914]/40 shadow-[0_0_25px_rgba(139,105,20,0.2)]",
        pointsNeeded: 1 - bookingCount,
        nextTier: "Silver Tier (Book 1 Service)",
        badgeColor: "bg-[#2d1b2e]/60 text-[#e8d5b0] border-[#8b6914]/40",
        img: "/card_bronze.jpeg"
      };
    }
  };

  const handleSimulateReferral = () => {
    const next = referralCount + 1;
    setReferralCount(next);
    localStorage.setItem("gg_referral_count", next.toString());
    
    // Check if new tier is unlocked
    toast.success(`Referral logged successfully! Total referrals: ${next}`);
  };

  const handleSimulateBooking = () => {
    const next = bookingCount + 1;
    setBookingCount(next);
    localStorage.setItem("gg_booking_count", next.toString());
    toast.success(`Mock booking recorded! Total bookings: ${next}`);
  };

  const handleResetSimulations = () => {
    setBookingCount(0);
    setReferralCount(0);
    localStorage.setItem("gg_booking_count", "0");
    localStorage.setItem("gg_referral_count", "0");
    toast.success("Simulation stats reset to Bronze level.");
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}/refer?code=${profile?.memberId || "GG-VIP"}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success("Your personal invitation code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow && profile) {
      const tier = getTierInfo();
      printWindow.document.write(`
        <html>
          <head>
            <title>GraceAndGo VIP Card - ${profile.name}</title>
            <style>
              body { background: #0a0808; color: #fff; font-family: 'Inter', sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
              .card { width: 450px; height: 270px; border: 2px solid #d4af37; background: linear-gradient(135deg, #1c1a19 0%, #2c2826 100%); border-radius: 12px; padding: 24px; display: flex; flex-direction: column; justify-content: space-between; }
              .header { display: flex; justify-content: space-between; }
              .logo { font-family: 'Cormorant Garamond', serif; font-size: 22px; color: #fff; }
              .logo span { color: #f4c2c2; }
              .tier { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #d4af37; border: 1px solid #d4af37; padding: 2px 8px; border-radius: 4px; }
              .name { font-size: 20px; letter-spacing: 1px; margin: 15px 0 5px 0; text-transform: uppercase; }
              .info { font-size: 11px; color: #a0a0a0; margin: 2px 0; }
              .footer { display: flex; justify-content: space-between; align-items: flex-end; }
              .id-number { font-family: monospace; font-size: 14px; color: #d4af37; }
            </style>
          </head>
          <body onload="window.print();window.close();">
            <div class="card">
              <div class="header">
                <div>
                  <div class="logo">Grace<span>AndGo</span></div>
                  <div style="font-size: 8px; letter-spacing: 2px; text-transform: uppercase; color: #888;">Virtual Luxury Salon</div>
                </div>
                <div class="tier">${tier.name}</div>
              </div>
              <div>
                <div class="name">${profile.name}</div>
                <div class="info">Phone: ${profile.phone}</div>
                <div class="info">Email: ${profile.email}</div>
                <div class="info">Joined: ${profile.joinedDate}</div>
              </div>
              <div class="footer">
                <div class="id-number">${profile.memberId}</div>
                <div style="font-size: 8px; color: #d4af37;">BARCODE VALID AT RECEPTION</div>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleBookServiceClick = (category: string, name: string) => {
    setActiveBookingId(category as HotspotId);
    setActiveBookingService(name);
  };

  const handleBookPrescribed = (hotspotId: string, serviceName: string) => {
    setActiveBookingId(hotspotId as HotspotId);
    setActiveBookingService(serviceName);
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(14,12,11,0.65))]">
      
      {/* Runway Rewards Ticker Banner */}
      <div className="fixed inset-x-0 top-0 z-40 bg-gradient-to-r from-[#b76e79] via-[#d4af37] to-[#b76e79] text-[#1c1a19] text-[0.52rem] sm:text-[0.58rem] tracking-[0.25em] uppercase font-bold py-1.5 px-4 text-center shadow-md flex items-center justify-center gap-2 select-none border-b border-[#d4af37]/20">
        <Award className="w-3.5 h-3.5 animate-pulse text-[#1c1a19]" />
        <span>Wednesday & Friday Runway Rewards: 11% Off all treatments before 2:00 PM!</span>
      </div>

      {/* Spacer for Fixed Ticker */}
      <div className="h-[28px] w-full" />

      {/* 1. Header (Navigation) */}
      <header className="sticky top-[28px] z-40 flex items-center justify-between px-6 py-4 sm:px-12 bg-black/75 backdrop-blur-md border-b border-blush-pink/10">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate({ to: "/" })}
            className="flex items-center gap-1.5 text-[0.6rem] tracking-[0.2em] uppercase text-muted-foreground hover:text-white transition-colors mr-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
          <div>
            <p className="font-display text-xl tracking-wide text-white leading-none">
              Grace<span className="text-blush">AndGo</span>
            </p>
            <p className="text-[0.55rem] tracking-[0.4em] uppercase text-white/50 mt-1">
              VIP Club Dashboard
            </p>
          </div>
        </div>
        
        {profile && (
          <nav className="hidden items-center gap-8 text-[0.65rem] tracking-[0.35em] uppercase text-white/80 sm:flex">
            <a className="transition hover:text-blush" href="#card-section">Card</a>
            <button onClick={() => setShowAIHub(true)} className="transition hover:text-blush uppercase tracking-[0.35em] text-[0.65rem] cursor-pointer">AI Scan</button>
            <a className="transition hover:text-blush" href="#tiers-showcase">Tiers</a>
            <a className="transition hover:text-blush" href="#services-catalog">Catalog</a>
          </nav>
        )}

        <button
          onClick={() => {
            if (profile) {
              setShowAIHub(true);
            } else {
              toast.error("Please register your membership card first.");
            }
          }}
          className="rounded-sm border border-blush-pink/60 px-4 py-2 text-[0.65rem] tracking-[0.35em] uppercase text-white hover:bg-blush-pink/20 bg-black/40 transition-colors"
        >
          AI Skin Scan
        </button>
      </header>

      {/* 2. REGISTRATION GATE (IF NOT SIGNED IN) */}
      {!profile ? (
        <div className="flex items-start justify-center p-6 pt-4 sm:pt-8 pb-16 min-h-[calc(100vh-120px)]">
          <div className="relative w-full max-w-lg rounded-sm border border-blush-pink/20 bg-[oklch(0.12_0.005_60)] shadow-luxe p-6 sm:p-8 text-center space-y-4">
            <div className="absolute inset-x-0 top-0 h-px bg-gold-gradient" />
            
            <div className="space-y-2">
              <div className="mx-auto w-10 h-10 rounded-full border border-gold flex items-center justify-center bg-black/45 text-gold">
                <span className="font-display font-semibold">G</span>
              </div>
              <h3 className="font-display text-3xl text-white">Create Membership</h3>
              <p className="text-[0.6rem] tracking-[0.3em] uppercase text-gold">VIP Registration Portal</p>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
              Please enter your contact details. This generates your unique member QR card, unlocks Runway Discounts, and runs our Gemini AI hair and skin scanner.
            </p>

            <form onSubmit={handleRegister} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-[0.55rem] tracking-wider uppercase text-muted-foreground flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-gold" /> Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sophia Loren"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/25 border border-blush-pink/15 rounded-sm p-3 text-xs tracking-wider text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-[0.55rem] tracking-wider uppercase text-muted-foreground flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-gold" /> Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-black/25 border border-blush-pink/15 rounded-sm p-3 text-xs tracking-wider text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-gold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[0.55rem] tracking-wider uppercase text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gold" /> Date of Birth
                  </label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full bg-black/25 border border-blush-pink/15 rounded-sm p-3 text-xs tracking-wider text-foreground focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[0.55rem] tracking-wider uppercase text-muted-foreground flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-gold" /> Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="sophia@luxury.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/25 border border-blush-pink/15 rounded-sm p-3 text-xs tracking-wider text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-gold"
                />
              </div>

              {/* Gender selector in form */}
              {!hasPreselectedGender && (
                <div className="space-y-2 pt-1">
                  <span className="text-[0.55rem] tracking-wider uppercase text-muted-foreground block">Preferred Catalog</span>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                      <input
                        type="radio"
                        name="genderForm"
                        checked={genderSelection === "female"}
                        onChange={() => setGenderSelection("female")}
                        className="accent-gold"
                      />
                      Ladies' Sanctuary (Women)
                    </label>
                    <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                      <input
                        type="radio"
                        name="genderForm"
                        checked={genderSelection === "male"}
                        onChange={() => setGenderSelection("male")}
                        className="accent-gold"
                      />
                      Gentlemen's Atelier (Men)
                    </label>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full overflow-hidden rounded-sm bg-gold-gradient py-3.5 text-xs font-semibold tracking-[0.3em] uppercase text-[#1c1a19] hover:brightness-110 shadow-soft cursor-pointer transition-all duration-300 pt-4"
              >
                Register Membership
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* 3. LOGGED-IN VIP PORTAL LAYOUT */
        <main className="max-w-6xl mx-auto px-6 py-12 space-y-16">
          
          {/* Section: VIP Card & Tracker */}
          <section id="card-section" className="grid gap-10 md:grid-cols-2 items-start">
            
            {/* Left: Dynamic VIP Membership Card */}
            <div className="space-y-4">
              <span className="text-[0.6rem] tracking-[0.3em] uppercase text-gold font-bold block">Your Active Invitation Card</span>
              
              {/* Card Container — Vertical portrait to match bronze card design */}
              <div 
                id="vip-card-printable"
                className={`relative w-full max-w-[340px] mx-auto aspect-[4/5] rounded-xl border-2 p-6 sm:p-7 flex flex-col justify-between overflow-hidden select-none bg-gradient-to-br ${getTierInfo().class} ${getTierInfo().border}`}
                style={{
                  backgroundImage: getTierInfo().img ? `url('${getTierInfo().img}')` : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Dark overlay for readability on image backgrounds */}
                {getTierInfo().img && (
                  <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-black/60 pointer-events-none" />
                )}
                {/* Visual Glare Sweep */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.05] to-white/0 pointer-events-none" />

                {/* Vertical layout divided into two columns */}
                <div className="relative z-10 flex h-full w-full">
                  {/* Left Column (60% width) - contains all details, badge and QR */}
                  <div className="w-[60%] h-full flex flex-col justify-between pr-2 pb-14 text-left">
                    {/* Top: Logo & Tier Badge */}
                    <div>
                      <h4 className="font-display text-xl sm:text-2xl tracking-wider leading-none text-white drop-shadow-lg">
                        Grace<span className="text-[#f4c2c2]">AndGo</span>
                      </h4>
                      <p className="text-[0.45rem] sm:text-[0.5rem] tracking-[0.25em] uppercase text-white/60 mt-1 drop-shadow-sm">Luxury Virtual Club</p>
                      
                      {/* Tier Badge: Bronze Starter / Silver / Gold / Platinum */}
                      <div className="mt-3 flex">
                        <span className={`rounded-md border px-2 py-0.5 text-[0.45rem] sm:text-[0.5rem] tracking-[0.2em] uppercase font-bold backdrop-blur-sm ${getTierInfo().badgeColor}`}>
                          {getTierInfo().name}
                        </span>
                      </div>
                    </div>

                    {/* Middle: User details */}
                    <div className="my-auto py-2">
                      <p className="font-display text-2xl sm:text-3xl tracking-[0.08em] uppercase text-white drop-shadow-lg leading-tight truncate">
                        {profile.name}
                      </p>
                      <div className="mt-3.5 space-y-1 text-white/90 text-[0.55rem] sm:text-[0.6rem] tracking-wider drop-shadow-sm">
                        <p className="truncate"><span className="text-[#ffd700] font-semibold">Phone:</span> {profile.phone}</p>
                        <p className="truncate"><span className="text-[#ffd700] font-semibold">DOB:</span> {profile.dob}</p>
                        <p className="truncate"><span className="text-[#ffd700] font-semibold">Atelier:</span> {profile.gender === "male" ? "Gentlemen" : "Ladies"}</p>
                      </div>
                    </div>

                    {/* Bottom: Unique ID & QR side-by-side */}
                    <div className="border-t border-white/10 pt-3 flex items-end justify-between gap-1">
                      <div className="flex-1 min-w-0 pr-1">
                        <p className="text-[0.4rem] tracking-[0.15em] uppercase text-white/50">Membership ID</p>
                        <p className="font-mono text-[0.6rem] sm:text-[0.65rem] tracking-tighter font-semibold text-[#d4af37] drop-shadow-sm mt-0.5 truncate">{profile.memberId}</p>
                      </div>
                      
                      {/* Realistic High-Quality QR Code */}
                      <div className="w-[50px] h-[50px] sm:w-[56px] sm:h-[56px] bg-white p-1 rounded-sm shadow-lg flex-shrink-0 flex items-center justify-center">
                        <svg viewBox="0 0 29 29" className="w-full h-full" shapeRendering="crispEdges">
                          {/* Generate a realistic 29x29 QR pattern */}
                          {(() => {
                            const size = 29;
                            const cells: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
                            
                            // Finder patterns (7x7 squares in 3 corners)
                            const drawFinder = (ox: number, oy: number) => {
                              for (let y = 0; y < 7; y++) {
                                for (let x = 0; x < 7; x++) {
                                  const isOuter = y === 0 || y === 6 || x === 0 || x === 6;
                                  const isInner = x >= 2 && x <= 4 && y >= 2 && y <= 4;
                                  cells[oy + y][ox + x] = isOuter || isInner;
                                }
                              }
                            };
                            drawFinder(0, 0);   // top-left
                            drawFinder(22, 0);  // top-right
                            drawFinder(0, 22);  // bottom-left
                            
                            // Timing patterns
                            for (let i = 8; i < 21; i++) {
                              cells[6][i] = i % 2 === 0;
                              cells[i][6] = i % 2 === 0;
                            }
                            
                            // Alignment pattern (5x5 at bottom-right area)
                            const ax = 22, ay = 22;
                            for (let y = -2; y <= 2; y++) {
                              for (let x = -2; x <= 2; x++) {
                                const isEdge = Math.abs(x) === 2 || Math.abs(y) === 2;
                                const isCenter = x === 0 && y === 0;
                                cells[ay + y][ax + x] = isEdge || isCenter;
                              }
                            }
                            
                            // Seed random numbers based on member ID
                            const seed = (profile.memberId || "GG-VIP").split("").reduce((a, c) => a + c.charCodeAt(0), 0);
                            let rng = seed;
                            const nextRng = () => { rng = (rng * 1103515245 + 12345) & 0x7fffffff; return rng; };
                            
                            for (let y = 0; y < size; y++) {
                              for (let x = 0; x < size; x++) {
                                // Skip finder areas & separators
                                const inFinderTL = x < 8 && y < 8;
                                const inFinderTR = x > 20 && y < 8;
                                const inFinderBL = x < 8 && y > 20;
                                const inAlignment = x >= 20 && x <= 24 && y >= 20 && y <= 24;
                                const isTiming = (x === 6 || y === 6);
                                // Skip center logo area (cutout of size 5: 12-16)
                                const inLogo = x >= 12 && x <= 16 && y >= 12 && y <= 16;
                                
                                if (!inFinderTL && !inFinderTR && !inFinderBL && !inAlignment && !isTiming && !inLogo) {
                                  cells[y][x] = nextRng() % 3 !== 0; // ~66% density
                                }
                              }
                            }
                            
                            // Render path/rects
                            return (
                              <>
                                {cells.flatMap((row, y) =>
                                  row.map((filled, x) =>
                                    filled ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="#121212" /> : null
                                  )
                                )}
                                {/* Logo center container */}
                                <rect x="11.5" y="11.5" width="6" height="6" rx="1" fill="#1c1a19" stroke="#d4af37" strokeWidth="0.4" />
                                <text x="14.5" y="15.8" fontFamily="'Cormorant Garamond', serif" fontSize="5.2" fontWeight="bold" fill="#ffd700" textAnchor="middle">G</text>
                              </>
                            );
                          })()}
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Column (40% width) - kept empty to show vertical BRONZE CARD text */}
                  <div className="w-[40%] h-full pointer-events-none" />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handlePrint}
                  className="flex-1 flex items-center justify-center gap-2 rounded-sm border border-blush-pink/35 py-3 text-[0.6rem] tracking-[0.25em] uppercase text-white hover:bg-white/5 cursor-pointer transition-colors"
                >
                  <Printer className="w-3.5 h-3.5 text-gold" /> Print ID Card
                </button>
                <button
                  onClick={copyReferralLink}
                  className="flex-1 flex items-center justify-center gap-2 rounded-sm border border-[#ffd700]/30 py-3 text-[0.6rem] tracking-[0.25em] uppercase text-white hover:bg-[#ffd700]/5 cursor-pointer transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-gold" /> : <Share2 className="w-3.5 h-3.5 text-gold" />}
                  Share Invite
                </button>
              </div>
            </div>

            {/* Right: Referral Trackers & simulations */}
            <div className="space-y-6">
              <span className="text-[0.6rem] tracking-[0.3em] uppercase text-gold font-bold block">VIP Referrals Tracker</span>
              
              <div className="bg-black/35 rounded-sm border border-blush-pink/15 p-6 space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs uppercase tracking-wider">
                    <span className="text-gold font-bold">Referral Progress</span>
                    <span className="text-white font-mono">{referralCount} / 3 Completed</span>
                  </div>
                  <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden border border-blush-pink/5">
                    <div 
                      className="h-full bg-gold-gradient transition-all duration-500" 
                      style={{ width: `${Math.min((referralCount / 3) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-[0.55rem] text-muted-foreground leading-relaxed">
                    Refer 3 friends: You unlock <strong className="text-gold">50% off</strong> on your next visit. Your referred friends get <strong className="text-gold">10% extra discount</strong>.
                  </p>
                </div>

                <div className="h-px bg-blush-pink/10" />

                {/* Tester Simulations */}
                <div className="space-y-3.5">
                  <p className="text-[0.55rem] tracking-[0.2em] uppercase text-gold font-semibold">Simulator controls (Developer Testing)</p>
                  <div className="grid gap-2 grid-cols-3">
                    <button
                      onClick={handleSimulateReferral}
                      className="rounded-xs border border-blush-pink/20 bg-black/20 hover:bg-blush-pink/10 py-2.5 text-[0.5rem] tracking-wider uppercase text-white cursor-pointer"
                      title="Increment referral count"
                    >
                      + Invite Friend
                    </button>
                    <button
                      onClick={handleSimulateBooking}
                      className="rounded-xs border border-blush-pink/20 bg-black/20 hover:bg-blush-pink/10 py-2.5 text-[0.5rem] tracking-wider uppercase text-white cursor-pointer"
                      title="Increment completed service count"
                    >
                      + Book Service
                    </button>
                    <button
                      onClick={handleResetSimulations}
                      className="rounded-xs border border-red-500/20 bg-red-950/10 hover:bg-red-950/30 py-2.5 text-[0.5rem] tracking-wider uppercase text-red-400 cursor-pointer"
                    >
                      Reset Tiers
                    </button>
                  </div>
                  <div className="text-[0.55rem] text-muted-foreground space-y-1">
                    <p>Current simulated bookings count: <span className="text-white font-mono">{bookingCount}</span></p>
                    <p>Current simulated referrals count: <span className="text-white font-mono">{referralCount}</span></p>
                    {getTierInfo().pointsNeeded > 0 && (
                      <p className="text-gold italic">Need {getTierInfo().pointsNeeded} points to unlock next card tier!</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Cards Showcase (All Tiers) */}
          <section id="tiers-showcase" className="space-y-6 pt-4">
            <div className="text-center space-y-2">
              <span className="text-[0.6rem] tracking-[0.3em] uppercase text-gold font-bold">The Registry</span>
              <h2 className="font-display text-3xl text-white">Membership Card Tiers</h2>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                Review all membership tiers and discover the steps required to unlock each luxury tier.
              </p>
            </div>

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { 
                  name: "Bronze Starter", 
                  req: "Register on website", 
                  priv: "Unlock basic direct service bookings and offline AI scan.", 
                  glow: "border-amber-900 bg-amber-950/20 hover:bg-amber-950/30", 
                  titleColor: "text-amber-400"
                },
                { 
                  name: "Silver Tier", 
                  req: "Book 1 service reservation", 
                  priv: "Unlocks virtual scratch cards for mystery discounts.", 
                  glow: "border-zinc-700 bg-zinc-800/20 hover:bg-zinc-800/30", 
                  titleColor: "text-zinc-300"
                },
                { 
                  name: "Gold Member", 
                  req: "3 bookings or 1 referral", 
                  priv: "15% off Birthday Week coupon + live Gemini scanner active.", 
                  glow: "border-yellow-800 bg-yellow-950/10 hover:bg-yellow-950/20", 
                  titleColor: "text-yellow-400"
                },
                { 
                  name: "Platinum Elite", 
                  req: "5 bookings or 3 referrals", 
                  priv: "50% off next booking + invitation to VIP member nights.", 
                  glow: "border-slate-600 bg-slate-800/10 hover:bg-slate-800/20", 
                  titleColor: "text-slate-200"
                },
              ].map((tier, idx) => (
                <div 
                  key={idx}
                  className={`p-6 rounded-sm border bg-black/20 flex flex-col justify-between gap-4 transition-all duration-300 ${tier.glow}`}
                >
                  <div className="space-y-2">
                    <span className={`font-display text-xl ${tier.titleColor}`}>{tier.name}</span>
                    <div className="h-px bg-blush-pink/15 w-8" />
                    <p className="text-[0.65rem] text-white font-medium uppercase tracking-wide">Req: {tier.req}</p>
                    <p className="text-[0.65rem] text-muted-foreground leading-normal mt-1">{tier.priv}</p>
                  </div>
                  <span className="text-[0.55rem] tracking-wider text-muted-foreground uppercase">Tier Level {idx + 1}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Section: AI Diagnostic Widget Embed */}
          <section className="p-8 rounded-sm border border-blush-pink/15 bg-black/35 backdrop-blur-md relative overflow-hidden flex flex-col sm:flex-row items-center gap-8 justify-between select-none">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ffd1dc]/5 to-transparent animate-pulse pointer-events-none" />
            <div className="space-y-3.5 text-center sm:text-left">
              <div className="inline-flex items-center gap-1 text-[0.55rem] tracking-[0.25em] uppercase text-gold font-bold">
                <Sparkles className="w-3.5 h-3.5" /> AI Consultant Embedded
              </div>
              <h3 className="font-display text-3xl text-white">Advanced Dermal spectator</h3>
              <p className="text-xs text-muted-foreground max-w-lg leading-relaxed">
                Answer diagnostic questions and load a portrait photo to run our spectrum laser scanner. Connects directly to Gemini models for custom recipes.
              </p>
            </div>
            <button
              onClick={() => setShowAIHub(true)}
              className="rounded-full bg-gold-gradient px-8 py-3.5 text-xs font-semibold tracking-[0.3em] uppercase text-[#1c1a19] hover:brightness-110 shadow-luxe cursor-pointer transition-all duration-300 flex-shrink-0"
            >
              Analyze Skin & Hair
            </button>
          </section>

          {/* Section: Services Booking Catalog in Card Format */}
          <section id="services-catalog" className="space-y-8 pt-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-blush-pink/15 pb-6">
              <div className="space-y-2 text-left">
                <span className="text-[0.6rem] tracking-[0.3em] uppercase text-gold font-bold block">Salon Carte</span>
                <h2 className="font-display text-4xl text-white">Direct Booking Catalog</h2>
                <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
                  Browse beauty rituals. Tap any card below to schedule a reservation.
                </p>
              </div>

              {/* Gender selector for VIP page */}
              <div className="flex p-0.5 rounded-full border border-blush-pink/15 bg-black/45 w-fit">
                <button
                  onClick={() => setSelectedGenderFilter("female")}
                  className={`px-6 py-2 rounded-full text-[0.6rem] tracking-[0.25em] uppercase transition-all duration-300 font-semibold cursor-pointer ${
                    selectedGenderFilter === "female"
                      ? "bg-gradient-to-r from-[#ffd1dc] to-[#b76e79] text-[#1c1a19] shadow-soft"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  Ladies' Services
                </button>
                <button
                  onClick={() => setSelectedGenderFilter("male")}
                  className={`px-6 py-2 rounded-full text-[0.6rem] tracking-[0.25em] uppercase transition-all duration-300 font-semibold cursor-pointer ${
                    selectedGenderFilter === "male"
                      ? "bg-gradient-to-r from-[#b76e79] to-[#d4af37] text-[#1c1a19] shadow-soft"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  Gentlemen's Services
                </button>
              </div>
            </div>

            {/* Loop through categories and display cards */}
            <div className="space-y-12">
              {SERVICES_CATALOG.map((cat) => {
                // Filter category services by gender selection
                const filteredServices = cat.services.filter(s => s.gender === "both" || s.gender === selectedGenderFilter);
                if (filteredServices.length === 0) return null;
                
                return (
                  <div key={cat.category} className="space-y-6">
                    <div className="text-left">
                      <h3 className="font-display text-3xl text-gold">{cat.atelier}</h3>
                      <p className="text-[0.65rem] text-muted-foreground tracking-wider uppercase mt-1">{cat.tagline}</p>
                    </div>

                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                      {filteredServices.map((service, sIdx) => (
                        <div 
                          key={sIdx}
                          className="group bg-[#0c0909] border border-white/[0.04] rounded-md p-6 flex flex-col justify-between gap-6 hover:border-white/[0.1] hover:bg-[#120e0e] transition-all duration-300 shadow-soft"
                        >
                          <div className="space-y-3.5">
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="font-display text-xl text-white group-hover:text-gold transition-colors leading-tight">{service.name}</h4>
                              {service.note && (
                                <span className="text-[0.45rem] tracking-[0.15em] uppercase text-[#d4af37] border border-[#d4af37]/30 px-1.5 py-0.5 rounded-xs flex-shrink-0 bg-[#d4af37]/5">
                                  {service.note}
                                </span>
                              )}
                            </div>
                            <p className="text-[0.75rem] text-[#8e8585] leading-relaxed font-sans">{service.desc}</p>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-white/[0.04]">
                            <div className="text-left">
                              <p className="text-[0.5rem] text-[#8e8585] uppercase tracking-[0.2em] font-semibold">Duration / Price</p>
                              <p className="text-xs font-semibold text-white mt-1">
                                {service.duration} <span className="text-[#8e8585] mx-1">•</span> <span className="text-[#ffd700] font-display text-base">{service.price}</span>
                              </p>
                            </div>
                            <button
                              onClick={() => handleBookServiceClick(cat.category, service.name)}
                              className="rounded-xs border border-white/[0.12] hover:border-[#ffd700] px-5 py-2.5 text-[0.55rem] tracking-[0.25em] uppercase text-white hover:bg-[#ffd700]/5 transition-all cursor-pointer font-bold"
                            >
                              Book Ritual
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Embed AI Scan modal */}
          <AIScanHub
            isOpen={showAIHub}
            onClose={() => setShowAIHub(false)}
            onBookService={handleBookPrescribed}
          />

          {/* Embed Booking scheduler overlay modal */}
          <ServiceOverlay
            id={activeBookingId}
            initialServiceName={activeBookingService}
            gender={selectedGenderFilter}
            onClose={() => {
              setActiveBookingId(null);
              setActiveBookingService(null);
            }}
          />
        </main>
      )}

      {/* Footer */}
      <footer className="border-t border-blush-pink/20 bg-[oklch(0.09_0.005_60)] px-6 py-12 text-center text-xs text-muted-foreground">
        <p className="font-display text-lg text-white">GraceAndGo Salon VIP Club</p>
        <p className="mt-1 text-[0.6rem] tracking-[0.2em] uppercase text-muted-foreground">Premium Beauty Privileges · © MMXXVI</p>
      </footer>
    </div>
  );
}
