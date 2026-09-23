import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { useMotionPreset, variantsEntree } from '../partage/MotionPresetContext'

/** Partie de la fiche : filet supérieur, titre, contenu. */
export function BlocA({ titre, children }: { titre: string; children: ReactNode }) {
  const { preset } = useMotionPreset()
  return (
    <motion.section
      variants={variantsEntree(preset)}
      initial="cache"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="border-rule border-t pt-6"
    >
      <h3 className="titre text-h3">{titre}</h3>
      <div className="mt-4">{children}</div>
    </motion.section>
  )
}
