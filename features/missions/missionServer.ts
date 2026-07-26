import { mergeMissionRecords } from "./missionData";
import type { MissionRecord } from "./missionTypes";

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "");
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

let publishedMissionsPromise: Promise<MissionRecord[]> | undefined;

async function loadPublishedMissions(): Promise<MissionRecord[]> {
  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes("YOUR-PROJECT")) return mergeMissionRecords([]);

  const response = await fetch(`${supabaseUrl}/rest/v1/missions?select=*&status=eq.published&order=updated_at.desc`, {
    headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`, Accept: "application/json" },
    // A static export must render every route from the same mission snapshot.
    // GitHub Actions starts from a clean build, so this cache cannot survive a deployment.
    cache: "force-cache",
  });

  if (!response.ok) {
    throw new Error(`Unable to load published missions from Supabase (${response.status}).`);
  }

  const missions: unknown = await response.json();
  if (!Array.isArray(missions)) throw new Error("Supabase returned an invalid published mission list.");
  return mergeMissionRecords(missions as MissionRecord[]);
}

export function getPublishedMissions(): Promise<MissionRecord[]> {
  // generateStaticParams, metadata, the archive and the mission page all call this
  // during export. Reusing one promise prevents a later request from silently
  // replacing a known mission with the local fallback and exporting a 404 page.
  publishedMissionsPromise ??= loadPublishedMissions();
  return publishedMissionsPromise;
}

export async function getPublishedMission(slug: string) {
  const missions = await getPublishedMissions();
  return missions.find((mission) => mission.slug === slug) ?? null;
}
