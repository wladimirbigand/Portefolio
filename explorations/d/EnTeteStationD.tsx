import type { EnTeteSection } from '@/content'
import { numeroSectionFormate } from '@/lib/sections'
import { StationD } from './StationD'

/** En-tête de section = station : pastille numérotée sur la ligne, nom de station, sous-titre. */
export function EnTeteStationD({ entete }: { entete: EnTeteSection }) {
  return (
    <header className="relative max-w-[62ch]">
      <StationD numero={numeroSectionFormate(entete.ancre)} className="top-0 md:-top-1" />
      <p className="meta text-muted">{entete.label}</p>
      <h2 className="titre text-h2 mt-1">{entete.titre}</h2>
      {entete.sousTitre && <p className="text-body text-muted mt-4">{entete.sousTitre}</p>}
    </header>
  )
}
