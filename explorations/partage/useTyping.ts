import { useEffect, useState } from 'react'
import { useMotionPreset } from './MotionPresetContext'

/**
 * Texte « typing » : frappe, pause, effacement, rôle suivant. Timings issus du preset actif.
 * En mouvement réduit : le rôle complet s'affiche d'un bloc et change après la pause.
 */
export function useTyping(roles: readonly string[]): string {
  const { preset, reduit } = useMotionPreset()
  const { frappe, effacement, pause } = preset.typing
  const [indexRole, setIndexRole] = useState(0)
  const [longueur, setLongueur] = useState(0)
  const [efface, setEfface] = useState(false)

  const role = roles[indexRole % roles.length] ?? ''

  useEffect(() => {
    if (reduit) {
      const minuteur = window.setTimeout(() => setIndexRole((i) => i + 1), pause * 1.5)
      return () => window.clearTimeout(minuteur)
    }
    let delai = frappe
    let action: () => void
    if (!efface && longueur < role.length) {
      action = () => setLongueur((l) => l + 1)
    } else if (!efface) {
      delai = pause
      action = () => setEfface(true)
    } else if (longueur > 0) {
      delai = effacement
      action = () => setLongueur((l) => l - 1)
    } else {
      delai = frappe * 4
      action = () => {
        setEfface(false)
        setIndexRole((i) => i + 1)
      }
    }
    const minuteur = window.setTimeout(action, delai)
    return () => window.clearTimeout(minuteur)
  }, [reduit, frappe, effacement, pause, efface, longueur, role.length, indexRole])

  return reduit ? role : role.slice(0, longueur)
}
