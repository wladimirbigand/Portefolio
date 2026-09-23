import type { Epreuves } from './types'

export const epreuves: Epreuves = {
  section: {
    ancre: 'epreuves',
    label: 'Épreuves',
    titre: 'Épreuves BTS SIO',
    titreAccent: 'BTS SIO',
    sousTitre:
      'Les supports de présentation de mes épreuves du BTS SIO option SISR. Téléchargez le document ou consultez-en un aperçu directement dans la page.',
  },
  libelles: {
    apercu: 'Aperçu',
    telecharger: 'Télécharger',
    indisponible: 'Document bientôt disponible',
    indisponibleDetail: 'Le support de cette épreuve sera mis en ligne prochainement.',
    fermerApercu: "Fermer l'aperçu",
    titreApercu: 'Aperçu du document PDF',
  },
  liste: [
    {
      id: 'ef3',
      code: 'EF3',
      titre: 'Épreuve EF3',
      // TODO(wladimir): vérifier l'intitulé officiel.
      description:
        'Évaluation des compétences du bloc « Support et mise à disposition de services informatiques ».',
      icone: 'settings',
      // TODO(wladimir): ajouter public/epreuves/ef3.pdf puis renseigner pdf: 'epreuves/ef3.pdf'.
    },
    {
      id: 'e5',
      code: 'E5',
      titre: 'Épreuve E5',
      // TODO(wladimir): vérifier l'intitulé officiel.
      description:
        'Épreuve orale de 20 minutes sur la démarche de développement de compétences complémentaires en lien avec le projet professionnel.',
      icone: 'user',
      pdf: 'epreuves/e5.pdf',
    },
    {
      id: 'e6',
      code: 'E6',
      titre: 'Épreuve E6',
      // TODO(wladimir): vérifier l'intitulé officiel.
      description:
        'Évaluation du bloc « Administration des systèmes et des réseaux » et mise en œuvre des services informatiques.',
      icone: 'hard-drive',
      // TODO(wladimir): ajouter public/epreuves/e6.pdf puis renseigner pdf: 'epreuves/e6.pdf'.
    },
  ],
}
