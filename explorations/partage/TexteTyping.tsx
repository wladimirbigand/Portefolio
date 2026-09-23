import type { ReactNode } from 'react'
import { useTyping } from './useTyping'

type Props = {
  roles: readonly string[]
  className?: string
  /** Curseur propre à chaque layout (statique : aucune animation infinie). */
  curseur?: ReactNode
}

/**
 * Feuille isolée : seul ce composant se re-rend à chaque frappe.
 * Les lecteurs d'écran reçoivent la liste complète des rôles, pas le texte en cours de frappe.
 */
export function TexteTyping({ roles, className, curseur }: Props) {
  const texte = useTyping(roles)
  return (
    <span className={className}>
      <span className="sr-only">{roles.join(', ')}</span>
      <span aria-hidden="true">
        {texte}
        {curseur}
      </span>
    </span>
  )
}
