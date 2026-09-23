import { numeroSectionFormate } from '@/lib/sections'
import type { EnTeteSection } from '@/content'

/** En-tête de section façon chemin : [05] ~/realisations, puis titre et sous-titre. */
export function EnTeteB({ entete }: { entete: EnTeteSection }) {
  return (
    <header className="max-w-[70ch]">
      <p className="meta text-muted flex flex-wrap gap-x-3">
        <span className="text-accent">[{numeroSectionFormate(entete.ancre)}]</span>
        <span>
          <span aria-hidden="true">~/</span>
          {entete.ancre}
        </span>
        <span className="sr-only">{entete.label}</span>
      </p>
      <h2 className="titre text-h2 mt-3">{entete.titre}</h2>
      {entete.sousTitre && <p className="text-body text-muted mt-3">{entete.sousTitre}</p>}
    </header>
  )
}
