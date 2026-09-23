import { useEffect, useState } from 'react'

/** Ancre du hero : quand il est lu, aucune section de la nav n'est active. */
export const ANCRE_ACCUEIL = 'accueil'

/**
 * Section actuellement lue : celle qui traverse la ligne située à 40 % de la hauteur de la
 * fenêtre. Retourne null quand c'est le hero qui est lu.
 */
export function useSectionActive(ancres: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null)
  const cle = ancres.join('|')

  useEffect(() => {
    const elements = [ANCRE_ACCUEIL, ...cle.split('|')]
      .map((ancre) => document.getElementById(ancre))
      .filter((element): element is HTMLElement => element !== null)
    const observateur = new IntersectionObserver(
      (entrees) => {
        for (const entree of entrees) {
          if (!entree.isIntersecting) continue
          setActive(entree.target.id === ANCRE_ACCUEIL ? null : entree.target.id)
        }
      },
      { rootMargin: '-40% 0px -59% 0px' },
    )
    elements.forEach((element) => observateur.observe(element))
    return () => observateur.disconnect()
  }, [cle])

  return active
}
