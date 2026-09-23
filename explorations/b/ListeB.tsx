import { estACompleter } from '@/lib/aCompleter'
import { ACompleter } from '../partage/ACompleter'

/** Liste à puces « - » en mono ; placeholder visible si la liste est encore vide. */
export function ListeB({ elements }: { elements: readonly string[] }) {
  if (estACompleter(elements)) return <ACompleter />
  return (
    <ul className="grid gap-2">
      {elements.map((element) => (
        <li key={element} className="grid grid-cols-[1.5rem_1fr]">
          <span aria-hidden="true" className="font-code text-accent">
            -
          </span>
          <span>{element}</span>
        </li>
      ))}
    </ul>
  )
}
