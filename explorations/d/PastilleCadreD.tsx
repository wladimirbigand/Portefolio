import type { CadreRealisation } from '@/content'
import { lettreCadre } from '../partage/donnees'
import { FOND_CADRE } from './teintesCadre'

type Props = { cadre: CadreRealisation; taille?: 'petite' | 'grande' }

/** Pastille de ligne : la lettre porte l'information, la couleur la double. */
export function PastilleCadreD({ cadre, taille = 'petite' }: Props) {
  return (
    <span
      aria-hidden="true"
      className={`font-display fort inline-grid shrink-0 place-items-center rounded-full ${FOND_CADRE[cadre]} ${
        taille === 'grande' ? 'text-h3 size-12' : 'text-ui size-8'
      }`}
    >
      {lettreCadre(cadre)}
    </span>
  )
}
