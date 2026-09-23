import { useChronoSession } from '../partage/useChronoSession'

/** Feuille isolée : seul ce composant se re-rend chaque seconde. */
export function ChronoA() {
  const temps = useChronoSession()
  return (
    <p className="font-code text-h3 mt-3 tabular-nums" aria-live="off">
      {temps}
    </p>
  )
}
