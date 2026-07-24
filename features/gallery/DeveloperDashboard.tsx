"use client";

import { useEffect, useState, type FormEvent } from "react";
import { UniversalFooter, UniversalHeader } from "@/components/site/UniversalShell";
import {
  OWNER_EMAIL,
  consumeOwnerMagicLink,
  createGalleryItem,
  deleteGalleryItem,
  fetchGalleryItems,
  getOwnerSession,
  isGalleryBackendConfigured,
  requestOwnerMagicLink,
  signOutOwner,
  updateGalleryItem,
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
      setMessage(`A secure sign-in link was sent to ${OWNER_EMAIL}. Open it to return here automatically.`);
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
      await loadItems(); setMessage("Image published to the gallery.");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "The image could not be published."); }
    finally { setBusy(null); }
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
    try { await deleteGalleryItem(item); await loadItems(); setMessage(`Removed “${item.title}”.`); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "The image could not be removed."); }
    finally { setBusy(null); }
  };

  const logOut = async () => { await signOutOwner(); setSignedIn(false); setItems([]); setMessage("Signed out safely."); };

  return (
    <main className="developer-site">
      <UniversalHeader />

      <section className="developer-hero"><div><p className="eyebrow">PRIVATE CONTROL ROOM</p><h1>Gallery<br />Developer.</h1><p>Publish, revise, and remove images from the public collection. Access is locked to one verified email address.</p><span><i /> MAGIC LINK AUTHENTICATION</span></div></section>

      <section className="developer-content">
        {checking ? <div className="developer-loading">Checking owner session…</div> : !signedIn ? (
          <div className="developer-login-grid">
            <article className="developer-login-card">
              <p className="eyebrow">OWNER SIGN IN</p><h2>One email.<br />No password.</h2><p>The dashboard emails a one-time sign-in link. No password is stored by this site.</p>
              <label>Authorized email<input value={OWNER_EMAIL} readOnly /></label>
              <button className="developer-primary" type="button" onClick={sendMagicLink} disabled={busy === "link" || !isGalleryBackendConfigured}>{busy === "link" ? "Sending…" : linkSent ? "Send another secure link" : "Email me a secure link"}<span>→</span></button>
              {linkSent && <p className="developer-security-note">Open the link from your email. It returns to this page and signs you in automatically.</p>}
              {message && <p className="developer-message success">{message}</p>}{error && <p className="developer-message error">{error}</p>}
            </article>
            <article className="developer-setup-card"><p className="eyebrow">ONE-TIME SETUP</p><h2>{isGalleryBackendConfigured ? "Backend connected." : "Connect the gallery backend."}</h2><p>GitHub Pages is static, so secure authentication and persistent image storage live in Supabase. The repository includes the complete SQL policy file and an environment template.</p><ol><li>Create a free Supabase project.</li><li>Run <code>supabase/gallery-setup.sql</code> in its SQL editor.</li><li>In Authentication → URL Configuration, set the Site URL to <code>https://gshergd.github.io</code> and add <code>https://gshergd.github.io/developer/</code> as a redirect URL.</li><li>Leave the default Magic Link template unchanged. No custom SMTP is needed while <strong>{OWNER_EMAIL}</strong> is a member of the Supabase project team.</li><li>Add the project URL and publishable key to the GitHub Actions variables described in the README, then redeploy.</li></ol><p className="developer-security-note">The publishable key is designed to be visible. Row Level Security restricts every write to <strong>{OWNER_EMAIL}</strong>.</p></article>
          </div>
        ) : (
          <div className="developer-dashboard">
            <div className="developer-dashboard-head"><div><p className="eyebrow">OWNER SESSION ACTIVE</p><h2>Manage the collection.</h2></div><div className="developer-session-actions"><span>{items.length} PUBLISHED IMAGES</span><button type="button" onClick={logOut}>Sign out</button></div></div>
            {message && <p className="developer-message success">{message}</p>}{error && <p className="developer-message error">{error}</p>}
            <form className="developer-add-card" onSubmit={addItem}><div><p className="eyebrow">ADD IMAGE</p><h3>Publish a new gallery entry.</h3><p>JPG, PNG, or WebP. Maximum file size: 10 MB.</p></div><label className="developer-file">Image<input id="gallery-file" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setFile(event.target.files?.[0] ?? null)} required /><span>{file?.name || "Choose image"}</span></label><label>Heading <small>{title.length}/{GALLERY_TITLE_LIMIT}</small><input maxLength={GALLERY_TITLE_LIMIT} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="A short, clear heading" required /></label><label>Description <small>{description.length}/{GALLERY_DESCRIPTION_LIMIT}</small><textarea maxLength={GALLERY_DESCRIPTION_LIMIT} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What is this image?" required /></label><button className="developer-primary" disabled={busy === "add"}>{busy === "add" ? "Publishing…" : "Publish image"}<span>↗</span></button></form>
            <div className="developer-list">
              {items.map((item, index) => {
                const draft = drafts[item.id] ?? { title: item.title, description: item.description };
                return <article key={item.id}><div className="developer-item-image"><img src={item.image_url} alt={item.title} /><span>{String(index + 1).padStart(2, "0")}</span></div><div className="developer-item-fields"><label>Heading <small>{draft.title.length}/{GALLERY_TITLE_LIMIT}</small><input maxLength={GALLERY_TITLE_LIMIT} value={draft.title} onChange={(event) => setDrafts((current) => ({ ...current, [item.id]: { ...draft, title: event.target.value } }))} /></label><label>Description <small>{draft.description.length}/{GALLERY_DESCRIPTION_LIMIT}</small><textarea maxLength={GALLERY_DESCRIPTION_LIMIT} value={draft.description} onChange={(event) => setDrafts((current) => ({ ...current, [item.id]: { ...draft, description: event.target.value } }))} /></label><div><button type="button" className="developer-save" onClick={() => void saveItem(item)} disabled={busy === `save-${item.id}`}>{busy === `save-${item.id}` ? "Saving…" : "Save changes"}</button><button type="button" className="developer-delete" onClick={() => void removeItem(item)} disabled={busy === `delete-${item.id}`}>{busy === `delete-${item.id}` ? "Removing…" : "Remove image"}</button></div></div></article>;
              })}
            </div>
          </div>
        )}
      </section>
      <UniversalFooter />
    </main>
  );
}
