"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function LegacyMissionRedirect() {
  useEffect(() => { window.location.replace("/missions/ada-wong/"); }, []);
  return <main className="mission-redirect"><div><p className="eyebrow">MISSION FILE MOVED</p><h1>Opening<br />Ada Wong.</h1><p>The dossier now lives inside the Mission Archives.</p><Link className="button primary" href="/missions/ada-wong/">Enter mission <span>↗</span></Link></div></main>;
}

