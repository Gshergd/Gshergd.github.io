import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, apikey, content-type" };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: cors });
  const authorization = request.headers.get("Authorization");
  if (!authorization) return json({ error: "Owner authentication required." }, 401);

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, { headers: { Authorization: authorization, apikey: anonKey } });
  const user = await userResponse.json().catch(() => ({})) as { email?: string };
  if (!userResponse.ok || user.email?.toLowerCase() !== "dikshitaggarwal007@gmail.com") return json({ error: "Owner account required." }, 403);

  const githubToken = Deno.env.get("GITHUB_ACTIONS_TOKEN");
  const githubRepository = Deno.env.get("GITHUB_REPOSITORY") ?? "Gshergd/Portfolio";
  if (!githubToken) return json({ error: "GITHUB_ACTIONS_TOKEN is not configured." }, 503);

  const dispatch = await fetch(`https://api.github.com/repos/${githubRepository}/actions/workflows/deploy-pages.yml/dispatches`, {
    method: "POST",
    headers: { Authorization: `Bearer ${githubToken}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", "User-Agent": "Luvinski-Mission-Builder" },
    body: JSON.stringify({ ref: "main" }),
  });
  if (!dispatch.ok) return json({ error: `GitHub deployment request failed (${dispatch.status}).` }, 502);
  return json({ ok: true, message: "GitHub Pages deployment requested." });
});

