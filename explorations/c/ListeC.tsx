import { estACompleter } from '@/lib/aCompleter'
import { ACompleter } from '../partage/ACompleter'

/** Liste éditoriale : tirets de liste discrets, interlignage de lecture. */
export function ListeC({ elements }: { elements: readonly string[] }) {
  if (estACompleter(elements)) return <ACompleter />
  return (
    <ul className="grid gap-3">
      {elements.map((element) => (
        <li key={element} className="grid grid-cols-[1.5rem_1fr]">
          <span aria-hidden="true" className="text-muted">
            –
          </span>
          <span>{element}</span>
        </li>
      ))}
    </ul>
  )
}
