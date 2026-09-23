import { site } from '@/content'

type Props = { className?: string }

/** Placeholder visible et discret d'un champ encore marqué TODO(wladimir). */
export function ACompleter({ className = '' }: Props) {
  return (
    <span
      className={`meta border-line text-muted inline-block rounded-[0.2em] border border-dashed px-[0.4em] ${className}`}
    >
      {site.libelles.aCompleter}
    </span>
  )
}
