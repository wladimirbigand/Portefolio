import { site } from '@/content'

export function FooterA() {
  return (
    <footer className="border-rule border-t">
      <div className="text-muted mx-auto flex max-w-[1200px] flex-wrap justify-between gap-4 px-5 py-10 md:px-10">
        <p>{site.footer.copyright}</p>
        <p>{site.footer.signature}</p>
      </div>
    </footer>
  )
}
