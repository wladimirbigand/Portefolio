import { useCallback, useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'

/** Zoom d'un clic (bouton, clic sur l'image) : la taille double. */
export const ZOOM_CLIC = 2
const ZOOM_MAX = 4
/** Au-delà de ce déplacement (px) entre l'appui et le relâchement, c'est un glissement, pas un clic. */
const SEUIL_GLISSEMENT = 5

interface Zoom {
  /** Facteur courant : 1 (ajusté à la zone) à 4. Pendant un pincement, il n'est mis à jour qu'à la fin du geste. */
  zoom: number
  /** Règle le zoom en gardant sous le doigt (ou le curseur) le point `x`, `y` de l'écran ; sans point, le centre de la zone. */
  regler: (voulu: number, x?: number, y?: number) => void
  /** Bouton et clic : passe de la taille ajustée au double, et retour. */
  basculer: (x?: number, y?: number) => void
}

/**
 * Zoom d'une zone défilante (visionneuse PDF, capture en grand). Le contenu est mis à l'échelle par la
 * mise en page (la variable `--p-zoom` de la zone, lue par le CSS) : il reste net, et la zone défile
 * dans les deux sens. Quatre entrées : `regler` et `basculer` (le bouton), et, suivis ici, le clic
 * dans la zone (× 2 sur le point cliqué, puis retour : ce qu'annonce le curseur en loupe), le
 * glissement à la souris (il déplace le contenu ; ce n'est pas un clic) et le pincement à deux doigts.
 * La zone porte `touch-action: pan-x pan-y` (ou `none`) : le navigateur ne zoome pas la page à sa place.
 * Pendant un glissement à la souris, elle porte `data-glisse` (curseur « grabbing »).
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
      const contenu = zone.firstElementChild
      if (!contenu) return
      const cadre = zone.getBoundingClientRect()
      const vx = x ?? cadre.left + cadre.width / 2
      const vy = y ?? cadre.top + cadre.height / 2
      // Place du point visé dans le contenu, en proportion : elle ne change pas avec le zoom. Elle est
      // lue sur le contenu lui-même, pas sur la zone : centré à × 1, il a des marges qu'il perd ensuite.
      const avant = contenu.getBoundingClientRect()
      const px = (vx - avant.left) / avant.width
      const py = (vy - avant.top) / avant.height
      courant.current = suivant
      zone.style.setProperty('--p-zoom', String(suivant))
      // La mesure refait la mise en page : le point visé revient sous le doigt.
      const apres = contenu.getBoundingClientRect()
      zone.scrollLeft += apres.left + px * apres.width - vx
      zone.scrollTop += apres.top + py * apres.height - vy
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

  // Clic et glissement. Un appui relâché sur place bascule le zoom autour du point cliqué ; à la
  // souris, un appui déplacé fait défiler la zone (au toucher, le navigateur s'en charge).
  useEffect(() => {
    const zone = ref.current
    if (!zone || !actif) return
    let appui: { id: number; x: number; y: number; gauche: number; haut: number; glisse: boolean } | null = null
    const debut = (evenement: PointerEvent) => {
      appui = null
      if (!evenement.isPrimary || evenement.button !== 0) return
      // Un appui sur une barre de défilement de la zone n'est ni un clic ni un glissement.
      const cadre = zone.getBoundingClientRect()
      const x = evenement.clientX - cadre.left - zone.clientLeft
      const y = evenement.clientY - cadre.top - zone.clientTop
      if (x < 0 || y < 0 || x >= zone.clientWidth || y >= zone.clientHeight) return
      appui = {
        id: evenement.pointerId,
        x: evenement.clientX,
        y: evenement.clientY,
        gauche: zone.scrollLeft,
        haut: zone.scrollTop,
        glisse: false,
      }
    }
    const mouvement = (evenement: PointerEvent) => {
      if (!appui || evenement.pointerId !== appui.id) return
      // Bouton relâché hors de la fenêtre : l'appui est fini, ce mouvement n'est pas un glissement.
      if (evenement.buttons === 0) return abandon()
      const dx = evenement.clientX - appui.x
      const dy = evenement.clientY - appui.y
      if (!appui.glisse) {
        if (Math.hypot(dx, dy) < SEUIL_GLISSEMENT) return
        appui.glisse = true
        if (evenement.pointerType !== 'mouse') return
        // La zone suit la souris même si elle en sort ; le curseur ne change que s'il y a de quoi défiler.
        zone.setPointerCapture(appui.id)
        if (zone.scrollWidth > zone.clientWidth || zone.scrollHeight > zone.clientHeight) zone.dataset.glisse = ''
      }
      if (evenement.pointerType !== 'mouse') return
      zone.scrollLeft = appui.gauche - dx
      zone.scrollTop = appui.haut - dy
    }
    const fin = () => {
      delete zone.dataset.glisse
    }
    const abandon = () => {
      appui = null
      fin()
    }
    const clic = (evenement: MouseEvent) => {
      const dernier = appui
      appui = null
      // Sans appui (barre de défilement, clic simulé) ou après un glissement : rien.
      if (!dernier || dernier.glisse) return
      basculer(evenement.clientX, evenement.clientY)
    }
    // Firefox proposerait de faire glisser l'image hors de la page.
    const retenir = (evenement: DragEvent) => evenement.preventDefault()
    zone.addEventListener('pointerdown', debut)
    zone.addEventListener('pointermove', mouvement)
    zone.addEventListener('pointerup', fin)
    zone.addEventListener('pointercancel', abandon)
    zone.addEventListener('click', clic)
    zone.addEventListener('dragstart', retenir)
    return () => {
      fin()
      zone.removeEventListener('pointerdown', debut)
      zone.removeEventListener('pointermove', mouvement)
      zone.removeEventListener('pointerup', fin)
      zone.removeEventListener('pointercancel', abandon)
      zone.removeEventListener('click', clic)
      zone.removeEventListener('dragstart', retenir)
    }
  }, [ref, actif, basculer])

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
