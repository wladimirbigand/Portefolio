import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Menu mobile accessible : Échap ferme, le focus va au premier lien à l'ouverture
 * et revient sur le bouton à la fermeture, Tab reste dans le panneau.
 */
export function useMenuMobile() {
  const [ouvert, setOuvert] = useState(false)
  const refBouton = useRef<HTMLButtonElement>(null)
  const refPanneau = useRef<HTMLDivElement>(null)

  const fermer = useCallback((rendreFocus = true) => {
    setOuvert(false)
    if (rendreFocus) refBouton.current?.focus()
  }, [])

  const basculer = useCallback(() => setOuvert((o) => !o), [])

  useEffect(() => {
    if (!ouvert) return
    const panneau = refPanneau.current
    const focusables = () =>
      Array.from(panneau?.querySelectorAll<HTMLElement>('a[href], button') ?? [])
    focusables()[0]?.focus()

    const auClavier = (evenement: KeyboardEvent) => {
      if (evenement.key === 'Escape') {
        evenement.preventDefault()
        fermer()
        return
      }
      if (evenement.key !== 'Tab') return
      const liste = [refBouton.current, ...focusables()].filter(
        (element): element is HTMLElement => element !== null,
      )
      const premier = liste[0]
      const dernier = liste[liste.length - 1]
      if (!premier || !dernier) return
      if (evenement.shiftKey && document.activeElement === premier) {
        evenement.preventDefault()
        dernier.focus()
      } else if (!evenement.shiftKey && document.activeElement === dernier) {
        evenement.preventDefault()
        premier.focus()
      }
    }
    document.addEventListener('keydown', auClavier)
    return () => document.removeEventListener('keydown', auClavier)
  }, [ouvert, fermer])

  return { ouvert, basculer, fermer, refBouton, refPanneau }
}
