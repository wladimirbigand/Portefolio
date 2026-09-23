import { useChronoSession } from '../partage/useChronoSession'

/** Feuille isolée : seul ce composant se re-rend chaque seconde. */
export function ChronoD() {
  const temps = useChronoSession()
  return <span className="font-display text-h2 fort tabular-nums">{temps}</span>
}
