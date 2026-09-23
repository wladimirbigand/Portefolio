import type { Site } from './types'

export const site: Site = {
  titre: 'Wladimir Bigand · Portfolio',
  logo: { initiale: 'W', nom: 'Bigand', ariaLabel: 'Revenir en haut de la page' },
  navigation: [
    { label: 'Parcours', ancre: 'parcours' },
    { label: 'Formation', ancre: 'formation' },
    { label: 'Entreprise', ancre: 'entreprise' },
    { label: 'Épreuves', ancre: 'epreuves' },
    { label: 'Réalisations', ancre: 'realisations' },
    { label: 'Compétences', ancre: 'competences' },
    { label: 'Certifications', ancre: 'certifications' },
    { label: 'Veille', ancre: 'veille' },
    { label: 'Contact', ancre: 'contact' },
  ],
  cta: { label: 'Me contacter', ancre: 'contact' },
  libelles: {
    themeClair: 'Thème clair',
    themeSombre: 'Thème sombre',
    basculerTheme: 'Basculer entre thème clair et sombre',
    ouvrirMenu: 'Ouvrir le menu',
    fermerMenu: 'Fermer le menu',
    retourHaut: 'Revenir en haut de la page',
    chronoSession: 'Temps passé sur la page',
    chronoPresentation: 'Temps restant de présentation',
    progressionScroll: 'Progression de la lecture',
    scroll: 'Scroll',
    lienExterne: "(s'ouvre dans un nouvel onglet)",
  },
  footer: {
    copyright: '© 2026 Wladimir Bigand · Étudiant BTS SIO SISR',
    signature: 'Conçu avec passion et beaucoup de café',
  },
  presentation: {
    // TODO(wladimir): confirmer la durée de l'oral E5 (valeur par défaut : 20 minutes).
    dureeMinutes: 20,
  },
}
