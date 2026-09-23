import { useState } from 'react'
import { useMotionValueEvent, useScroll } from 'motion/react'
import { useModeAffichage } from './ModeAffichageContext'

/**
 * Masquage de la nav au scroll vers le bas, réapparition au scroll vers le haut.
 * Jamais masquée si navAlwaysVisible (futur mode Présentation) ou si `bloquee`
 * (menu ouvert, focus clavier dans la nav).
 */
export function useNavMasquee(bloquee: boolean): boolean {
  const { navAlwaysVisible } = useModeAffichage()
  const { scrollY } = useScroll()
  const [masquee, setMasquee] = useState(false)

  useMotionValueEvent(scrollY, 'change', (y) => {
    const precedent = scrollY.getPrevious() ?? 0
    if (y < 120) setMasquee(false)
    else if (y > precedent + 6) setMasquee(true)
    else if (y < precedent - 6) setMasquee(false)
  })

  return masquee && !navAlwaysVisible && !bloquee
}
