/**
 * Affichage des dates du contenu (écrites en ISO, `AAAA-MM-JJ`).
 * Le fuseau est fixé à UTC : une date ISO sans heure est lue à minuit UTC, et ne doit pas glisser d'un jour.
 */
const COURT = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit',
  timeZone: 'UTC',
})
const LONG = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

/** « 13/10/25 » : le format du tableau de synthèse. */
export function dateCourte(iso: string): string {
  return COURT.format(new Date(iso))
}

/** « 13 octobre 2025 », en un seul bloc (espaces insécables). */
export function dateLongue(iso: string): string {
  return LONG.format(new Date(iso)).replace(/ /g, '\u00A0')
}

/** « 13/10/25 – 31/10/25 », en un seul bloc (espaces insécables autour du tiret). */
export function periodeCourte(debut: string, fin: string): string {
  return `${dateCourte(debut)}\u00A0–\u00A0${dateCourte(fin)}`
}
