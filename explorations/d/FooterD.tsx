import { site } from '@/content'

/** Terminus : plaque inversée pleine largeur. */
export function FooterD() {
  return (
    <footer className="bg-fg text-bg">
      <div className="font-ui text-ui mx-auto flex max-w-[1280px] flex-wrap justify-between gap-4 px-4 py-10 md:px-10">
        <p className="fort">{site.footer.copyright}</p>
        <p>{site.footer.signature}</p>
      </div>
    </footer>
  )
}
