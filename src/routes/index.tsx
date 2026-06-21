import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import ServiceOverlay from "@/components/salon/ServiceOverlay";

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
    title: "The Lounge & Apothecary",
    body: "A quiet sanctuary at the end of the passage. Serums, oils & elixirs orbit a cozy velvet sofa.",
  },
];

function Index() {
  const { global: globalScroll, camera: cameraScroll } = useScrollProgress();
  const [open, setOpen] = useState<HotspotId | null>(null);

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
    <div className="relative bg-background text-foreground">
      {/* Fixed 3D stage */}
      <div className="fixed inset-0 z-0">
        <Suspense
          fallback={
            <div className="flex h-full items-center justify-center text-xs tracking-[0.3em] uppercase text-muted-foreground">
              Entering GraceAndGo…
            </div>
          }
        >
          <SalonScene
            scroll={cameraScroll}
            activeRoom={open}
            onHotspot={setOpen}
          />
        </Suspense>
        {/* Soft centered vignette and subtle top/bottom gradients for contrast */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(14,12,11,0.65))]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50" />
      </div>

      {/* Top nav */}
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 sm:px-12 bg-gradient-to-b from-black/85 via-black/35 to-transparent backdrop-blur-[1px]">
        <div>
          <p className="font-display text-xl tracking-wide text-foreground text-shadow-luxe">
            Grace<span className="text-gold">AndGo</span>
          </p>
          <p className="text-[0.55rem] tracking-[0.4em] uppercase text-muted-foreground text-shadow-luxe">
            Your Beauty, Our Passion
          </p>
        </div>
        <nav className="hidden items-center gap-8 text-[0.65rem] tracking-[0.35em] uppercase text-muted-foreground sm:flex text-shadow-luxe">
          <a className="transition hover:text-gold" href="#tour">
            Tour
          </a>
          <a className="transition hover:text-gold" href="#services">
            Services
          </a>
          <a className="transition hover:text-gold" href="#apothecary">
            Apothecary
          </a>
        </nav>
        <button
          onClick={() => setOpen("facial")}
          className="rounded-sm border border-blush-pink/50 px-4 py-2 text-[0.65rem] tracking-[0.35em] uppercase text-blush transition hover:bg-blush-pink/10"
        >
          Reserve
        </button>
      </header>

      {/* Scroll content overlays */}
      <main className="relative z-10">
        {/* HERO */}
        <section className="relative flex min-h-screen items-center justify-center text-center px-6 pb-16 sm:px-16">
          <div className="max-w-2xl flex flex-col items-center">
            <p className="text-[0.65rem] tracking-[0.5em] uppercase text-blush reveal-instant text-shadow-luxe font-semibold">
              GraceAndGo Salon
            </p>
            <h1 className="mt-6 font-display text-6xl leading-[1.05] sm:text-8xl reveal-instant delay-instant-100 text-shadow-luxe tracking-[0.05em]">
              GRACE <span className="italic text-blush-gold-gradient">&</span>{" "}
              GO
            </h1>
            <p className="mt-4 text-[0.7rem] tracking-[0.6em] uppercase text-muted-foreground reveal-instant delay-instant-200 text-shadow-luxe font-medium">
              PARIS · TOKYO · NEW YORK
            </p>
            <div className="mt-12 reveal-instant delay-instant-300">
              <a
                href="#tour"
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-blush-pink/60 bg-black/40 hover:bg-blush-pink/15 px-8 py-3.5 text-xs font-semibold tracking-[0.4em] uppercase text-blush shadow-luxe transition-all duration-300 hover:scale-105"
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
            <p className="mt-3 text-[0.55rem] tracking-[0.4em] uppercase text-muted-foreground text-shadow-luxe">
              Scroll to enter
            </p>
          </div>
        </section>

        {/* TOUR CHAPTERS */}
        <section id="tour" className="relative">
          {CHAPTERS.map((c, i) => (
            <div
              key={c.title}
              className={`flex min-h-screen items-center px-6 sm:px-16 ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
            >
              <div className="max-w-sm rounded-sm border border-blush-pink/25 bg-[oklch(0.12_0.005_60)]/85 p-8 backdrop-blur-md shadow-luxe reveal">
                <p className="text-[0.6rem] tracking-[0.4em] uppercase text-gold">
                  {c.eyebrow}
                </p>
                <h2 className="mt-3 font-display text-4xl text-foreground">
                  {c.title}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {c.body}
                </p>
                <div className="hairline mt-6 pt-4 text-[0.6rem] tracking-[0.35em] uppercase text-muted-foreground">
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
          className="relative min-h-screen bg-[oklch(0.1_0.005_60)]/85 px-6 py-32 backdrop-blur-md sm:px-16"
        >
          <div className="mx-auto max-w-5xl">
            <p className="text-[0.65rem] tracking-[0.5em] uppercase text-gold reveal">
              The Carte
            </p>
            <h2 className="mt-4 font-display text-5xl sm:text-6xl reveal delay-100">
              Rituals of the house.
            </h2>
            <p className="mt-4 max-w-xl text-sm text-muted-foreground reveal delay-200">
              Four ateliers, one philosophy: time, taken slowly. Tap any room
              above, or browse below.
            </p>

            <div className="mt-16 grid gap-px bg-blush-pink/20 sm:grid-cols-2">
              {(["hair", "nails", "facial", "product"] as HotspotId[]).map(
                (id, idx) => {
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
                  }[id];
                  const delayClass = [
                    "",
                    "delay-100",
                    "delay-200",
                    "delay-300",
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
                },
              )}
            </div>
          </div>
        </section>

        {/* APOTHECARY */}
        <section
          id="apothecary"
          className="relative min-h-screen px-6 py-32 sm:px-16"
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
        <footer className="relative border-t border-blush-pink/20 bg-[oklch(0.09_0.005_60)] px-6 py-16 sm:px-16 reveal">
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
      <div className="pointer-events-none fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 sm:block">
        <div className="relative h-64 w-px bg-blush-pink/20">
          <div
            className="absolute left-0 top-0 w-px bg-gold-gradient transition-[height] duration-150"
            style={{ height: `${globalScroll * 100}%` }}
          />
        </div>
      </div>

      <ServiceOverlay id={open} onClose={() => setOpen(null)} />
    </div>
  );
}
