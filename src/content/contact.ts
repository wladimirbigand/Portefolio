import type { Contact } from './types'

export const contact: Contact = {
  section: {
    ancre: 'contact',
    label: 'Contact',
    titre: 'Travaillons ensemble',
    titreAccent: 'ensemble',
  },
  // TODO(wladimir): reformulation proposée (l'ancien « Disponible pour un stage ou une alternance »
  // était incohérent avec l'alternance en cours). À valider ou réécrire.
  titre: 'Alternant, ouvert aux échanges',
  description:
    "Étudiant en BTS SIO SISR en alternance chez Lot-et-Garonne Numérique, je suis ouvert aux échanges autour des systèmes, des réseaux et de la sécurité : questions sur mes réalisations, poursuite d'études ou opportunités après le BTS.",
  email: 'wladimir.bigand@gmail.com',
  liens: [
    {
      label: 'wladimir.bigand@gmail.com',
      href: 'mailto:wladimir.bigand@gmail.com',
      icone: 'mail',
    },
    {
      label: 'linkedin.com/in/wladimir-bigand',
      href: 'https://www.linkedin.com/in/wladimir-bigand/',
      externe: true,
      icone: 'linkedin',
    },
    {
      label: 'github.com/wladimirbigand',
      href: 'https://github.com/wladimirbigand',
      externe: true,
      icone: 'github',
    },
  ],
  localisation: { label: 'Agen (47), France', icone: 'map-pin' },
  formulaire: {
    // TODO(wladimir): créer le formulaire sur formspree.io et remplacer <id> par l'identifiant.
    endpoint: 'https://formspree.io/f/<id>',
    champs: [
      { nom: 'nom', label: 'Nom', placeholder: 'Votre nom', type: 'text' },
      { nom: 'email', label: 'Email', placeholder: 'votre@email.com', type: 'email' },
      { nom: 'message', label: 'Message', placeholder: 'Votre message…', type: 'textarea' },
    ],
    envoyer: 'Envoyer le message',
    envoiEnCours: 'Envoi en cours…',
    succes: 'Message envoyé, merci ! Je vous réponds rapidement.',
    erreur: "L'envoi a échoué. Vous pouvez m'écrire directement par email.",
  },
}
