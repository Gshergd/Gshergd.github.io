import type { MissionBlock, MissionRecord } from "./missionTypes";
import { createId, toMissionSlug } from "./missionTypes";

const adaCards = [
  { id: "ada-card-profile", title: "Operative Profile", kicker: "CLASSIFIED IDENTITY", body: "Trace Ada's aliases, shifting objectives, and the details hidden between missions.", image: "/assets/characters/ada-wong/operative-profile.webp", caption: "Every file carries a different employer, objective, or alias. The constant is Ada herself: precise, composed, and impossible to fully place on anyone else's side." },
  { id: "ada-card-archive", title: "Mission Archive", kicker: "OPERATIONAL HISTORY", body: "Revisit Raccoon City, the European village, and every operation where Ada changed the outcome.", image: "/assets/characters/ada-wong/ada-02.png", caption: "From the fall of Raccoon City to the search for the amber, Ada repeatedly enters impossible operations, secures what matters, and leaves before the truth catches up." },
  { id: "ada-card-separate", title: "Separate Ways", kicker: "PARALLEL MISSION", body: "Follow the mission running in parallel with Leon's search and uncover the story he never saw.", image: "/assets/characters/ada-wong/ada-03.png", caption: "Separate Ways reveals the unseen mission behind Leon's journey: Ada's pursuit of the amber, her uneasy alliance with Luis, and the choices that quietly change the ending." },
];

const adaGallery = [
  { id: "ada-frame-1", image: "/assets/characters/ada-wong/ada-04.png", title: "Extraction", kicker: "A NEW DAWN", body: "With the operation collapsing behind her, Ada reaches the extraction point at sunrise. The mission is over; the consequences are only beginning." },
  { id: "ada-frame-2", image: "/assets/characters/ada-wong/ada-06.png", title: "Comms", kicker: "PATCH ME THROUGH", body: "A secure channel, a changing objective, and an employer receiving only the information Ada chooses to share." },
  { id: "ada-frame-3", image: "/assets/characters/ada-wong/ada-08.png", title: "Intel", kicker: "EYES ON TARGET", body: "The smallest detail can change an entire operation. Ada watches first, moves second, and never wastes the advantage." },
  { id: "ada-frame-4", image: "/assets/characters/ada-wong/ada-14.png", title: "Departure", kicker: "SEPARATE WAYS", body: "Another escape, another unanswered question. Ada leaves the battlefield with her identity, intentions, and next destination still classified." },
];

const adaVisuals = [
  { id: "ada-visual-1", image: "/assets/characters/ada-wong/ada-07.png", title: "Observe", kicker: "FIELD DISCIPLINE", body: "Ada reads a room before anyone realizes she has entered it. Observation turns uncertainty into leverage." },
  { id: "ada-visual-2", image: "/assets/characters/ada-wong/ada-09.png", title: "Infiltrate", kicker: "COVERT ACCESS", body: "A convincing cover and exact timing get her through doors that force alone could never open." },
  { id: "ada-visual-3", image: "/assets/characters/ada-wong/ada-13.png", title: "Disappear", kicker: "CLEAN EXTRACTION", body: "The best exit leaves no pursuit, no useful evidence, and no certainty that she was ever there." },
];

const adaCapabilities = [
  ["Hookshot Mobility", "Ada's grappling device turns vertical spaces into escape routes and unreachable positions into tactical ground.", "advantage-01.webp"],
  ["Covert Intelligence", "She builds a cover that survives scrutiny and extracts the one detail her employer actually needs.", "advantage-02.webp"],
  ["Precision Combat", "Measured marksmanship and controlled movement let Ada finish encounters before they become a liability.", "advantage-03.webp"],
  ["Situational Control", "Distractions, feints, and environmental awareness allow her to reshape a dangerous scene.", "advantage-04.webp"],
  ["Independent Judgment", "Ada accepts a brief, not a leash. When the mission conflicts with her code, she makes the final call.", "advantage-05.webp"],
  ["Unshakable Composure", "Whether surrounded, betrayed, or seconds from disaster, she keeps her next move unreadable.", "advantage-06.webp"],
].map(([title, body, image], index) => ({ id: `ada-capability-${index + 1}`, title, body, kicker: "OPERATIONAL ADVANTAGE", image: `/assets/characters/ada-wong/${image}` }));

export const staticAdaMission: MissionRecord = {
  id: "10000000-0000-4000-8000-000000000001",
  slug: "ada-wong",
  name: "Ada Wong",
  excerpt: "A cinematic dossier devoted to the woman in red: covert operations, classified connections, mission footage, and unfinished business.",
  cover_url: "/assets/characters/ada-wong/hero.webp",
  status: "published",
  hero: {
    status: "CLASSIFIED OPERATIVE • ACTIVE",
    eyebrow: "RESIDENT EVIL ARCHIVES",
    title: "Ada\nWong",
    lede: "A name without a history. An operative without a flag. Step into the classified world of Resident Evil's most elusive spy.",
    image: "/assets/characters/ada-wong/hero.webp",
    buttons: [
      { label: "Enter the dossier", href: "#dossier", tone: "primary" },
      { label: "View missions", href: "#mission-footage", tone: "secondary" },
    ],
    stats: [{ value: "1998", label: "FIRST SIGHTING" }, { value: "6+", label: "OPERATIONS" }, { value: "∞", label: "UNFINISHED BUSINESS" }],
  },
  blocks: [
    { id: "ada-marquee", type: "marquee", items: ["RACCOON CITY", "COVERT OPERATIONS", "SEPARATE WAYS", "ASSIGNMENT ADA", "THE WOMAN IN RED"] },
    { id: "ada-dossier", type: "cards", eyebrow: "ACCESS GRANTED", title: "Open the dossier.", intro: "Three ways into the story of an agent whose motives remain classified.", items: adaCards },
    { id: "ada-stats", type: "stats", items: [{ value: "TOP", label: "CLASSIFICATION" }, { value: "100%", label: "MISSION FOCUS" }, { value: "1998", label: "RACCOON CITY" }, { value: "ADA", label: "KNOWN ALIAS" }] },
    { id: "ada-profile", type: "feature", eyebrow: "SUBJECT: ADA WONG", title: "Always close.\nNever captured.", body: "Her employers know only what she lets them know. Behind the red dress, measured smile, and impossible escapes is an operative guided by a private moral compass.", image: "/assets/characters/ada-wong/ada-15.png", buttons: [{ label: "Read her legacy", href: "#field-intelligence", tone: "primary" }, { label: "Browse operations", href: "#mission-footage", tone: "dark" }] },
    { id: "ada-banner", type: "banner", eyebrow: "LATEST DECLASSIFIED FILE", title: "Separate Ways.\nA mission behind the mission.", body: "While Leon fights his way forward, Ada moves through the same nightmare with a different objective — and changes the outcome from the shadows.", image: "/assets/characters/ada-wong/ada-11.png", tags: ["ESPIONAGE", "PLAGA SAMPLE", "HOOKSHOT", "EXTRACTION"] },
    { id: "mission-footage", type: "gallery", eyebrow: "MISSION FOOTAGE", title: "Fragments from the field.", intro: "Every frame tells part of the truth. The rest is still classified.", items: adaGallery },
    { id: "ada-capabilities", type: "capabilities", eyebrow: "FIELD CAPABILITIES", title: "Built for the impossible.", intro: "Ada survives because every movement has a purpose and every secret has value.", visuals: adaVisuals, items: adaCapabilities },
    { id: "ada-connections", type: "connections", eyebrow: "KNOWN CONNECTIONS", title: "Few allies. Fewer answers.", intro: "Every relationship reveals a different version of Ada — and none reveal the whole truth.", image: "/assets/characters/ada-wong/ada-10.png", items: [
      { id: "ada-link-leon", title: "Leon Kennedy", kicker: "Unfinished business", body: "", image: "", href: "#", initials: "LSK" },
      { id: "ada-link-wesker", title: "Albert Wesker", kicker: "Former employer", body: "", image: "", href: "#", initials: "WSK" },
      { id: "ada-link-luis", title: "Luis Serra", kicker: "Field contact", body: "", image: "", href: "#", initials: "LS" },
      { id: "ada-link-merchant", title: "The Merchant", kicker: "Useful acquaintance", body: "", image: "", href: "#", initials: "TM" },
    ] },
    { id: "field-intelligence", type: "faq", eyebrow: "FIELD INTELLIGENCE", image: "/assets/characters/ada-wong/ada-12.png", items: [
      { id: "ada-faq-1", question: "Who is Ada Wong?", answer: "Ada Wong is an elite covert operative whose true loyalties are deliberately difficult to read. Precise, resourceful, and always one step ahead, she moves through the shadows of the Resident Evil story on her own terms." },
      { id: "ada-faq-2", question: "What is Ada's connection to Leon S. Kennedy?", answer: "Ada and Leon share a complicated bond built on trust, deception, and repeated rescues. Their paths cross at the worst possible moments, yet neither can quite leave the other behind." },
      { id: "ada-faq-3", question: "Where does Separate Ways fit into the story?", answer: "Separate Ways follows Ada's parallel mission during Resident Evil 4, revealing the operations, choices, and close calls taking place beyond Leon's point of view." },
      { id: "ada-faq-4", question: "What makes Ada such a capable operative?", answer: "She combines intelligence work, social engineering, acrobatics, marksmanship, and specialized equipment. Her real advantage is composure: Ada rarely reveals more than she intends." },
      { id: "ada-faq-5", question: "Is this an official Capcom website?", answer: "No. This is a fan-made tribute experience inspired by Ada Wong and Resident Evil. It is not affiliated with or endorsed by Capcom." },
    ] },
  ],
};

export const staticMissions = [staticAdaMission];

export function createMissionBlock(type: MissionBlock["type"]): MissionBlock {
  const id = createId(type);
  if (type === "marquee") return { id, type, items: ["NEW MISSION", "CLASSIFIED FILE", "FIELD ARCHIVE"] };
  if (type === "cards") return { id, type, eyebrow: "ACCESS GRANTED", title: "Open the files.", intro: "Choose a card to reveal more information.", items: [] };
  if (type === "stats") return { id, type, items: [{ value: "01", label: "MISSION FILE" }, { value: "100%", label: "FOCUS" }, { value: "LIVE", label: "STATUS" }] };
  if (type === "feature") return { id, type, eyebrow: "FEATURE FILE", title: "A defining moment.", body: "Add the story behind this image.", image: "", buttons: [] };
  if (type === "banner") return { id, type, eyebrow: "DECLASSIFIED", title: "The mission behind the mission.", body: "Introduce the next chapter.", image: "", tags: ["FIELD FILE", "ARCHIVE"] };
  if (type === "gallery") return { id, type, eyebrow: "MISSION FOOTAGE", title: "Fragments from the field.", intro: "Every image carries part of the story.", items: [] };
  if (type === "capabilities") return { id, type, eyebrow: "FIELD CAPABILITIES", title: "Built for the impossible.", intro: "The skills that changed the outcome.", visuals: [], items: [] };
  if (type === "connections") return { id, type, eyebrow: "KNOWN CONNECTIONS", title: "Allies and adversaries.", intro: "Every connection reveals another part of the file.", image: "", items: [] };
  return { id, type: "faq", eyebrow: "FIELD INTELLIGENCE", image: "", items: [{ id: createId("faq"), question: "What should visitors know?", answer: "Add the answer here." }] };
}

export function createBlankMission(name: string): MissionRecord {
  const slug = toMissionSlug(name) || "untitled-mission";
  return {
    id: crypto.randomUUID(), slug, name, excerpt: "A new mission file from the Luvinski archive.", cover_url: "", status: "draft",
    hero: { status: "MISSION FILE • DRAFT", eyebrow: "THE MISSION ARCHIVES", title: name, lede: "Add the opening description for this mission.", image: "", buttons: [], stats: [] },
    blocks: [],
  };
}

export function mergeMissionRecords(remote: MissionRecord[]) {
  const bySlug = new Map(staticMissions.map((mission) => [mission.slug, mission]));
  remote.forEach((mission) => bySlug.set(mission.slug, mission));
  return [...bySlug.values()];
}

