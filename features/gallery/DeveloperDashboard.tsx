"use client";

import { useEffect, useState, type FormEvent } from "react";
import { UniversalFooter, UniversalHeader } from "@/components/site/UniversalShell";
import MissionManager from "@/features/missions/MissionManager";
import {
  consumeOwnerMagicLink,
  createGalleryItem,
  deleteGalleryItem,
  fetchGalleryItems,
  getOwnerSession,
  isGalleryBackendConfigured,
  requestGalleryGithubSync,
  requestOwnerMagicLink,
  signOutOwner,
  updateGalleryItem,
  updateGalleryOrder,
  uploadGalleryImage,
} from "./galleryClient";
import {
  GALLERY_DESCRIPTION_LIMIT,
  GALLERY_TITLE_LIMIT,
  GALLERY_UPLOAD_LIMIT,
  type GalleryItem,
} from "./galleryData";

type Draft = { title: string; description: string };

export default function DeveloperDashboard() {
  const [workspace, setWorkspace] = useState<"gallery" | "missions">("missions");
  const [checking, setChecking] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const loadItems = async () => {
    const next = await fetchGalleryItems();
    setItems(next);
    setDrafts(Object.fromEntries(next.map((item) => [item.id, { title: item.title, description: item.description }])));
  };

  useEffect(() => {
    void (async () => {
      try {
        const magicLinkSession = await consumeOwnerMagicLink();
        const session = magicLinkSession ?? await getOwnerSession();
        setSignedIn(Boolean(session));
        if (magicLinkSession) setMessage("Owner access granted. The secure link has been verified.");
        if (session) await loadItems();
      } catch (reason) {
        setError(reason instanceof Error ? reason.message : "The secure sign-in link could not be verified.");
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  const sendMagicLink = async () => {
    setBusy("link"); setError(null); setMessage(null);
    try {
      await requestOwnerMagicLink();
      setLinkSent(true);
      setMessage("A secure sign-in link has been sent. Open it to enter automatically.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The secure sign-in link could not be sent.");
    }
    finally { setBusy(null); }
  };

  const addItem = async (event: FormEvent) => {
    event.preventDefault(); setError(null); setMessage(null);
    if (!file) { setError("Choose an image first."); return; }
    if (!file.type.startsWith("image/")) { setError("Only image files are accepted."); return; }
    if (file.size > GALLERY_UPLOAD_LIMIT) { setError("Images must be 10 MB or smaller."); return; }
    setBusy("add");
    try {
      const uploaded = await uploadGalleryImage(file);
      await createGalleryItem({ title: title.trim(), description: description.trim(), image_url: uploaded.imageUrl, storage_path: uploaded.storagePath, sort_order: 0 });
      setTitle(""); setDescription(""); setFile(null);
      const input = document.getElementById("gallery-file") as HTMLInputElement | null;
      if (input) input.value = "";
      await loadItems();
      try {
        const sync = await requestGalleryGithubSync();
        setMessage(sync.queued ? "Image published. Its GitHub archive has been requested." : sync.message);
      } catch {
        setMessage("Image published through Supabase. Use Update GitHub to retry its permanent archive.");
      }
    } catch (reason) { setError(reason instanceof Error ? reason.message : "The image could not be published."); }
    finally { setBusy(null); }
  };

  const syncGallery = async () => {
    setBusy("sync-gallery"); setError(null); setMessage(null);
    try {
      const result = await requestGalleryGithubSync();
      setMessage(result.message);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The GitHub gallery update could not be requested.");
    } finally { setBusy(null); }
  };

  const saveItem = async (item: GalleryItem) => {
    const draft = drafts[item.id];
    if (!draft?.title.trim()) { setError("Every gallery image needs a heading."); return; }
    setBusy(`save-${item.id}`); setError(null); setMessage(null);
    try { await updateGalleryItem(item.id, { title: draft.title.trim(), description: draft.description.trim() }); await loadItems(); setMessage(`Saved “${draft.title.trim()}”.`); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "The changes could not be saved."); }
    finally { setBusy(null); }
  };

  const removeItem = async (item: GalleryItem) => {
    if (!window.confirm(`Remove “${item.title}” from the public gallery? This cannot be undone.`)) return;
    setBusy(`delete-${item.id}`); setError(null); setMessage(null);
    try {
      await deleteGalleryItem(item);
      await loadItems();
      try { await requestGalleryGithubSync(true); } catch { /* The next manual sync can retry cleanup. */ }
      setMessage(`Removed “${item.title}”.`);
    }
    catch (reason) { setError(reason instanceof Error ? reason.message : "The image could not be removed."); }
    finally { setBusy(null); }
  };

  const moveItem = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length || busy) return;

    const movedItem = items[index];
    const nextItems = [...items];
    [nextItems[index], nextItems[targetIndex]] = [nextItems[targetIndex], nextItems[index]];
    const orderedItems = nextItems.map((item, orderIndex) => ({ ...item, sort_order: (orderIndex + 1) * 10 }));

    setBusy(`move-${movedItem.id}`); setError(null); setMessage(null); setItems(orderedItems);
    try {
      await updateGalleryOrder(orderedItems.map(({ id, sort_order }) => ({ id, sort_order })));
      await loadItems();
      setMessage(`Moved “${movedItem.title}” ${direction < 0 ? "up" : "down"}.`);
    } catch (reason) {
      await loadItems().catch(() => null);
      setError(reason instanceof Error ? reason.message : "The gallery order could not be saved.");
    } finally { setBusy(null); }
  };

  const logOut = async () => { await signOutOwner(); setSignedIn(false); setItems([]); setMessage("Signed out safely."); };

  return (
    <main className="developer-site">
      <UniversalHeader />

      {signedIn && <section className="developer-hero"><div><p className="eyebrow">PRIVATE CONTROL ROOM // ACCESS GRANTED</p><h1>Welcome<br />Sir.</h1><p>Manage the gallery and build complete mission pages from locked cinematic widgets.</p><span><i /> SECURE OWNER SESSION</span></div></section>}

      <section className={signedIn ? "developer-content" : "developer-login-content"}>
        {checking ? <div className="developer-loading">Checking owner session…</div> : !signedIn ? (
          <div className="developer-login-layout">
            <div className="developer-login-panel">
              <div className="developer-login-wrap">
                <p className="eyebrow">RESTRICTED ARCHIVE // IDENTITY CHECK</p>
                <h1>Return to<br />the control room.</h1>
                <p className="developer-login-intro">A private channel for maintaining missions, arranging the visual archive, and keeping every published file in order.</p>
                <button className="developer-primary" type="button" onClick={() => void sendMagicLink()} disabled={busy === "link" || !isGalleryBackendConfigured}>{busy === "link" ? "Sending…" : linkSent ? "Resend secure link" : "Email secure sign-in link"}<span>→</span></button>
                {message && <p className="developer-message success">{message}</p>}{error && <p className="developer-message error">{error}</p>}
                <div className="developer-login-meta"><a href="/">← Back to Legacy</a><span>Authorized access only</span></div>
              </div>
            </div>
            <div className="developer-login-visual" aria-label="A woman in red inside a private evening venue"><div className="developer-login-shade" /><div className="developer-login-index" aria-hidden="true">02</div><div className="developer-login-caption"><span>PRIVATE ARCHIVE</span><strong>Every file waits behind one verified identity.</strong></div></div>
          </div>
        ) : (
          <div className="developer-dashboard">
            <div className="developer-workspace-tabs" role="tablist" aria-label="Developer workspace"><button type="button" role="tab" aria-selected={workspace === "missions"} className={workspace === "missions" ? "active" : ""} onClick={() => setWorkspace("missions")}><span>01</span>Mission Builder</button><button type="button" role="tab" aria-selected={workspace === "gallery"} className={workspace === "gallery" ? "active" : ""} onClick={() => setWorkspace("gallery")}><span>02</span>Gallery Manager</button></div>
            {workspace === "missions" ? <MissionManager /> : <>
            <div className="developer-dashboard-head"><div><p className="eyebrow">OWNER SESSION ACTIVE</p><h2>Manage the collection.</h2></div><div className="developer-session-actions"><span>{items.length} PUBLISHED IMAGES</span><button className="github-sync" type="button" onClick={() => void syncGallery()} disabled={busy !== null}>{busy === "sync-gallery" ? "Checking…" : "Update GitHub"}</button><button type="button" onClick={logOut} disabled={busy !== null}>Sign out</button></div></div>
            {message && <p className="developer-message success">{message}</p>}{error && <p className="developer-message error">{error}</p>}
            <form className="developer-add-card" onSubmit={addItem}><div><p className="eyebrow">ADD IMAGE</p><h3>Publish a new gallery entry.</h3><p>JPG, PNG, or WebP. Maximum file size: 10 MB.</p></div><label className="developer-file">Image<input id="gallery-file" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setFile(event.target.files?.[0] ?? null)} required /><span>{file?.name || "Choose image"}</span></label><label>Heading <small>{title.length}/{GALLERY_TITLE_LIMIT}</small><input maxLength={GALLERY_TITLE_LIMIT} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="A short, clear heading" required /></label><label>Description <small>{description.length}/{GALLERY_DESCRIPTION_LIMIT}</small><textarea maxLength={GALLERY_DESCRIPTION_LIMIT} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What is this image?" required /></label><button className="developer-primary" disabled={busy === "add"}>{busy === "add" ? "Publishing…" : "Publish image"}<span>↗</span></button></form>
            <div className="developer-list">
              {items.map((item, index) => {
                const draft = drafts[item.id] ?? { title: item.title, description: item.description };
                return <article key={item.id}><div className="developer-item-image"><img src={item.image_url} alt={item.title} /><span>{String(index + 1).padStart(2, "0")}</span></div><div className="developer-item-fields"><label>Heading <small>{draft.title.length}/{GALLERY_TITLE_LIMIT}</small><input maxLength={GALLERY_TITLE_LIMIT} value={draft.title} onChange={(event) => setDrafts((current) => ({ ...current, [item.id]: { ...draft, title: event.target.value } }))} /></label><label>Description <small>{draft.description.length}/{GALLERY_DESCRIPTION_LIMIT}</small><textarea maxLength={GALLERY_DESCRIPTION_LIMIT} value={draft.description} onChange={(event) => setDrafts((current) => ({ ...current, [item.id]: { ...draft, description: event.target.value } }))} /></label><div className="developer-item-actions"><button type="button" className="developer-move" onClick={() => void moveItem(index, -1)} disabled={index === 0 || busy !== null} aria-label={`Move ${item.title} up`}>↑ Move up</button><button type="button" className="developer-move" onClick={() => void moveItem(index, 1)} disabled={index === items.length - 1 || busy !== null} aria-label={`Move ${item.title} down`}>↓ Move down</button><button type="button" className="developer-save" onClick={() => void saveItem(item)} disabled={busy === `save-${item.id}`}>{busy === `save-${item.id}` ? "Saving…" : "Save changes"}</button><button type="button" className="developer-delete" onClick={() => void removeItem(item)} disabled={busy === `delete-${item.id}`}>{busy === `delete-${item.id}` ? "Removing…" : "Remove image"}</button></div></div></article>;
              })}
            </div>
            </>}
          </div>
        )}
      </section>
      <UniversalFooter />
    </main>
  );
}
