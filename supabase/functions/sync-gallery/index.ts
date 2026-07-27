import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const OWNER_EMAIL = "dikshitaggarwal007@gmail.com";
const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, apikey, content-type" };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

type GalleryRow = { id: string; image_url: string; storage_path: string | null };

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (request.method !== "POST") return json({ error: "Method not allowed." }, 405);

  const authorization = request.headers.get("Authorization");
  if (!authorization) return json({ error: "Owner authentication required." }, 401);

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, { headers: { Authorization: authorization, apikey: anonKey } });
  const user = await userResponse.json().catch(() => ({})) as { email?: string };
  if (!userResponse.ok || user.email?.toLowerCase() !== OWNER_EMAIL) return json({ error: "Owner account required." }, 403);

  const requestBody = await request.json().catch(() => ({})) as { force?: boolean };
  const galleryResponse = await fetch(`${supabaseUrl}/rest/v1/gallery_items?select=id,image_url,storage_path`, {
    headers: { Authorization: authorization, apikey: anonKey, Accept: "application/json" },
  });
  if (!galleryResponse.ok) return json({ error: "The gallery could not be checked." }, 502);

  const rows = await galleryResponse.json() as GalleryRow[];
  const pending = rows.filter((row) => Boolean(row.storage_path) || !row.image_url.startsWith("/assets/"));
  if (!requestBody.force && pending.length === 0) {
    return json({ ok: true, queued: false, count: 0, message: "All gallery images are already hosted on GitHub." });
  }

  const githubToken = Deno.env.get("GITHUB_ACTIONS_TOKEN");
  const githubRepository = Deno.env.get("GITHUB_REPOSITORY") ?? "Gshergd/Gshergd.github.io";
  if (!githubToken) return json({ error: "GITHUB_ACTIONS_TOKEN is not configured." }, 503);

  const dispatch = await fetch(`https://api.github.com/repos/${githubRepository}/actions/workflows/sync-gallery.yml/dispatches`, {
    method: "POST",
    headers: { Authorization: `Bearer ${githubToken}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", "User-Agent": "Luvinski-Gallery-Archive" },
    body: JSON.stringify({ ref: "main" }),
  });
  if (!dispatch.ok) return json({ error: `GitHub gallery update failed (${dispatch.status}).` }, 502);

  return json({
    ok: true,
    queued: true,
    count: pending.length,
    message: pending.length > 0
      ? `${pending.length} gallery image${pending.length === 1 ? "" : "s"} queued for GitHub archival.`
      : "Gallery cleanup queued on GitHub.",
  });
});
