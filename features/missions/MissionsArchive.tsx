"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UniversalFooter, UniversalHeader } from "@/components/site/UniversalShell";
import { fetchPublishedMissionsClient } from "./missionClient";
import { staticMissions } from "./missionData";
import type { MissionRecord } from "./missionTypes";

const shapes = ["mission-card-tall", "mission-card-wide", "mission-card-small", "mission-card-small", "mission-card-wide", "mission-card-tall", "mission-card-small", "mission-card-wide"];

export default function MissionsArchive() {
  const [missions, setMissions] = useState<MissionRecord[]>(staticMissions);
  const [selected, setSelected] = useState<MissionRecord | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => { void fetchPublishedMissionsClient().then(setMissions).catch(() => setError(true)); }, []);
  useEffect(() => {
    if (!selected) return;
    const previous = document.body.style.overflow;
    const key = (event: KeyboardEvent) => { if (event.key === "Escape") setSelected(null); };
    document.body.style.overflow = "hidden"; window.addEventListener("keydown", key);
    return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", key); };
  }, [selected]);

  return <main className="missions-site">
    <UniversalHeader active="missions" />
    <section className="missions-hero"><div className="missions-hero-image" /><div className="missions-hero-grid" /><div className="missions-hero-copy"><div className="status-pill"><i /> MISSION NETWORK <b>•</b> ONLINE</div><p className="eyebrow">THE PORTFOLIO LIBRARY</p><h1>Mission<br />Archives.</h1><p>Characters, operations, worlds, and stories preserved as living dossiers—each built from the same cinematic system.</p><div className="hero-stats"><div><strong>{String(missions.length).padStart(2, "0")}</strong><span>ACTIVE FILES</span></div><div><strong>LIVE</strong><span>OWNER BUILT</span></div><div><strong>∞</strong><span>ROOM TO EXPAND</span></div></div></div><a className="scroll-cue" href="#mission-grid"><span>EXPLORE</span><b><i /></b></a></section>
    <section className="missions-content" id="mission-grid"><div className="missions-heading"><div><p className="eyebrow">ALL DOSSIERS</p><h2>Choose your next mission.</h2></div><p>Open a file for its briefing, then enter the complete archive when you are ready.</p></div>{error && <p className="gallery-sync-note">Live mission updates are temporarily unavailable. The built-in archive remains accessible.</p>}<div className="missions-grid">{missions.map((mission, index) => <button type="button" className={`mission-card ${shapes[index % shapes.length]}`} key={mission.id} onClick={() => setSelected(mission)} aria-haspopup="dialog"><img src={mission.cover_url || mission.hero.image} alt="" loading={index < 3 ? "eager" : "lazy"} decoding="async" /><span><small>{String(index + 1).padStart(2, "0")} // {mission.status.toUpperCase()}</small><strong>{mission.name}</strong><em>{mission.excerpt}</em></span></button>)}</div></section>
    <UniversalFooter />
    {selected && <div className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="mission-archive-title" onMouseDown={() => setSelected(null)}><div className="detail-modal-panel" onMouseDown={(event) => event.stopPropagation()}><button className="detail-close" type="button" onClick={() => setSelected(null)} aria-label="Close mission briefing">×</button><div className="detail-media"><img src={selected.cover_url || selected.hero.image} alt={selected.name} /></div><div className="detail-copy"><p className="eyebrow">MISSION FILE</p><h2 id="mission-archive-title">{selected.name}</h2><p>{selected.excerpt}</p><Link className="mission-enter-link" href={`/missions/${selected.slug}/`}>Enter mission <span>↗</span></Link></div></div></div>}
  </main>;
}

