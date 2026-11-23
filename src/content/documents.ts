// Manifeste écrit par `scripts/pdf-en-images.mjs` avant chaque `npm run dev` et `npm run build`
// (jamais commité) : pour chaque PDF de `public/docs/`, ses pages converties en images.
import manifeste from '../generes/documents.json'

/** Pages d’un PDF converties en images au build (AVIF et WebP, en plusieurs largeurs). */
export interface PagesDocument {
  /** Dossier des images et du texte, relatif à `public/` : `docs-apercu/e6-neoretail`. */
  dossier: string
  /** Largeurs disponibles, en pixels. */
  largeurs: number[]
  /** Dimensions de chaque page (à la plus grande largeur) : elles réservent sa place avant le chargement. */
  pages: { largeur: number; hauteur: number }[]
}

const documents: Record<string, PagesDocument | undefined> = manifeste

/** Pages d’un PDF, par son chemin dans `public/` (`docs/e6-neoretail.pdf`). Absent : PDF non converti. */
export function pagesDocument(chemin: string): PagesDocument | undefined {
  return documents[chemin.replace(/^\/+/, '')]
}

/** Nom du fichier qui porte le texte extrait de chaque page (un tableau, une entrée par page). */
export const FICHIER_TEXTE = 'texte.json'
