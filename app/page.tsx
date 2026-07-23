export default function ArchiveIndex() {
  return (
    <main className="not-found-page archive-index-page">
      <header className="nav-shell not-found-nav">
        <span className="brand-mark brand-image" aria-hidden="true">
          <img src="/assets/brand/secretary-mark.png" alt="" />
        </span>
        <span className="not-found-label">THE SECRETARY ARCHIVES</span>
        <a className="nav-action" href="/forum/" aria-label="Open the forum"><span>+</span></a>
      </header>

      <div className="not-found-backdrop archive-index-backdrop" aria-hidden="true" />
      <div className="not-found-grid" aria-hidden="true" />

      <section className="not-found-content archive-index-content">
        <p className="eyebrow">ARCHIVE INDEX</p>
        <p className="archive-index-code">01</p>
        <h1>One dossier is open.</h1>
        <p>
          The archive is expanding. Enter the first classified profile now, then return as new
          operatives, legends, and assignments are brought online.
        </p>
        <div className="not-found-actions">
          <a className="button primary" href="/ada-wong/">Open Ada Wong <span>&rarr;</span></a>
          <a className="button secondary" href="https://thesecretary.xyz/" target="_blank" rel="noreferrer">Visit The Secretary</a>
        </div>
      </section>

      <div className="not-found-footer">
        <span>&copy; 2026 The Secretary</span>
        <span>More archives coming soon</span>
      </div>
    </main>
  );
}
