import type { ReactNode } from 'react'

/** Sous-partie de la fiche : titre préfixé « ## » (décoratif), contenu en dessous. */
export function BlocFicheB({
  id,
  titre,
  children,
}: {
  id: string
  titre: string
  children: ReactNode
}) {
  return (
    <section id={id} className="border-rule scroll-mt-28 border-t pt-6">
      <h3 className="titre text-h3">
        <span aria-hidden="true" className="text-accent">
          ##{' '}
        </span>
        {titre}
      </h3>
      <div className="mt-4">{children}</div>
    </section>
  )
}
