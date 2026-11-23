import { useCallback, useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'

/** Zoom d'un clic (bouton, double-clic) : la taille double. */
export const ZOOM_CLIC = 2
const ZOOM_MAX = 4

interface Zoom {
  /** Facteur courant : 1 (ajusté à la zone) à 4. Pendant un pincement, il n'est mis à jour qu'à la fin du geste. */
  zoom: number
  /** Règle le zoom en gardant sous le doigt (ou le curseur) le point `x`, `y` de l'écran ; sans point, le centre de la zone. */
  regler: (voulu: number, x?: number, y?: number) => void
  /** Bouton et double-clic : passe de la taille ajustée au double, et retour. */
  basculer: (x?: number, y?: number) => void
}

/**
 * Zoom d'une zone défilante (visionneuse PDF, capture en grand). Le contenu est mis à l'échelle par la
 * mise en page (la variable `--p-zoom` de la zone, lue par le CSS) : il reste net, et la zone défile
 * dans les deux sens. Trois entrées : `regler` et `basculer` (bouton, double-clic), et le pincement
 * à deux doigts, suivi ici. La zone porte `touch-action: pan-x pan-y` (ou `none`) : le navigateur ne
 * zoome pas la page à sa place.
 * `actif: false` (version texte) : le zoom revient à 1 et ne répond plus.
 */
export function useZoom(ref: RefObject<HTMLElement | null>, actif = true): Zoom {
  const [zoom, setZoom] = useState(1)
  const courant = useRef(1)

  /** Écrit le zoom dans la page, sans rendu React : appelé à chaque mouvement d'un pincement. */
  const appliquer = useCallback(
    (voulu: number, x?: number, y?: number) => {
      const zone = ref.current
      if (!zone) return
      const suivant = Math.min(ZOOM_MAX, Math.max(1, voulu))
      if (suivant === courant.current) return
      const cadre = zone.getBoundingClientRect()
      const dx = (x ?? cadre.left + cadre.width / 2) - cadre.left
      const dy = (y ?? cadre.top + cadre.height / 2) - cadre.top
      // Place du point visé dans le contenu, en proportion : elle ne change pas avec le zoom.
      const px = (zone.scrollLeft + dx) / zone.scrollWidth
      const py = (zone.scrollTop + dy) / zone.scrollHeight
      courant.current = suivant
      zone.style.setProperty('--p-zoom', String(suivant))
      // La lecture de scrollWidth refait la mise en page : le point visé revient sous le doigt.
      zone.scrollLeft = px * zone.scrollWidth - dx
      zone.scrollTop = py * zone.scrollHeight - dy
    },
    [ref],
  )

  const regler = useCallback(
    (voulu: number, x?: number, y?: number) => {
      appliquer(voulu, x, y)
      setZoom(courant.current)
    },
    [appliquer],
  )

  const basculer = useCallback(
    (x?: number, y?: number) => regler(courant.current > 1 ? 1 : ZOOM_CLIC, x, y),
    [regler],
  )

  useEffect(() => {
    if (!actif) regler(1)
  }, [actif, regler])

  // Pincement : l'écart entre les deux doigts donne le facteur, leur milieu le point à garder en place.
  useEffect(() => {
    const zone = ref.current
    if (!zone || !actif) return
    let depart: { ecart: number; zoom: number } | null = null
    const ecart = (doigts: TouchList) =>
      Math.hypot(doigts[0]!.clientX - doigts[1]!.clientX, doigts[0]!.clientY - doigts[1]!.clientY)
    const debut = (evenement: TouchEvent) => {
      if (evenement.touches.length === 2) depart = { ecart: ecart(evenement.touches), zoom: courant.current }
    }
    const mouvement = (evenement: TouchEvent) => {
      if (!depart || evenement.touches.length !== 2 || depart.ecart === 0) return
      if (evenement.cancelable) evenement.preventDefault()
      const [a, b] = [evenement.touches[0]!, evenement.touches[1]!]
      appliquer(
        (depart.zoom * ecart(evenement.touches)) / depart.ecart,
        (a.clientX + b.clientX) / 2,
        (a.clientY + b.clientY) / 2,
      )
    }
    const fin = (evenement: TouchEvent) => {
      if (!depart || evenement.touches.length >= 2) return
      depart = null
      setZoom(courant.current)
    }
    zone.addEventListener('touchstart', debut, { passive: true })
    zone.addEventListener('touchmove', mouvement, { passive: false })
    zone.addEventListener('touchend', fin)
    zone.addEventListener('touchcancel', fin)
    return () => {
      zone.removeEventListener('touchstart', debut)
      zone.removeEventListener('touchmove', mouvement)
      zone.removeEventListener('touchend', fin)
      zone.removeEventListener('touchcancel', fin)
    }
  }, [ref, actif, appliquer])

  return { zoom, regler, basculer }
}
