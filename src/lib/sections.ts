import { site } from '../content'

/**
 * Numéro d'une section (1, 2, 3…) calculé depuis l'ordre de `site.navigation`.
 * Le contenu ne stocke jamais de numéro : chaque layout décide de l'afficher ou non.
 * Retourne `undefined` si l'ancre n'est pas une section de la navigation.
 */
export function numeroSection(ancre: string): number | undefined {
  const index = site.navigation.findIndex((element) => element.ancre === ancre)
  return index === -1 ? undefined : index + 1
}

/** Numéro formaté sur deux chiffres (« 05 »), ou chaîne vide si l'ancre est inconnue. */
export function numeroSectionFormate(ancre: string): string {
  const numero = numeroSection(ancre)
  return numero === undefined ? '' : String(numero).padStart(2, '0')
}
