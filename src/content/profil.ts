import type { Profil } from './types'

export const profil: Profil = {
  prenom: 'Wladimir',
  nom: 'Bigand',
  accroche: 'Bonjour, je suis',
  rolesTyping: [
    'Étudiant BTS SIO (SISR)',
    'Alternant Administrateur Systèmes & Réseaux',
    "Passionné d'infrastructure & de sécurité",
    'Développeur Web',
  ],
  // TODO(wladimir): texte repris de l'ancien site. Le mettre à jour pour mentionner l'alternance
  // et l'orientation infrastructure (il parle encore de « cybersécurité et développement web »).
  description:
    "Passionné par l'informatique depuis tout petit, j'ai développé une appétence pour la cybersécurité et le développement web. Actuellement en BTS SIO option SISR.",
  photo: { src: 'images/photo.png', alt: 'Portrait de Wladimir Bigand' },
  reseaux: [
    { label: 'GitHub', href: 'https://github.com/wladimirbigand', externe: true, icone: 'github' },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/wladimir-bigand/',
      externe: true,
      icone: 'linkedin',
    },
  ],
  ctaPrincipal: { label: 'Voir mes réalisations', href: '#realisations' },
  ctaSecondaire: { label: 'Me contacter', href: '#contact' },
}
