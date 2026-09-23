import { motion } from 'motion/react'
import { realisations, type Realisation } from '@/content'
import { estACompleter } from '@/lib/aCompleter'
import { ACompleter } from '../partage/ACompleter'
import { ancreFiche, ficheSamba } from '../partage/donnees'
import { useMotionPreset, variantsEntree } from '../partage/MotionPresetContext'
import { StatutB } from './StatutB'

const { libelles } = realisations

/** Une ligne de la liste façon `ls -l` ; les libellés de colonnes réapparaissent sur mobile. */
export function LigneRealisationB({ realisation }: { realisation: Realisation }) {
  const { preset } = useMotionPreset()
  const aUneFiche = realisation.id === ficheSamba.id
  return (
    <motion.li
      variants={variantsEntree(preset)}
      className="bg-surface transition-ui hover:bg-surface-2 grid gap-x-6 gap-y-2 px-4 py-4 md:grid-cols-[minmax(0,1fr)_9rem_11rem_11rem] md:items-baseline md:px-5"
    >
      <div>
        <h3 className="font-ui text-ui fort">
          {aUneFiche ? (
            <a
              href={`#${ancreFiche(realisation.id)}`}
              className="decoration-accent underline underline-offset-4"
            >
              {realisation.titre}
            </a>
          ) : (
            realisation.titre
          )}
        </h3>
        <p className="text-body text-muted mt-1">{realisation.resume}</p>
      </div>
      <p className="meta">
        <span className="text-muted md:sr-only">{libelles.cadre} : </span>
        {libelles.cadres[realisation.cadre]}
      </p>
      <p>
        <span className="meta text-muted md:sr-only">{libelles.statut} : </span>
        <StatutB statut={realisation.statut} note={realisation.noteStatut} />
      </p>
      <p className="meta">
        <span className="text-muted md:sr-only">{libelles.periode} : </span>
        {estACompleter(realisation.periode) ? <ACompleter /> : realisation.periode}
      </p>
    </motion.li>
  )
}
