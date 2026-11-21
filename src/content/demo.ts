/**
 * Textes d’interface de la page « trame » (barre, accueil, épreuves, mode oral).
 * Ce sont des libellés d’interface, pas des faits : aucun contenu du portfolio n’est inventé ici.
 */
export const demo = {
  accueil: { id: 'accueil', nav: 'Accueil' },
  navPrincipale: 'Navigation principale',
  menu: 'Menu',
  sommaire: 'Sommaire',
  rolesTitre: 'Profil',
  reseauxTitre: 'Réseaux',
  epreuves: {
    disponible: 'Document disponible',
    format: 'PDF',
    ouvrirOnglet: 'Ouvrir dans un nouvel onglet',
    /** Texte de repli si le navigateur n’affiche pas les PDF dans la page. */
    apercuImpossible: "L’aperçu ne s’affiche pas dans ce navigateur. Téléchargez le document :",
    aVenirDetail: "Ce document n’est pas encore déposé.",
    /** Nom accessible d’une action : « Télécharger — Fiche 1, épreuve E6 ». */
    pour: (action: string, document: string, code: string) =>
      `${action} — ${document}, épreuve ${code}`,
  },
  basculeTheme: { light: 'Mode sombre', dark: 'Mode clair' },
  /** Compteur de position dans la barre : « 03 / 09 ». */
  total: (numero: string, total: number) => `${numero} / ${String(total).padStart(2, '0')}`,
  /** Mode oral (?oral) : chronomètre discret dans un coin de l’écran. */
  oral: {
    chronometre: 'Chronomètre de l’oral',
  },
}
