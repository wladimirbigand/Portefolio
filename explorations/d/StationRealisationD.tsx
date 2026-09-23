import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { realisations, type Realisation } from '@/content'
import { estACompleter } from '@/lib/aCompleter'
import { ACompleter } from '../partage/ACompleter'
import { ancreFiche } from '../partage/donnees'
import { IconeStatut } from '../partage/IconeStatut'
import { useMotionPreset, variantsEntree } from '../partage/MotionPresetContext'
import { ArretStatutD } from './ArretStatutD'
import { PastilleCadreD } from './PastilleCadreD'
import { ANNEAU_CADRE } from './teintesCadre'

const { libelles } = realisations

type Props = { realisation: Realisation; principale: boolean }

/** Une réalisation = un arrêt sur l'embranchement, avec sa plaque. */
export function StationRealisationD({ realisation, principale }: Props) {
  const { preset } = useMotionPreset()
  return (
    <motion.li
      variants={variantsEntree(preset)}
      className="relative grid grid-cols-[2.5rem_1fr] items-start gap-3 md:gap-5"
    >
      <span className="relative z-10 mt-7 grid place-items-center">
        <ArretStatutD statut={realisation.statut} />
      </span>
      <div
        className={`bg-surface rounded-[20px] p-6 md:p-8 ${principale ? `ring-4 ${ANNEAU_CADRE[realisation.cadre]}` : ''}`}
      >
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="meta inline-flex items-center gap-2">
            <PastilleCadreD cadre={realisation.cadre} />
            {libelles.cadres[realisation.cadre]}
          </span>
          <span className="meta text-muted inline-flex items-center gap-1.5">
            <IconeStatut statut={realisation.statut} size={18} />
            {libelles.statuts[realisation.statut]}
            {realisation.noteStatut && `, ${realisation.noteStatut.toLowerCase()}`}
          </span>
        </div>
        <h3 className={`titre mt-3 ${principale ? 'text-h2' : 'text-h3'}`}>{realisation.titre}</h3>
        <p className="text-body mt-3 max-w-[60ch]">{realisation.resume}</p>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <p className="meta text-muted">
            <span className="sr-only">{libelles.periode} : </span>
            {estACompleter(realisation.periode) ? <ACompleter /> : realisation.periode}
          </p>
          {principale && (
            <a
              href={`#${ancreFiche(realisation.id)}`}
              className="bg-accent-fill font-ui text-ui fort text-on-accent-fill transition-ui inline-flex h-12 items-center gap-2 rounded-full px-5 hover:opacity-90"
            >
              {libelles.voirFiche}
              <ArrowRight aria-hidden="true" size={18} />
            </a>
          )}
        </div>
      </div>
    </motion.li>
  )
}
