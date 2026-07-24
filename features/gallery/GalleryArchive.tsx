"use client";

import { useEffect, useState } from "react";
import { useGalleryItems } from "./galleryClient";
import type { GalleryItem } from "./galleryData";

export default function GalleryArchive() {
  const { items, loading, error } = useGalleryItems();
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const [fullscreen, setFullscreen] = useState<GalleryItem | null>(null);

  useEffect(() => {
    if (!selected && !fullscreen) return;
    const previous = document.body.style.overflow;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setSelected(null); setFullscreen(null); }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", onKey); };
  }, [selected, fullscreen]);

  const openFullscreen = (item: GalleryItem) => {
    setSelected(null);
    setFullscreen(item);
    window.requestAnimationFrame(() => {
      const viewer = document.querySelector<HTMLElement>(".gallery-fullscreen");
      void viewer?.requestFullscreen?.().catch(() => undefined);
    });
  };

  const closeFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => undefined);
    setFullscreen(null);
  };

  return (
    <main className="gallery-site">
      <header className="gallery-nav">
        <a className="gallery-brand" href="/"><img src="/assets/brand/secretary-mark.png" alt="" /><span>Luvinski<small>PORTFOLIO LIBRARY</small></span></a>
        <nav aria-label="Gallery navigation"><a href="/">Legacy</a><a className="active" href="/gallery/">Gallery</a><a href="/ada-wong/">Ada Wong</a><a href="https://thesecretary.xyz/" target="_blank" rel="noreferrer">Official</a></nav>
        <a className="gallery-owner-link" href="/developer/" aria-label="Gallery owner access">Owner</a>
      </header>

      <section className="gallery-hero">
        <div className="gallery-hero-image" />
        <div className="gallery-hero-copy"><p className="eyebrow">THE COMPLETE COLLECTION</p><h1>Image<br />Gallery.</h1><p>Screenshots, experiments, games, characters, roads, and moments collected because they were worth keeping.</p><span>{loading ? "SYNCING" : `${items.length} IMAGES`}<i />PUBLIC ARCHIVE</span></div>
      </section>

      <section className="gallery-content">
        <div className="gallery-heading"><div><p className="eyebrow">ALL IMAGES</p><h2>No lore. Just the gallery.</h2></div><p>Open any image for its heading and note, then take it fullscreen for the details that disappear at card size.</p></div>
        {error && <p className="gallery-sync-note">Live additions are temporarily unavailable; the original collection is still here.</p>}
        <div className="gallery-archive-grid">
          {items.map((item, index) => (
            <button type="button" key={item.id} className={`gallery-card gallery-shape-${(index % 9) + 1}`} onClick={() => setSelected(item)} aria-haspopup="dialog">
              <img src={item.image_url} alt={item.title} loading={index < 6 ? "eager" : "lazy"} decoding="async" />
              <span><small>{String(index + 1).padStart(2, "0")}</small><strong>{item.title}</strong><em>Open image ↗</em></span>
            </button>
          ))}
        </div>
      </section>

      <footer className="gallery-footer"><div><img src="/assets/brand/secretary-mark.png" alt="" /><span><b>Luvinski</b><small>A living visual collection.</small></span></div><nav><a href="/">Legacy</a><a href="/developer/">Owner access</a><a href="https://thesecretary.xyz/" target="_blank" rel="noreferrer">The Secretary</a></nav><p>© 2026 The Secretary. Built by Gshergd Luvinski.</p></footer>

      {selected && (
        <div className="gallery-modal" role="dialog" aria-modal="true" aria-labelledby="gallery-detail-title" onMouseDown={() => setSelected(null)}>
          <article onMouseDown={(event) => event.stopPropagation()}>
            <button className="gallery-modal-close" type="button" onClick={() => setSelected(null)} aria-label="Close image details">×</button>
            <div className="gallery-modal-image"><img src={selected.image_url} alt={selected.title} /></div>
            <div className="gallery-modal-copy"><p className="eyebrow">GALLERY IMAGE</p><h2 id="gallery-detail-title">{selected.title}</h2><p>{selected.description}</p><button type="button" onClick={() => openFullscreen(selected)}>Fullscreen <span>⛶</span></button></div>
          </article>
        </div>
      )}

      {fullscreen && <div className="gallery-fullscreen"><img src={fullscreen.image_url} alt={fullscreen.title} /><div><strong>{fullscreen.title}</strong><span>{fullscreen.description}</span></div><button type="button" onClick={closeFullscreen} aria-label="Close fullscreen image">×</button></div>}
    </main>
  );
}
