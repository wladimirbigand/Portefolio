import { realisations, type Realisation } from '@/content'
import { estACompleter } from '@/lib/aCompleter'
import { ACompleter } from '../partage/ACompleter'

const { libelles } = realisations

/** Ligne de métadonnées éditoriale : cadre, statut, période. */
export function MetaRealisationC({ realisation }: { realisation: Realisation }) {
  return (
    <p className="meta text-muted flex flex-wrap items-center gap-x-2">
      <span>{libelles.cadres[realisation.cadre]}</span>
      <span aria-hidden="true">·</span>
      <span>
        <span className="sr-only">{libelles.statut} : </span>
        {libelles.statuts[realisation.statut]}
        {realisation.noteStatut && ` (${realisation.noteStatut.toLowerCase()})`}
      </span>
      <span aria-hidden="true">·</span>
      <span>
        <span className="sr-only">{libelles.periode} : </span>
        {estACompleter(realisation.periode) ? <ACompleter /> : realisation.periode}
      </span>
    </p>
  )
}
