import type { PresetMotion } from '../partage/types'

// D · Signalétique : ressorts physiques (léger dépassement) et ligne tracée au scroll.
export const motionD: PresetMotion = {
  ui: { type: 'spring', stiffness: 420, damping: 30 },
  section: { type: 'spring', stiffness: 260, damping: 22 },
  ressort: { type: 'spring', stiffness: 260, damping: 22 },
  trace: { type: 'spring', stiffness: 90, damping: 24, restDelta: 0.001 },
  decalage: 0.07,
  deplacement: 20,
  sequence: { pas: 0.08, dureeEtape: 0.3 },
  typing: { frappe: 50, effacement: 26, pause: 2000 },
  dureeUiCss: 0.22,
  easingCss: 'cubic-bezier(0.34, 1.4, 0.64, 1)',
}
