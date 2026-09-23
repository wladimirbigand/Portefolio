import type { Formation } from './types'

export const formation: Formation = {
  section: {
    ancre: 'formation',
    label: 'Formation',
    titre: 'Campus Ermitage',
    titreAccent: 'Ermitage',
    sousTitre:
      "Anciennement UFA47, le Campus Ermitage est un partenariat entre L'Ermitage et l'Institution Sainte-Catherine, dépendant du CFA Aspect Aquitaine de Bordeaux. Il propose 4 BTS et un Bachelor en alternance sur Agen.",
  },
  etablissement: {
    nom: 'Campus Ermitage',
    site: {
      label: 'Visiter le site Campus Ermitage',
      href: 'https://postbac-campusermitage.com',
      externe: true,
    },
    logo: { src: 'images/logo-campus-ermitage.png', alt: 'Logo Campus Ermitage' },
  },
  partenariat: 'Partenariat DDEC 47 × CFA Aspect Aquitaine',
  accroche: 'Un parcours numérique continu',
  accrocheAccent: "de la Seconde jusqu'au BAC+5",
  description:
    "Formation en alternance sur Agen, répondant aux besoins du territoire. Un véritable parcours Numérique étendu progressivement jusqu'aux filières BAC+3 et BAC+5.",
  tags: [
    { label: 'Alternance', misEnAvant: true },
    { label: 'Agen' },
    { label: 'CFA Aspect Aquitaine' },
    { label: 'BAC+3' },
    { label: 'BAC+5' },
    { label: 'Parcours numérique' },
  ],
  titreFormations: 'Formations proposées',
  libelleMaFormation: 'Ma formation',
  formations: [
    {
      code: 'BTS SAM',
      nom: "Support à l'Action Managériale",
      description:
        'Assistance aux cadres, compétences relationnelles, organisationnelles et administratives.',
    },
    {
      code: 'BTS PI',
      nom: 'Professions Immobilières',
      description:
        'Formation complète sur la transaction, la gestion locative et les aspects juridiques du secteur.',
    },
    {
      code: 'BTS CJN',
      nom: 'Collaborateur Juriste Notarial',
      description:
        'Spécialisation dans les actes et formalités notariales ainsi que la veille juridique.',
    },
    {
      code: 'BTS SIO',
      nom: 'Services Informatiques aux Organisations',
      description:
        "Préparation aux métiers d'administrateur réseau et de développeur — options SISR / SLAM.",
      estMaFormation: true,
      optionsMisesEnAvant: ['SISR'],
    },
  ],
  titreParcoursNumerique: 'Parcours numérique progressif',
  parcoursNumerique: [
    { label: 'Seconde', etat: 'passe' },
    { label: 'BTS SIO', niveau: 'BAC+2', etat: 'actuel' },
    { label: 'Bachelor', niveau: 'BAC+3', etat: 'futur' },
    { label: 'Master', niveau: 'BAC+5', etat: 'futur' },
  ],
}
