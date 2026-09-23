import { CircleCheck, CircleDashed, CircleDot, type LucideProps } from 'lucide-react'
import type { StatutRealisation } from '@/content'

type Props = LucideProps & { statut: StatutRealisation }

/** Icône de statut : la forme porte l'information, jamais la couleur seule (toujours + libellé). */
export function IconeStatut({ statut, ...props }: Props) {
  if (statut === 'termine') return <CircleCheck aria-hidden="true" {...props} />
  if (statut === 'en-cours') return <CircleDot aria-hidden="true" {...props} />
  return <CircleDashed aria-hidden="true" {...props} />
}
