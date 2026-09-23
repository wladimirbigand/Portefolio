import { useLayoutEffect, useState } from 'react'
import { useAnimate, type AnimationSequence } from 'motion/react'
import { useMotionPreset } from '../partage/MotionPresetContext'
import { bootDejaJoue, DUREE_MAX_BOOT, marquerBootJoue } from './boot'

const EVENEMENTS_INTERRUPTION = ['keydown', 'pointerdown', 'wheel', 'touchstart', 'scroll'] as const

/**
 * Séquence de boot : les éléments [data-boot="n"] apparaissent dans l'ordre de n, par paliers.
 * - durée totale ≤ DUREE_MAX_BOOT ;
 * - n'importe quelle touche, clic ou scroll affiche immédiatement l'état final ;
 * - jouée une fois par session, jamais en mouvement réduit.
 * Tant qu'elle est en cours, le conteneur porte data-boot-etat="en-cours" (éléments masqués en CSS).
 */
export function useBoot<T extends HTMLElement>() {
  const { preset, reduit } = useMotionPreset()
  const [enCours, setEnCours] = useState(() => !reduit && !bootDejaJoue())
  const [scope, animer] = useAnimate<T>()

  useLayoutEffect(() => {
    if (!enCours || !scope.current) return
    const elements = Array.from(scope.current.querySelectorAll<HTMLElement>('[data-boot]')).sort(
      (a, b) => Number(a.dataset.boot) - Number(b.dataset.boot),
    )
    const etapes = Math.max(...elements.map((element) => Number(element.dataset.boot)), 0)
    const dureeEtape = Math.min(preset.sequence.dureeEtape, DUREE_MAX_BOOT / 3)
    const pas =
      etapes > 0 ? Math.min(preset.sequence.pas, (DUREE_MAX_BOOT - dureeEtape) / etapes) : 0

    const sequence: AnimationSequence = elements.map((element) => [
      element,
      { opacity: [0, 1] },
      {
        at: Number(element.dataset.boot) * pas,
        duration: dureeEtape,
        ease: preset.section.ease ?? 'linear',
      },
    ])
    const controles = animer(sequence)

    let termine = false
    const terminer = () => {
      if (termine) return
      termine = true
      controles.complete()
      marquerBootJoue()
      setEnCours(false)
      EVENEMENTS_INTERRUPTION.forEach((type) => window.removeEventListener(type, terminer))
    }
    EVENEMENTS_INTERRUPTION.forEach((type) =>
      window.addEventListener(type, terminer, { passive: true, once: true }),
    )
    void controles.finished.then(terminer)

    return () => {
      EVENEMENTS_INTERRUPTION.forEach((type) => window.removeEventListener(type, terminer))
      controles.stop()
    }
    // La séquence ne se lance qu'au montage (le remontage est géré par « Rejouer »).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { scope, enCours }
}
