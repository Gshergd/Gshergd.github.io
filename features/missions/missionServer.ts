import { mergeMissionRecords } from "./missionData";
import type { MissionRecord } from "./missionTypes";

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "");
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export async function getPublishedMissions(): Promise<MissionRecord[]> {
  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes("YOUR-PROJECT")) return mergeMissionRecords([]);
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/missions?select=*&status=eq.published&order=updated_at.desc`, {
      headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`, Accept: "application/json" },
      cache: "no-store",
    });
    if (!response.ok) return mergeMissionRecords([]);
    return mergeMissionRecords(await response.json() as MissionRecord[]);
  } catch {
    return mergeMissionRecords([]);
  }
}

export async function getPublishedMission(slug: string) {
  const missions = await getPublishedMissions();
  return missions.find((mission) => mission.slug === slug) ?? null;
}

