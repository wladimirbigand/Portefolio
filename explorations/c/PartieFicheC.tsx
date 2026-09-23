import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { useMotionPreset, variantsEntree } from '../partage/MotionPresetContext'

/** Partie d'article : intertitre serif, fondu lent à l'entrée. */
export function PartieFicheC({ titre, children }: { titre: string; children: ReactNode }) {
  const { preset } = useMotionPreset()
  return (
    <motion.section
      variants={variantsEntree(preset)}
      initial="cache"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <h3 className="titre text-h3">{titre}</h3>
      <div className="mt-4">{children}</div>
    </motion.section>
  )
}
