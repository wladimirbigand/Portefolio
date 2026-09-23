import { useEffect, useState } from 'react'

const CLE_DEBUT = 'exploration-debut-session'

function lireDebut(): number {
  try {
    const stocke = window.sessionStorage.getItem(CLE_DEBUT)
    if (stocke) return Number(stocke)
    const maintenant = Date.now()
    window.sessionStorage.setItem(CLE_DEBUT, String(maintenant))
    return maintenant
  } catch {
    return Date.now()
  }
}

function formater(secondes: number): string {
  const minutes = Math.floor(secondes / 60)
  const reste = secondes % 60
  return `${String(minutes).padStart(2, '0')}:${String(reste).padStart(2, '0')}`
}

/**
 * Chrono de session (mm:ss depuis l'ouverture de la page, conservé pendant la session).
 * À n'utiliser que dans une feuille : il déclenche un rendu par seconde.
 */
export function useChronoSession(): string {
  const [debut] = useState(lireDebut)
  const [secondes, setSecondes] = useState(() => Math.floor((Date.now() - debut) / 1000))
  useEffect(() => {
    const intervalle = window.setInterval(
      () => setSecondes(Math.floor((Date.now() - debut) / 1000)),
      1000,
    )
    return () => window.clearInterval(intervalle)
  }, [debut])
  return formater(secondes)
}
