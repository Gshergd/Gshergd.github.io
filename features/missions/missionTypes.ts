export type MissionStatus = "draft" | "published";

export type MissionButton = {
  label: string;
  href: string;
  tone: "primary" | "secondary" | "dark";
};

export type MissionStat = { value: string; label: string };

export type MissionCard = {
  id: string;
  title: string;
  kicker: string;
  body: string;
  image: string;
  caption?: string;
};

export type MissionLink = MissionCard & { href: string; initials?: string };
export type MissionFaq = { id: string; question: string; answer: string };

export type MissionHero = {
  status: string;
  eyebrow: string;
  title: string;
  lede: string;
  image: string;
  buttons: MissionButton[];
  stats: MissionStat[];
};

export type MissionBlock =
  | { id: string; type: "marquee"; items: string[] }
  | { id: string; type: "cards"; eyebrow: string; title: string; intro: string; items: MissionCard[] }
  | { id: string; type: "stats"; items: MissionStat[] }
  | { id: string; type: "feature"; eyebrow: string; title: string; body: string; image: string; buttons: MissionButton[] }
  | { id: string; type: "banner"; eyebrow: string; title: string; body: string; image: string; tags: string[] }
  | { id: string; type: "gallery"; eyebrow: string; title: string; intro: string; items: MissionCard[] }
  | { id: string; type: "capabilities"; eyebrow: string; title: string; intro: string; visuals: MissionCard[]; items: MissionCard[] }
  | { id: string; type: "connections"; eyebrow: string; title: string; intro: string; image: string; items: MissionLink[] }
  | { id: string; type: "faq"; eyebrow: string; image: string; items: MissionFaq[] };

export type MissionRecord = {
  id: string;
  slug: string;
  name: string;
  excerpt: string;
  cover_url: string;
  cover_storage_path?: string | null;
  status: MissionStatus;
  hero: MissionHero;
  blocks: MissionBlock[];
  created_at?: string;
  updated_at?: string;
};

export const MISSION_NAME_LIMIT = 64;
export const MISSION_EXCERPT_LIMIT = 220;
export const MISSION_UPLOAD_LIMIT = 10 * 1024 * 1024;

export function createId(prefix = "block") {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return `${prefix}-${crypto.randomUUID()}`;
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function toMissionSlug(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 56);
}

