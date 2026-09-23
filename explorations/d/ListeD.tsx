import { estACompleter } from '@/lib/aCompleter'
import { ACompleter } from '../partage/ACompleter'

/** Liste à puces carrées (repères de signalétique). */
export function ListeD({ elements }: { elements: readonly string[] }) {
  if (estACompleter(elements)) return <ACompleter />
  return (
    <ul className="grid gap-2.5">
      {elements.map((element) => (
        <li key={element} className="grid grid-cols-[1.25rem_1fr] items-baseline">
          <span aria-hidden="true" className="bg-fg block size-2 translate-y-[-0.15em]" />
          <span>{element}</span>
        </li>
      ))}
    </ul>
  )
}
