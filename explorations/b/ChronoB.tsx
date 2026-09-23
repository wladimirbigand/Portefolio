import { useChronoSession } from '../partage/useChronoSession'

type Props = { className?: string }

/** Chrono de session affiché comme un uptime. Feuille isolée (un rendu par seconde). */
export function ChronoB({ className = '' }: Props) {
  const temps = useChronoSession()
  return <span className={`tabular-nums ${className}`}>{temps}</span>
}
