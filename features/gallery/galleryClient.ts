"use client";

import { useCallback, useEffect, useState } from "react";
import { staticGalleryItems, type GalleryItem } from "./galleryData";

export const OWNER_EMAIL = "dikshitaggarwal007@gmail.com";
const SESSION_KEY = "luvinski-gallery-owner-session";
const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "");
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isGalleryBackendConfigured = Boolean(supabaseUrl && supabaseKey);

type AuthSession = {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
  user?: { email?: string };
};

function headers(accessToken?: string, extra?: HeadersInit) {
  return {
    apikey: supabaseKey,
    Authorization: `Bearer ${accessToken || supabaseKey}`,
    ...extra,
  } as HeadersInit;
}

async function readError(response: Response) {
  const body = await response.json().catch(() => null) as { message?: string; error_description?: string; error?: string } | null;
  return body?.message || body?.error_description || body?.error || `Request failed (${response.status})`;
}

export async function fetchGalleryItems(): Promise<GalleryItem[]> {
  if (!isGalleryBackendConfigured) return staticGalleryItems;
  const response = await fetch(`${supabaseUrl}/rest/v1/gallery_items?select=*&order=sort_order.asc,created_at.desc`, {
    headers: headers(undefined, { Accept: "application/json" }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(await readError(response));
  return response.json() as Promise<GalleryItem[]>;
}

export function useGalleryItems() {
  const [items, setItems] = useState<GalleryItem[]>(staticGalleryItems);
  const [loading, setLoading] = useState(isGalleryBackendConfigured);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await fetchGalleryItems());
      setError(null);
    } catch (reason) {
      setItems(staticGalleryItems);
      setError(reason instanceof Error ? reason.message : "The live gallery could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void reload(); }, [reload]);
  return { items, loading, error, reload };
}

function saveSession(session: AuthSession | null) {
  if (typeof window === "undefined") return;
  if (session) window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else window.localStorage.removeItem(SESSION_KEY);
}

function readSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(window.localStorage.getItem(SESSION_KEY) || "null") as AuthSession | null; }
  catch { return null; }
}

async function refreshSession(session: AuthSession) {
  const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=refresh_token`, {
    method: "POST",
    headers: headers(undefined, { "Content-Type": "application/json" }),
    body: JSON.stringify({ refresh_token: session.refresh_token }),
  });
  if (!response.ok) throw new Error(await readError(response));
  const next = await response.json() as AuthSession & { expires_in?: number };
  next.expires_at = Math.floor(Date.now() / 1000) + (next.expires_in ?? 3600);
  saveSession(next);
  return next;
}

export async function getOwnerSession(): Promise<AuthSession | null> {
  if (!isGalleryBackendConfigured) return null;
  let session = readSession();
  if (!session) return null;
  try {
    if (session.expires_at && session.expires_at < Math.floor(Date.now() / 1000) + 30) session = await refreshSession(session);
    const response = await fetch(`${supabaseUrl}/auth/v1/user`, { headers: headers(session.access_token) });
    if (!response.ok) throw new Error("Session expired");
    const user = await response.json() as { email?: string };
    if (user.email?.toLowerCase() !== OWNER_EMAIL) throw new Error("Owner account required");
    session.user = user;
    saveSession(session);
    return session;
  } catch {
    saveSession(null);
    return null;
  }
}

function getOwnerRedirectUrl() {
  if (typeof window === "undefined") return "https://gshergd.github.io/developer/";
  return `${window.location.origin}/developer/`;
}

function clearAuthFragment() {
  if (typeof window === "undefined" || !window.location.hash) return;
  window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
}

export async function requestOwnerMagicLink() {
  if (!isGalleryBackendConfigured) throw new Error("Connect Supabase first; setup instructions are shown below.");
  const redirectTo = encodeURIComponent(getOwnerRedirectUrl());
  const response = await fetch(`${supabaseUrl}/auth/v1/otp?redirect_to=${redirectTo}`, {
    method: "POST",
    headers: headers(undefined, { "Content-Type": "application/json" }),
    body: JSON.stringify({ email: OWNER_EMAIL, create_user: true }),
  });
  if (!response.ok) throw new Error(await readError(response));
}

export async function consumeOwnerMagicLink(): Promise<AuthSession | null> {
  if (!isGalleryBackendConfigured || typeof window === "undefined" || !window.location.hash) return null;

  const params = new URLSearchParams(window.location.hash.slice(1));
  const authError = params.get("error_description") || params.get("error");
  if (authError) {
    clearAuthFragment();
    throw new Error(authError);
  }

  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");
  if (!accessToken || !refreshToken) return null;

  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/user`, { headers: headers(accessToken) });
    if (!response.ok) throw new Error(await readError(response));
    const user = await response.json() as { email?: string };
    if (user.email?.toLowerCase() !== OWNER_EMAIL) {
      throw new Error("This dashboard is restricted to the gallery owner.");
    }

    const expiresIn = Number(params.get("expires_in")) || 3600;
    const session: AuthSession = {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: Math.floor(Date.now() / 1000) + expiresIn,
      user,
    };
    saveSession(session);
    clearAuthFragment();
    return session;
  } catch (reason) {
    saveSession(null);
    clearAuthFragment();
    throw reason;
  }
}

export async function signOutOwner() {
  const session = readSession();
  if (session && isGalleryBackendConfigured) {
    await fetch(`${supabaseUrl}/auth/v1/logout`, { method: "POST", headers: headers(session.access_token) }).catch(() => null);
  }
  saveSession(null);
}

async function ownerFetch(path: string, init: RequestInit = {}) {
  const session = await getOwnerSession();
  if (!session) throw new Error("Your owner session has expired. Sign in again.");
  const response = await fetch(`${supabaseUrl}${path}`, {
    ...init,
    headers: headers(session.access_token, init.headers),
  });
  if (!response.ok) throw new Error(await readError(response));
  return response;
}

export async function uploadGalleryImage(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `uploads/${Date.now()}-${crypto.randomUUID()}.${extension}`;
  await ownerFetch(`/storage/v1/object/gallery/${path}`, {
    method: "POST",
    headers: { "Content-Type": file.type || "application/octet-stream", "x-upsert": "false" },
    body: file,
  });
  return { storagePath: path, imageUrl: `${supabaseUrl}/storage/v1/object/public/gallery/${path}` };
}

export async function createGalleryItem(input: Omit<GalleryItem, "id" | "created_at">) {
  const response = await ownerFetch("/rest/v1/gallery_items", {
    method: "POST",
    headers: { "Content-Type": "application/json", Prefer: "return=representation" },
    body: JSON.stringify(input),
  });
  return (await response.json() as GalleryItem[])[0];
}

export async function updateGalleryItem(id: string, input: Pick<GalleryItem, "title" | "description">) {
  await ownerFetch(`/rest/v1/gallery_items?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify(input),
  });
}

export async function deleteGalleryItem(item: GalleryItem) {
  if (item.storage_path) {
    await ownerFetch("/storage/v1/object/gallery", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prefixes: [item.storage_path] }),
    });
  }
  await ownerFetch(`/rest/v1/gallery_items?id=eq.${encodeURIComponent(item.id)}`, {
    method: "DELETE",
    headers: { Prefer: "return=minimal" },
  });
}
