export default function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-backdrop" aria-hidden="true" />
      <div className="not-found-grid" aria-hidden="true" />

      <header className="nav-shell not-found-nav">
        <a className="brand-mark brand-image" href="/" aria-label="The Secretary legacy home"><img src="/assets/brand/secretary-mark.png" alt="" /></a>
        <span className="not-found-label">CLASSIFIED ARCHIVE</span>
        <a className="nav-action" href="/forum/" aria-label="Open the forum"><span>+</span></a>
      </header>

      <section className="not-found-content">
        <p className="eyebrow">FILE NOT FOUND</p>
        <p className="error-code" aria-hidden="true">404</p>
        <h1>This record does not exist.</h1>
        <p>The requested file may still be classified, may have moved, or may belong to an archive that has not yet been opened.</p>
        <div className="not-found-actions">
          <a className="button primary" href="/">Return to Legacy <span>&rarr;</span></a>
          <a className="button secondary" href="/ada-wong/">Open Ada Wong</a>
        </div>
      </section>

      <div className="not-found-footer">
        <span>&copy; 2026 The Secretary.</span>
        <span>Unofficial character archive.</span>
      </div>
    </main>
  );
}
