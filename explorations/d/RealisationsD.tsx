import { motion } from 'motion/react'
import { realisations } from '@/content'
import { cadresUtilises, realisationsMisesEnAvant } from '../partage/donnees'
import { useMotionPreset, variantsGroupe } from '../partage/MotionPresetContext'
import { EnTeteStationD } from './EnTeteStationD'
import { PastilleCadreD } from './PastilleCadreD'
import { StationRealisationD } from './StationRealisationD'

const { section, libelles } = realisations

/**
 * Aperçu des réalisations : un embranchement de la ligne principale, un arrêt par réalisation.
 * La légende ne montre que les lignes (cadres) qui ont au moins une réalisation.
 */
export function RealisationsD() {
  const { preset } = useMotionPreset()
  return (
    <section id={section.ancre} className="py-20 md:py-28">
      <EnTeteStationD entete={section} />

      <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3" aria-label={libelles.cadre}>
        {cadresUtilises.map((cadre) => (
          <li key={cadre} className="meta inline-flex items-center gap-2">
            <PastilleCadreD cadre={cadre} />
            {libelles.cadres[cadre]}
          </li>
        ))}
      </ul>

      <div className="relative mt-10">
        <span
          aria-hidden="true"
          className="bg-fg absolute top-8 bottom-8 left-5 w-1 -translate-x-1/2 rounded-full"
        />
        <motion.ol
          variants={variantsGroupe(preset)}
          initial="cache"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="relative grid gap-4"
        >
          {realisationsMisesEnAvant.map((realisation, index) => (
            <StationRealisationD
              key={realisation.id}
              realisation={realisation}
              principale={index === 0}
            />
          ))}
        </motion.ol>
      </div>
    </section>
  )
}
