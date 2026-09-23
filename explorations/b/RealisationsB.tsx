import { motion } from 'motion/react'
import { realisations } from '@/content'
import { realisationsMisesEnAvant } from '../partage/donnees'
import { useMotionPreset, variantsGroupe } from '../partage/MotionPresetContext'
import { EnTeteB } from './EnTeteB'
import { LigneRealisationB } from './LigneRealisationB'

const { section, libelles } = realisations

/** Aperçu des réalisations : liste dense à colonnes, comme un listing de répertoire. */
export function RealisationsB() {
  const { preset } = useMotionPreset()
  return (
    <section id={section.ancre} className="mx-auto max-w-[1320px] px-3 py-16 md:px-6">
      <EnTeteB entete={section} />
      <div className="border-line mt-8 border">
        <div
          aria-hidden="true"
          className="meta border-line bg-surface-2 text-muted hidden grid-cols-[minmax(0,1fr)_9rem_11rem_11rem] gap-x-6 border-b px-5 py-2 md:grid"
        >
          <span>{section.label}</span>
          <span>{libelles.cadre}</span>
          <span>{libelles.statut}</span>
          <span>{libelles.periode}</span>
        </div>
        <motion.ul
          variants={variantsGroupe(preset)}
          initial="cache"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="bg-line grid gap-px"
        >
          {realisationsMisesEnAvant.map((realisation) => (
            <LigneRealisationB key={realisation.id} realisation={realisation} />
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
