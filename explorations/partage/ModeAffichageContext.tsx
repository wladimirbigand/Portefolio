import { createContext, useContext } from 'react'

/**
 * Réglages d'affichage transverses, pilotés plus tard par le mode Présentation.
 * `navAlwaysVisible` : la nav ne se masque jamais au scroll (utile devant le jury).
 */
export type ModeAffichage = {
  navAlwaysVisible: boolean
}

export const ModeAffichageContext = createContext<ModeAffichage>({ navAlwaysVisible: false })

export function useModeAffichage(): ModeAffichage {
  return useContext(ModeAffichageContext)
}
