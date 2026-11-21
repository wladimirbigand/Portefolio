import type { Epreuve, SectionMeta } from './types'

export const epreuvesSection: SectionMeta = {
  id: 'epreuves',
  nav: 'Épreuves',
  titre: 'Épreuves',
  picto: 'epreuves',
  sousTitre:
    "Les documents de mes épreuves du BTS SIO option SISR. Téléchargez un document ou ouvrez-en un aperçu en grand.",
}

export const epreuvesActions = {
  /** Mot qui précède le code : « Épreuve E5 ». */
  mot: 'Épreuve',
  telecharger: 'Télécharger',
  apercu: 'Aperçu',
  apercuTitre: 'Aperçu du document PDF',
  /** Sous 768 px, l’aperçu s’ouvre dans un nouvel onglet : précisé dans le nom accessible du lien. */
  apercuOnglet: 'Aperçu (nouvel onglet)',
  /** Titre de l’aperçu d’un document : « Épreuve E6 · Fiche 1 ». */
  titreApercu: (code: string, document: string) => `Épreuve ${code} · ${document}`,
  /** État affiché à la place des liens quand `fichier` est absent. */
  aVenir: 'Document à venir',
}

/**
 * Intitulés officiels. Aucune épreuve facultative.
 * Les PDF publiés sont des versions où le numéro de candidat est masqué, déposées par Wladimir
 * dans `public/docs/`. Un document sans `fichier` affiche « document à venir » (aucun lien cassé).
 */
export const epreuves: Epreuve[] = [
  {
    code: 'E5',
    intitule: 'Support et mise à disposition de services informatiques',
    description:
      'Oral de présentation du portfolio et des réalisations professionnelles, appuyé sur le tableau de synthèse.',
    documents: [
      {
        label: 'Session 2027',
        titre: 'Tableau de synthèse des réalisations professionnelles',
        fichier: 'docs/e5-tableau-de-synthese.pdf',
      },
    ],
  },
  {
    code: 'E6',
    intitule: 'Administration des systèmes et des réseaux (option SISR)',
    description:
      "Épreuve pratique et orale sur des réalisations d’administration des systèmes et des réseaux, chacune présentée dans une fiche descriptive.",
    documents: [
      {
        label: 'Fiche 1',
        titre:
          "Sécurisation et haute disponibilité d’une infrastructure applicative web 3-tiers pour la solution RetailSuite de NeoRetail Solutions", // intitulé de la fiche, mot pour mot
        fichier: 'docs/e6-neoretail.pdf',
      },
      // En attente : la fiche n°2 sera fournie plus tard (ajouter alors `titre` et `fichier`).
      { label: 'Fiche 2' },
    ],
  },
]
