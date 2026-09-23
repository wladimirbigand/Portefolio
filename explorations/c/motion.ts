import type { PresetMotion } from '../partage/types'

// C · Éditorial : fondus lents, déplacement minimal, presque aucun décalage visible.
const douce = [0.16, 1, 0.3, 1] as const

export const motionC: PresetMotion = {
  ui: { duration: 0.25, ease: douce },
  section: { duration: 0.7, ease: douce },
  ressort: { duration: 0.5, ease: douce },
  trace: { duration: 0.9, ease: douce },
  decalage: 0.09,
  deplacement: 12,
  sequence: { pas: 0.12, dureeEtape: 0.5 },
  typing: { frappe: 70, effacement: 32, pause: 2600 },
  dureeUiCss: 0.25,
  easingCss: 'cubic-bezier(0.16, 1, 0.3, 1)',
}
