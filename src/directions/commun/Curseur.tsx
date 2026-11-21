import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

const CLIQUABLE = 'a, button, summary, label, select, input, textarea, [role="button"]'
/** Contenus qui gardent leur propre curseur (le lecteur PDF du navigateur). */
const EXTERNE = 'object, iframe, embed'
/** Zones à secret (le portrait) : le point y grossit comme sur un élément cliquable. */
const SECRET = '[data-secret]'

type Etat = 'cache' | 'repos' | 'actif'
const ECHELLE: Record<Etat, number> = { cache: 1, repos: 1, actif: 1.6 }

/**
 * Curseur en point.
 * - Uniquement avec une souris (`pointer: fine`) et hors mouvement réduit : sinon rien n'est rendu
 *   et le curseur natif reste en place.
 * - Aucune latence : la position est écrite directement dans le gestionnaire `pointermove`
 *   (`translate3d`), sans ressort ni interpolation.
 * - Un rond plein de 10 px, blanc en `mix-blend-mode: difference` : visible sur tous les fonds.
 * - Sur un élément cliquable ou sur le portrait, il grossit légèrement : un ressort court, sur la
 *   taille seulement. Purement décoratif : il ne porte aucune information.
 * - Dans une fenêtre superposée (`<dialog>`), le curseur natif reprend la main.
 */
export function Curseur() {
  const reduit = useReducedMotion()
  const [fin, setFin] = useState(false)
  const [etat, setEtat] = useState<Etat>('cache')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const media = window.matchMedia('(pointer: fine)')
    const lire = () => setFin(media.matches)
    lire()
    media.addEventListener('change', lire)
    return () => media.removeEventListener('change', lire)
  }, [])

  const actif = fin && !reduit

  useEffect(() => {
    if (!actif) return
    const racine = document.documentElement

    const suivre = (evenement: PointerEvent) => {
      if (evenement.pointerType !== 'mouse') return
      const cible = evenement.target instanceof Element ? evenement.target : null
      // Fenêtre superposée : elle est au-dessus de tout, le point passerait dessous. Le curseur natif revient.
      if (cible?.closest('dialog')) {
        delete racine.dataset.curseur
        setEtat('cache')
        return
      }
      const point = ref.current
      if (point) {
        point.style.transform = `translate3d(${evenement.clientX}px, ${evenement.clientY}px, 0)`
      }
      // Le curseur natif n'est masqué qu'une fois le point réellement placé.
      racine.dataset.curseur = 'point'
      if (!cible || cible.closest(EXTERNE)) setEtat('cache')
      else setEtat(cible.closest(CLIQUABLE) || cible.closest(SECRET) ? 'actif' : 'repos')
    }
    const cacher = () => setEtat('cache')

    window.addEventListener('pointermove', suivre, { passive: true })
    window.addEventListener('pointerover', suivre, { passive: true })
    racine.addEventListener('pointerleave', cacher)
    window.addEventListener('blur', cacher)
    return () => {
      window.removeEventListener('pointermove', suivre)
      window.removeEventListener('pointerover', suivre)
      racine.removeEventListener('pointerleave', cacher)
      window.removeEventListener('blur', cacher)
      delete racine.dataset.curseur
    }
  }, [actif])

  if (!actif) return null

  return (
    <div ref={ref} className="p-curseur" aria-hidden="true">
      <motion.span
        className="p-curseur-point"
        initial={false}
        animate={{ scale: ECHELLE[etat], opacity: etat === 'cache' ? 0 : 1 }}
        transition={{
          scale: { type: 'spring', stiffness: 700, damping: 34 },
          opacity: { duration: 0.1 },
        }}
      />
    </div>
  )
}
