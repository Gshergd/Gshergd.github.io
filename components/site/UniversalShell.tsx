"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type ActiveLink = "legacy" | "ada" | "mission";

export function UniversalHeader({ active, intro = false }: { active?: ActiveLink; intro?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const className = ["nav-shell", intro ? "intro-target" : "", scrolled ? "nav-scrolled" : ""].filter(Boolean).join(" ");

  return (
    <header className={className}>
      <Link className="brand-mark brand-image" href="/" aria-label="Luvinski portfolio home">
        <img src="/assets/brand/secretary-mark.png" alt="" />
      </Link>
      <nav className={menuOpen ? "nav-links open" : "nav-links"} aria-label="Primary navigation">
        <Link className={active === "legacy" ? "active" : undefined} href="/" onClick={closeMenu}>Legacy</Link>
        <Link className={active === "ada" ? "active" : undefined} href="/ada-wong/" onClick={closeMenu}>Ada Wong</Link>
        <a href="https://thesecretary.xyz/" target="_blank" rel="noreferrer" onClick={closeMenu}>Official</a>
        <Link className={active === "mission" ? "active" : undefined} href="/#missions" onClick={closeMenu}>Mission</Link>
      </nav>
      <Link className="nav-action" href="/forum/" aria-label="Open the forum"><span>+</span></Link>
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
        <div><p className="eyebrow">EXPLORE</p><Link href="/">Legacy</Link><Link href="/gallery/">Gallery</Link><Link href="/ada-wong/">Ada Wong</Link><a href="https://thesecretary.xyz/" target="_blank" rel="noreferrer">Official</a><Link href="/#missions">Mission</Link></div>
        <div><p className="eyebrow">CONTACT</p><p>The Secretary is the official public presence and developer contact hub.</p><a className="footer-cta" href="https://thesecretary.xyz/" target="_blank" rel="noreferrer"><span aria-hidden="true">&#8599;</span> Open The Secretary</a></div>
      </div>
      <div className="legal"><span>&copy; 2026 The Secretary.</span><span>Built by Gshergd Luvinski.</span><span>From curiosity to useful systems.</span></div>
    </footer>
  );
}
