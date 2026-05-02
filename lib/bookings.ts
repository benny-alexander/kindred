export type Family = "mum_dad" | "tom_lou" | "ben_jen" | "other";
export type Building = "shack" | "tiny_home" | "shed" | "camping";

export type Booking = {
  id: string;
  family: Family;
  building: Building;
  start_date: string;
  end_date: string;
  notes: string | null;
  staying: string | null;
  created_at: string;
};

export type FamilyMeta = {
  value: Family;
  label: string;
  initials: string;
  dot: string;
  bg: string;
  ring: string;
  text: string;
};

export const FAMILIES: FamilyMeta[] = [
  {
    value: "mum_dad",
    label: "Mum & Dad",
    initials: "M&D",
    dot: "bg-amber-500",
    bg: "bg-amber-50",
    ring: "ring-amber-300",
    text: "text-amber-900",
  },
  {
    value: "tom_lou",
    label: "Tom & Lou",
    initials: "T&L",
    dot: "bg-emerald-500",
    bg: "bg-emerald-50",
    ring: "ring-emerald-300",
    text: "text-emerald-900",
  },
  {
    value: "ben_jen",
    label: "Ben & Jen",
    initials: "B&J",
    dot: "bg-sky-500",
    bg: "bg-sky-50",
    ring: "ring-sky-300",
    text: "text-sky-900",
  },
  {
    value: "other",
    label: "Other",
    initials: "✶",
    dot: "bg-violet-500",
    bg: "bg-violet-50",
    ring: "ring-violet-300",
    text: "text-violet-900",
  },
];

export type BuildingMeta = {
  value: Building;
  label: string;
  emoji: string;
  gradient: string;
  blurb: string;
  beds: string;
  bathroom: string;
};

export const BUILDINGS: BuildingMeta[] = [
  {
    value: "shack",
    label: "The Shack",
    emoji: "🏡",
    gradient: "from-amber-100 to-orange-50",
    blurb: "The main house",
    beds: "Queen + single fold-out",
    bathroom: "No bathroom — use Tiny Home or Glider Room",
  },
  {
    value: "tiny_home",
    label: "Tiny Home",
    emoji: "🛖",
    gradient: "from-emerald-100 to-lime-50",
    blurb: "Up the back",
    beds: "Two doubles (or queen + fold-out double)",
    bathroom: "Composting toilet, warm shower",
  },
  {
    value: "shed",
    label: "The Glider Room",
    emoji: "🏚️",
    gradient: "from-stone-200 to-stone-50",
    blurb: "Bunk space",
    beds: "Lots of single mattresses",
    bathroom: "Flushing toilet & shower",
  },
  {
    value: "camping",
    label: "Camping / Caravan",
    emoji: "🏕️",
    gradient: "from-sky-100 to-emerald-50",
    blurb: "Pitch a tent or park the van",
    beds: "Bring your own setup",
    bathroom: "Use the Tiny Home or Glider Room",
  },
];

export const familyMeta = (f: Family) => FAMILIES.find((x) => x.value === f)!;
export const buildingMeta = (b: Building) => BUILDINGS.find((x) => x.value === b)!;
export const familyLabel = (f: Family) => familyMeta(f).label;
export const buildingLabel = (b: Building) => buildingMeta(b).label;

export function bookingDisplayName(b: Pick<Booking, "family" | "staying">): string {
  if (b.family === "other") return b.staying?.trim() || "Guest";
  const base = familyLabel(b.family);
  return b.staying?.trim() ? `${base} + ${b.staying.trim()}` : base;
}

export function findConflict(
  bookings: Booking[],
  building: Building,
  startISO: string,
  endISO: string,
  excludeId?: string,
): Booking | null {
  if (!startISO || !endISO || endISO < startISO) return null;
  for (const b of bookings) {
    if (b.id === excludeId) continue;
    if (b.building !== building) continue;
    // inclusive overlap (matches the DB exclusion constraint using daterange [])
    if (b.start_date <= endISO && b.end_date >= startISO) return b;
  }
  return null;
}
