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
      { name: "Signature Cut & Style", duration: "75 min", price: "₹4,500" },
      {
        name: "Balayage Composition",
        duration: "180 min",
        price: "₹9,500",
        note: "Most requested",
      },
      { name: "Silk Press Ritual", duration: "120 min", price: "₹6,500" },
      { name: "Bridal Atelier Package", duration: "240 min", price: "₹18,000" },
    ],
  },
  nails: {
    title: "Nails Bar",
    tagline: "Hand-painted artistry on champagne-marble manicure stations.",
    services: [
      { name: "Grace Manicure", duration: "45 min", price: "₹2,200" },
      { name: "Gel Sculpture", duration: "75 min", price: "₹3,500" },
      { name: "Pedicure Grace", duration: "60 min", price: "₹2,800" },
      { name: "Crystal Couture Set", duration: "120 min", price: "₹6,000" },
    ],
  },
  facial: {
    title: "Facial Suite",
    tagline: "Bespoke skincare protocols in a private VIP chamber.",
    services: [
      { name: "Glow Facial", duration: "60 min", price: "₹6,500" },
      {
        name: "Diamond Microdermabrasion",
        duration: "75 min",
        price: "₹9,000",
      },
      {
        name: "LED & Cryo Ritual",
        duration: "90 min",
        price: "₹11,000",
        note: "VIP exclusive",
      },
      { name: "24K Gold Renewal", duration: "120 min", price: "₹16,500" },
    ],
  },
  product: {
    title: "GraceAndGo Apothecary",
    tagline: "Curated serums, oils & elixirs — bottled by hand in Provence.",
    services: [
      { name: "No.07 Radiance Serum", duration: "30 ml", price: "₹5,500" },
      { name: "Velours Hair Oil", duration: "50 ml", price: "₹3,800" },
      { name: "Pearl Night Crème", duration: "50 ml", price: "₹7,200" },
      { name: "Rose Quartz Mist", duration: "100 ml", price: "₹2,800" },
    ],
  },
  treatment: {
    title: "Therapy Sanctuary",
    tagline:
      "Rejuvenating head spas, scalp detox rituals, and organic oil infusions.",
    services: [
      {
        name: "Signature Hair Spa Treatment",
        duration: "90 min",
        price: "₹5,800",
      },
      {
        name: "Scalp Detoxification Ritual",
        duration: "60 min",
        price: "₹4,200",
      },
      {
        name: "Ayurvedic Hair & Scalp Therapy",
        duration: "75 min",
        price: "₹4,800",
      },
      {
        name: "Keratin Restorative Treatment",
        duration: "120 min",
        price: "₹8,500",
      },
    ],
  },
  vip: {
    title: "VIP Suite",
    tagline:
      "A private studio suite for exclusive foot therapy, pedicures, and custom styling.",
    services: [
      {
        name: "Royal Pedicure & Manicure Duo",
        duration: "90 min",
        price: "₹7,500",
      },
      {
        name: "Private Suite Custom Styling",
        duration: "120 min",
        price: "₹12,000",
      },
      {
        name: "VIP Champagne Grooming Experience",
        duration: "150 min",
        price: "₹15,000",
      },
    ],
  },
};

interface Artisan {
  name: string;
  role: string;
  specialty: string;
}

const ARTISANS: Record<HotspotId, Artisan[]> = {
  hair: [
    { name: "Any Master Stylist", role: "Unassigned", specialty: "Best available artisan for selected service" },
    { name: "Jean-Luc", role: "Atelier Director", specialty: "Couture precision cuts & styling" },
    { name: "Elise", role: "Senior Colorist", specialty: "Balayage composition & color transformations" },
    { name: "Marc", role: "Creative Designer", specialty: "Avant-garde design & bridal packages" },
  ],
  nails: [
    { name: "Any Nail Artisan", role: "Unassigned", specialty: "Best available artisan for selected service" },
    { name: "Chloe", role: "Senior Nail Tech", specialty: "Crystal couture & gel sculptures" },
    { name: "Sasha", role: "Nail Artist", specialty: "Hand-painted organic art & decals" },
    { name: "Lili", role: "Manicurist", specialty: "Grace signature manicure & pedicure" },
  ],
  facial: [
    { name: "Any Esthetician", role: "Unassigned", specialty: "Best available artisan for selected service" },
    { name: "Madame Renée", role: "Senior Esthetician", specialty: "24K Gold renewal & LED cryo lifting" },
    { name: "Dr. Aris", role: "Skin Specialist", specialty: "Bespoke skincare protocols & microdermabrasion" },
  ],
  product: [
    { name: "Any Perfumer", role: "Unassigned", specialty: "Best available expert" },
    { name: "Pierre", role: "House Alchemist", specialty: "Provence botanical blending & serums" },
    { name: "Sophie", role: "Apothecary Curator", specialty: "Organic oil infusions & quartz mists" },
  ],
  treatment: [
    { name: "Any Therapy Specialist", role: "Unassigned", specialty: "Best available artisan for selected service" },
    { name: "Siddharth", role: "Ayurvedic Master", specialty: "Scalp detox & restorative herb infusions" },
    { name: "Priya", role: "Scalp Therapist", specialty: "Signature head spas & head relaxation" },
  ],
  vip: [
    { name: "Any VIP Artisan", role: "Unassigned", specialty: "Best available artisan for selected service" },
    { name: "Rohan", role: "Celebrity Stylist", specialty: "VIP Champagne styling & custom cuts" },
    { name: "Ananya", role: "Executive Pedicurist", specialty: "Royal pedicure & manicure duo rituals" },
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
  initialServiceName,
}: {
  id: HotspotId | null;
  onClose: () => void;
  initialServiceName?: string | null;
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

  // Reset steps on change of hotspot ID or pre-selected service
  useEffect(() => {
    if (id && initialServiceName && DATA[id]) {
      const found = DATA[id].services.find(
        (s) => s.name === initialServiceName || s.name.toLowerCase().includes(initialServiceName.toLowerCase())
      );
      if (found) {
        const localDays = getNextSevenDays();
        const localArtisans = ARTISANS[id] || [];
        setSelectedService(found);
        setSelectedDate(localDays[0]?.raw || "");
        setSelectedTime(TIME_SLOTS[0] || "");
        setSelectedArtisan(localArtisans[0]?.name || "");
        setBookingStep("details");
        return;
      }
    }

    setSelectedService(null);
    setBookingStep("select");
    setSelectedDate("");
    setSelectedTime("");
    setClientName("");
    setClientEmail("");
    setClientPhone("");
  }, [id, initialServiceName]);

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
      setSelectedArtisan(artisansList[0]?.name || "");
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
    const code = `GG-${Math.floor(100000 + Math.random() * 900000)}`;
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
      <div className="relative w-full max-w-lg max-h-[90vh] sm:max-h-[85vh] flex flex-col overflow-hidden rounded-sm border border-blush-pink/30 bg-[oklch(0.14_0.005_60)] shadow-luxe animate-[scale-in_0.25s_ease-out]">
        <div className="absolute inset-x-0 top-0 h-px bg-gold-gradient" />

        {/* Header (Fixed) */}
        <div className="flex items-center justify-between border-b border-blush-pink/10 px-8 py-5">
          <div>
            <p className="text-[0.65rem] tracking-[0.4em] uppercase text-gold">
              GraceAndGo
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
                          ? "border-gold bg-blush-pink/10 shadow-soft"
                          : "border-blush-pink/10 bg-black/20 hover:border-blush-pink/30 hover:bg-[oklch(0.16_0.006_60)]"
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

              <div className="pt-4 border-t border-blush-pink/10">
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
              <div className="flex items-center gap-3 bg-black/20 p-3 rounded-sm border border-blush-pink/10">
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
                            ? "border-gold bg-blush-pink/15 text-gold"
                            : "border-blush-pink/10 bg-black/10 hover:border-gold/30 hover:bg-black/30"
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
                            ? "border-gold bg-blush-pink/15 text-gold"
                            : "border-blush-pink/10 bg-black/10 hover:border-gold/30"
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
                <label className="text-[0.65rem] tracking-[0.3em] uppercase text-gold block">
                  3. Select Preferred Artisan
                </label>
                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 scrollbar-thin">
                  {artisansList.map((artisan) => {
                    const isSelected = selectedArtisan === artisan.name;
                    return (
                      <button
                        key={artisan.name}
                        type="button"
                        onClick={() => setSelectedArtisan(artisan.name)}
                        className={`w-full text-left flex flex-col p-3 rounded-sm border transition-all duration-300 cursor-pointer ${
                          isSelected
                            ? "border-gold bg-blush-pink/15 text-foreground shadow-soft"
                            : "border-blush-pink/10 bg-black/20 hover:border-gold/30 hover:bg-black/30"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-display text-sm text-foreground font-semibold flex items-center gap-2">
                            {isSelected && <span className="text-gold text-[10px]">●</span>}
                            {artisan.name}
                          </span>
                          <span className="text-[0.55rem] tracking-wider uppercase text-gold font-bold">
                            {artisan.role}
                          </span>
                        </div>
                        <p className="text-[0.65rem] text-muted-foreground mt-1">
                          {artisan.specialty}
                        </p>
                      </button>
                    );
                  })}
                </div>
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
                    className="w-full bg-black/20 border border-blush-pink/15 rounded-sm p-3 text-xs tracking-wider text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-gold"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full bg-black/20 border border-blush-pink/15 rounded-sm p-3 text-xs tracking-wider text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-gold"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Phone Number"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full bg-black/20 border border-blush-pink/15 rounded-sm p-3 text-xs tracking-wider text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-blush-pink/10">
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
              <div className="mx-auto w-16 h-16 rounded-full border border-gold flex items-center justify-center bg-blush-pink/10 text-gold shadow-luxe animate-[scale-in_0.4s_cubic-bezier(0.16,1,0.3,1)]">
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
              <div className="bg-black/35 rounded-sm border border-blush-pink/15 p-5 text-left text-xs space-y-3.5 max-w-sm mx-auto">
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

              <div className="pt-6 border-t border-blush-pink/10 max-w-sm mx-auto">
                <button
                  type="button"
                  onClick={handleResetClose}
                  className="w-full overflow-hidden rounded-sm border border-blush-pink/50 py-3.5 text-xs font-semibold tracking-[0.3em] uppercase text-gold hover:bg-blush-pink/10 cursor-pointer transition-all duration-300"
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
