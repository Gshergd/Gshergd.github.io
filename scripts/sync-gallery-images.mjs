import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import sharp from "sharp";

const mode = process.argv[2];
const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "");
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const resultPath = path.resolve(".gallery-sync-result.json");
const assetDirectory = path.resolve("public/assets/gallery");
const uuidAssetPattern = /^([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})\.webp$/i;

if (!supabaseUrl || !serviceKey) throw new Error("Gallery sync requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");

const apiHeaders = { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` };

async function checkedFetch(url, init = {}) {
  const response = await fetch(url, init);
  if (!response.ok) throw new Error(`Request failed (${response.status}) for ${new URL(url).pathname}`);
  return response;
}

async function loadRows() {
  const response = await checkedFetch(`${supabaseUrl}/rest/v1/gallery_items?select=id,image_url,storage_path&order=created_at.asc`, {
    headers: { ...apiHeaders, Accept: "application/json" },
  });
  return response.json();
}

function setOutput(name, value) {
  if (process.env.GITHUB_OUTPUT) fsSync.appendFileSync(process.env.GITHUB_OUTPUT, `${name}=${value}\n`);
}

async function prepare() {
  const rows = await loadRows();
  const activeIds = new Set(rows.map((row) => row.id));
  const pendingRows = rows.filter((row) => Boolean(row.storage_path) || !String(row.image_url).startsWith("/assets/"));
  const updates = [];
  let removed = 0;

  await fs.mkdir(assetDirectory, { recursive: true });
  for (const filename of await fs.readdir(assetDirectory)) {
    const match = filename.match(uuidAssetPattern);
    if (match && !activeIds.has(match[1])) {
      await fs.unlink(path.join(assetDirectory, filename));
      removed += 1;
    }
  }

  for (const row of pendingRows) {
    const source = new URL(row.image_url);
    if (!/^https?:$/.test(source.protocol)) throw new Error(`Gallery image ${row.id} has an unsupported source URL.`);
    const response = await checkedFetch(source.href);
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.startsWith("image/")) throw new Error(`Gallery image ${row.id} did not return an image.`);
    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length > 25 * 1024 * 1024) throw new Error(`Gallery image ${row.id} exceeds the 25 MB archive limit.`);

    const filename = `${row.id}.webp`;
    await sharp(buffer, { failOn: "error" })
      .rotate()
      .resize({ width: 2560, height: 2560, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 86, effort: 5 })
      .toFile(path.join(assetDirectory, filename));

    updates.push({ id: row.id, finalUrl: `/assets/gallery/${filename}`, storagePath: row.storage_path || null });
  }

  await fs.writeFile(resultPath, JSON.stringify({ updates }, null, 2));
  const pending = updates.length > 0 || removed > 0;
  setOutput("pending", String(pending));
  setOutput("count", String(updates.length));
  console.log(pending
    ? `Prepared ${updates.length} gallery archive(s) and removed ${removed} obsolete asset(s).`
    : "All gallery images are already hosted on GitHub; nothing changed.");
}

async function finalize() {
  const result = JSON.parse(await fs.readFile(resultPath, "utf8"));
  for (const update of result.updates) {
    await checkedFetch(`${supabaseUrl}/rest/v1/gallery_items?id=eq.${encodeURIComponent(update.id)}`, {
      method: "PATCH",
      headers: { ...apiHeaders, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ image_url: update.finalUrl, ...(update.storagePath ? {} : { storage_path: null }) }),
    });
    if (update.storagePath) {
      await checkedFetch(`${supabaseUrl}/storage/v1/object/gallery`, {
        method: "DELETE",
        headers: { ...apiHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ prefixes: [update.storagePath] }),
      });
      await checkedFetch(`${supabaseUrl}/rest/v1/gallery_items?id=eq.${encodeURIComponent(update.id)}`, {
        method: "PATCH",
        headers: { ...apiHeaders, "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify({ storage_path: null }),
      });
    }
  }
  console.log(`Finalized ${result.updates.length} GitHub gallery archive(s).`);
}

if (mode === "prepare") await prepare();
else if (mode === "finalize") await finalize();
else throw new Error("Use: node scripts/sync-gallery-images.mjs prepare|finalize");
