import { realisations } from '../../content'

/** Ancre d'une réalisation : `realisation-1` à `realisation-16` (le numéro du tableau de synthèse). */
export function ancreRealisation(numero: number): string {
  return `realisation-${numero}`
}

/** « 04 » : numéro sur deux chiffres, pour l'alignement. */
export function deuxChiffres(numero: number): string {
  return String(numero).padStart(2, '0')
}

/** Numéro de réalisation désigné par une ancre (`#realisation-3`), ou null si ce n'en est pas une. */
export function numeroDepuisAncre(ancre: string): number | null {
  let id = ancre.replace(/^#/, '')
  try {
    id = decodeURIComponent(id)
  } catch {
    // Ancre mal encodée : on la lit telle quelle.
  }
  const trouve = /^realisation-(\d{1,2})$/.exec(id)
  if (!trouve) return null
  const numero = Number(trouve[1])
  return realisations.some((realisation) => realisation.numero === numero) ? numero : null
}

/**
 * Affichage seulement : un trait d’union entre deux lettres ou chiffres est encadré de gluons
 * (U+2060, sans largeur), pour que « 3-tiers » ou « sous-domaine » ne soient pas coupés en fin de ligne.
 * Le trait d’union reste celui de la police, et le texte reste le même.
 */
export function insecable(texte: string): string {
  return texte.replace(/(?<=[\p{L}\p{N}])-(?=[\p{L}\p{N}])/gu, '\u2060-\u2060')
}
