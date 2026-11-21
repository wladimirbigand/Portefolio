/** Lecture et écriture des paramètres d'URL (?theme=, ?oral). */

export function lireParametre(nom: string): string | null {
  return new URLSearchParams(window.location.search).get(nom)
}

/**
 * Construit une URL relative à la page courante en modifiant des paramètres.
 * Une valeur `null` retire le paramètre ; les autres paramètres sont conservés.
 */
export function urlAvec(parametres: Record<string, string | null>): string {
  const recherche = new URLSearchParams(window.location.search)
  for (const [nom, valeur] of Object.entries(parametres)) {
    if (valeur === null) recherche.delete(nom)
    else recherche.set(nom, valeur)
  }
  const chaine = recherche.toString()
  return window.location.pathname + (chaine ? `?${chaine}` : '')
}

/** `?oral` : mode oral, avec un chronomètre discret dans un coin de l'écran. */
export function modeOral(): boolean {
  const recherche = new URLSearchParams(window.location.search)
  return recherche.has('oral') && recherche.get('oral') !== '0'
}

/** URL d'un fichier de `public/` : toujours préfixée par la base du site (/Portefolio/). */
export function fichierPublic(chemin: string): string {
  return import.meta.env.BASE_URL + chemin.replace(/^\/+/, '')
}

/**
 * URL d'un PDF pour l'aperçu dans la page : sans le volet des vignettes et ajusté à la largeur,
 * pour que la page soit la plus grande possible (lecture au vidéoprojecteur).
 * Les navigateurs qui ne connaissent pas ces paramètres les ignorent.
 */
export function urlApercuPdf(url: string): string {
  return `${url}#navpanes=0&view=FitH`
}
