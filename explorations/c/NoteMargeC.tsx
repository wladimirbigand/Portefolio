import type { ReactNode } from 'react'

/** Note de marge : intitulé en sans, valeur en dessous (type Tufte). */
export function NoteMargeC({ titre, children }: { titre: string; children: ReactNode }) {
  return (
    <div>
      <dt className="meta text-muted">{titre}</dt>
      <dd className="font-ui text-ui mt-1">{children}</dd>
    </div>
  )
}
