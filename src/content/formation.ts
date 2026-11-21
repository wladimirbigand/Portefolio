// Logo téléchargé une seule fois depuis le site officiel (adresse de l’ancien site), servi localement.
import logoCampus from '../assets/logos/campus-ermitage.png'
import type { FormationProposee, Lien, Logo, PalierFormation, SectionMeta } from './types'

/**
 * Formation : le Campus Ermitage, entre Parcours et Entreprise.
 * Aucune mention de partenariat (ni L’Ermitage × Sainte-Catherine, ni DDEC 47 × CFA Aspect Aquitaine).
 */
export const formationSection: SectionMeta = {
  id: 'formation',
  nav: 'Formation',
  titre: 'Formation',
  picto: 'formation',
  sousTitre: 'Centre de formation en alternance à Agen. Il propose quatre BTS et un Bachelor.',
}

const siteEcole: Lien = {
  label: 'Visiter le site du Campus Ermitage',
  url: 'https://postbac-campusermitage.com',
}

const logoEcole: Logo = {
  src: logoCampus,
  alt: 'Logo du Campus Ermitage',
  largeur: 320,
  hauteur: 132,
}

export const ecole = {
  nom: 'Campus Ermitage',
  lieu: 'Agen',
  site: siteEcole,
  logo: logoEcole,
  /** Ce que Wladimir y prépare. */
  diplome: 'BTS SIO option SISR, en alternance',
  periode: '2025 – 2027',
}

export const formationLibelles = {
  diplome: 'Diplôme préparé',
  periode: 'Période',
  lieu: 'Lieu',
  formations: 'Formations proposées',
  /** État d’une formation, écrit à côté de son nom. */
  etats: {
    suivie: 'Ma formation',
    ouverte: 'Désormais ouvert',
  },
}

/** Formations proposées : celle de Wladimir d’abord, puis les autres BTS et le Bachelor. */
export const formations: FormationProposee[] = [
  {
    sigle: 'BTS SIO',
    nom: 'Services informatiques aux organisations',
    precision: 'Options SISR et SLAM',
    etat: 'suivie',
  },
  { sigle: 'BTS SAM', nom: 'Support à l’action managériale' },
  { sigle: 'BTS PI', nom: 'Professions immobilières' },
  { sigle: 'BTS CJN', nom: 'Collaborateur juriste notarial' },
  {
    // À VÉRIFIER : intitulé complet de « AIS » (probablement « Administrateur d’infrastructures sécurisées »).
    sigle: 'Bachelor AIS',
    nom: 'En alternance',
    etat: 'ouverte',
  },
]

/**
 * Parcours progressif de l'ancien site (Seconde → BTS → Bachelor → Master) : retiré à l'étape 3c bis.
 * Le tableau reste, vide ; la page ne l'affiche plus.
 */
export const parcoursProgressif: PalierFormation[] = []
