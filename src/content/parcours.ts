import type { Parcours } from './types'

export const parcours: Parcours = {
  section: {
    ancre: 'parcours',
    label: 'Parcours',
    titre: 'Mon parcours',
    titreAccent: 'parcours',
    sousTitre: 'Mon parcours de formation, mes projets réalisés et mes certifications.',
  },
  libelleCertifications: 'Certifications :',
  etapes: [
    {
      id: 'bts-sio',
      periode: '2025 – maintenant',
      titre: 'BTS SIO · Option SISR',
      // TODO(wladimir): préciser « en alternance au Campus Ermitage / Lot-et-Garonne Numérique » ?
      description: 'Réseau, systèmes, sécurité.',
      enCours: true,
    },
    {
      id: 'esiea',
      periode: '2023 – 2025',
      titre: 'ESIEA · Campus Numérique 47, Agen',
      organisation: 'Étudiant Informatique',
      groupes: [
        {
          titre: 'Projets informatiques',
          elements: [
            {
              nom: 'Accorderie Agenaise',
              description: 'Site web statique',
              stack: ['HTML', 'CSS', 'JS'],
            },
            {
              nom: "Diab'Landes",
              description: 'Site vitrine avec menu Admin',
              stack: ['HTML', 'CSS', 'JS', 'PHP', 'SQL'],
              realisation: 'site-diablandes',
            },
            {
              nom: 'Centre Jean Pouzet',
              description: 'Site vitrine avec menu Admin',
              stack: ['HTML', 'CSS', 'JS', 'Bootstrap', 'PHP', 'SQL'],
              realisation: 'site-jean-pouzet',
            },
          ],
        },
        {
          titre: 'Projets de formations humaines',
          elements: [
            { nom: "BATUC'FANFAR' BRASS-BAND", description: 'Création print' },
            { nom: 'Philippides', description: 'Communication visuelle' },
            { nom: 'EVAD', description: 'Communication print' },
          ],
        },
      ],
      certifications: ['toeic', 'voltaire'],
    },
    {
      id: 'bac',
      periode: '2021 – 2023',
      titre: 'Institution Sainte-Catherine, Villeneuve-sur-Lot',
      description: 'Baccalauréat technologique : Énergie & Environnement.',
    },
  ],
}
