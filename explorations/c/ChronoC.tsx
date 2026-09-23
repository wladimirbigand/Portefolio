import { useChronoSession } from '../partage/useChronoSession'

/** Feuille isolée : seul ce composant se re-rend chaque seconde. */
export function ChronoC() {
  const temps = useChronoSession()
  return <span className="text-fg tabular-nums">{temps}</span>
}
