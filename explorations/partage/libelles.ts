// Libellés de l'outil d'exploration (serveur de dev uniquement, jamais publiés).
// Les libellés du site lui-même vivent dans src/content/.
import type { PisteId, Theme } from './types'

export const libellesExploration = {
  nomsPistes: {
    a: 'A · Précis',
    b: 'B · Infra',
    c: 'C · Éditorial',
    d: 'D · Signalétique',
  } satisfies Record<PisteId, string>,
  themes: { clair: 'Clair', sombre: 'Sombre' } satisfies Record<Theme, string>,
  mixeur: {
    titre: 'Mixeur de DA',
    ouvrir: 'Ouvrir le mixeur',
    replier: 'Replier le mixeur',
    layout: 'Mise en page',
    palette: 'Palette',
    type: 'Typographie',
    motion: 'Animations',
    theme: 'Thème',
    pistePure: 'Piste pure',
    pistePureAide: 'Aligner tous les axes sur la piste :',
    rejouer: 'Rejouer les animations',
    navToujoursVisible: 'Nav toujours visible (futur mode Présentation)',
    copierLien: 'Copier le lien',
    lienCopie: 'Lien copié',
    contrastes: 'Contrastes de la palette active',
    texteFond: 'Texte / fond',
    secondaireFond: 'Secondaire / fond',
    secondaireSurface: 'Secondaire / surface',
    accentFond: 'Accent / fond',
    bordureFond: 'Bordure UI / fond',
    avertissement: 'Sous le seuil',
    conforme: 'Conforme',
  },
  sectionNonPrototypee: 'Section hors périmètre de ce prototype.',
  /** Glyphes textuels propres à la piste B (à migrer dans src/content/ si B est retenue). */
  b: { statutOk: '[ OK ]', commandeMenu: 'cd' },
}
