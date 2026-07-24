import { UniversalFooter, UniversalHeader } from "@/components/site/UniversalShell";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-backdrop" aria-hidden="true" />
      <div className="not-found-grid" aria-hidden="true" />

      <UniversalHeader />

      <section className="not-found-content">
        <p className="eyebrow">FILE NOT FOUND</p>
        <p className="error-code" aria-hidden="true">404</p>
        <h1>This record does not exist.</h1>
        <p>The requested file may still be classified, may have moved, or may belong to an archive that has not yet been opened.</p>
        <div className="not-found-actions">
          <Link className="button primary" href="/">Return to Legacy <span>&rarr;</span></Link>
          <Link className="button secondary" href="/ada-wong/">Open Ada Wong</Link>
        </div>
      </section>

      <UniversalFooter />
    </main>
  );
}
