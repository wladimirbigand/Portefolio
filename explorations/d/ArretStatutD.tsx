import type { StatutRealisation } from '@/content'

const FORMES: Record<StatutRealisation, string> = {
  termine: 'bg-fg',
  'en-cours': 'border-[5px] border-fg bg-surface',
  'a-venir': 'border-[3px] border-dashed border-fg bg-bg',
}

/** Arrêt sur l'embranchement : la forme indique le statut (plein, anneau, pointillé). */
export function ArretStatutD({ statut }: { statut: StatutRealisation }) {
  return <span aria-hidden="true" className={`block size-6 rounded-full ${FORMES[statut]}`} />
}
