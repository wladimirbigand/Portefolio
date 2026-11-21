import { anciennesAncres } from '../content/meta'

/**
 * Ancres de l'ancien site (`#projects`, `#skills`…) : un lien déjà partagé mène à la bonne section.
 * L'adresse est remplacée, sans nouvelle entrée d'historique. À appeler avant le premier rendu : la
 * page lit ensuite la nouvelle ancre (`useAncreInitiale`, `useSectionActive`).
 */
export function redirigerAnciennesAncres(): void {
  const rediriger = () => {
    const nouvelle = anciennesAncres[decodeURIComponent(window.location.hash.slice(1)).toLowerCase()]
    if (nouvelle) window.location.replace(`#${nouvelle}`)
  }
  rediriger()
  window.addEventListener('hashchange', rediriger)
}
