// Version allégée de `src/assets/photo-detouree.png`, générée par `node scripts/optimiser-photo.mjs`.
import photoDetouree from '../assets/photo-detouree.webp'
import { liens } from './meta'
import type { NomPicto } from './types'

export const profil = {
  prenom: 'Wladimir',
  nom: 'Bigand',
  nomComplet: 'Wladimir Bigand',
  logoTexte: 'W.Bigand',
  accroche: 'Bonjour, je suis',
  /** Titre du héros, sur une ligne. */
  titre: 'Administrateur systèmes et réseaux en alternance · aspirant DevSecOps',
  /** Rôles secondaires du héros. */
  roles: [
    { texte: 'BTS SIO option SISR · Campus Ermitage', picto: 'formation' },
    { texte: 'Alternant chez Lot-et-Garonne Numérique', picto: 'entreprise' },
    { texte: 'Agen (47)', picto: 'lieu' },
  ] satisfies { texte: string; picto: NomPicto }[],
  presentation:
    "Je suis en alternance chez Lot-et-Garonne Numérique depuis octobre 2025, en BTS SIO option SISR au Campus Ermitage d’Agen. J’administre les systèmes, les réseaux et les services de l’organisation, et je me dirige vers le DevSecOps.",
  /** Portrait détouré sur fond transparent (800 × 1200, WebP) : mode photo, et source de la trame de points. */
  photoDetouree,
  photoAlt: 'Wladimir Bigand',
  actions: [
    { label: 'Voir mes projets', url: '#projets' },
    { label: 'Me contacter', url: '#contact' },
  ],
  reseaux: [
    { label: 'GitHub', url: liens.github, picto: 'github' },
    { label: 'LinkedIn', url: liens.linkedin, picto: 'linkedin' },
  ] satisfies { label: string; url: string; picto: NomPicto }[],
}
