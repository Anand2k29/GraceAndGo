import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { HotspotId } from "./SalonScene";

interface Service {
  name: string;
  duration: string;
  price: string;
  note?: string;
}

const DATA: Record<
  HotspotId,
  { title: string; tagline: string; services: Service[] }
> = {
  hair: {
    title: "Hair Atelier",
    tagline: "Couture cuts, color & ceremonial blow-outs by master stylists.",
    services: [
      { name: "Signature Cut & Style", duration: "75 min", price: "$185" },
      {
        name: "Balayage Composition",
        duration: "180 min",
        price: "$420",
        note: "Most requested",
      },
      { name: "Silk Press Ritual", duration: "120 min", price: "$240" },
      { name: "Bridal Atelier Package", duration: "240 min", price: "$680" },
    ],
  },
  nails: {
    title: "Nails Bar",
    tagline: "Hand-painted artistry on champagne-marble manicure stations.",
    services: [
      { name: "Maison Manicure", duration: "45 min", price: "$75" },
      { name: "Gel Sculpture", duration: "75 min", price: "$120" },
      { name: "Pedicure Lumière", duration: "60 min", price: "$95" },
      { name: "Crystal Couture Set", duration: "120 min", price: "$220" },
    ],
  },
  facial: {
    title: "Facial Suite",
    tagline: "Bespoke skincare protocols in a private VIP chamber.",
    services: [
      { name: "Lumière Glow Facial", duration: "60 min", price: "$220" },
      { name: "Diamond Microdermabrasion", duration: "75 min", price: "$320" },
      {
        name: "LED & Cryo Ritual",
        duration: "90 min",
        price: "$380",
        note: "VIP exclusive",
      },
      { name: "24K Gold Renewal", duration: "120 min", price: "$580" },
    ],
  },
  product: {
    title: "Maison Apothecary",
    tagline: "Curated serums, oils & elixirs — bottled by hand in Provence.",
    services: [
      { name: "No.07 Radiance Serum", duration: "30 ml", price: "$185" },
      { name: "Velours Hair Oil", duration: "50 ml", price: "$125" },
      { name: "Pearl Night Crème", duration: "50 ml", price: "$240" },
      { name: "Rose Quartz Mist", duration: "100 ml", price: "$95" },
    ],
  },
};

const ARTISANS: Record<HotspotId, string[]> = {
  hair: [
    "Any Master Stylist",
    "Jean-Luc (Atelier Director)",
    "Elise (Senior Colorist)",
    "Marc (Creative Designer)",
  ],
  nails: [
    "Any Nail Artisan",
    "Chloe (Senior Tech)",
    "Sasha (Nail Artist)",
    "Lili (Manicurist)",
  ],
  facial: [
    "Any Esthetician",
    "Madame Renée (Skin Therapist)",
    "Dr. Aris (Bespoke Protocols)",
  ],
  product: [
    "Any Perfumer",
    "Pierre (House Alchemist)",
    "Sophie (Apothecary Curator)",
  ],
};

const TIME_SLOTS = [
  "09:30 AM",
  "11:00 AM",
  "01:00 PM",
  "02:30 PM",
  "04:00 PM",
  "05:30 PM",
  "07:00 PM",
];

const getNextSevenDays = () => {
  const days = [];
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  for (let i = 1; i <= 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push({
      name: daysOfWeek[d.getDay()],
      dateStr: `${d.getDate()} ${months[d.getMonth()]}`,
      raw: d.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }),
    });
  }
  return days;
};

export default function ServiceOverlay({
  id,
  onClose,
}: {
  id: HotspotId | null;
  onClose: () => void;
}) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [bookingStep, setBookingStep] = useState<
    "select" | "details" | "success"
  >("select");

  // Form fields
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedArtisan, setSelectedArtisan] = useState<string>("");
  const [clientName, setClientName] = useState<string>("");
  const [clientEmail, setClientEmail] = useState<string>("");
  const [clientPhone, setClientPhone] = useState<string>("");
  const [confCode, setConfCode] = useState<string>("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && handleResetClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Reset steps on change of hotspot ID
  useEffect(() => {
    setSelectedService(null);
    setBookingStep("select");
    setSelectedDate("");
    setSelectedTime("");
    setClientName("");
    setClientEmail("");
    setClientPhone("");
  }, [id]);

  if (!id) return null;
  const d = DATA[id];
  const days = getNextSevenDays();
  const artisansList = ARTISANS[id];

  const handleResetClose = () => {
    onClose();
    setTimeout(() => {
      setSelectedService(null);
      setBookingStep("select");
    }, 300);
  };

  const handleProceedToBooking = () => {
    if (selectedService) {
      setSelectedDate(days[0].raw);
      setSelectedTime(TIME_SLOTS[0]);
      setSelectedArtisan(artisansList[0]);
      setBookingStep("details");
    }
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !clientPhone) {
      toast.error("Please fill in all personal information.");
      return;
    }

    // Generate confirmation code
    const code = `ML-${Math.floor(100000 + Math.random() * 900000)}`;
    setConfCode(code);
    toast.success(`Ritual requested successfully! Code: ${code}`);
    setBookingStep("success");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-md animate-[fade-in_0.3s_ease-out]"
        onClick={handleResetClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg max-h-[90vh] sm:max-h-[85vh] flex flex-col overflow-hidden rounded-sm border border-[oklch(0.82_0.09_85)]/30 bg-[oklch(0.14_0.005_60)] shadow-luxe animate-[scale-in_0.25s_ease-out]">
        <div className="absolute inset-x-0 top-0 h-px bg-gold-gradient" />

        {/* Header (Fixed) */}
        <div className="flex items-center justify-between border-b border-[oklch(0.82_0.09_85)]/10 px-8 py-5">
          <div>
            <p className="text-[0.65rem] tracking-[0.4em] uppercase text-gold">
              Maison Lumière
            </p>
            <h3 className="font-display text-2xl text-foreground mt-1">
              {d.title}
            </h3>
          </div>
          <button
            onClick={handleResetClose}
            aria-label="Close"
            className="text-[oklch(0.72_0.015_70)] hover:text-gold transition-colors p-1"
          >
            ✕
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto grain p-8">
          {/* STEP 1: SELECT SERVICE */}
          {bookingStep === "select" && (
            <div className="space-y-6">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {d.tagline}
              </p>

              <div className="space-y-3">
                {d.services.map((s) => {
                  const isSelected = selectedService?.name === s.name;
                  return (
                    <button
                      key={s.name}
                      onClick={() => setSelectedService(s)}
                      className={`w-full text-left flex items-baseline justify-between gap-4 p-4 rounded-sm border transition-all duration-300 ${
                        isSelected
                          ? "border-gold bg-[oklch(0.82_0.09_85)]/10 shadow-soft"
                          : "border-[oklch(0.82_0.09_85)]/10 bg-black/20 hover:border-[oklch(0.82_0.09_85)]/30 hover:bg-[oklch(0.16_0.006_60)]"
                      }`}
                    >
                      <div className="pr-4">
                        <span className="font-display text-lg text-foreground flex items-center gap-2">
                          {isSelected && (
                            <span className="text-gold text-xs">●</span>
                          )}
                          {s.name}
                          {s.note && (
                            <span className="ml-1 text-[0.55rem] tracking-[0.2em] uppercase text-[oklch(0.88_0.05_25)] border border-[oklch(0.88_0.05_25)]/20 px-1 rounded-sm">
                              {s.note}
                            </span>
                          )}
                        </span>
                        <p className="text-[0.65rem] tracking-widest uppercase text-muted-foreground mt-1">
                          {s.duration}
                        </p>
                      </div>
                      <span
                        className={`font-display text-lg ${isSelected ? "text-gold" : "text-muted-foreground group-hover:text-gold"}`}
                      >
                        {s.price}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-[oklch(0.82_0.09_85)]/10">
                <button
                  disabled={!selectedService}
                  onClick={handleProceedToBooking}
                  className={`w-full overflow-hidden rounded-sm py-3.5 text-xs font-semibold tracking-[0.3em] uppercase transition-all duration-300 ${
                    selectedService
                      ? "bg-gold-gradient text-[oklch(0.14_0.005_60)] hover:brightness-110 shadow-soft cursor-pointer"
                      : "bg-muted text-muted-foreground border border-border/10 cursor-not-allowed opacity-55"
                  }`}
                >
                  {selectedService
                    ? `Book ${selectedService.name} →`
                    : "Select a Ritual"}
                </button>
                <p className="mt-3 text-center text-[0.6rem] tracking-[0.25em] uppercase text-muted-foreground">
                  Private & secure booking request
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: BOOKING DETAILS FORM */}
          {bookingStep === "details" && selectedService && (
            <form onSubmit={handleConfirmBooking} className="space-y-6">
              {/* Back button and service summary */}
              <div className="flex items-center gap-3 bg-black/20 p-3 rounded-sm border border-[oklch(0.82_0.09_85)]/10">
                <button
                  type="button"
                  onClick={() => setBookingStep("select")}
                  className="text-gold text-xs tracking-wider uppercase hover:underline"
                >
                  ← Change
                </button>
                <div className="w-px h-4 bg-muted" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground truncate">
                    Selected Ritual:
                  </p>
                  <p className="font-display text-sm text-foreground truncate">
                    {selectedService.name}
                  </p>
                </div>
                <span className="font-display text-gold">
                  {selectedService.price}
                </span>
              </div>

              {/* 1. Date Selection */}
              <div className="space-y-2">
                <label className="text-[0.65rem] tracking-[0.3em] uppercase text-gold">
                  1. Select Preferred Date
                </label>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                  {days.map((day) => {
                    const isSelected = selectedDate === day.raw;
                    return (
                      <button
                        key={day.raw}
                        type="button"
                        onClick={() => setSelectedDate(day.raw)}
                        className={`flex-shrink-0 flex flex-col items-center justify-center p-3 rounded-sm border w-16 transition-all duration-300 cursor-pointer ${
                          isSelected
                            ? "border-gold bg-[oklch(0.82_0.09_85)]/15 text-gold"
                            : "border-[oklch(0.82_0.09_85)]/10 bg-black/10 hover:border-gold/30 hover:bg-black/30"
                        }`}
                      >
                        <span className="text-[0.55rem] tracking-wider uppercase text-muted-foreground">
                          {day.name}
                        </span>
                        <span className="font-display text-sm font-semibold mt-1">
                          {day.dateStr}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Time Selection */}
              <div className="space-y-2">
                <label className="text-[0.65rem] tracking-[0.3em] uppercase text-gold">
                  2. Select Preferred Time
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {TIME_SLOTS.map((time) => {
                    const isSelected = selectedTime === time;
                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={`py-2 px-1 text-center rounded-sm border text-[0.65rem] tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                          isSelected
                            ? "border-gold bg-[oklch(0.82_0.09_85)]/15 text-gold"
                            : "border-[oklch(0.82_0.09_85)]/10 bg-black/10 hover:border-gold/30"
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Artisan Selection */}
              <div className="space-y-2">
                <label className="text-[0.65rem] tracking-[0.3em] uppercase text-gold">
                  3. Select Preferred Artisan
                </label>
                <select
                  value={selectedArtisan}
                  onChange={(e) => setSelectedArtisan(e.target.value)}
                  className="w-full bg-black/30 border border-[oklch(0.82_0.09_85)]/20 rounded-sm p-3 text-xs tracking-wider text-foreground focus:outline-none focus:border-gold"
                >
                  {artisansList.map((artisan) => (
                    <option
                      key={artisan}
                      value={artisan}
                      className="bg-[oklch(0.14_0.005_60)] text-foreground"
                    >
                      {artisan}
                    </option>
                  ))}
                </select>
              </div>

              {/* 4. Client Information */}
              <div className="space-y-3 pt-2">
                <label className="text-[0.65rem] tracking-[0.3em] uppercase text-gold block">
                  4. Personal Details
                </label>
                <div className="space-y-2.5">
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-black/20 border border-[oklch(0.82_0.09_85)]/15 rounded-sm p-3 text-xs tracking-wider text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-gold"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full bg-black/20 border border-[oklch(0.82_0.09_85)]/15 rounded-sm p-3 text-xs tracking-wider text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-gold"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Phone Number"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full bg-black/20 border border-[oklch(0.82_0.09_85)]/15 rounded-sm p-3 text-xs tracking-wider text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-[oklch(0.82_0.09_85)]/10">
                <button
                  type="submit"
                  className="w-full overflow-hidden rounded-sm bg-gold-gradient py-3.5 text-xs font-semibold tracking-[0.3em] uppercase text-[oklch(0.14_0.005_60)] hover:brightness-110 shadow-soft cursor-pointer transition-all duration-300"
                >
                  Request Booking
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: BOOKING SUCCESS CONFIRMATION */}
          {bookingStep === "success" && selectedService && (
            <div className="text-center space-y-6 py-4 animate-[fade-in_0.5s_ease-out]">
              {/* Gold wax-seal checkmark */}
              <div className="mx-auto w-16 h-16 rounded-full border border-gold flex items-center justify-center bg-[oklch(0.82_0.09_85)]/10 text-gold shadow-luxe animate-[scale-in_0.4s_cubic-bezier(0.16,1,0.3,1)]">
                <span className="text-2xl font-bold font-sans">✓</span>
              </div>

              <div className="space-y-2">
                <h4 className="font-display text-3xl text-foreground">
                  Ritual Reserved
                </h4>
                <p className="text-[0.65rem] tracking-[0.25em] uppercase text-gold">
                  Confirmation Code: {confCode}
                </p>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
                Your request has been received by our house concierge. A
                personalized confirmation and digital invitation will be sent to
                your inbox shortly.
              </p>

              {/* Summary table */}
              <div className="bg-black/35 rounded-sm border border-[oklch(0.82_0.09_85)]/15 p-5 text-left text-xs space-y-3.5 max-w-sm mx-auto">
                <div className="flex justify-between items-baseline border-b border-border/10 pb-2">
                  <span className="text-muted-foreground">Service:</span>
                  <span className="font-display text-sm font-semibold text-foreground text-right">
                    {selectedService.name}
                  </span>
                </div>
                <div className="flex justify-between items-baseline border-b border-border/10 pb-2">
                  <span className="text-muted-foreground">Atelier:</span>
                  <span className="text-foreground text-right">{d.title}</span>
                </div>
                <div className="flex justify-between items-baseline border-b border-border/10 pb-2">
                  <span className="text-muted-foreground">Scheduled Date:</span>
                  <span className="text-foreground text-right">
                    {selectedDate}
                  </span>
                </div>
                <div className="flex justify-between items-baseline border-b border-border/10 pb-2">
                  <span className="text-muted-foreground">Scheduled Time:</span>
                  <span className="text-foreground text-right">
                    {selectedTime}
                  </span>
                </div>
                <div className="flex justify-between items-baseline border-b border-border/10 pb-2">
                  <span className="text-muted-foreground">Master Artisan:</span>
                  <span className="text-foreground text-right">
                    {selectedArtisan}
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-muted-foreground">Guest:</span>
                  <span className="text-foreground text-right">
                    {clientName}
                  </span>
                </div>
              </div>

              <div className="pt-6 border-t border-[oklch(0.82_0.09_85)]/10 max-w-sm mx-auto">
                <button
                  type="button"
                  onClick={handleResetClose}
                  className="w-full overflow-hidden rounded-sm border border-[oklch(0.82_0.09_85)]/50 py-3.5 text-xs font-semibold tracking-[0.3em] uppercase text-gold hover:bg-[oklch(0.82_0.09_85)]/10 cursor-pointer transition-all duration-300"
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
