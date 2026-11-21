/**
 * Référencement, partage et pages statiques (page 404, repli sans JavaScript).
 *
 * Ce fichier n'importe rien : il est lu par le site, mais aussi par `vite.config.ts` (qui écrit ces
 * textes dans `index.html` et `404.html` au build) et par `scripts/generer-apercu.mjs` (image de
 * partage). Garde-le sans import d'image ni de composant, et sans syntaxe TypeScript à l'exécution
 * (ni `enum`, ni `namespace`) : Node le charge tel quel.
 */

/** Adresse publique du site. Le chemin `/Portefolio/` (P majuscule) ne change pas. */
export const urlSite = 'https://wladimirbigand.fr/Portefolio/'

/** Profils publics : les mêmes liens dans l'accueil, dans Contact et dans les données structurées. */
export const liens = {
  github: 'https://github.com/wladimirbigand',
  linkedin: 'https://www.linkedin.com/in/wladimir-bigand/',
}

export const meta = {
  langue: 'fr',
  /** Région de l'Open Graph. */
  region: 'fr_FR',
  nom: 'Wladimir Bigand',
  /** Titre de l'onglet et des résultats de recherche. */
  titre: 'Portefolio de Wladimir Bigand',
  /** Description des résultats de recherche et des aperçus de partage (160 caractères au plus). */
  description:
    'Portfolio de Wladimir Bigand, administrateur systèmes et réseaux en alternance chez Lot-et-Garonne Numérique, en BTS SIO option SISR au Campus Ermitage d’Agen.',
  /** Métier, pour les données structurées (type Person). */
  metier: 'Administrateur systèmes et réseaux en alternance',
  /** Image de partage (1200 × 630), générée par `npm run apercu` dans `public/`. */
  apercu: {
    fichier: 'apercu.png',
    largeur: 1200,
    hauteur: 630,
    alt: 'Wladimir Bigand, administrateur systèmes et réseaux en alternance. Son portrait est dessiné en trame de points.',
    /** Lignes écrites dans l'image, sous le nom. */
    lignes: ['Administrateur systèmes et réseaux', 'en alternance · aspirant DevSecOps'],
    mention: 'Portefolio · BTS SIO option SISR · Campus Ermitage',
    adresse: 'wladimirbigand.fr/Portefolio',
  },
}

/** Repli affiché quand JavaScript est désactivé : l'essentiel, et de quoi me joindre. */
export const sansScript = {
  titre: 'Administrateur systèmes et réseaux en alternance · aspirant DevSecOps',
  texte:
    'Je suis en alternance chez Lot-et-Garonne Numérique, en BTS SIO option SISR au Campus Ermitage d’Agen. Ce portfolio a besoin de JavaScript pour s’afficher en entier ; voici l’essentiel.',
  contact: 'Contact',
  email: 'wladimir.bigand@gmail.com',
  linkedin: 'LinkedIn',
  github: 'GitHub',
  documents: 'Documents des épreuves',
  e5: 'Épreuve E5 : tableau de synthèse (PDF)',
  e6: 'Épreuve E6 : fiche de réalisation NeoRetail (PDF)',
}

/** Page 404 (`404.html`, servie par GitHub Pages pour toute adresse inconnue sous `/Portefolio/`). */
export const page404 = {
  titreOnglet: 'Page introuvable — Wladimir Bigand',
  code: '404',
  titre: 'Page introuvable',
  texte: 'Cette adresse ne correspond à aucune page du portfolio. Elle a peut-être changé avec la nouvelle version du site.',
  retour: 'Retour à l’accueil',
  logo: 'W.Bigand',
  /** Raccourcis vers les sections les plus demandées. */
  raccourcis: 'Ou directement',
  projets: 'Projets',
  epreuves: 'Épreuves',
  contact: 'Contact',
}

/**
 * Ancres de l'ancien site, redirigées vers les nouvelles (`src/lib/anciennesAncres.ts`).
 * Les autres ancres de l'ancien site (parcours, formation, entreprise…) portent déjà le même nom.
 */
export const anciennesAncres: Record<string, string> = {
  projects: 'projets',
  skills: 'competences',
  hero: 'accueil',
  top: 'accueil',
}
