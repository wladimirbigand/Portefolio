import { realisations, type StatutRealisation } from '@/content'

const COULEUR: Record<StatutRealisation, string> = {
  termine: 'text-ok',
  'en-cours': 'text-accent',
  'a-venir': 'text-muted',
}

/** Statut entre crochets : le libellé porte l'information, la couleur ne fait que la doubler. */
export function StatutB({ statut, note }: { statut: StatutRealisation; note?: string }) {
  return (
    <span className={`meta ${COULEUR[statut]}`}>
      <span className="whitespace-nowrap">[{realisations.libelles.statuts[statut]}]</span>
      {note && <span className="text-muted block">{note}</span>}
    </span>
  )
}
