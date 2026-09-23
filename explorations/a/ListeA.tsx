import { estACompleter } from '@/lib/aCompleter'
import { ACompleter } from '../partage/ACompleter'

/** Liste à puces accentuées ; placeholder visible si la liste est encore vide. */
export function ListeA({ elements }: { elements: readonly string[] }) {
  if (estACompleter(elements)) return <ACompleter />
  return (
    <ul className="grid gap-3">
      {elements.map((element) => (
        <li key={element} className="flex gap-3">
          <span
            aria-hidden="true"
            className="bg-accent mt-[0.7em] size-1.5 shrink-0 rounded-full"
          />
          <span>{element}</span>
        </li>
      ))}
    </ul>
  )
}
