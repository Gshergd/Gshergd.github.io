"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { UniversalFooter, UniversalHeader } from "@/components/site/UniversalShell";
import type { MissionBlock, MissionButton, MissionCard, MissionRecord } from "./missionTypes";

type Detail = { image: string; title: string; kicker: string; body: string };

function backdrop(image: string, kind: "hero" | "feature" | "banner" | "panel" | "faq"): CSSProperties {
  const overlays = {
    hero: "linear-gradient(90deg,rgba(4,5,7,.98) 3%,rgba(4,5,7,.86) 30%,rgba(4,5,7,.34) 58%,rgba(4,5,7,.12)),linear-gradient(0deg,#050507 0%,transparent 38%)",
    feature: "linear-gradient(90deg,rgba(4,5,7,.95),rgba(4,5,7,.7) 45%,rgba(4,5,7,.06)),linear-gradient(0deg,rgba(4,5,7,.9),transparent 52%)",
    banner: "linear-gradient(0deg,#07080a 0%,rgba(6,7,9,.14) 42%,#07080a 100%),linear-gradient(90deg,rgba(7,8,10,.58),rgba(70,9,22,.08),rgba(7,8,10,.55))",
    panel: "linear-gradient(rgba(5,6,8,.66),rgba(5,6,8,.93))",
    faq: "linear-gradient(90deg,rgba(5,6,8,.98),rgba(5,6,8,.83) 58%,rgba(5,6,8,.5)),linear-gradient(0deg,rgba(5,6,8,.96),transparent)",
  }[kind];
  return { backgroundImage: `${overlays},url('${image || "/assets/portfolio/hero-legacy.webp"}')` };
}

function MissionButtons({ buttons }: { buttons: MissionButton[] }) {
  if (!buttons.length) return null;
  return <div className="button-row" data-reveal>{buttons.map((button, index) => <a className={`button ${button.tone}`} href={button.href || "#"} key={`${button.label}-${index}`}>{button.label}<span aria-hidden="true">{button.tone === "primary" ? "↗" : "→"}</span></a>)}</div>;
}

function CardsBlock({ block, open }: { block: Extract<MissionBlock, { type: "cards" }>; open: (item: MissionCard) => void }) {
  return <section className="section dossier-section" id={block.id}><div className="section-heading centered" data-reveal><p className="eyebrow">{block.eyebrow}</p><h2>{block.title}</h2><p>{block.intro}</p></div><div className={`card-grid ${block.items.length === 3 ? "three" : "mission-flex-grid"}`}>{block.items.map((item, index) => <button type="button" className="action-card tilt-card" data-reveal key={item.id} style={{ "--card-image": `url(${item.image})`, "--delay": `${index * 80}ms` } as CSSProperties} onClick={() => open(item)} aria-haspopup="dialog"><div className="action-card-image" /><div className="action-card-content"><span className={`icon-box tone-${index % 3}`}>{item.title.slice(0, 1)}</span><h3>{item.title}</h3><p>{item.body}</p><span className="action-link">Open file <b>→</b></span></div></button>)}</div></section>;
}

function GalleryBlock({ block, open }: { block: Extract<MissionBlock, { type: "gallery" }>; open: (item: MissionCard) => void }) {
  return <section className="section archive-section" id={block.id}><div className="archive-head" data-reveal><div><p className="eyebrow">{block.eyebrow}</p><h2>{block.title}</h2></div><p>{block.intro}</p></div><div className="archive-grid mission-archive-grid">{block.items.map((item, index) => <button type="button" className={`archive-card archive-${(index % 4) + 1}`} data-reveal key={item.id} onClick={() => open(item)} aria-haspopup="dialog"><img src={item.image} alt={item.title} loading="lazy" decoding="async" /><span className="archive-caption"><span>{String(index + 1).padStart(2, "0")}</span><span><b>{item.title}</b><small>{item.kicker}</small></span></span></button>)}</div></section>;
}

export default function MissionRenderer({ mission, preview = false }: { mission: MissionRecord; preview?: boolean }) {
  const [loaded, setLoaded] = useState(preview);
  const [detail, setDetail] = useState<Detail | null>(null);
  const faqBlock = useMemo(() => mission.blocks.find((block): block is Extract<MissionBlock, { type: "faq" }> => block.type === "faq"), [mission.blocks]);
  const [faqIndex, setFaqIndex] = useState(0);

  useEffect(() => {
    if (preview) return;
    const timer = window.setTimeout(() => setLoaded(true), 60);
    const root = document.documentElement;
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } }), { threshold: .12, rootMargin: "0px 0px -6% 0px" });
    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element, index) => { if (!element.style.getPropertyValue("--delay")) element.style.setProperty("--delay", `${(index % 4) * 70}ms`); observer.observe(element); });
    const onScroll = () => { const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1); root.style.setProperty("--scroll-progress", `${window.scrollY / max}`); };
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.clearTimeout(timer); observer.disconnect(); window.removeEventListener("scroll", onScroll); };
  }, [mission.slug, preview]);

  useEffect(() => {
    if (!detail || preview) return;
    const previous = document.body.style.overflow;
    const key = (event: KeyboardEvent) => { if (event.key === "Escape") setDetail(null); };
    document.body.style.overflow = "hidden"; window.addEventListener("keydown", key);
    return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", key); };
  }, [detail, preview]);

  const open = (item: MissionCard) => setDetail({ image: item.image, title: item.title, kicker: item.kicker, body: item.caption || item.body });
  const rootClass = ["mission-page", loaded ? "site-loaded" : "", preview ? "mission-preview-render" : ""].filter(Boolean).join(" ");

  return <main className={rootClass}>
    {!preview && <><div className="scroll-progress" aria-hidden="true" /><div className="ambient-grid" aria-hidden="true" /><UniversalHeader active="missions" intro /></>}
    <section className="hero mission-hero" id="top"><div className="hero-image" style={backdrop(mission.hero.image || mission.cover_url, "hero")} /><div className="hero-grid" /><div className="hero-copy"><div className="status-pill intro-target intro-1"><i />{mission.hero.status}</div><p className="eyebrow intro-target intro-2">{mission.hero.eyebrow}</p><h1 className="intro-target intro-3">{mission.hero.title}</h1><p className="hero-lede intro-target intro-4">{mission.hero.lede}</p><MissionButtons buttons={mission.hero.buttons} />{mission.hero.stats.length > 0 && <div className="hero-stats intro-target intro-6">{mission.hero.stats.map((stat, index) => <div key={`${stat.label}-${index}`}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}</div>}</div>{!preview && <a className="scroll-cue intro-target intro-6" href={`#${mission.blocks[0]?.id || "top"}`}><span>SCROLL</span><b><i /></b></a>}</section>

    {mission.blocks.map((block) => {
      if (block.type === "marquee") {
        const items = block.items.filter(Boolean).length ? block.items.filter(Boolean) : ["Mission archive"];
        const group = (copy: string) => <span className="mission-marquee-group" key={copy}>{items.map((item, index) => <span className="mission-marquee-item" key={`${copy}-${item}-${index}`}>{item}<i aria-hidden="true">&#8226;</i></span>)}</span>;
        return <div className="marquee mission-marquee" aria-hidden="true" id={block.id} key={block.id}><div className="mission-marquee-track">{group("primary")}{group("duplicate")}</div></div>;
      }
      if (block.type === "cards") return <CardsBlock block={block} open={open} key={block.id} />;
      if (block.type === "stats") return <section className="section stat-section" key={block.id} id={block.id}><div className="stat-panel" data-reveal>{block.items.map((stat, index) => <div key={`${stat.label}-${index}`}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}</div></section>;
      if (block.type === "feature") return <section className="section profile-section" id={block.id} key={block.id}><div className="feature-panel image-panel" data-reveal><div className="feature-image" style={backdrop(block.image, "feature")} /><div className="panel-copy"><p className="eyebrow">{block.eyebrow}</p><h2>{block.title}</h2><p>{block.body}</p><MissionButtons buttons={block.buttons} /></div></div></section>;
      if (block.type === "banner") return <section className="mission-banner" id={block.id} key={block.id}><div className="mission-backdrop" style={backdrop(block.image, "banner")} /><div className="mission-content"><p className="eyebrow" data-reveal>{block.eyebrow}</p><h2 data-reveal>{block.title}</h2><p data-reveal>{block.body}</p>{block.tags.length > 0 && <div className="tags" data-reveal>{block.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>}</div></section>;
      if (block.type === "gallery") return <GalleryBlock block={block} open={open} key={block.id} />;
      if (block.type === "capabilities") return <section className="section capability-section" id={block.id} key={block.id}><div className="section-heading align-left" data-reveal><p className="eyebrow">{block.eyebrow}</p><h2>{block.title}</h2><p>{block.intro}</p></div>{block.visuals.length > 0 && <div className="intel-strip">{block.visuals.map((item, index) => <button type="button" className="intel-visual" data-reveal key={item.id} style={{ backgroundImage: `linear-gradient(0deg,rgba(6,7,9,.86),rgba(6,7,9,.08)),url('${item.image}')` }} onClick={() => open(item)}><span>{String(index + 1).padStart(2, "0")}</span><p>{item.title}</p></button>)}</div>}<h2 className="subhead" data-reveal>Operational advantages</h2><div className="card-grid capability-grid">{block.items.map((item, index) => <button type="button" className="capability-card" data-reveal key={item.id} style={{ "--capability-image": `url('${item.image}')` } as CSSProperties} onClick={() => open(item)}><span>{String(index + 1).padStart(2, "0")}</span><h3>{item.title}</h3><p>{item.body}</p></button>)}</div></section>;
      if (block.type === "connections") return <section className="section network-section" id={block.id} key={block.id}><div className="network-panel" data-reveal><div className="network-backdrop" style={backdrop(block.image, "panel")} /><div className="network-content"><p className="eyebrow">{block.eyebrow}</p><h2>{block.title}</h2><p>{block.intro}</p><div className="connection-row">{block.items.map((item) => <a href={item.href || "#"} key={item.id}><b>{item.initials || item.title.slice(0, 2).toUpperCase()}</b><span><strong>{item.title}</strong><small>{item.kicker}</small></span></a>)}</div></div></div></section>;
      if (block.type === "faq" && block.items.length > 0) { const safeIndex = Math.min(faqIndex, block.items.length - 1); return <section className="section legacy-section" id={block.id} key={block.id}><div className="faq-panel" data-reveal><div className="faq-backdrop" style={backdrop(block.image, "faq")} /><div className="faq-top"><div><p className="eyebrow">{block.eyebrow}</p><span>{String(safeIndex + 1).padStart(2, "0")} / {String(block.items.length).padStart(2, "0")}</span></div><div className="faq-arrows"><button onClick={() => setFaqIndex((safeIndex - 1 + block.items.length) % block.items.length)} aria-label="Previous question">←</button><button onClick={() => setFaqIndex((safeIndex + 1) % block.items.length)} aria-label="Next question">→</button></div></div><div className="faq-content" key={safeIndex}><h2>{block.items[safeIndex].question}</h2><p>{block.items[safeIndex].answer}</p></div><div className="faq-bottom"><div className="dots">{block.items.map((item, index) => <button className={safeIndex === index ? "selected" : ""} onClick={() => setFaqIndex(index)} aria-label={item.question} key={item.id} />)}</div><a href="#top">Return to top ↑</a></div></div></section>; }
      return null;
    })}
    {!preview && <UniversalFooter />}
    {!preview && detail && <div className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="mission-detail-title" onMouseDown={() => setDetail(null)}><div className="detail-modal-panel" onMouseDown={(event) => event.stopPropagation()}><button className="detail-close" type="button" onClick={() => setDetail(null)} aria-label="Close details">×</button><div className="detail-media"><img src={detail.image} alt={detail.title} /></div><div className="detail-copy"><p className="eyebrow">{detail.kicker}</p><h2 id="mission-detail-title">{detail.title}</h2><p>{detail.body}</p><button type="button" onClick={() => setDetail(null)}>Return to mission <span>→</span></button></div></div></div>}
  </main>;
}
