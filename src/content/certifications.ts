import type { Certifications } from './types'

export const certifications: Certifications = {
  section: {
    ancre: 'certifications',
    label: 'Certifications',
    titre: 'Certifications',
    titreAccent: 'cations',
    sousTitre: 'Compétences validées par des organismes reconnus.',
  },
  libellesStatut: { obtenue: 'Obtenue', 'en-cours': 'En cours' },
  aVenir: {
    titre: 'À venir',
    detail: 'En préparation',
    description: 'De nouvelles certifications bientôt',
  },
  liste: [
    {
      id: 'toeic',
      nom: 'TOEIC',
      organisme: 'ETS Global',
      detail: 'Score : à définir · 2025', // TODO(wladimir): score TOEIC
      statut: 'obtenue',
      image: { src: 'certs/Toeic.jpg', alt: 'Certification TOEIC' },
      tags: ['Listening', 'Reading'],
    },
    {
      id: 'voltaire',
      nom: 'Certificat Voltaire',
      organisme: 'Projet Voltaire',
      detail: 'Score : 714 points · 2025',
      statut: 'obtenue',
      image: { src: 'certs/Voltaire.jpg', alt: 'Certificat Voltaire' },
      tags: ['Orthographe', 'Expression'],
    },
    {
      id: 'mooc-cnil',
      nom: 'MOOC CNIL',
      organisme: 'CNIL',
      detail: 'RGPD : les essentiels',
      statut: 'en-cours', // TODO(wladimir): toujours en cours ?
      image: { src: 'certs/MOOC_RGPD.png', alt: 'MOOC CNIL : RGPD' },
      tags: ['RGPD', 'Protection des données'],
    },
    {
      id: 'secnum',
      nom: 'MOOC SecNumAcadémie',
      organisme: 'ANSSI',
      detail: 'Les bases de la cybersécurité',
      statut: 'obtenue', // TODO(wladimir): statut non précisé sur l'ancien site (obtenu ?)
      image: { src: 'certs/SecNum.jpeg', alt: 'MOOC SecNumAcadémie (ANSSI)' },
      tags: ['Cybersécurité', 'ANSSI', 'SecNum'],
    },
    {
      id: 'mooc-ia',
      nom: "MOOC : Les fondamentaux de l'IA",
      organisme: 'CNFPT',
      detail: "Principes de base de l'IA",
      statut: 'obtenue', // TODO(wladimir): statut non précisé sur l'ancien site (obtenu ?)
      image: { src: 'certs/MOOC_IA.jpg', alt: "MOOC : Les fondamentaux de l'IA" },
      tags: ['Intelligence Artificielle', 'Machine Learning', 'MOOC'],
    },
    {
      id: 'ebios',
      nom: 'MOOC EBIOS Risk Manager',
      organisme: 'ANSSI / Club EBIOS',
      detail: 'Analyse des risques',
      statut: 'en-cours', // TODO(wladimir): toujours en cours ?
      image: { src: 'certs/EBIOS.jpg', alt: 'MOOC EBIOS Risk Manager' },
      tags: ['Analyse des risques', 'Cybersécurité'],
    },
    {
      id: 'mooc-osint',
      nom: 'MOOC OSINT',
      organisme: 'MOOC OSINT FR',
      detail: 'Concept de base',
      statut: 'en-cours', // TODO(wladimir): toujours en cours ?
      image: { src: 'certs/MOOC_OSINT.jpg', alt: 'MOOC OSINT' },
      tags: ['OSINT', 'Analyser des données'],
    },
  ],
}
