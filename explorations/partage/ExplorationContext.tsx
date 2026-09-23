import { createContext, useContext } from 'react'
import type { Combinaison } from './types'

export type EtatExploration = {
  combinaison: Combinaison
  modifier: (partiel: Partial<Combinaison>) => void
  /** Incrémenté par « Rejouer les animations » : sert de clé de remontage du layout. */
  cleRejeu: number
  rejouer: () => void
}

export const ExplorationContext = createContext<EtatExploration | null>(null)

export function useExploration(): EtatExploration {
  const etat = useContext(ExplorationContext)
  if (!etat) throw new Error('useExploration doit être utilisé sous ExplorationContext')
  return etat
}
