import { useEffect, useState } from 'react'

/**
 * Identifiant de la section en cours de lecture : la dernière dont le haut a franchi
 * une ligne de lecture placée sous l'en-tête (un quart de la fenêtre, 140 px au moins).
 * L'ancre de l'URL a priorité tant que sa section est en position de lecture : c'est ce qui
 * départage des sections courtes, côte à côte ou en bas de page, que la ligne ne peut pas séparer.
 * Logique seule (aucun rendu) : chaque DA dessine son propre repère.
 */
export function useSectionActive(ids: readonly string[]): string {
  const [active, setActive] = useState(ids[0] ?? '')

  useEffect(() => {
    let demande = 0

    const mesurer = () => {
      demande = 0
      const ligne = Math.max(140, window.innerHeight * 0.25)
      let courante = ids[0] ?? ''
      for (const id of ids) {
        const element = document.getElementById(id)
        if (element && element.getBoundingClientRect().top <= ligne) courante = id
      }
      const basDePage =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4

      const ancre = decodeURIComponent(window.location.hash.slice(1))
      const hautAncre = ids.includes(ancre)
        ? document.getElementById(ancre)?.getBoundingClientRect().top
        : undefined
      if (hautAncre !== undefined && hautAncre >= -8 && hautAncre <= ligne) {
        // La section demandée est en position de lecture.
        courante = ancre
      } else if (basDePage && ids.length > 0) {
        // En bas de page : la section demandée si elle est à l'écran, sinon la dernière.
        const visible = hautAncre !== undefined && hautAncre >= 0 && hautAncre < window.innerHeight
        courante = visible ? ancre : ids[ids.length - 1]!
      }
      setActive(courante)
    }

    const planifier = () => {
      if (demande === 0) demande = window.requestAnimationFrame(mesurer)
    }

    mesurer()
    window.addEventListener('scroll', planifier, { passive: true })
    window.addEventListener('resize', planifier)
    window.addEventListener('hashchange', planifier)
    return () => {
      window.removeEventListener('hashchange', planifier)
      window.removeEventListener('scroll', planifier)
      window.removeEventListener('resize', planifier)
      if (demande !== 0) window.cancelAnimationFrame(demande)
    }
  }, [ids])

  return active
}
