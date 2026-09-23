import type { SectionPage } from '../partage/donnees'
import { libellesExploration } from '../partage/libelles'
import { EnTeteStationD } from './EnTeteStationD'

/** Section hors périmètre du prototype : la station et son en-tête (contenu réel) seulement. */
export function SectionD({ section }: { section: SectionPage }) {
  return (
    <section id={section.ancre} className="py-16 md:py-20">
      <EnTeteStationD entete={section.entete} />
      <p className="meta text-muted mt-5">{libellesExploration.sectionNonPrototypee}</p>
    </section>
  )
}
