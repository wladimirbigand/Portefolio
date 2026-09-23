import { motion } from 'motion/react'
import { numeroSectionFormate } from '@/lib/sections'
import type { SectionPage } from '../partage/donnees'
import { libellesExploration } from '../partage/libelles'
import { useMotionPreset, variantsEntree } from '../partage/MotionPresetContext'

/** Section hors périmètre du prototype : seul son en-tête (contenu réel) est affiché. */
export function SectionA({ section }: { section: SectionPage }) {
  const { preset } = useMotionPreset()
  return (
    <section id={section.ancre} className="mx-auto max-w-[1200px] px-5 py-16 md:px-10">
      <motion.div
        variants={variantsEntree(preset)}
        initial="cache"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        className="border-rule max-w-[62ch] border-t pt-8"
      >
        <p className="meta text-muted flex gap-3">
          <span className="font-code">{numeroSectionFormate(section.ancre)}</span>
          <span>{section.entete.label}</span>
        </p>
        <h2 className="titre text-h2 mt-3">{section.entete.titre}</h2>
        {section.entete.sousTitre && (
          <p className="text-body text-muted mt-4">{section.entete.sousTitre}</p>
        )}
        <p className="meta text-muted mt-6 italic">{libellesExploration.sectionNonPrototypee}</p>
      </motion.div>
    </section>
  )
}
