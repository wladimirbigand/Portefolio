import { useSyncExternalStore } from 'react'

/** Vrai tant que la requête média correspond (suit les changements de taille de la fenêtre). */
export function useMedia(requete: string): boolean {
  return useSyncExternalStore(
    (prevenir) => {
      const media = window.matchMedia(requete)
      media.addEventListener('change', prevenir)
      return () => media.removeEventListener('change', prevenir)
    },
    () => window.matchMedia(requete).matches,
  )
}

/** Sous 768 px : les navigateurs mobiles affichent mal un PDF intégré à la page. */
export const REQUETE_MOBILE = '(max-width: 47.99em)'

/** Appareil tactile, sans curseur : les effets au survol y sont remplacés par des transitions au défilement. */
export const REQUETE_TACTILE = '(pointer: coarse)'
