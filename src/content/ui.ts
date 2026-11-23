/** Textes d’interface communs à tout le site. */
export const ui = {
  evitement: 'Aller au contenu',
  /** Fenêtre superposée (aperçu PDF, fiche de réalisation). */
  fenetre: {
    fermer: 'Fermer',
  },
  /** Zoom d’une capture ou d’un document (bouton, double-clic, pincement). */
  zoom: {
    zoomer: 'Zoomer',
    dezoomer: 'Dézoomer',
  },
  /** Visionneuse d’un document PDF : ses pages en images, et sa version texte. */
  visionneuse: {
    pages: 'Pages du document',
    outils: 'Outils du document',
    /** Compteur qui suit le défilement : « Page 2 / 8 ». */
    compteur: (page: number, total: number) => `Page ${page} / ${total}`, // espaces insécables
    /** Texte alternatif d’une page : « Épreuve E6 · Fiche 1, page 2 sur 8 ». */
    altPage: (titre: string, page: number, total: number) => `${titre}, page ${page} sur ${total}`,
    titrePage: (page: number) => `Page ${page}`,
    /** Bouton qui remplace les images par le texte extrait du PDF (accessibilité). */
    texte: 'Version texte',
    texteChargement: 'Chargement du texte…',
    texteErreur: 'Le texte n’a pas pu être chargé. Téléchargez le document pour le lire.',
    texteVide: 'Cette page ne contient pas de texte : c’est une image ou un schéma.',
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
