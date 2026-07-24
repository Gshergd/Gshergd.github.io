"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useGalleryItems } from "@/features/gallery/galleryClient";
import type { GalleryItem } from "@/features/gallery/galleryData";

type DetailView = {
  image: string;
  title: string;
  kicker: string;
  description: string;
  href?: string;
  action?: string;
  galleryItem?: GalleryItem;
};

const projects = [
  {
    title: "The Secretary",
    type: "Discord platform",
    stat: "40K+ users",
    description: "The personal favourite: a multipurpose Discord management platform for moderation, tickets, automation, economy, AI interactions, and community operations.",
    href: "https://thesecretary.xyz/",
  },
  {
    title: "Apricot",
    type: "Community discovery",
    stat: "Server advertising",
    description: "A dedicated discovery and advertising system that helps Discord communities present themselves clearly and reach the people looking for them.",
    href: "https://apricot.gt.tc/",
  },
  {
    title: "Track Your Rack",
    type: "Open publishing",
    stat: "Newsletters for anyone",
    description: "A public newsletter and blog platform where anyone can write, publish, and build an archive around the ideas they care about.",
    href: "https://trackyourrack.gt.tc/",
  },
  {
    title: "Secretary Status",
    type: "Infrastructure",
    stat: "Live system health",
    description: "A transparent status surface for the services behind The Secretary, bringing uptime, incidents, and operational health into one place.",
    href: "https://thesecretary-status.gt.tc/",
  },
  {
    title: "DikAgg007.in",
    type: "Web experiment",
    stat: "Built for fun",
    description: "A playful site created simply because making something interesting is reason enough. An early personal corner of the wider archive.",
    href: "https://dikagg007.in/",
  },
  {
    title: "Portfolio Library",
    type: "Living archive",
    stat: "Stories and systems",
    description: "The home you are standing in: a growing library for projects, character dossiers, experiments, timelines, and the work still to come.",
    href: "https://gshergd.github.io/",
  },
  {
    title: "GTA:SA Fan",
    type: "YouTube channel",
    stat: "Games and graphics",
    description: "Gaming videos shaped around Grand Theft Auto, graphics, mods, visual presentation, and the belief that mobile and lower-end players deserve ambitious experiences too.",
    href: "https://www.youtube.com/@grandtheftautosafan",
  },
  {
    title: "The Secretary — Video",
    type: "Official channel",
    stat: "Guides and releases",
    description: "The official video home for The Secretary: practical setup guides, feature demonstrations, release notes, and approachable Discord automation tutorials.",
    href: "https://www.youtube.com/@TheSecretary-ts",
  },
  {
    title: "Zombies vs You",
    type: "Unity project",
    stat: "Archived prototype",
    description: "A survival-game experiment from the Unity years. Development has ended, but the project remains part of the path that started everything.",
    href: "https://gshergd.itch.io/zombies-vs-you",
  },
  {
    title: "Minecraft Mods",
    type: "Modding release",
    stat: "Version 0.0.1",
    description: "A small public release from years of experimenting with Minecraft worlds, custom ideas, and the joy of changing a familiar game by hand.",
    href: "https://github.com/Gshergd/Minecraft-mods/releases/tag/V0.0.1",
  },
  {
    title: "Documentation",
    type: "Knowledge system",
    stat: "Built to be useful",
    description: "A structured reference for The Secretary: setup, commands, permissions, configuration, changelogs, and the details that turn software into a usable product.",
    href: "https://thesecretary.xyz/documentation",
  },
  {
    title: "Cinematic Edits",
    type: "Visual work",
    stat: "Stories in motion",
    description: "Short-form edits and cinematic experiments exploring pacing, presentation, game worlds, and the moments that become memorable after the screen goes dark.",
    href: "https://www.youtube.com/watch?v=_D5YlJ-Yvf0",
  },
].map((project, index) => ({ ...project, image: `/assets/portfolio/project-${String(index + 1).padStart(2, "0")}.webp` }));

const timeline = [
  { year: "2016", label: "Unity", title: "Started with impossible games", image: "/assets/portfolio/timeline-2016.webp", copy: "The first serious experiments began in Unity, driven by the hope of recreating huge open-world ideas and learning every system through trial, curiosity, and stubborn iteration." },
  { year: "2020", label: "YouTube", title: "Turned presentation into a craft", image: "/assets/portfolio/timeline-2020.webp", copy: "Lockdown changed the direction of the work. Content creation opened a path into graphics, editing, and presenting ambitious game experiences for mobile and lower-end players." },
  { year: "2021", label: "Discord", title: "Communities became products", image: "/assets/portfolio/timeline-2021.webp", copy: "Discord brought new people, real operational problems, and the foundation of the Federal Administrative Agency community. Building for others made reliability matter." },
  { year: "2024", label: "AI", title: "Learning accelerated", image: "/assets/portfolio/timeline-2024.webp", copy: "Artificial intelligence changed the pace of learning and building. Old ideas became practical again, with sharper tools for code, design, research, and experimentation." },
  { year: "2025", label: "Life", title: "Useful work over unfinished noise", image: "/assets/portfolio/timeline-2025.webp", copy: "Balancing personal life and expectations meant choosing what deserved to remain. The goal became leaving a clear library of useful work for people walking a similar path." },
  { year: "2026", label: "Hope", title: "A return to building", image: "/assets/portfolio/timeline-2026.webp", copy: "A new year brings another chance to return to game development and test what modern AI-assisted creation can make possible without losing the curiosity that started it all." },
];

const missions = [
  {
    title: "Ada Wong",
    kicker: "RESIDENT EVIL ARCHIVE",
    image: "/assets/characters/ada-wong/hero.webp",
    href: "/ada-wong/",
    copy: "A cinematic dossier devoted to the woman in red: operative profile, mission footage, field capabilities, connections, and unanswered questions.",
  },
].slice(0, 5);

const faqs = [
  { q: "Who is Luvinski?", a: "Luvinski is the creative identity behind Gshergd, DikAgg007, The Secretary, this portfolio, and a long trail of community systems, game experiments, websites, videos, and unfinished ideas worth returning to." },
  { q: "What kind of work lives here?", a: "Discord automation, websites, documentation, infrastructure, community platforms, video work, Unity prototypes, Minecraft experiments, visual studies, and the character archives that make the portfolio feel like a library instead of a résumé." },
  { q: "Why are documentation and status pages included?", a: "Because the quiet parts are part of the product. Clear documentation, visible infrastructure health, and thoughtful onboarding are what make ambitious systems dependable for real people." },
  { q: "Is game development still part of the plan?", a: "Yes. The path has moved through communities, web products, and AI-assisted development, but the original ambition remains: return to games with better tools, stronger judgment, and more realistic ways to finish." },
  { q: "How can I reach the developer?", a: "The Secretary is the main public presence and developer contact hub. Project cards throughout this archive link directly to their live destinations and official channels." },
];

export default function LuvinskiPortfolio() {
  const { items: galleryItems } = useGalleryItems();
  const homeGallery = galleryItems.slice(0, 10);
  const [loaded, setLoaded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [detailView, setDetailView] = useState<DetailView | null>(null);
  const [fullscreenView, setFullscreenView] = useState<GalleryItem | null>(null);
  const [faq, setFaq] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoaded(true), 80);
    const root = document.documentElement;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element, index) => {
      if (!element.style.getPropertyValue("--delay")) element.style.setProperty("--delay", `${(index % 4) * 70}ms`);
      observer.observe(element);
    });

    const onScroll = () => {
      const current = window.scrollY;
      setScrolled(current > 24);
      const maximum = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      root.style.setProperty("--scroll-progress", `${current / maximum}`);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!detailView && !fullscreenView) return;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setDetailView(null); setFullscreenView(null); }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [detailView, fullscreenView]);

  const openFullscreen = (item: GalleryItem) => {
    setDetailView(null);
    setFullscreenView(item);
    window.requestAnimationFrame(() => {
      const viewer = document.querySelector<HTMLElement>(".gallery-fullscreen");
      void viewer?.requestFullscreen?.().catch(() => undefined);
    });
  };

  const closeFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => undefined);
    setFullscreenView(null);
  };

  const openProject = (project: (typeof projects)[number]) => setDetailView({
    image: project.image,
    title: project.title,
    kicker: project.type.toUpperCase(),
    description: project.description,
    href: project.href,
    action: "Visit project",
  });

  const changeFaq = (direction: number) => setFaq((current) => (current + direction + faqs.length) % faqs.length);

  return (
    <main className={`luv-site ${loaded ? "site-loaded" : ""}`}>
      <div className="scroll-progress" aria-hidden="true" />
      <div className="luv-noise" aria-hidden="true" />

      <header className={`nav-shell intro-target ${scrolled ? "nav-scrolled" : ""}`}>
        <a className="brand-mark brand-image" href="#top" aria-label="Luvinski portfolio home"><img src="/assets/brand/secretary-mark.png" alt="" /></a>
        <nav className={menuOpen ? "nav-links open" : "nav-links"} aria-label="Primary navigation">
          <a className="active" href="#top" onClick={() => setMenuOpen(false)}>Legacy</a>
          <a href="/ada-wong/" onClick={() => setMenuOpen(false)}>Ada Wong</a>
          <a href="https://thesecretary.xyz/" target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)}>Official</a>
          <a href="#missions" onClick={() => setMenuOpen(false)}>Mission</a>
        </nav>
        <a className="nav-action" href="/forum/" aria-label="Open the forum"><span>+</span></a>
        <button className="menu-button" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle menu" aria-expanded={menuOpen}>Menu</button>
      </header>

      <section className="luv-hero" id="top">
        <div className="luv-hero-image" />
        <div className="luv-hero-grid" />
        <div className="luv-hero-copy">
          <div className="status-pill intro-target intro-1"><i /> INDEPENDENT BUILDER <b>•</b> ONLINE</div>
          <p className="eyebrow intro-target intro-2">THE LEGACY ARCHIVE</p>
          <h1 className="intro-target intro-3">Luvinski</h1>
          <p className="luv-aliases intro-target intro-4">Gshergd Luvinski <span>•</span> Luvinski <span>•</span> DikAgg007</p>
          <p className="luv-hero-lede intro-target intro-4">Developer, community systems builder, visual storyteller, and lifelong game-maker in progress. From twelve Discord bots to public platforms, every project is another route back to building bigger worlds.</p>
          <div className="button-row intro-target intro-5">
            <a className="button primary" href="#work">Explore the work <span>↗</span></a>
            <a className="button secondary" href="#timeline">Read the timeline</a>
          </div>
          <div className="hero-stats intro-target intro-6">
            <div><strong>40K+</strong><span>BOT USERS</span></div>
            <div><strong>12</strong><span>DISCORD BOTS</span></div>
            <div><strong>2016</strong><span>FIRST BUILD</span></div>
          </div>
        </div>
        <a className="scroll-cue intro-target intro-6" href="#identity"><span>SCROLL</span><b><i /></b></a>
      </section>

      <div className="marquee luv-marquee" aria-hidden="true"><div><span>GAME DEVELOPMENT <i>•</i> DISCORD SYSTEMS <i>•</i> WEB PLATFORMS <i>•</i> DOCUMENTATION <i>•</i> VISUAL STORIES <i>•</i></span><span>GAME DEVELOPMENT <i>•</i> DISCORD SYSTEMS <i>•</i> WEB PLATFORMS <i>•</i> DOCUMENTATION <i>•</i> VISUAL STORIES <i>•</i></span></div></div>

      <section className="section luv-identity" id="identity">
        <div className="section-heading" data-reveal><p className="eyebrow">ONE BUILDER. THREE SIGNATURES.</p><h2>The aliases changed.<br />The curiosity stayed.</h2><p>Each name marks a different chapter, but the work shares one instinct: learn the system, make it useful, and give it a world of its own.</p></div>
        <div className="luv-alias-grid">
          <article data-reveal><span>01</span><h3>Gshergd Luvinski</h3><p>The public developer identity behind the portfolio, open-source releases, and a growing library of work.</p></article>
          <article data-reveal><span>02</span><h3>Luvinski</h3><p>The creative signature used across products, writing, visual experiments, and The Secretary ecosystem.</p></article>
          <article data-reveal><span>03</span><h3>DikAgg007</h3><p>The early handle that carries the Unity, Minecraft, gaming, and first-website years into everything built now.</p></article>
        </div>
      </section>

      <section className="section luv-work" id="work">
        <div className="archive-head" data-reveal><div><p className="eyebrow">PROJECT DIRECTORY</p><h2>Systems, communities<br />& experiments.</h2></div><p>Twelve doors into the work. Open any file for context, then continue to the live project, channel, or release.</p></div>
        <div className="luv-project-grid">
          {projects.map((project, index) => (
            <button className={`luv-project-card luv-project-${index + 1}`} type="button" key={project.title} data-reveal onClick={() => openProject(project)} aria-haspopup="dialog" style={{ "--delay": `${(index % 3) * 70}ms` } as CSSProperties}>
              <img src={project.image} alt="" loading={index < 3 ? "eager" : "lazy"} decoding="async" />
              <span className="luv-project-shade" />
              <span className="luv-project-number">{String(index + 1).padStart(2, "0")}</span>
              <span className="luv-project-copy"><small>{project.type}</small><strong>{project.title}</strong><em>{project.stat}</em></span>
              <span className="luv-project-open">Open file ↗</span>
            </button>
          ))}
        </div>
      </section>

      <section className="section stat-section" aria-label="Portfolio statistics">
        <div className="stat-panel luv-stat-panel" data-reveal>
          <div><strong>40K+</strong><span>PLATFORM USERS</span></div>
          <div><strong>12</strong><span>DISCORD BOTS</span></div>
          <div><strong>10+</strong><span>PUBLIC DESTINATIONS</span></div>
          <div><strong>∞</strong><span>NEXT IDEAS</span></div>
        </div>
      </section>

      <section className="luv-manifesto">
        <div className="luv-manifesto-image" />
        <div className="luv-manifesto-copy">
          <p className="eyebrow" data-reveal>THE OPERATING PRINCIPLE</p>
          <h2 data-reveal>Build useful things.<br />Leave good work behind.</h2>
          <p data-reveal>The strongest projects are more than their main feature. They explain themselves, report their health, respect the communities using them, and stay clear enough for the next person to learn from.</p>
          <div className="tags" data-reveal><span>AUTOMATION</span><span>COMMUNITY</span><span>DESIGN</span><span>DOCUMENTATION</span><span>GAMES</span></div>
        </div>
      </section>

      <section className="section luv-timeline" id="timeline">
        <div className="archive-head" data-reveal><div><p className="eyebrow">2016 — 2026</p><h2>From Unity experiments<br />to AI-backed development.</h2></div><p>A compact timeline of the pivots, platforms, and hopes that shaped the work.</p></div>
        <div className="luv-timeline-list">
          {timeline.map((item, index) => (
            <article data-reveal key={item.year} className={index % 2 ? "is-even" : ""}>
              <div className="luv-timeline-media"><img src={item.image} alt="" loading="lazy" decoding="async" /><span>{item.year}</span></div>
              <div className="luv-timeline-copy"><p>{item.year} // {item.label}</p><h3>{item.title}</h3><span>{item.copy}</span></div>
            </article>
          ))}
        </div>
      </section>

      <section className="section luv-missions" id="missions">
        <div className="section-heading centered" data-reveal><p className="eyebrow">PORTFOLIO LIBRARY</p><h2>Current mission files.</h2><p>Only live dossiers appear here. The library will expand one finished archive at a time.</p></div>
        <div className="luv-mission-grid">
          {missions.map((mission) => (
            <button type="button" key={mission.title} data-reveal onClick={() => setDetailView({ image: mission.image, title: mission.title, kicker: mission.kicker, description: mission.copy, href: mission.href, action: "Enter dossier" })} aria-haspopup="dialog">
              <img src={mission.image} alt="" loading="lazy" decoding="async" />
              <span><small>{mission.kicker}</small><strong>{mission.title}</strong><em>Open mission ↗</em></span>
            </button>
          ))}
        </div>
      </section>

      <section className="section luv-field" id="gallery">
        <div className="archive-head" data-reveal><div><p className="eyebrow">IMAGE GALLERY</p><h2>Images worth<br />keeping.</h2></div><div className="luv-gallery-intro"><p>Screenshots, experiments, games, characters, roads, and visual moments collected in one growing gallery.</p><a href="/gallery/">View the full gallery <span>→</span></a></div></div>
        <div className="luv-field-grid">
          {homeGallery.map((item, index) => (
            <button type="button" key={item.id} data-reveal className={`field-${(index % 8) + 1}`} onClick={() => setDetailView({ image: item.image_url, title: item.title, kicker: `GALLERY IMAGE ${String(index + 1).padStart(2, "0")}`, description: item.description, galleryItem: item })} aria-haspopup="dialog">
              <img src={item.image_url} alt={item.title} loading="lazy" decoding="async" /><span>{String(index + 1).padStart(2, "0")} <b>{item.title}</b></span>
            </button>
          ))}
        </div>
      </section>

      <section className="section luv-contact">
        <div className="luv-contact-panel" data-reveal>
          <div className="luv-contact-backdrop" />
          <div className="luv-contact-copy">
            <p className="eyebrow">OFFICIAL PRESENCE & DEVELOPER CONTACT</p>
            <h2>The Sovereign Building.</h2>
            <address>The Sovereign Building, #473, Sector 68, Block 15,<br />Pripyal City, Minecraft</address>
            <p>The Secretary is the official presence and developer contact hub — the best place to follow the ecosystem, find documentation, or start a conversation.</p>
            <div className="button-row"><a className="button primary" href="https://thesecretary.xyz/" target="_blank" rel="noreferrer">Visit The Secretary ↗</a><a className="button dark" href="https://thesecretary.xyz/documentation" target="_blank" rel="noreferrer">Read documentation</a></div>
          </div>
        </div>
      </section>

      <section className="section legacy-section luv-faq">
        <div className="faq-panel" data-reveal>
          <div className="luv-faq-backdrop" />
          <div className="faq-top"><div><p className="eyebrow">ARCHIVE NOTES</p><span>{String(faq + 1).padStart(2, "0")} / {String(faqs.length).padStart(2, "0")}</span></div><div className="faq-arrows"><button onClick={() => changeFaq(-1)} aria-label="Previous question">←</button><button onClick={() => changeFaq(1)} aria-label="Next question">→</button></div></div>
          <div className="faq-content" key={faq}><h2>{faqs[faq].q}</h2><p>{faqs[faq].a}</p></div>
          <div className="faq-bottom"><div className="dots" aria-label="Select a note">{faqs.map((item, index) => <button className={faq === index ? "selected" : ""} onClick={() => setFaq(index)} aria-label={item.q} key={item.q} />)}</div><a href="#top">Return to top ↑</a></div>
        </div>
      </section>

      <footer data-reveal>
        <div className="footer-grid">
          <div className="footer-brand"><div><span className="brand-mark brand-image"><img src="/assets/brand/secretary-mark.png" alt="" /></span><h3>Luvinski<small>PORTFOLIO LIBRARY</small></h3></div><p>An independent archive of systems, communities, visual experiments, game ambitions, and the work worth carrying forward.</p></div>
          <div><p className="eyebrow">EXPLORE</p><a href="#top">Legacy</a><a href="/gallery/">Gallery</a><a href="/ada-wong/">Ada Wong</a><a href="https://thesecretary.xyz/" target="_blank" rel="noreferrer">Official</a><a href="#missions">Mission</a></div>
          <div><p className="eyebrow">CONTACT</p><p>The Secretary is the official public presence and developer contact hub.</p><a className="footer-cta" href="https://thesecretary.xyz/" target="_blank" rel="noreferrer"><span>↗</span> Open The Secretary</a></div>
        </div>
        <div className="legal"><span>© 2026 The Secretary.</span><span>Built by Gshergd Luvinski.</span><span>From curiosity to useful systems.</span></div>
      </footer>

      {detailView && (
        <div className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="detail-title" onMouseDown={() => setDetailView(null)}>
          <div className="detail-modal-panel" onMouseDown={(event) => event.stopPropagation()}>
            <button className="detail-close" type="button" onClick={() => setDetailView(null)} aria-label="Close details">×</button>
            <div className="detail-media"><img src={detailView.image} alt={detailView.title} /></div>
            <div className="detail-copy"><p className="eyebrow">{detailView.kicker}</p><h2 id="detail-title">{detailView.title}</h2><p>{detailView.description}</p>{detailView.href ? <a className="luv-modal-action" href={detailView.href} target={detailView.href.startsWith("http") ? "_blank" : undefined} rel={detailView.href.startsWith("http") ? "noreferrer" : undefined}>{detailView.action ?? "Visit project"}<span>↗</span></a> : <button type="button" onClick={() => detailView.galleryItem && openFullscreen(detailView.galleryItem)}>Fullscreen <span>⛶</span></button>}</div>
          </div>
        </div>
      )}

      {fullscreenView && <div className="gallery-fullscreen"><img src={fullscreenView.image_url} alt={fullscreenView.title} /><div><strong>{fullscreenView.title}</strong><span>{fullscreenView.description}</span></div><button type="button" onClick={closeFullscreen} aria-label="Close fullscreen image">×</button></div>}
    </main>
  );
}
