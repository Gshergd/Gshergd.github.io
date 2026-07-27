"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type ActiveLink = "legacy" | "missions" | "gallery" | "ada";

export function UniversalHeader({ active }: { active?: ActiveLink; intro?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const className = ["nav-shell", "nav-universal-enter", scrolled ? "nav-scrolled" : ""].filter(Boolean).join(" ");

  return (
    <header className={className}>
      <Link className="brand-mark brand-image" href="/" aria-label="Luvinski portfolio home">
        <img src="/assets/brand/secretary-mark.png" alt="" />
      </Link>
      <nav className={menuOpen ? "nav-links open" : "nav-links"} aria-label="Primary navigation">
        <Link className={active === "legacy" ? "active" : undefined} href="/" onClick={closeMenu}>Legacy</Link>
        <Link className={active === "missions" ? "active" : undefined} href="/missions/" onClick={closeMenu}>Missions</Link>
        <Link className={active === "gallery" ? "active" : undefined} href="/gallery/" onClick={closeMenu}>Gallery</Link>
        <a href="https://thesecretary.xyz/" target="_blank" rel="noreferrer" onClick={closeMenu}>Official</a>
      </nav>
      <Link className="nav-action" href="/forum/" aria-label="Open the forum"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 6.5h15v11h-15z" /><path d="m5 7 7 5 7-5" /></svg></Link>
      <button className="menu-button" type="button" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle menu" aria-expanded={menuOpen}>Menu</button>
    </header>
  );
}

export function UniversalFooter() {
  return (
    <footer className="universal-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <div><span className="brand-mark brand-image"><img src="/assets/brand/secretary-mark.png" alt="" /></span><h3>Luvinski<small>PORTFOLIO LIBRARY</small></h3></div>
          <p>An independent archive of systems, communities, visual experiments, game ambitions, and the work worth carrying forward.</p>
        </div>
        <div><p className="eyebrow">EXPLORE</p><Link href="/">Legacy</Link><Link href="/missions/">Missions</Link><Link href="/gallery/">Gallery</Link><a href="https://thesecretary.xyz/" target="_blank" rel="noreferrer">Official</a></div>
        <div><p className="eyebrow">CONTACT</p><p>The forum is the single contact channel for conversations, service requests, and anything you want to discuss.</p><Link className="footer-cta" href="/forum/"><span aria-hidden="true">&#8594;</span> Open the forum</Link></div>
      </div>
      <div className="legal"><span>&copy; 2026 Gshergd Luvinski.</span><span>Built by Gshergd Luvinski.</span><span>From curiosity to useful systems.</span></div>
    </footer>
  );
}
