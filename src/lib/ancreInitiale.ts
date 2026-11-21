import { useEffect } from 'react'

/**
 * Arrivée directe sur une ancre (ex. `…/#projets`).
 * La page est rendue par React : quand le navigateur cherche l'ancre, la section
 * n'existe pas encore, et il reste en haut de page. On refait donc le saut nous-mêmes :
 * - une fois la page montée ;
 * - puis à chaque fois que la mise en page bouge pendant le chargement (polices, images),
 *   tant que la personne n'a pas commencé à défiler elle-même.
 * Le saut est instantané (pas de défilement animé) : la section est à l'écran tout de suite.
 */
export function useAncreInitiale(): void {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (!id) return

    let actif = true
    const sauter = () => {
      if (!actif) return
      document.getElementById(id)?.scrollIntoView({ behavior: 'instant', block: 'start' })
    }
    const arreter = () => {
      actif = false
      observateur.disconnect()
      evenements.forEach((nom) => window.removeEventListener(nom, arreter))
    }

    // La hauteur du document change quand les polices et les images arrivent.
    const observateur = new ResizeObserver(sauter)
    observateur.observe(document.body)
    const evenements = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const
    evenements.forEach((nom) => window.addEventListener(nom, arreter, { passive: true }))

    sauter()
    void document.fonts.ready.then(sauter)
    const fin = window.setTimeout(arreter, 4000)

    return () => {
      window.clearTimeout(fin)
      arreter()
    }
  }, [])
}
