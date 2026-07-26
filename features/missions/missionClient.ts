"use client";

import { getSupabasePublicUrl, isGalleryBackendConfigured, ownerFetch } from "@/features/gallery/galleryClient";
import { mergeMissionRecords } from "./missionData";
import type { MissionRecord } from "./missionTypes";

function publicHeaders(extra?: HeadersInit) {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  return { apikey: key, Authorization: `Bearer ${key}`, ...extra } as HeadersInit;
}

async function readError(response: Response) {
  const body = await response.json().catch(() => null) as { message?: string; error?: string } | null;
  return body?.message || body?.error || `Request failed (${response.status})`;
}

export async function fetchPublishedMissionsClient() {
  if (!isGalleryBackendConfigured) return mergeMissionRecords([]);
  const response = await fetch(`${getSupabasePublicUrl()}/rest/v1/missions?select=*&status=eq.published&order=updated_at.desc`, {
    headers: publicHeaders({ Accept: "application/json" }), cache: "no-store",
  });
  if (!response.ok) throw new Error(await readError(response));
  return mergeMissionRecords(await response.json() as MissionRecord[]);
}

export async function fetchOwnerMissions() {
  const response = await ownerFetch("/rest/v1/missions?select=*&order=updated_at.desc", { headers: { Accept: "application/json" } });
  return mergeMissionRecords(await response.json() as MissionRecord[]);
}

export async function saveMission(mission: MissionRecord) {
  const response = await ownerFetch("/rest/v1/missions?on_conflict=id", {
    method: "POST",
    headers: { "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(mission),
  });
  return (await response.json() as MissionRecord[])[0];
}

export async function deleteMission(mission: MissionRecord) {
  if (mission.cover_storage_path) {
    await ownerFetch("/storage/v1/object/missions", {
      method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prefixes: [mission.cover_storage_path] }),
    }).catch(() => null);
  }
  await ownerFetch(`/rest/v1/missions?id=eq.${encodeURIComponent(mission.id)}`, { method: "DELETE", headers: { Prefer: "return=minimal" } });
}

export async function uploadMissionImage(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `uploads/${Date.now()}-${crypto.randomUUID()}.${extension}`;
  await ownerFetch(`/storage/v1/object/missions/${path}`, {
    method: "POST",
    headers: { "Content-Type": file.type || "application/octet-stream", "x-upsert": "false" },
    body: file,
  });
  return { storagePath: path, imageUrl: `${getSupabasePublicUrl()}/storage/v1/object/public/missions/${path}` };
}

export async function requestMissionDeployment() {
  const response = await ownerFetch("/functions/v1/publish-mission", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
  return response.json().catch(() => ({ ok: true }));
}

