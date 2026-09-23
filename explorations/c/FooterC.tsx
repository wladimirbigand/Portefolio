import { site } from '@/content'

/** Colophon. */
export function FooterC() {
  return (
    <footer className="border-rule border-t px-5 py-12 md:px-[8vw]">
      <div className="font-ui text-ui text-muted flex max-w-[76rem] flex-wrap justify-between gap-4">
        <p>{site.footer.copyright}</p>
        <p className="accent-style font-body">{site.footer.signature}</p>
      </div>
    </footer>
  )
}
