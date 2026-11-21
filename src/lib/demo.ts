import { demo, sections } from '../content'
import type { SectionMeta } from '../content'

/**
 * Numéro d'une section : sa position dans la navigation (01 à 09), sans trou.
 * Il est toujours calculé : aucun numéro n'est écrit dans le contenu.
 */
export function numeroSection(section: SectionMeta): string {
  return String(sections.indexOf(section) + 1).padStart(2, '0')
}

/** Entrées de navigation : l’accueil (00), puis les neuf sections numérotées par position. */
export const entrees: { id: string; nav: string; numero: string }[] = [
  { ...demo.accueil, numero: '00' },
  ...sections.map((section) => ({ id: section.id, nav: section.nav, numero: numeroSection(section) })),
]

/** Ancres dans l'ordre de la page, qui est celui de la navigation : l'accueil, puis les neuf sections. */
export const idsPage: string[] = [demo.accueil.id, ...sections.map((section) => section.id)]
