/**
 * Fréquence réelle de l'écran (images par seconde), mesurée une fois, au démarrage.
 * Le navigateur ne la donne pas : on la déduit de l'écart entre deux images (`requestAnimationFrame`),
 * pendant que la page ne dessine encore rien de lourd. Un écran ou un vidéoprojecteur à 30 Hz donne
 * 30, quelle que soit la puissance de la machine.
 */

/** Nombre d'écarts consécutifs et réguliers qui suffisent : la cadence est alors celle de l'écran. */
const SUITE = 8
/** Écart toléré, dans cette suite, entre la plus courte et la plus longue image. */
const TOLERANCE = 0.15
/** Démarrage trop irrégulier : on s'arrête à ce nombre d'écarts, et on garde le quart le plus rapide. */
const ECARTS_MAX = 24

let mesure: Promise<number> | null = null

export function frequenceEcran(): Promise<number> {
  mesure ??= new Promise((fin) => {
    const ecarts: number[] = []
    let avant = 0
    const image = (maintenant: number) => {
      if (avant > 0 && maintenant > avant) ecarts.push(maintenant - avant)
      avant = maintenant
      if (ecarts.length >= SUITE) {
        const suite = ecarts.slice(-SUITE).sort((a, b) => a - b)
        // Huit images de suite au même rythme : la page suit l'écran, c'est sa fréquence.
        if (suite[SUITE - 1]! - suite[0]! <= suite[0]! * TOLERANCE) return fin(1000 / suite[SUITE >> 1]!)
        // Page occupée pendant toute la mesure : les images les plus rapprochées sont les plus fidèles
        // (une image en retard dure deux ou trois périodes de l'écran, jamais moins d'une).
        if (ecarts.length >= ECARTS_MAX) {
          ecarts.sort((a, b) => a - b)
          return fin(1000 / ecarts[ECARTS_MAX >> 2]!)
        }
      }
      window.requestAnimationFrame(image)
    }
    window.requestAnimationFrame(image)
  })
  return mesure
}
