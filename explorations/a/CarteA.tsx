import { ArrowRight } from 'lucide-react'
import { realisations, type Realisation } from '@/content'
import { estACompleter } from '@/lib/aCompleter'
import { ACompleter } from '../partage/ACompleter'
import { ancreFiche } from '../partage/donnees'
import { IconeStatut } from '../partage/IconeStatut'

const { libelles } = realisations

type Props = { realisation: Realisation; principale: boolean }

/** Contenu d'une cellule du bento ; la cellule principale montre aussi la stack et le lien vers la fiche. */
export function CarteA({ realisation, principale }: Props) {
  return (
    <>
      <div className="meta text-muted flex flex-wrap items-center gap-x-4 gap-y-1">
        <span>{libelles.cadres[realisation.cadre]}</span>
        <span className="inline-flex items-center gap-1.5">
          <IconeStatut statut={realisation.statut} size={16} />
          {libelles.statuts[realisation.statut]}
          {realisation.noteStatut && ` · ${realisation.noteStatut}`}
        </span>
      </div>
      <h3 className={`titre mt-3 ${principale ? 'text-h2' : 'text-h3'}`}>{realisation.titre}</h3>
      <p className="text-body text-muted mt-3">{realisation.resume}</p>
      {principale && (
        <ul className="mt-6 flex flex-wrap gap-2" aria-label={libelles.stack}>
          {realisation.stack.map((outil) => (
            <li
              key={outil}
              translate="no"
              className="border-line bg-surface font-code text-meta rounded-md border px-2.5 py-1"
            >
              {outil}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-6">
        <p className="meta text-muted">
          <span className="sr-only">{libelles.periode} : </span>
          {estACompleter(realisation.periode) ? <ACompleter /> : realisation.periode}
        </p>
        {principale && (
          <a
            href={`#${ancreFiche(realisation.id)}`}
            className="bg-accent-fill font-ui text-ui fort text-on-accent-fill transition-ui inline-flex h-11 items-center gap-2 rounded-lg px-4 hover:opacity-90"
          >
            {libelles.voirFiche}
            <ArrowRight aria-hidden="true" size={18} />
          </a>
        )}
      </div>
    </>
  )
}
