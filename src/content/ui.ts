/** Textes d’interface communs à tout le site. */
export const ui = {
  evitement: 'Aller au contenu',
  /** Fenêtre superposée (aperçu PDF, fiche de réalisation). */
  fenetre: {
    fermer: 'Fermer',
  },
  /** Palette de navigation rapide (Ctrl+K, ou Cmd+K sur Mac). */
  palette: {
    titre: 'Recherche rapide',
    champ: 'Rechercher une section, une réalisation, un document ou une action',
    indice: 'Rechercher…',
    resultats: 'Résultats',
    /** Annonce aux lecteurs d’écran : « 3 résultats ». */
    compte: (nombre: number) => (nombre > 1 ? `${nombre} résultats` : `${nombre} résultat`),
    aucun: (recherche: string) => `Aucun résultat pour « ${recherche} ».`,
    groupes: {
      section: 'Sections',
      realisation: 'Réalisations',
      document: 'Documents',
      action: 'Actions',
    },
    /** Ce que fait Entrée sur un résultat, écrit au bout de sa ligne. */
    effets: {
      section: 'Aller à la section',
      realisation: 'Ouvrir la fiche',
      document: 'Ouvrir l’aperçu',
      action: 'Lancer',
    },
    realisation: (numero: number) => `Réalisation ${numero}`,
    actions: {
      themeSombre: 'Passer au thème sombre',
      themeClair: 'Passer au thème clair',
      photo: 'Portrait : afficher la photo',
      points: 'Portrait : afficher les points',
      oral: 'Mode oral (afficher ou masquer le chrono)',
    },
    /** Mots qui retrouvent une action, en plus de son libellé. */
    motsActions: {
      theme: 'theme clair sombre dark light mode couleur',
      portrait: 'portrait photo points trame visage basculer',
      oral: 'oral chrono chronometre minuteur temps duree touche o',
    },
    /** Rappel des touches, au pied de la palette. */
    touches: 'Flèches pour choisir · Entrée pour ouvrir · Échap pour fermer',
    /** Bouton discret du pied de page : « Recherche rapide », suivi du raccourci. */
    raccourci: { mac: '⌘ K', autre: 'Ctrl K' },
  },
  theme: {
    light: 'clair',
    dark: 'sombre',
    passerAuSombre: 'Passer au thème sombre',
    passerAuClair: 'Passer au thème clair',
  },
}
