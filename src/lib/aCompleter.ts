// Détection des champs encore à compléter (marqués TODO(wladimir) dans src/content/).
// Ces champs s'affichent sous forme d'un placeholder visible et discret, jamais comme du faux contenu.

/** Valeurs de contenu qui signalent un champ non renseigné. */
const MARQUEURS_A_COMPLETER: readonly string[] = ['À préciser']

export function estACompleter(valeur: string | readonly unknown[] | undefined): boolean {
  if (valeur === undefined) return true
  if (Array.isArray(valeur)) return valeur.length === 0
  if (typeof valeur !== 'string') return false
  const texte = valeur.trim()
  return texte === '' || MARQUEURS_A_COMPLETER.includes(texte)
}
