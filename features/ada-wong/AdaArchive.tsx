"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { UniversalFooter, UniversalHeader } from "@/components/site/UniversalShell";

const faqs = [
  { q: "Who is Ada Wong?", a: "Ada Wong is an elite covert operative whose true loyalties are deliberately difficult to read. Precise, resourceful, and always one step ahead, she moves through the shadows of the Resident Evil story on her own terms." },
  { q: "What is Ada's connection to Leon S. Kennedy?", a: "Ada and Leon share a complicated bond built on trust, deception, and repeated rescues. Their paths cross at the worst possible moments, yet neither can quite leave the other behind." },
  { q: "Where does Separate Ways fit into the story?", a: "Separate Ways follows Ada's parallel mission during Resident Evil 4, revealing the operations, choices, and close calls taking place beyond Leon's point of view." },
  { q: "What makes Ada such a capable operative?", a: "She combines intelligence work, social engineering, acrobatics, marksmanship, and specialized equipment. Her real advantage is composure: Ada rarely reveals more than she intends." },
  { q: "Is this an official Capcom website?", a: "No. This is a fan-made tribute experience inspired by Ada Wong and Resident Evil. It is not affiliated with or endorsed by Capcom." },
];

const dossiers = [
  { icon: "A", title: "Operative Profile", copy: "Trace Ada's aliases, shifting objectives, and the details hidden between missions.", image: "/assets/characters/ada-wong/operative-profile.webp", kicker: "CLASSIFIED IDENTITY", detail: "Every file carries a different employer, objective, or alias. The constant is Ada herself: precise, composed, and impossible to fully place on anyone else's side." },
  { icon: "M", title: "Mission Archive", copy: "Revisit Raccoon City, the European village, and every operation where Ada changed the outcome.", image: "/assets/characters/ada-wong/ada-02.png", kicker: "OPERATIONAL HISTORY", detail: "From the fall of Raccoon City to the search for the amber, Ada repeatedly enters impossible operations, secures what matters, and leaves before the truth catches up." },
  { icon: "S", title: "Separate Ways", copy: "Follow the mission running in parallel with Leon's search and uncover the story he never saw.", image: "/assets/characters/ada-wong/ada-03.png", kicker: "PARALLEL MISSION", detail: "Separate Ways reveals the unseen mission behind Leon's journey: Ada's pursuit of the amber, her uneasy alliance with Luis, and the choices that quietly change the ending." },
];

const missionFrames = [
  { image: "/assets/characters/ada-wong/ada-04.png", label: "Extraction", detail: "A new dawn", description: "With the operation collapsing behind her, Ada reaches the extraction point at sunrise. The mission is over; the consequences are only beginning." },
  { image: "/assets/characters/ada-wong/ada-06.png", label: "Comms", detail: "Patch me through", description: "A secure channel, a changing objective, and an employer receiving only the information Ada chooses to share." },
  { image: "/assets/characters/ada-wong/ada-08.png", label: "Intel", detail: "Eyes on target", description: "The smallest detail can change an entire operation. Ada watches first, moves second, and never wastes the advantage." },
  { image: "/assets/characters/ada-wong/ada-14.png", label: "Departure", detail: "Separate ways", description: "Another escape, another unanswered question. Ada leaves the battlefield with her identity, intentions, and next destination still classified." },
];

const intelFrames = [
  { image: "/assets/characters/ada-wong/ada-07.png", title: "Observe", kicker: "FIELD DISCIPLINE", detail: "Ada reads a room before anyone realizes she has entered it. Observation turns uncertainty into leverage." },
  { image: "/assets/characters/ada-wong/ada-09.png", title: "Infiltrate", kicker: "COVERT ACCESS", detail: "A convincing cover and exact timing get her through doors that force alone could never open." },
  { image: "/assets/characters/ada-wong/ada-13.png", title: "Disappear", kicker: "CLEAN EXTRACTION", detail: "The best exit leaves no pursuit, no useful evidence, and no certainty that she was ever there." },
];

type DetailView = { image: string; title: string; kicker: string; description: string };

const capabilities = [
  { title: "Hookshot Mobility", copy: "Ada's grappling device turns vertical spaces into escape routes and unreachable positions into tactical ground.", image: "/assets/characters/ada-wong/advantage-01.webp" },
  { title: "Covert Intelligence", copy: "She builds a cover that survives scrutiny and extracts the one detail her employer actually needs.", image: "/assets/characters/ada-wong/advantage-02.webp" },
  { title: "Precision Combat", copy: "Measured marksmanship and controlled movement let Ada finish encounters before they become a liability.", image: "/assets/characters/ada-wong/advantage-03.webp" },
  { title: "Situational Control", copy: "Distractions, feints, and environmental awareness allow her to reshape a dangerous scene.", image: "/assets/characters/ada-wong/advantage-04.webp" },
  { title: "Independent Judgment", copy: "Ada accepts a brief, not a leash. When the mission conflicts with her code, she makes the final call.", image: "/assets/characters/ada-wong/advantage-05.webp" },
  { title: "Unshakable Composure", copy: "Whether surrounded, betrayed, or seconds from disaster, she keeps her next move unreadable.", image: "/assets/characters/ada-wong/advantage-06.webp" },
];

export default function AdaArchive() {
  const [faq, setFaq] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [detailView, setDetailView] = useState<DetailView | null>(null);

  useEffect(() => {
    const startTimer = window.setTimeout(() => setLoaded(true), 80);
    const root = document.documentElement;

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -7% 0px" });

    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element, index) => {
      if (!element.style.getPropertyValue("--delay")) element.style.setProperty("--delay", `${(index % 4) * 80}ms`);
      revealObserver.observe(element);
    });

    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll<HTMLElement>("[data-count]").forEach((counter) => {
          const target = Number(counter.dataset.count || 0);
          const suffix = counter.dataset.suffix || "";
          const started = performance.now();
          const update = (time: number) => {
            const progress = Math.min((time - started) / 1500, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = `${Math.round(target * eased).toLocaleString()}${suffix}`;
            if (progress < 1) requestAnimationFrame(update);
          };
          requestAnimationFrame(update);
        });
        countObserver.unobserve(entry.target);
      });
    }, { threshold: 0.45 });
    document.querySelectorAll("[data-counter-group]").forEach((element) => countObserver.observe(element));

    const onScroll = () => {
      const current = window.scrollY;
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      root.style.setProperty("--scroll-progress", `${current / max}`);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(startTimer);
      revealObserver.disconnect();
      countObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!detailView) return;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDetailView(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [detailView]);

  const changeFaq = (direction: number) => setFaq((current) => (current + direction + faqs.length) % faqs.length);

  return (
    <main className={loaded ? "site-loaded" : ""}>
      <div className="scroll-progress" aria-hidden="true" />
      <div className="ambient-grid" aria-hidden="true" />

      <UniversalHeader active="ada" intro />

      <section className="hero" id="top">
        <div className="hero-image" />
        <div className="hero-grid" />
        <div className="hero-copy">
          <div className="status-pill intro-target intro-1"><i /> CLASSIFIED OPERATIVE <b>&bull;</b> ACTIVE</div>
          <p className="eyebrow intro-target intro-2">RESIDENT EVIL ARCHIVES</p>
          <h1 className="intro-target intro-3">Ada<br />Wong</h1>
          <p className="hero-lede intro-target intro-4">A name without a history. An operative without a flag. Step into the classified world of Resident Evil&apos;s most elusive spy.</p>
          <div className="button-row intro-target intro-5">
            <a className="button primary" href="#profile">Enter the dossier <span>{"\u2197"}</span></a>
            <a className="button secondary" href="#missions">View missions</a>
          </div>
          <div className="hero-stats intro-target intro-6">
            <div><strong>1998</strong><span>FIRST SIGHTING</span></div>
            <div><strong>6+</strong><span>OPERATIONS</span></div>
            <div><strong>&infin;</strong><span>UNFINISHED BUSINESS</span></div>
          </div>
        </div>
        <a className="scroll-cue intro-target intro-6" href="#dossier"><span>SCROLL</span><b><i /></b></a>
      </section>

      <div className="marquee" aria-hidden="true">
        <div><span>RACCOON CITY <i>&bull;</i> COVERT OPERATIONS <i>&bull;</i> SEPARATE WAYS <i>&bull;</i> ASSIGNMENT ADA <i>&bull;</i> THE WOMAN IN RED <i>&bull;</i></span><span>RACCOON CITY <i>&bull;</i> COVERT OPERATIONS <i>&bull;</i> SEPARATE WAYS <i>&bull;</i> ASSIGNMENT ADA <i>&bull;</i> THE WOMAN IN RED <i>&bull;</i></span></div>
      </div>

      <section className="section dossier-section" id="dossier">
        <div className="section-heading centered" data-reveal>
          <p className="eyebrow">ACCESS GRANTED</p>
          <h2>Open the dossier.</h2>
          <p>Three ways into the story of an agent whose motives remain classified.</p>
        </div>
        <div className="card-grid three">
          {dossiers.map((item, index) => (
            <button type="button" className="action-card tilt-card" data-reveal key={item.title} style={{ "--card-image": `url(${item.image})`, "--delay": `${index * 100}ms` } as CSSProperties} onClick={() => setDetailView({ image: item.image, title: item.title, kicker: item.kicker, description: item.detail })} aria-haspopup="dialog">
              <div className="action-card-image" />
              <div className="action-card-content">
                <span className={`icon-box tone-${index}`}>{item.icon}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
                <span className="action-link shimmer-button">Open file <b>&rarr;</b></span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="section stat-section" aria-label="Operative statistics">
        <div className="stat-panel" data-reveal data-counter-group>
          <div><strong>TOP</strong><span>CLASSIFICATION</span></div>
          <div><strong data-count="100" data-suffix="%">0%</strong><span>MISSION FOCUS</span></div>
          <div><strong data-count="1998">0</strong><span>RACCOON CITY</span></div>
          <div><strong>ADA</strong><span>KNOWN ALIAS</span></div>
        </div>
      </section>

      <section className="section profile-section" id="profile">
        <div className="feature-panel image-panel tilt-soft" data-reveal data-spotlight>
          <div className="feature-image" />
          <div className="card-spotlight" />
          <div className="panel-copy">
            <p className="eyebrow" data-reveal>SUBJECT: ADA WONG</p>
            <h2 data-reveal>Always close.<br />Never captured.</h2>
            <p data-reveal>Her employers know only what she lets them know. Behind the red dress, measured smile, and impossible escapes is an operative guided by a private moral compass.</p>
            <div className="button-row" data-reveal>
              <a className="button primary shimmer-button" data-magnetic href="#legacy">Read her legacy <span>&rarr;</span></a>
              <a className="button dark" data-magnetic href="#archive">Browse operations</a>
            </div>
          </div>
        </div>
      </section>

      <section className="mission-banner" id="missions">
        <div className="mission-backdrop" />
        <div className="mission-glow" />
        <div className="mission-content">
          <p className="eyebrow" data-reveal>LATEST DECLASSIFIED FILE</p>
          <h2 data-reveal>Separate Ways.<br />A mission behind the mission.</h2>
          <p data-reveal>While Leon fights his way forward, Ada moves through the same nightmare with a different objective - and changes the outcome from the shadows.</p>
          <div className="tags" data-reveal><span>ESPIONAGE</span><span>PLAGA SAMPLE</span><span>HOOKSHOT</span><span>EXTRACTION</span></div>
        </div>
      </section>

      <section className="section archive-section" id="archive">
        <div className="archive-head" data-reveal>
          <div><p className="eyebrow">MISSION FOOTAGE</p><h2>Fragments from the field.</h2></div>
          <p>Every frame tells part of the truth. The rest is still classified.</p>
        </div>
        <div className="archive-grid">
          {missionFrames.map((frame, index) => (
            <button type="button" className={`archive-card archive-${index + 1} tilt-card`} data-reveal key={frame.image} style={{ "--delay": `${index * 90}ms` } as CSSProperties} onClick={() => setDetailView({ image: frame.image, title: frame.label, kicker: frame.detail, description: frame.description })} aria-haspopup="dialog">
              <img src={frame.image} alt={`Ada Wong mission footage: ${frame.label}`} loading="lazy" decoding="async" />
              <span className="archive-caption"><span>0{index + 1}</span><span><b>{frame.label}</b><small>{frame.detail}</small></span></span>
            </button>
          ))}
        </div>
      </section>

      <section className="section capability-section">
        <div className="section-heading align-left" data-reveal>
          <p className="eyebrow">FIELD CAPABILITIES</p>
          <h2>Built for the impossible.</h2>
          <p>Ada survives because every movement has a purpose and every secret has value.</p>
        </div>
        <div className="intel-strip">
          {intelFrames.map((item, index) => (
            <button type="button" className="intel-visual tilt-card" data-reveal key={item.image} style={{ "--intel-image": `url(${item.image})`, "--delay": `${index * 100}ms` } as CSSProperties} onClick={() => setDetailView({ image: item.image, title: item.title, kicker: item.kicker, description: item.detail })} aria-haspopup="dialog">
              <span>0{index + 1}</span><p>{item.title}</p>
            </button>
          ))}
        </div>
        <h2 className="subhead" data-reveal>Operational advantages</h2>
        <div className="card-grid capability-grid">
          {capabilities.map((item, index) => (
            <button type="button" className="capability-card" data-reveal key={item.title} style={{ "--capability-image": `url(${item.image})`, "--delay": `${(index % 3) * 80}ms` } as CSSProperties} onClick={() => setDetailView({ image: item.image, title: item.title, kicker: "OPERATIONAL ADVANTAGE", description: item.copy })} aria-haspopup="dialog">
              <span>0{index + 1}</span><h3>{item.title}</h3><p>{item.copy}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="section network-section">
        <div className="network-panel" data-reveal data-spotlight>
          <div className="network-backdrop" />
          <div className="card-spotlight" />
          <div className="network-content">
            <p className="eyebrow" data-reveal>KNOWN CONNECTIONS</p>
            <h2 data-reveal>Few allies. Fewer answers.</h2>
            <p data-reveal>Every relationship reveals a different version of Ada - and none reveal the whole truth.</p>
            <div className="connection-row" data-reveal>
              <a href="/james-bond/"><b>LSK</b><span><strong>Leon Kennedy</strong><small>Unfinished business</small></span></a>
              <a href="/arthur-morgan/"><b>WSK</b><span><strong>Albert Wesker</strong><small>Former employer</small></span></a>
              <a href="/captain-price/"><b>LS</b><span><strong>Luis Serra</strong><small>Field contact</small></span></a>
              <a href="/michael-santa/"><b>SM</b><span><strong>The Merchant</strong><small>Useful acquaintance</small></span></a>
            </div>
          </div>
        </div>
      </section>

      <section className="section legacy-section" id="legacy">
        <div className="faq-panel" id="faq" data-reveal>
          <div className="faq-backdrop" />
          <div className="faq-top">
            <div><p className="eyebrow">FIELD INTELLIGENCE</p><span>{String(faq + 1).padStart(2, "0")} / {String(faqs.length).padStart(2, "0")}</span></div>
            <div className="faq-arrows">
              <button onClick={() => changeFaq(-1)} aria-label="Previous question">&larr;</button>
              <button onClick={() => changeFaq(1)} aria-label="Next question">&rarr;</button>
            </div>
          </div>
          <div className="faq-content" key={faq}>
            <h2>{faqs[faq].q}</h2>
            <p>{faqs[faq].a}</p>
          </div>
          <div className="faq-bottom">
            <div className="dots" aria-label="Select a question">
              {faqs.map((item, index) => <button className={faq === index ? "selected" : ""} onClick={() => setFaq(index)} aria-label={item.q} key={item.q} />)}
            </div>
            <a className="shimmer-button" href="#top">Return to top &uarr;</a>
          </div>
        </div>
      </section>

      <UniversalFooter />

      {detailView && (
        <div className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="detail-title" onMouseDown={() => setDetailView(null)}>
          <div className="detail-modal-panel" onMouseDown={(event) => event.stopPropagation()}>
            <button className="detail-close" type="button" onClick={() => setDetailView(null)} aria-label="Close image details">&times;</button>
            <div className="detail-media"><img src={detailView.image} alt={detailView.title} /></div>
            <div className="detail-copy">
              <p className="eyebrow">{detailView.kicker}</p>
              <h2 id="detail-title">{detailView.title}</h2>
              <p>{detailView.description}</p>
              <button type="button" onClick={() => setDetailView(null)}>Return to archive <span>&rarr;</span></button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
