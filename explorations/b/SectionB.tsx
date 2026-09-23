import { motion } from 'motion/react'
import type { SectionPage } from '../partage/donnees'
import { libellesExploration } from '../partage/libelles'
import { useMotionPreset, variantsEntree } from '../partage/MotionPresetContext'
import { EnTeteB } from './EnTeteB'

/** Section hors périmètre du prototype : seul son en-tête (contenu réel) est affiché. */
export function SectionB({ section }: { section: SectionPage }) {
  const { preset } = useMotionPreset()
  return (
    <section id={section.ancre} className="mx-auto max-w-[1320px] px-3 py-12 md:px-6">
      <motion.div
        variants={variantsEntree(preset)}
        initial="cache"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        className="border-line border-t pt-8"
      >
        <EnTeteB entete={section.entete} />
        <p className="meta text-muted mt-4">{libellesExploration.sectionNonPrototypee}</p>
      </motion.div>
    </section>
  )
}
