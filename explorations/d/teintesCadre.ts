import type { CadreRealisation } from '@/content'

// Classes Tailwind complètes (détectables à la compilation) par cadre de réalisation.
export const FOND_CADRE: Record<CadreRealisation, string> = {
  entreprise: 'bg-cadre-entreprise text-on-cadre-entreprise',
  formation: 'bg-cadre-formation text-on-cadre-formation',
  personnel: 'bg-cadre-personnel text-on-cadre-personnel',
}

export const BORDURE_CADRE: Record<CadreRealisation, string> = {
  entreprise: 'border-cadre-entreprise',
  formation: 'border-cadre-formation',
  personnel: 'border-cadre-personnel',
}

export const ANNEAU_CADRE: Record<CadreRealisation, string> = {
  entreprise: 'ring-cadre-entreprise',
  formation: 'ring-cadre-formation',
  personnel: 'ring-cadre-personnel',
}

export const LIGNE_CADRE: Record<CadreRealisation, string> = {
  entreprise: 'bg-cadre-entreprise',
  formation: 'bg-cadre-formation',
  personnel: 'bg-cadre-personnel',
}
