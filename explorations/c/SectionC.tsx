import { motion } from 'motion/react'
import type { SectionPage } from '../partage/donnees'
import { libellesExploration } from '../partage/libelles'
import { useMotionPreset, variantsEntree } from '../partage/MotionPresetContext'

/** Section hors périmètre du prototype : seul son en-tête (contenu réel) est affiché. */
export function SectionC({ section }: { section: SectionPage }) {
  const { preset } = useMotionPreset()
  return (
    <section id={section.ancre} className="px-5 py-20 md:px-[8vw]">
      <motion.div
        variants={variantsEntree(preset)}
        initial="cache"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        className="border-rule max-w-[46rem] border-t pt-10"
      >
        <h2 className="titre text-h2">{section.entete.titre}</h2>
        {section.entete.sousTitre && (
          <p className="text-body text-muted mt-4">{section.entete.sousTitre}</p>
        )}
        <p className="meta text-muted mt-6">{libellesExploration.sectionNonPrototypee}</p>
      </motion.div>
    </section>
  )
}
