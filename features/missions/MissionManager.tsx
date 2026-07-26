"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { createBlankMission, createMissionBlock, staticAdaMission } from "./missionData";
import { deleteMission, fetchOwnerMissions, requestMissionDeployment, saveMission, uploadMissionImage } from "./missionClient";
import { MISSION_EXCERPT_LIMIT, MISSION_NAME_LIMIT, MISSION_UPLOAD_LIMIT, createId, toMissionSlug, type MissionBlock, type MissionButton, type MissionCard, type MissionFaq, type MissionLink, type MissionRecord, type MissionStat } from "./missionTypes";

const blockNames: Record<MissionBlock["type"], string> = { marquee: "Marquee", cards: "Dossier cards", stats: "Statistics", feature: "Image feature", banner: "Cinematic banner", gallery: "Mission footage", capabilities: "Capabilities", connections: "Connections", faq: "FAQ intelligence" };

function Field({ label, value, onChange, multiline = false, placeholder, limit }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean; placeholder?: string; limit?: number }) {
  return <label>{label}{limit && <small>{value.length}/{limit}</small>}{multiline ? <textarea value={value} maxLength={limit} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} /> : <input value={value} maxLength={limit} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />}</label>;
}

function ImageField({ label, value, onChange, onUpload, busy }: { label: string; value: string; onChange: (value: string) => void; onUpload: (file: File) => void; busy: boolean }) {
  return <div className="mission-image-field"><Field label={`${label} URL`} value={value} onChange={onChange} placeholder="/assets/... or uploaded image URL" /><label className="developer-file">Upload {label}<input type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={(event) => { const file = event.target.files?.[0]; if (file) onUpload(file); event.currentTarget.value = ""; }} /><span>{busy ? "Uploading…" : "Choose JPG, PNG, or WebP"}</span></label>{value && <img src={value} alt="" />}</div>;
}

function SmallActions({ onDelete }: { onDelete: () => void }) { return <button className="mission-mini-delete" type="button" onClick={onDelete}>Remove</button>; }

function StatsEditor({ items, onChange }: { items: MissionStat[]; onChange: (items: MissionStat[]) => void }) {
  return <div className="mission-nested-list">{items.map((item, index) => <fieldset key={index}><legend>Stat {index + 1}</legend><Field label="Value" value={item.value} onChange={(value) => onChange(items.map((entry, i) => i === index ? { ...entry, value } : entry))} /><Field label="Label" value={item.label} onChange={(label) => onChange(items.map((entry, i) => i === index ? { ...entry, label } : entry))} /><SmallActions onDelete={() => onChange(items.filter((_, i) => i !== index))} /></fieldset>)}<button className="mission-add-nested" type="button" onClick={() => onChange([...items, { value: "NEW", label: "STAT" }])}>+ Add statistic</button></div>;
}

function ButtonsEditor({ items, onChange }: { items: MissionButton[]; onChange: (items: MissionButton[]) => void }) {
  return <div className="mission-nested-list">{items.map((item, index) => <fieldset key={index}><legend>Button {index + 1}</legend><Field label="Text" value={item.label} onChange={(label) => onChange(items.map((entry, i) => i === index ? { ...entry, label } : entry))} /><Field label="URL or section" value={item.href} onChange={(href) => onChange(items.map((entry, i) => i === index ? { ...entry, href } : entry))} /><label>Fixed style<select value={item.tone} onChange={(event) => onChange(items.map((entry, i) => i === index ? { ...entry, tone: event.target.value as MissionButton["tone"] } : entry))}><option value="primary">Primary</option><option value="secondary">Secondary</option><option value="dark">Dark</option></select></label><SmallActions onDelete={() => onChange(items.filter((_, i) => i !== index))} /></fieldset>)}<button className="mission-add-nested" type="button" onClick={() => onChange([...items, { label: "Explore", href: "#", tone: "primary" }])}>+ Add button</button></div>;
}

function CardsEditor({ items, onChange, upload }: { items: MissionCard[]; onChange: (items: MissionCard[]) => void; upload: (file: File, done: (url: string) => void) => void }) {
  const update = (index: number, patch: Partial<MissionCard>) => onChange(items.map((item, i) => i === index ? { ...item, ...patch } : item));
  return <div className="mission-nested-list">{items.map((item, index) => <fieldset key={item.id}><legend>Card {index + 1}</legend><Field label="Title" value={item.title} onChange={(title) => update(index, { title })} /><Field label="Kicker" value={item.kicker} onChange={(kicker) => update(index, { kicker })} /><Field label="Visible text" value={item.body} multiline onChange={(body) => update(index, { body })} /><Field label="Popup text" value={item.caption || ""} multiline onChange={(caption) => update(index, { caption })} /><ImageField label="Image" value={item.image} onChange={(image) => update(index, { image })} onUpload={(file) => upload(file, (image) => update(index, { image }))} busy={false} /><SmallActions onDelete={() => onChange(items.filter((_, i) => i !== index))} /></fieldset>)}<button className="mission-add-nested" type="button" onClick={() => onChange([...items, { id: createId("card"), title: "New file", kicker: "CLASSIFIED", body: "Add the visible card description.", caption: "Add the complete popup description.", image: "" }])}>+ Add card</button></div>;
}

function ConnectionsEditor({ items, onChange }: { items: MissionLink[]; onChange: (items: MissionLink[]) => void }) {
  const update = (index: number, patch: Partial<MissionLink>) => onChange(items.map((item, i) => i === index ? { ...item, ...patch } : item));
  return <div className="mission-nested-list">{items.map((item, index) => <fieldset key={item.id}><legend>Connection {index + 1}</legend><Field label="Name" value={item.title} onChange={(title) => update(index, { title })} /><Field label="Relationship" value={item.kicker} onChange={(kicker) => update(index, { kicker })} /><Field label="Initials" value={item.initials || ""} onChange={(initials) => update(index, { initials })} /><Field label="URL" value={item.href} onChange={(href) => update(index, { href })} /><SmallActions onDelete={() => onChange(items.filter((_, i) => i !== index))} /></fieldset>)}<button className="mission-add-nested" type="button" onClick={() => onChange([...items, { id: createId("link"), title: "New connection", kicker: "Unknown relationship", body: "", image: "", href: "#", initials: "NC" }])}>+ Add connection</button></div>;
}

function FaqEditor({ items, onChange }: { items: MissionFaq[]; onChange: (items: MissionFaq[]) => void }) {
  const update = (index: number, patch: Partial<MissionFaq>) => onChange(items.map((item, i) => i === index ? { ...item, ...patch } : item));
  return <div className="mission-nested-list">{items.map((item, index) => <fieldset key={item.id}><legend>Question {index + 1}</legend><Field label="Question" value={item.question} onChange={(question) => update(index, { question })} /><Field label="Answer" value={item.answer} multiline onChange={(answer) => update(index, { answer })} /><SmallActions onDelete={() => onChange(items.filter((_, i) => i !== index))} /></fieldset>)}<button className="mission-add-nested" type="button" onClick={() => onChange([...items, { id: createId("faq"), question: "New question", answer: "Add the answer here." }])}>+ Add question</button></div>;
}

function CanvasPreview({ mission, selected, onSelect }: { mission: MissionRecord; selected: string | null; onSelect: (id: string | null) => void }) {
  return <div className="mission-canvas"><button type="button" className={!selected ? "selected" : ""} onClick={() => onSelect(null)}><div className="mission-canvas-hero" style={{ backgroundImage: `linear-gradient(90deg,rgba(4,5,8,.96),rgba(4,5,8,.2)),url('${mission.hero.image || mission.cover_url || "/assets/portfolio/hero-legacy.webp"}')` }}><small>{mission.hero.eyebrow}</small><strong>{mission.hero.title}</strong><span>{mission.hero.lede}</span></div></button>{mission.blocks.map((block, index) => <button type="button" key={block.id} className={selected === block.id ? "selected" : ""} onClick={() => onSelect(block.id)}><div className={`mission-canvas-block canvas-${block.type}`}><span>{String(index + 1).padStart(2, "0")}</span><small>{blockNames[block.type]}</small><strong>{"title" in block ? block.title : block.type === "marquee" ? block.items.join(" • ") : block.type === "stats" ? `${block.items.length} statistics` : `${block.items.length} questions`}</strong></div></button>)}</div>;
}

function Inspector({ mission, selected, updateMission, updateBlock, upload }: { mission: MissionRecord; selected: string | null; updateMission: (patch: Partial<MissionRecord>) => void; updateBlock: (id: string, block: MissionBlock) => void; upload: (file: File, done: (url: string, storagePath?: string) => void) => void }) {
  const block = mission.blocks.find((item) => item.id === selected);
  if (!block) return <div className="mission-inspector"><p className="eyebrow">PAGE SETTINGS</p><h3>Mission and hero</h3><Field label="Mission name" value={mission.name} limit={MISSION_NAME_LIMIT} onChange={(name) => updateMission({ name })} /><Field label="URL slug" value={mission.slug} onChange={(slug) => updateMission({ slug: toMissionSlug(slug) })} /><Field label="Archive description" value={mission.excerpt} multiline limit={MISSION_EXCERPT_LIMIT} onChange={(excerpt) => updateMission({ excerpt })} /><ImageField label="Cover" value={mission.cover_url} onChange={(cover_url) => updateMission({ cover_url })} onUpload={(file) => upload(file, (cover_url, cover_storage_path) => updateMission({ cover_url, cover_storage_path }))} busy={false} /><hr /><Field label="Status badge" value={mission.hero.status} onChange={(status) => updateMission({ hero: { ...mission.hero, status } })} /><Field label="Eyebrow" value={mission.hero.eyebrow} onChange={(eyebrow) => updateMission({ hero: { ...mission.hero, eyebrow } })} /><Field label="Hero title" value={mission.hero.title} multiline onChange={(title) => updateMission({ hero: { ...mission.hero, title } })} /><Field label="Hero introduction" value={mission.hero.lede} multiline onChange={(lede) => updateMission({ hero: { ...mission.hero, lede } })} /><ImageField label="Hero" value={mission.hero.image} onChange={(image) => updateMission({ hero: { ...mission.hero, image } })} onUpload={(file) => upload(file, (image) => updateMission({ hero: { ...mission.hero, image } }))} busy={false} /><h4>Hero buttons</h4><ButtonsEditor items={mission.hero.buttons} onChange={(buttons) => updateMission({ hero: { ...mission.hero, buttons } })} /><h4>Hero statistics</h4><StatsEditor items={mission.hero.stats} onChange={(stats) => updateMission({ hero: { ...mission.hero, stats } })} /></div>;

  const replace = (next: MissionBlock) => updateBlock(block.id, next);
  const heading = (children?: ReactNode) => <><p className="eyebrow">WIDGET SETTINGS</p><h3>{blockNames[block.type]}</h3>{children}</>;
  if (block.type === "marquee") return <div className="mission-inspector">{heading()}<Field label="Items — one per line" value={block.items.join("\n")} multiline onChange={(value) => replace({ ...block, items: value.split("\n").map((item) => item.trim()).filter(Boolean) })} /></div>;
  if (block.type === "stats") return <div className="mission-inspector">{heading()}<StatsEditor items={block.items} onChange={(items) => replace({ ...block, items })} /></div>;
  if (block.type === "feature") return <div className="mission-inspector">{heading()}<Field label="Eyebrow" value={block.eyebrow} onChange={(eyebrow) => replace({ ...block, eyebrow })} /><Field label="Heading" value={block.title} multiline onChange={(title) => replace({ ...block, title })} /><Field label="Body" value={block.body} multiline onChange={(body) => replace({ ...block, body })} /><ImageField label="Background" value={block.image} onChange={(image) => replace({ ...block, image })} onUpload={(file) => upload(file, (image) => replace({ ...block, image }))} busy={false} /><ButtonsEditor items={block.buttons} onChange={(buttons) => replace({ ...block, buttons })} /></div>;
  if (block.type === "banner") return <div className="mission-inspector">{heading()}<Field label="Eyebrow" value={block.eyebrow} onChange={(eyebrow) => replace({ ...block, eyebrow })} /><Field label="Heading" value={block.title} multiline onChange={(title) => replace({ ...block, title })} /><Field label="Body" value={block.body} multiline onChange={(body) => replace({ ...block, body })} /><ImageField label="Background" value={block.image} onChange={(image) => replace({ ...block, image })} onUpload={(file) => upload(file, (image) => replace({ ...block, image }))} busy={false} /><Field label="Tags — one per line" value={block.tags.join("\n")} multiline onChange={(value) => replace({ ...block, tags: value.split("\n").map((tag) => tag.trim()).filter(Boolean) })} /></div>;
  if (block.type === "connections") return <div className="mission-inspector">{heading()}<Field label="Eyebrow" value={block.eyebrow} onChange={(eyebrow) => replace({ ...block, eyebrow })} /><Field label="Heading" value={block.title} onChange={(title) => replace({ ...block, title })} /><Field label="Introduction" value={block.intro} multiline onChange={(intro) => replace({ ...block, intro })} /><ImageField label="Background" value={block.image} onChange={(image) => replace({ ...block, image })} onUpload={(file) => upload(file, (image) => replace({ ...block, image }))} busy={false} /><ConnectionsEditor items={block.items} onChange={(items) => replace({ ...block, items })} /></div>;
  if (block.type === "faq") return <div className="mission-inspector">{heading()}<Field label="Eyebrow" value={block.eyebrow} onChange={(eyebrow) => replace({ ...block, eyebrow })} /><ImageField label="Background" value={block.image} onChange={(image) => replace({ ...block, image })} onUpload={(file) => upload(file, (image) => replace({ ...block, image }))} busy={false} /><FaqEditor items={block.items} onChange={(items) => replace({ ...block, items })} /></div>;
  const common = <><Field label="Eyebrow" value={block.eyebrow} onChange={(eyebrow) => replace({ ...block, eyebrow } as MissionBlock)} /><Field label="Heading" value={block.title} onChange={(title) => replace({ ...block, title } as MissionBlock)} /><Field label="Introduction" value={block.intro} multiline onChange={(intro) => replace({ ...block, intro } as MissionBlock)} /></>;
  if (block.type === "capabilities") return <div className="mission-inspector">{heading()}{common}<h4>Large visual cards</h4><CardsEditor items={block.visuals} onChange={(visuals) => replace({ ...block, visuals })} upload={upload} /><h4>Capability cards</h4><CardsEditor items={block.items} onChange={(items) => replace({ ...block, items })} upload={upload} /></div>;
  return <div className="mission-inspector">{heading()}{common}<CardsEditor items={block.items} onChange={(items) => replace({ ...block, items } as MissionBlock)} upload={upload} /></div>;
}

export default function MissionManager() {
  const [missions, setMissions] = useState<MissionRecord[]>([]);
  const [draft, setDraft] = useState<MissionRecord | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [busy, setBusy] = useState<string | null>("load");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const reload = async () => { setMissions(await fetchOwnerMissions()); };
  useEffect(() => { void reload().catch((reason) => setError(reason instanceof Error ? reason.message : "Missions could not be loaded.")).finally(() => setBusy(null)); }, []);
  const selectedBlock = useMemo(() => draft?.blocks.find((block) => block.id === selected) ?? null, [draft, selected]);

  const create = async () => {
    if (!newName.trim()) return;
    setBusy("create"); setError(null);
    try { const mission = createBlankMission(newName.trim()); const saved = await saveMission(mission); setDraft(saved); setSelected(null); setCreating(false); setNewName(""); await reload(); setMessage("Blank mission created. Add widgets when you are ready."); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "The mission could not be created."); }
    finally { setBusy(null); }
  };

  const persist = async (status: "draft" | "published") => {
    if (!draft) return;
    if (!draft.name.trim() || !draft.slug.trim()) { setError("Mission name and URL slug are required."); return; }
    setBusy(status); setError(null); setMessage(null);
    try {
      const saved = await saveMission({ ...draft, name: draft.name.trim(), slug: toMissionSlug(draft.slug), status });
      setDraft(saved); await reload();
      if (status === "published") {
        try { await requestMissionDeployment(); setMessage("Mission published. A fresh GitHub Pages build has been requested."); }
        catch { setMessage("Mission published. Deploy the publish-mission Edge Function to trigger GitHub Pages automatically; a normal push also rebuilds it."); }
      } else setMessage("Draft saved securely.");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "The mission could not be saved."); }
    finally { setBusy(null); }
  };

  const remove = async (mission: MissionRecord) => {
    if (mission.id === staticAdaMission.id) { setError("Ada Wong is the built-in mission and cannot be deleted. You can fully edit and republish it."); return; }
    if (!window.confirm(`Delete “${mission.name}”? This cannot be undone.`)) return;
    setBusy(`delete-${mission.id}`); try { await deleteMission(mission); await reload(); setMessage(`Deleted “${mission.name}”.`); } catch (reason) { setError(reason instanceof Error ? reason.message : "The mission could not be deleted."); } finally { setBusy(null); }
  };

  const upload = async (file: File, done: (url: string, storagePath?: string) => void) => {
    if (!file.type.startsWith("image/") || file.size > MISSION_UPLOAD_LIMIT) { setError("Use a JPG, PNG, or WebP image no larger than 10 MB."); return; }
    setBusy("upload"); setError(null);
    try { const result = await uploadMissionImage(file); done(result.imageUrl, result.storagePath); setMessage("Image uploaded and placed into the selected field."); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "The image could not be uploaded."); }
    finally { setBusy(null); }
  };

  const updateBlock = (id: string, next: MissionBlock) => setDraft((current) => current ? { ...current, blocks: current.blocks.map((block) => block.id === id ? next : block) } : current);
  const moveBlock = (from: number, to: number) => setDraft((current) => { if (!current || to < 0 || to >= current.blocks.length) return current; const blocks = [...current.blocks]; const [item] = blocks.splice(from, 1); blocks.splice(to, 0, item); return { ...current, blocks }; });

  if (!draft) return <section className="mission-manager"><div className="mission-manager-head"><div><p className="eyebrow">MISSION BUILDER</p><h2>Build living dossiers.</h2><p>Create a page from locked cinematic widgets. The global theme, navigation, footer, motion, and responsive rules cannot be changed.</p></div><button className="mission-create-button" type="button" onClick={() => setCreating(true)}>+ Create mission</button></div>{message && <p className="developer-message success">{message}</p>}{error && <p className="developer-message error">{error}</p>}{creating && <div className="mission-create-panel"><Field label="Mission name" value={newName} limit={MISSION_NAME_LIMIT} onChange={setNewName} placeholder="Ada Wong" /><p>URL preview: <code>/missions/{toMissionSlug(newName) || "mission-name"}/</code></p><div><button type="button" onClick={() => setCreating(false)}>Cancel</button><button type="button" onClick={() => void create()} disabled={busy === "create"}>Create blank mission</button></div></div>}<div className="mission-manager-grid">{missions.map((mission) => <article key={mission.id}><img src={mission.cover_url || mission.hero.image || "/assets/portfolio/hero-legacy.webp"} alt="" /><div><span className={`mission-status ${mission.status}`}>{mission.status}</span><h3>{mission.name}</h3><p>{mission.excerpt}</p><small>/missions/{mission.slug}/</small><div><button type="button" onClick={() => { setDraft(structuredClone(mission)); setSelected(null); setMessage(null); setError(null); }}>Open builder</button>{mission.status === "published" && <a href={`/missions/${mission.slug}/`} target="_blank" rel="noreferrer">View page ↗</a>}<button className="danger" type="button" disabled={busy === `delete-${mission.id}` || mission.id === staticAdaMission.id} onClick={() => void remove(mission)}>Delete</button></div></div></article>)}</div>{busy === "load" && <p className="developer-loading">Loading mission files…</p>}</section>;

  return <section className="mission-builder"><div className="mission-builder-bar"><button type="button" onClick={() => { setDraft(null); setSelected(null); }}>← All missions</button><div><span className={`mission-status ${draft.status}`}>{draft.status}</span><strong>{draft.name}</strong><small>/missions/{draft.slug}/</small></div><div><button type="button" onClick={() => void persist("draft")} disabled={Boolean(busy)}>Save draft</button><button className="publish" type="button" onClick={() => void persist("published")} disabled={Boolean(busy)}>{busy === "published" ? "Publishing…" : "Publish"}</button></div></div>{message && <p className="developer-message success">{message}</p>}{error && <p className="developer-message error">{error}</p>}<div className="mission-builder-layout"><aside className="mission-block-library"><p className="eyebrow">WIDGETS</p><h3>Add section</h3>{(Object.keys(blockNames) as MissionBlock["type"][]).map((type) => <button type="button" key={type} onClick={() => { const block = createMissionBlock(type); setDraft({ ...draft, blocks: [...draft.blocks, block] }); setSelected(block.id); }}>{blockNames[type]}<span>+</span></button>)}<hr /><p className="eyebrow">PAGE ORDER</p><button type="button" className={!selected ? "active" : ""} onClick={() => setSelected(null)}>Hero & page settings</button>{draft.blocks.map((block, index) => <div key={block.id} draggable onDragStart={() => setDragIndex(index)} onDragOver={(event) => event.preventDefault()} onDrop={() => { if (dragIndex !== null) moveBlock(dragIndex, index); setDragIndex(null); }} className={selected === block.id ? "active" : ""}><button type="button" onClick={() => setSelected(block.id)}>{String(index + 1).padStart(2, "0")} {blockNames[block.type]}</button><span><button type="button" aria-label="Move up" onClick={() => moveBlock(index, index - 1)}>↑</button><button type="button" aria-label="Move down" onClick={() => moveBlock(index, index + 1)}>↓</button><button type="button" aria-label="Duplicate" onClick={() => { const copy = { ...structuredClone(block), id: createId(block.type) } as MissionBlock; const blocks = [...draft.blocks]; blocks.splice(index + 1, 0, copy); setDraft({ ...draft, blocks }); setSelected(copy.id); }}>⧉</button><button type="button" aria-label="Remove" onClick={() => { setDraft({ ...draft, blocks: draft.blocks.filter((item) => item.id !== block.id) }); setSelected(null); }}>×</button></span></div>)}</aside><div className="mission-builder-canvas"><div className="mission-canvas-toolbar"><span>LIVE STRUCTURE PREVIEW</span><small>Click any section to edit it</small></div><CanvasPreview mission={draft} selected={selected} onSelect={setSelected} /></div><Inspector mission={draft} selected={selectedBlock?.id ?? null} updateMission={(patch) => setDraft({ ...draft, ...patch })} updateBlock={updateBlock} upload={upload} /></div></section>;
}

