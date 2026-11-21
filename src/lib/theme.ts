import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import { lireParametre, urlAvec } from './url'

export type Theme = 'light' | 'dark'

const REQUETE_SOMBRE = '(prefers-color-scheme: dark)'

function estTheme(valeur: string | null): valeur is Theme {
  return valeur === 'light' || valeur === 'dark'
}

/** Thème forcé par ?theme=light|dark, ou null si le site doit suivre le système. */
function themeForce(): Theme | null {
  const valeur = lireParametre('theme')
  return estTheme(valeur) ? valeur : null
}

function themeSysteme(): Theme {
  return window.matchMedia(REQUETE_SOMBRE).matches ? 'dark' : 'light'
}

/** Couleur de l'interface du navigateur (barre d'adresse mobile) : le fond de page de chaque thème. */
export const COULEUR_THEME: Record<Theme, string> = { light: '#f3f3f1', dark: '#0b0b0c' }

function appliquer(theme: Theme) {
  document.documentElement.dataset.theme = theme
  // Même valeur que le script de index.html, qui la pose avant le premier rendu.
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', COULEUR_THEME[theme])
}

/**
 * Thème courant et bascule.
 * - ?theme=light|dark force le thème.
 * - Sans paramètre, on suit prefers-color-scheme (y compris ses changements).
 * - La bascule écrit ?theme= dans l'URL : le choix survit au rechargement et se partage.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => themeForce() ?? themeSysteme())

  useEffect(() => {
    appliquer(theme)
  }, [theme])

  useEffect(() => {
    const media = window.matchMedia(REQUETE_SOMBRE)
    const surChangement = () => {
      if (themeForce() === null) setTheme(themeSysteme())
    }
    media.addEventListener('change', surChangement)
    return () => media.removeEventListener('change', surChangement)
  }, [])

  const basculer = useCallback(() => {
    setTheme((actuel) => {
      const suivant: Theme = actuel === 'dark' ? 'light' : 'dark'
      window.history.replaceState(null, '', urlAvec({ theme: suivant }) + window.location.hash)
      return suivant
    })
  }, [])

  return { theme, basculer }
}

/**
 * Thème appliqué à la page (`<html data-theme>`), pour un composant qui dessine sur une toile et doit
 * relire ses couleurs une fois le thème réellement posé.
 */
export function useThemeCourant(): Theme {
  return useSyncExternalStore(
    (prevenir) => {
      const observateur = new MutationObserver(prevenir)
      observateur.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
      return () => observateur.disconnect()
    },
    () => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'),
  )
}
