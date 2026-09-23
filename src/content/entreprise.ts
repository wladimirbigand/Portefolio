import type { Entreprise } from './types'

export const entreprise: Entreprise = {
  section: {
    ancre: 'entreprise',
    label: '03 — Entreprise',
    titre: 'Lot-et-Garonne Numérique',
    titreAccent: 'Numérique',
    sousTitre:
      "Syndicat mixte œuvrant pour l'aménagement numérique du territoire : déploiement de la fibre optique, services numériques et ouverture des données publiques.",
  },
  nom: 'Lot-et-Garonne Numérique',
  site: {
    label: 'Visiter le site Lot-et-Garonne Numérique',
    href: 'https://lot-et-garonne-numerique.fr',
    externe: true,
  },
  logo: { src: 'images/logo-lgn.png', alt: 'Logo Lot-et-Garonne Numérique' },
  typeStructure: 'Syndicat mixte — Aménagement numérique',
  poste: 'Alternant — Administrateur Systèmes & Réseaux',
  // TODO(wladimir): mettre à jour avec les nouvelles missions (Jitsi/Dolibarr, support, n8n…).
  resumeMission:
    "Intervention sur l'administration des systèmes, l'infrastructure réseau, le développement d'outils internes et la gestion d'un portail open data (solution non pérennisée).",
  tags: [
    { label: 'Sysadmin', misEnAvant: true },
    { label: 'Réseaux', misEnAvant: true },
    { label: 'Linux' },
    { label: 'Next.js' },
    { label: 'OpenData' },
  ],
  infos: [
    { id: 'role', label: 'Rôle', valeur: 'Administrateur Systèmes & Réseaux', icone: 'user' },
    // TODO(wladimir): compléter la stack (Jitsi Meet, Dolibarr, reverse proxy, Docker…) si pertinent.
    {
      id: 'stack',
      label: 'Stack',
      valeur: 'Linux · Samba AD · Next.js · HTML/CSS/JS',
      icone: 'code',
    },
    {
      id: 'outils',
      label: 'Outils',
      valeur: 'Visual Studio Code · Hyper-V · Draw.io',
      icone: 'wrench',
    },
    {
      id: 'livrables',
      label: 'Livrables',
      valeur: 'Schémas réseaux, plateforme de formation, documentation technique',
      icone: 'package',
    },
    {
      id: 'infra',
      label: 'Infra',
      valeur: 'Migration Linux · Samba AD · Ubuntu 26.04 LTS',
      icone: 'server',
    },
    {
      id: 'qualite',
      label: 'Qualité',
      valeur: 'Sécurité · Documentation · Continuité de service',
      icone: 'award',
    },
  ],
  titreRealisations: 'Missions clés',
  realisations: [
    'samba-ad',
    'jitsi-dolibarr',
    'schema-vlan',
    'support-utilisateurs',
    'n8n-dolibarr',
    'plateforme-formation',
    'portail-open-data',
  ],
}
