import type { PresetMotion } from '../partage/types'

// B · Infra : séquence de boot par étapes. Mouvements mécaniques, en paliers, sans ressort.
const paliers =
  (nombre: number) =>
  (t: number): number =>
    t >= 1 ? 1 : Math.floor(t * nombre) / nombre

export const motionB: PresetMotion = {
  ui: { duration: 0.15, ease: 'linear' },
  section: { duration: 0.4, ease: paliers(4) },
  ressort: { duration: 0.15, ease: 'linear' },
  trace: { duration: 0.3, ease: 'linear' },
  decalage: 0.06,
  deplacement: 0,
  sequence: { pas: 0.07, dureeEtape: 0.15 },
  typing: { frappe: 28, effacement: 14, pause: 1600 },
  dureeUiCss: 0.15,
  easingCss: 'linear',
}
