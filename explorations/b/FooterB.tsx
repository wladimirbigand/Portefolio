import { site } from '@/content'

/** Pied de page en ligne d'état. */
export function FooterB() {
  return (
    <footer className="border-line bg-surface border-t">
      <div className="meta text-muted mx-auto flex max-w-[1320px] flex-wrap justify-between gap-3 px-3 py-4 md:px-6">
        <p>{site.footer.copyright}</p>
        <p>{site.footer.signature}</p>
      </div>
    </footer>
  )
}
