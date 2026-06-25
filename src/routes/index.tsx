import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import ServiceOverlay from "@/components/salon/ServiceOverlay";
import StorefrontOverlay from "@/components/salon/StorefrontOverlay";
import EntranceLanding from "@/components/salon/EntranceLanding";
import AIScanHub from "@/components/salon/AIScanHub";
import { Sparkles, Award, User, RefreshCw } from "lucide-react";

export interface UserProfile {
  name: string;
  phone: string;
  dob: string;
  email: string;
  gender: "male" | "female";
  memberId: string;
  joinedDate: string;
}

import { useScrollProgress } from "@/components/salon/useScrollProgress";
import type { HotspotId } from "@/components/salon/SalonScene";

const SalonScene = lazy(() => import("@/components/salon/SalonScene"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GraceAndGo — Virtual Luxury Beauty Salon" },
      {
        name: "description",
        content:
          "An immersive 3D virtual tour of a five-star beauty salon. Hair, nails, facials, and curated skincare — booked with cinematic ease.",
      },
    ],
  }),
  component: Index,
  ssr: false,
});

const CHAPTERS = [
  {
    eyebrow: "Chapter I",
    title: "The Entrance",
    body: "Double pink doors swing inward, welcoming you from the street into a realm of luxury.",
  },
  {
    eyebrow: "Chapter II",
    title: "The Grand Passage",
    body: "Wander down the long corridor, cast in warm light rings and polished white marble.",
  },
  {
    eyebrow: "Chapter III",
    title: "Hair Atelier",
    body: "Master stylists at private vanities behind the first glass archway. A scissor's hush, a couture finish.",
  },
  {
    eyebrow: "Chapter IV",
    title: "Nails Bar",
    body: "Pastel rose lacquer, hand-painted on a champagne-marble counter behind the opposite arch.",
  },
  {
    eyebrow: "Chapter V",
    title: "Facial Suite",
    body: "Bespoke protocols beneath warm pink light. Skin, restored to first light.",
  },
  {
    eyebrow: "Chapter VI",
    title: "Apothecary Showcase",
    body: "A holographic vitrine of Provence botanical elixirs, serums, and oils on your right.",
  },
  {
    eyebrow: "Chapter VII",
    title: "Therapy Sanctuary",
    body: "Rejuvenating head spas, scalp detox rituals, and organic oil infusions behind the third left arch.",
  },
  {
    eyebrow: "Chapter VIII",
    title: "VIP Suite",
    body: "A private studio suite for exclusive foot therapy, pedicures, and custom styling on your right.",
  },
  {
    eyebrow: "Chapter IX",
    title: "The Lounge & Rituals",
    body: "A quiet sanctuary at the end of the passage. Unwind on a plush velvet sofa with house elixirs.",
  },
];

const IS_CARD_ON_RIGHT = [
  false, // Chapter I: Entrance -> Left
  true,  // Chapter II: Passage -> Right
  true,  // Chapter III: Hair (Left room) -> Right
  false, // Chapter IV: Nails (Right room) -> Left
  true,  // Chapter V: Facial (Left room) -> Right
  false, // Chapter VI: Apothecary (Right room) -> Left
  true,  // Chapter VII: Therapy (Left room) -> Right
  false, // Chapter VIII: VIP (Right room) -> Left
  true   // Chapter IX: Lounge -> Right
];

function Index() {
  const { global: globalScroll, camera: cameraScroll } = useScrollProgress();
  const [open, setOpen] = useState<HotspotId | null>(null);
  const [initialService, setInitialService] = useState<string | null>(null);
  const [isStorefrontOpen, setIsStorefrontOpen] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  // New States
  const [selectedGender, setSelectedGender] = useState<"male" | "female" | null>(null);
  const [showEntranceLanding, setShowEntranceLanding] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showAIScanHub, setShowAIScanHub] = useState(false);

  // Sync profile on mount
  useEffect(() => {
    const rawProfile = localStorage.getItem("gg_user_profile");
    if (rawProfile) {
      try {
        const profile = JSON.parse(rawProfile);
        setUserProfile(profile);
        setSelectedGender(profile.gender || "female");
      } catch (e) {
        console.error("Error parsing user profile:", e);
      }
    }

    // Clean up body overflow when navigating away
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Guest Ledger State
  const [reviews, setReviews] = useState([
    {
      name: "Sophia L.",
      city: "Mumbai",
      rating: 5,
      comment: "An absolute sanctuary in the heart of the city. Jean-Luc's styling is pure couture.",
      date: "Jun 2026",
    },
    {
      name: "Aria M.",
      city: "Bangalore",
      rating: 5,
      comment: "The Facial Suite left my skin restored to first light. The 24K Gold treatment is worth every rupee.",
      date: "May 2026",
    },
    {
      name: "Rohan D.",
      city: "Delhi",
      rating: 5,
      comment: "Unparalleled nail artistry by Chloe. The crystal couture manicure was stunning.",
      date: "Apr 2026",
    },
  ]);

  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewCity, setNewReviewCity] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState("");

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) {
      toast.error("Please provide both your name and reflection comment.");
      return;
    }
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const d = new Date();
    const dateStr = `${months[d.getMonth()]} ${d.getFullYear()}`;

    setReviews([
      {
        name: newReviewName,
        city: newReviewCity || "Guest",
        rating: newReviewRating,
        comment: newReviewComment,
        date: dateStr,
      },
      ...reviews,
    ]);

    setNewReviewName("");
    setNewReviewCity("");
    setNewReviewRating(5);
    setNewReviewComment("");

    toast.success("Thank you! Your reflection has been recorded in our guest ledger.");
  };

  const handleEnter = () => {
    // Lock scrolling during the entrance selection phase
    document.body.style.overflow = "hidden";
    // Show selection landing page immediately on top of the closed doors
    setShowEntranceLanding(true);
  };

  const handleSelectTour = (gender: "male" | "female") => {
    setSelectedGender(gender);
    setShowEntranceLanding(false);
    // Now trigger the storefront doors to swing open
    setIsStorefrontOpen(true);
  };

  const handleOpenComplete = useCallback(() => {
    setHasEntered(true);
    // Unlock scrolling once inside
    document.body.style.overflow = "";
    // Scroll smoothly to the tour chapter once the doors are fully open
    requestAnimationFrame(() => {
      document.getElementById("tour")?.scrollIntoView({ behavior: "smooth" });
    });
  }, []);

  const handleOpenRoom = (id: HotspotId, serviceName?: string) => {
    setInitialService(serviceName || null);
    setOpen(id);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -50px 0px" },
    );

    const elements = document.querySelectorAll(".reveal");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className={`relative bg-background text-foreground ${!hasEntered ? "h-screen overflow-hidden" : ""}`}>
      {/* Fixed 3D stage */}
      <div className="fixed inset-0 z-0">
        <Suspense
          fallback={
            <div className="flex h-full items-center justify-center text-xs tracking-[0.3em] uppercase text-muted-foreground">
              Entering GraceAndGo…
            </div>
          }
        >
          {(isStorefrontOpen || hasEntered) && (
            <SalonScene
              scroll={cameraScroll}
              activeRoom={open}
              onHotspot={(id) => handleOpenRoom(id)}
              onSelectService={(id, sName) => handleOpenRoom(id, sName)}
            />
          )}
        </Suspense>
        {/* Soft centered vignette and subtle top/bottom gradients for contrast */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(14,12,11,0.65))]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50" />
      </div>

      {/* Runway Rewards Ticker Banner */}
      {hasEntered && (
        <div className="fixed inset-x-0 top-0 z-40 bg-gradient-to-r from-[#b76e79] via-[#d4af37] to-[#b76e79] text-[#1c1a19] text-[0.52rem] sm:text-[0.58rem] tracking-[0.25em] uppercase font-bold py-1.5 px-4 text-center shadow-md flex items-center justify-center gap-2 select-none border-b border-[#d4af37]/20">
          <Award className="w-3.5 h-3.5 animate-pulse text-[#1c1a19]" />
          <span>Wednesday & Friday Runway Rewards: 11% Off all treatments before 2:00 PM!</span>
        </div>
      )}

      {/* Top nav */}
      <header className={`fixed inset-x-0 z-40 flex items-center justify-between px-6 py-4 sm:px-12 bg-black/60 backdrop-blur-md border-b border-blush-pink/10 transition-all duration-1000 ${
        hasEntered ? "opacity-100 translate-y-0 top-[28px]" : "opacity-0 -translate-y-4 pointer-events-none top-0"
      }`}>
        <div>
          <p className="font-display text-xl tracking-wide text-white text-shadow-tight">
            Grace<span className="text-blush">AndGo</span>
          </p>
          <p className="text-[0.55rem] tracking-[0.4em] uppercase text-white/80 text-shadow-tight">
            Your Beauty, Our Passion
          </p>
        </div>
        <nav className="hidden items-center gap-8 text-[0.65rem] tracking-[0.35em] uppercase text-white/80 sm:flex text-shadow-tight">
          <a className="transition hover:text-blush" href="#tour">
            Tour
          </a>
          <a className="transition hover:text-blush" href="#services">
            Services
          </a>
          <button 
            onClick={() => setShowAIScanHub(true)} 
            className="transition hover:text-blush uppercase tracking-[0.35em] text-[0.65rem] bg-transparent border-none cursor-pointer"
          >
            AI Scan
          </button>
          <button 
            onClick={() => setShowEntranceLanding(true)} 
            className="transition hover:text-blush uppercase tracking-[0.35em] text-[0.65rem] bg-transparent border-none cursor-pointer flex items-center gap-1 text-[#ffd700]"
          >
            <User className="w-3 h-3 text-[#ffd700]" /> VIP Card
          </button>
          <a className="transition hover:text-blush" href="#reviews">
            Ledger
          </a>
          <a className="transition hover:text-blush" href="#apothecary">
            Apothecary
          </a>
        </nav>
        <button
          onClick={() => setOpen("facial")}
          className="rounded-sm border border-blush-pink/60 px-4 py-2 text-[0.65rem] tracking-[0.35em] uppercase text-white text-shadow-tight transition hover:bg-blush-pink/20 bg-black/40"
        >
          Reserve
        </button>
      </header>

      {/* Scroll content overlays */}
      <main className="relative z-10 pointer-events-none">
        {/* HERO */}
        <section className={`relative flex min-h-screen items-center justify-center text-center px-6 pb-16 sm:px-16 transition-all duration-700 ${hasEntered || isStorefrontOpen ? "hidden" : ""} pointer-events-auto`}>
          <div className="max-w-2xl flex flex-col items-center">
            <p className="text-[0.65rem] tracking-[0.5em] uppercase text-white reveal-instant text-shadow-tight font-semibold">
              GraceAndGo Salon
            </p>
            <h1 className="mt-6 font-display text-6xl leading-[1.05] sm:text-8xl reveal-instant delay-instant-100 text-shadow-luxe tracking-[0.05em]">
              GRACE <span className="italic text-blush-gold-gradient">&</span>{" "}
              GO
            </h1>
            <p className="mt-4 text-[0.7rem] tracking-[0.5em] uppercase text-white reveal-instant delay-instant-200 text-shadow-tight font-bold">
              BANGALORE · MUMBAI · DELHI
            </p>
            <div className="mt-12 reveal-instant delay-instant-300">
              <a
                href="#tour"
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-blush-pink/60 bg-black/45 hover:bg-blush-pink/15 px-8 py-3.5 text-xs font-semibold tracking-[0.4em] uppercase text-white text-shadow-tight shadow-luxe transition-all duration-300 hover:scale-105"
              >
                STEP INSIDE
                <span className="transition-transform duration-300 group-hover:translate-y-0.5">
                  ✧
                </span>
              </a>
            </div>
          </div>

          {/* scroll cue */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
            <div className="mx-auto h-12 w-px bg-gradient-to-b from-transparent via-blush-pink to-transparent" />
            <p className="mt-3 text-[0.55rem] tracking-[0.4em] uppercase text-white/90 text-shadow-tight font-semibold">
              Scroll to enter
            </p>
          </div>
        </section>

        {/* TOUR CHAPTERS */}
        <section id="tour" className="relative">
          {CHAPTERS.map((c, i) => (
            <div
              key={c.title}
              className={`flex min-h-screen items-center px-6 sm:px-16 ${IS_CARD_ON_RIGHT[i] ? "justify-end" : "justify-start"}`}
            >
              <div className="max-w-xs sm:max-w-sm rounded-sm border border-blush-pink/20 bg-[oklch(0.12_0.005_60)]/90 p-6 sm:p-8 backdrop-blur-md shadow-luxe reveal pointer-events-auto">
                <p className="text-[0.6rem] tracking-[0.4em] uppercase text-gold">
                  {c.eyebrow}
                </p>
                <h2 className="mt-3 font-display text-4xl text-white">
                  {c.title}
                </h2>
                <p className="mt-4 text-xs sm:text-sm leading-relaxed text-white/95">
                  {c.body}
                </p>
                <div className="hairline mt-6 pt-4 text-[0.6rem] tracking-[0.35em] uppercase text-white/70">
                  {String(i + 1).padStart(2, "0")} /{" "}
                  {String(CHAPTERS.length).padStart(2, "0")}
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* SERVICES GRID */}
        <section
          id="services"
          className="relative min-h-screen bg-[oklch(0.1_0.005_60)]/85 px-6 py-32 backdrop-blur-md sm:px-16 pointer-events-auto"
        >
          <div className="mx-auto max-w-5xl">
            <p className="text-[0.65rem] tracking-[0.5em] uppercase text-gold reveal">
              The Carte
            </p>
            <h2 className="mt-4 font-display text-5xl sm:text-6xl reveal delay-100">
              Rituals of the house.
            </h2>
            <p className="mt-4 max-w-xl text-sm text-muted-foreground reveal delay-200">
              Six ateliers, one philosophy: time, taken slowly. Tap any room
              above, or browse below.
            </p>

            <div className="mt-16 grid gap-px bg-blush-pink/20 sm:grid-cols-2">
              {(
                [
                  "hair",
                  "nails",
                  "facial",
                  "product",
                  "treatment",
                  "vip",
                ] as HotspotId[]
              ).map((id, idx) => {
                const meta = {
                  hair: {
                    t: "Hair Atelier",
                    s: "From ₹4,500",
                    d: "Cuts, color, blow-outs.",
                  },
                  nails: {
                    t: "Nails Bar",
                    s: "From ₹2,200",
                    d: "Manicure, pedicure, art.",
                  },
                  facial: {
                    t: "Facial Suite",
                    s: "From ₹6,500",
                    d: "Bespoke skincare protocols.",
                  },
                  product: {
                    t: "Apothecary",
                    s: "From ₹2,800",
                    d: "Serums, oils, elixirs.",
                  },
                  treatment: {
                    t: "Therapy Sanctuary",
                    s: "From ₹4,200",
                    d: "Rejuvenating head spa & oil therapies.",
                  },
                  vip: {
                    t: "VIP Suite",
                    s: "From ₹7,500",
                    d: "Private pedicure & exclusive styling.",
                  },
                }[id];
                const delayClass = [
                  "",
                  "delay-100",
                  "delay-200",
                  "delay-300",
                  "delay-150",
                  "delay-250",
                ][idx];
                return (
                  <button
                    key={id}
                    onClick={() => setOpen(id)}
                    className={`group relative bg-[oklch(0.12_0.005_60)] p-10 text-left transition hover:bg-[oklch(0.16_0.006_60)] hover:-translate-y-1 hover:shadow-luxe reveal ${delayClass}`}
                  >
                    <p className="text-[0.6rem] tracking-[0.4em] uppercase text-blush">
                      {meta.s}
                    </p>
                    <h3 className="mt-3 font-display text-3xl">{meta.t}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {meta.d}
                    </p>
                    <span className="mt-8 inline-flex items-center gap-2 text-[0.65rem] tracking-[0.35em] uppercase text-foreground transition group-hover:text-blush">
                      View & Book{" "}
                      <span className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* REVIEWS & GUEST LEDGER */}
        <section
          id="reviews"
          className="relative min-h-screen bg-[oklch(0.12_0.005_60)]/75 px-6 py-32 backdrop-blur-md sm:px-16 border-t border-blush-pink/20 pointer-events-auto"
        >
          <div className="mx-auto max-w-5xl">
            <p className="text-[0.65rem] tracking-[0.5em] uppercase text-gold reveal">
              Guest Ledger
            </p>
            <h2 className="mt-4 font-display text-5xl sm:text-6xl reveal delay-100">
              Reflections of our guests.
            </h2>
            <p className="mt-4 max-w-xl text-sm text-muted-foreground reveal delay-200">
              Read experiences from those who have stepped inside GraceAndGo, or share your own reflection below.
            </p>

            <div className="mt-16 grid gap-8 md:grid-cols-2">
              {/* Existing Reviews */}
              <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin reveal">
                {reviews.map((r, index) => (
                  <div
                    key={index}
                    className="p-6 rounded-sm border border-blush-pink/15 bg-black/20 backdrop-blur-sm space-y-3.5 transition hover:border-gold/30 hover:bg-[oklch(0.15_0.006_60)]/40"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${
                              i < r.rating ? "text-[#ffd700]" : "text-muted-foreground/30"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-[0.6rem] tracking-[0.2em] uppercase text-muted-foreground">
                        {r.date}
                      </span>
                    </div>
                    <p className="font-display italic text-base text-foreground leading-relaxed">
                      "{r.comment}"
                    </p>
                    <p className="text-[0.65rem] tracking-[0.25em] uppercase text-gold font-semibold">
                      — {r.name}, {r.city}
                    </p>
                  </div>
                ))}
              </div>

              {/* Leave a Review Form */}
              <div className="p-8 rounded-sm border border-blush-pink/20 bg-black/30 backdrop-blur-sm shadow-soft reveal delay-150">
                <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-6 block font-semibold">
                  Add Your Reflection
                </p>
                <form onSubmit={handleAddReview} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[0.55rem] tracking-[0.2em] uppercase text-muted-foreground block mb-1.5 font-bold">
                        Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Your Name"
                        value={newReviewName}
                        onChange={(e) => setNewReviewName(e.target.value)}
                        className="w-full bg-black/20 border border-blush-pink/15 rounded-sm p-3 text-xs tracking-wider text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="text-[0.55rem] tracking-[0.2em] uppercase text-muted-foreground block mb-1.5 font-bold">
                        City
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Bangalore"
                        value={newReviewCity}
                        onChange={(e) => setNewReviewCity(e.target.value)}
                        className="w-full bg-black/20 border border-blush-pink/15 rounded-sm p-3 text-xs tracking-wider text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-gold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[0.55rem] tracking-[0.2em] uppercase text-muted-foreground block mb-1.5 font-bold">
                      Rating
                    </label>
                    <div className="flex gap-2.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReviewRating(star)}
                          className="text-2xl transition hover:scale-110 focus:outline-none cursor-pointer"
                        >
                          <span
                            className={
                              star <= newReviewRating ? "text-[#ffd700]" : "text-muted-foreground/30"
                            }
                          >
                            ★
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[0.55rem] tracking-[0.2em] uppercase text-muted-foreground block mb-1.5 font-bold">
                      Your Reflection
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Share your experience at GraceAndGo..."
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      className="w-full bg-black/20 border border-blush-pink/15 rounded-sm p-3 text-xs tracking-wider text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-gold resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full overflow-hidden rounded-sm bg-gold-gradient py-3.5 text-xs font-semibold tracking-[0.3em] uppercase text-[oklch(0.14_0.005_60)] hover:brightness-110 shadow-soft cursor-pointer transition-all duration-300"
                    >
                      Publish Reflection
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* APOTHECARY */}
        <section
          id="apothecary"
          className="relative min-h-screen px-6 py-32 sm:px-16 pointer-events-auto"
        >
          <div className="mx-auto grid max-w-5xl items-center gap-16 sm:grid-cols-2">
            <div className="reveal">
              <p className="text-[0.65rem] tracking-[0.5em] uppercase text-blush">
                Apothecary
              </p>
              <h2 className="mt-4 font-display text-5xl sm:text-6xl">
                Bottled in Provence.
              </h2>
              <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                A holographic vitrine above the reception desk holds the house
                collection — small-batch elixirs blended by our in-house
                perfumer. Hover the bottle to begin.
              </p>
              <button
                onClick={() => setOpen("product")}
                className="mt-8 inline-flex items-center gap-3 rounded-sm border border-blush-pink/50 px-6 py-3 text-xs tracking-[0.35em] uppercase text-blush transition hover:bg-blush-pink/10"
              >
                Explore the Collection
              </button>
            </div>
            <div className="hairline pt-6">
              <ul className="space-y-5">
                {[
                  ["No.07", "Radiance Serum", "₹5,500"],
                  ["Velours", "Hair Oil", "₹3,800"],
                  ["Pearl", "Night Crème", "₹7,200"],
                  ["Rose Quartz", "Mist", "₹2,800"],
                ].map(([n, t, p], idx) => {
                  const delayClass = [
                    "",
                    "delay-100",
                    "delay-200",
                    "delay-300",
                  ][idx];
                  return (
                    <li
                      key={n}
                      onClick={() => setOpen("product")}
                      className={`flex items-baseline justify-between hover:text-blush transition-colors duration-300 cursor-pointer reveal ${delayClass}`}
                    >
                      <div>
                        <p className="font-display text-2xl">{n}</p>
                        <p className="text-[0.65rem] tracking-[0.3em] uppercase text-muted-foreground">
                          {t}
                        </p>
                      </div>
                      <span className="font-display text-xl text-blush">
                        {p}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="relative border-t border-blush-pink/20 bg-[oklch(0.09_0.005_60)] px-6 py-16 sm:px-16 reveal pointer-events-auto">
          <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
            <div>
              <p className="font-display text-2xl">
                Grace<span className="text-gold">AndGo</span>
              </p>
              <p className="mt-2 text-xs tracking-[0.3em] uppercase text-muted-foreground">
                Premium Virtual Salon Experience
              </p>
              <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
                By appointment · hello@graceandgo.com
              </p>
            </div>
            <p className="text-[0.6rem] tracking-[0.4em] uppercase text-muted-foreground">
              © MMXXVI — A virtual experience
            </p>
          </div>
        </footer>
      </main>

      {/* Progress rail */}
      <div className={`pointer-events-none fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 sm:block transition-opacity duration-1000 ${
        hasEntered ? "opacity-100" : "opacity-0"
      }`}>
        <div className="relative h-64 w-px bg-blush-pink/20">
          <div
            className="absolute left-0 top-0 w-px bg-gold-gradient transition-[height] duration-150"
            style={{ height: `${globalScroll * 100}%` }}
          />
        </div>
      </div>

      <StorefrontOverlay
        isOpen={isStorefrontOpen}
        onOpen={handleEnter}
        onOpenComplete={handleOpenComplete}
      />

      <ServiceOverlay
        id={open}
        initialServiceName={initialService}
        gender={selectedGender}
        onClose={() => {
          setOpen(null);
          setInitialService(null);
        }}
      />

      <EntranceLanding
        isOpen={showEntranceLanding}
        onClose={() => setShowEntranceLanding(false)}
        onSelectTour={handleSelectTour}
      />

      <AIScanHub
        isOpen={showAIScanHub}
        onClose={() => setShowAIScanHub(false)}
        onBookService={(hId, sName) => handleOpenRoom(hId as HotspotId, sName)}
      />
    </div>
  );
}
