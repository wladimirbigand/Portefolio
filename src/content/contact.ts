import { liens } from './meta'
import type { MoyenContact, SectionMeta } from './types'

export const contactSection: SectionMeta = {
  id: 'contact',
  nav: 'Contact',
  titre: 'Contact',
  picto: 'contact',
}

export const contact = {
  // À VÉRIFIER : intitulé complet de « AIS » (probablement « Administrateur d’infrastructures sécurisées »).
  accroche:
    'Je recherche une entreprise pour poursuivre en Bachelor AIS en alternance au Campus Ermitage, à partir de la rentrée 2027.',
  /** Texte simple : ce n’est pas un moyen de contact. */
  lieu: 'Agen (47)',
}

/**
 * Moyens de contact : e-mail, LinkedIn et GitHub. Pas de formulaire
 * (GitHub Pages n’a pas de serveur pour l’envoyer).
 * L’adresse est personnelle : le portfolio doit survivre à l’alternance.
 */
export const moyensContact: MoyenContact[] = [
  {
    type: 'email',
    label: 'wladimir.bigand@gmail.com',
    url: 'mailto:wladimir.bigand@gmail.com',
    valeur: 'wladimir.bigand@gmail.com',
  },
  {
    type: 'linkedin',
    label: 'linkedin.com/in/wladimir-bigand',
    url: liens.linkedin,
  },
  {
    type: 'github',
    label: 'github.com/wladimirbigand',
    url: liens.github,
  },
]

/** Libellés de la section : le nom de chaque ligne, puis les actions de l’e-mail. */
export const contactLibelles = {
  types: {
    email: 'E-mail',
    linkedin: 'LinkedIn',
    github: 'GitHub',
  } satisfies Record<MoyenContact['type'], string>,
  lieu: 'Lieu',
  /** Précision lue par les lecteurs d’écran après un lien externe. */
  nouvelOnglet: 'nouvel onglet',
}

/** Libellés de l’e-mail : lien mailto et bouton « copier ». */
export const contactActions = {
  ecrire: 'Écrire un e-mail',
  copier: 'Copier l’adresse',
  /** Confirmation visible, annoncée aux lecteurs d’écran. */
  copie: 'Adresse copiée',
  /** Le navigateur a refusé l’accès au presse-papiers : l’adresse reste affichée, à sélectionner. */
  echec: 'Copie impossible : sélectionnez l’adresse ci-dessus.',
}
