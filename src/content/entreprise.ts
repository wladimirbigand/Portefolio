// Logo téléchargé une seule fois depuis le site officiel (adresse de l’ancien site), servi localement.
// Fichier réduit à sa taille d’affichage : 3rem de haut (48 px), en densité 2, soit 290 × 96.
import logoLgn from '../assets/logos/lot-et-garonne-numerique.webp'
import { realisations } from './projets'
import type { Lien, Logo, Realisation, SectionMeta } from './types'

export const entrepriseSection: SectionMeta = {
  id: 'entreprise',
  nav: 'Entreprise',
  titre: 'Entreprise',
  picto: 'entreprise',
  // Description fournie par Wladimir, mot pour mot (CONTENU-VALIDE.md, section 4).
  sousTitre:
    'Chargé de l’aménagement numérique du territoire en termes d’infrastructures, usages et services (Fibre, Accompagnement des collectivités dans la transition numérique)',
}

const siteEntreprise: Lien = {
  label: 'Visiter le site de Lot-et-Garonne Numérique',
  url: 'https://lot-et-garonne-numerique.fr',
}

const logoEntreprise: Logo = {
  src: logoLgn,
  alt: 'Logo de Lot-et-Garonne Numérique',
  largeur: 290,
  hauteur: 96,
}

export const entreprise = {
  nom: 'Lot-et-Garonne Numérique',
  sigle: 'LGN',
  site: siteEntreprise,
  logo: logoEntreprise,
  nature: 'Syndicat mixte — Aménagement numérique',
  poste: 'Alternant administrateur systèmes et réseaux',
  /** Période de l’alternance, en dates ISO. */
  debut: '2025-10-13',
  fin: '2027-06-30',
  environnement: [
    'Linux (Ubuntu)',
    'SSH',
    'Serveur dédié OVH',
    'Bash',
    'Active Directory',
    'Samba AD',
    'Exchange (via le prestataire)',
    'n8n',
    'Dolibarr',
    'Jitsi Meet',
    'QGIS',
    'Draw.io',
    'Hyper-V (maquette de migration)',
  ],
}

export const entrepriseLibelles = {
  poste: 'Poste',
  periode: 'Période',
  environnement: 'Environnement',
  missions: 'Réalisations mises en avant',
  /** Période en toutes lettres : « Du 13 octobre 2025 au 30 juin 2027 ». */
  duAu: (debut: string, fin: string) => `Du ${debut} au ${fin}`,
  /** Renvoi vers la liste complète, dans la section Projets. */
  toutesLesRealisations: { label: 'Voir toutes les réalisations', url: '#projets' } as Lien,
}

/**
 * Les missions sont les réalisations professionnelles du tableau de synthèse (`projets.ts`) :
 * aucun texte en double. La section Entreprise en met cinq en avant, en cartes (toutes terminées :
 * le service, le serveur, les comptes et le développement), et renvoie vers Projets pour la liste
 * complète. Chaque carte ouvre la fiche de sa réalisation.
 */
const numerosEnAvant = [4, 8, 10, 13, 16]

export const missionsEnAvant: Realisation[] = numerosEnAvant
  .map((numero) => realisations.find((realisation) => realisation.numero === numero))
  .filter((realisation): realisation is Realisation => realisation !== undefined)

/** Les 13 réalisations en milieu professionnel (1re et 2e années). */
export const missions: Realisation[] = realisations.filter(
  (realisation) => realisation.categorie !== 'formation',
)
