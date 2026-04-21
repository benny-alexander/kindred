export type Family = "mum_dad" | "tom_lou" | "ben_jen";
export type Building = "shack" | "tiny_home" | "shed";

export type Booking = {
  id: string;
  family: Family;
  building: Building;
  start_date: string;
  end_date: string;
  notes: string | null;
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
];

export type BuildingMeta = {
  value: Building;
  label: string;
  emoji: string;
  gradient: string;
  blurb: string;
};

export const BUILDINGS: BuildingMeta[] = [
  {
    value: "shack",
    label: "The Shack",
    emoji: "🏡",
    gradient: "from-amber-100 to-orange-50",
    blurb: "The main house",
  },
  {
    value: "tiny_home",
    label: "Tiny Home",
    emoji: "🛖",
    gradient: "from-emerald-100 to-lime-50",
    blurb: "Up the back",
  },
  {
    value: "shed",
    label: "The Shed",
    emoji: "🏚️",
    gradient: "from-stone-200 to-stone-50",
    blurb: "Cozy for two",
  },
];

export const familyMeta = (f: Family) => FAMILIES.find((x) => x.value === f)!;
export const buildingMeta = (b: Building) => BUILDINGS.find((x) => x.value === b)!;
export const familyLabel = (f: Family) => familyMeta(f).label;
export const buildingLabel = (b: Building) => buildingMeta(b).label;
