import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import type { CadreRealisation } from '@/content'
import { useMotionPreset } from '../partage/MotionPresetContext'
import { BORDURE_CADRE } from './teintesCadre'

/** Arrêt du parcours de la fiche : anneau sur la ligne de la fiche, titre condensé, contenu. */
type Props = { titre: string; cadre: CadreRealisation; children: ReactNode }

export function ArretFicheD({ titre, cadre, children }: Props) {
  const { preset } = useMotionPreset()
  return (
    <motion.section
      initial={{ opacity: 0, x: preset.deplacement }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={preset.section}
      className="relative grid grid-cols-[2.5rem_1fr] gap-3 md:gap-5"
    >
      <span aria-hidden="true" className="relative z-10 mt-1.5 grid place-items-center">
        <span
          className={`bg-surface block size-6 rounded-full border-[5px] ${BORDURE_CADRE[cadre]}`}
        />
      </span>
      <div>
        <h3 className="titre text-h3">{titre}</h3>
        <div className="mt-3">{children}</div>
      </div>
    </motion.section>
  )
}
