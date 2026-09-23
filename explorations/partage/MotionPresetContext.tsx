import { createContext, useContext } from 'react'
import type { Variants } from 'motion/react'
import type { PresetMotion } from './types'

export type EtatMotion = {
  preset: PresetMotion
  /** true si prefers-reduced-motion : le preset est déjà réduit. */
  reduit: boolean
}

export const MotionPresetContext = createContext<EtatMotion | null>(null)

export function useMotionPreset(): EtatMotion {
  const etat = useContext(MotionPresetContext)
  if (!etat) throw new Error('useMotionPreset doit être utilisé sous MotionPresetContext')
  return etat
}

/** Version prefers-reduced-motion d'un preset : aucun déplacement, fondus courts. */
export function reduirePreset(preset: PresetMotion): PresetMotion {
  const fondu = { duration: 0.12, ease: 'linear' as const }
  return {
    ...preset,
    ui: fondu,
    section: fondu,
    ressort: { duration: 0 },
    trace: { duration: 0 },
    decalage: 0,
    deplacement: 0,
    sequence: { pas: 0, dureeEtape: 0 },
    dureeUiCss: 0.12,
  }
}

/** Variants d'entrée standard (fondu + translation), dérivés du preset actif. */
export function variantsEntree(preset: PresetMotion): Variants {
  return {
    cache: { opacity: 0, y: preset.deplacement },
    visible: { opacity: 1, y: 0, transition: preset.section },
  }
}

/** Conteneur qui décale l'entrée de ses enfants selon le preset. */
export function variantsGroupe(preset: PresetMotion): Variants {
  return {
    cache: {},
    visible: { transition: { staggerChildren: preset.decalage } },
  }
}
