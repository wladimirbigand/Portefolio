import type { PresetMotion } from '../partage/types'

// A · Précis : précise et rapide. Sortie nette, aucun rebond, décalages courts.
const sortieNette = [0.2, 0, 0, 1] as const

export const motionA: PresetMotion = {
  ui: { duration: 0.16, ease: sortieNette },
  section: { duration: 0.45, ease: sortieNette },
  ressort: { type: 'spring', stiffness: 520, damping: 44, mass: 0.8 },
  trace: { duration: 0.4, ease: sortieNette },
  decalage: 0.04,
  deplacement: 8,
  sequence: { pas: 0.05, dureeEtape: 0.16 },
  typing: { frappe: 45, effacement: 22, pause: 1800 },
  dureeUiCss: 0.16,
  easingCss: 'cubic-bezier(0.2, 0, 0, 1)',
}
