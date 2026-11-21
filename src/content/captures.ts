import type { Capture, CleCaptureVeille } from './types'

/**
 * Captures d’écran : elles sont déposées dans `src/assets/captures/`, et c’est leur nom qui décide de
 * l’endroit où elles s’affichent (convention : `src/assets/captures/LISEZ-MOI.md` et `CLAUDE.md`).
 *
 * - `realisation-<n>-<ordre>.png` : galerie de la fiche de la réalisation `n` ; la première remplace
 *   le picto de sa carte, si la réalisation figure parmi les cartes d’Entreprise.
 * - `veille-agregateur.png`, `veille-bot.png` : visuel de la carte de l’outil de veille.
 *
 * Au build, chaque fichier est converti en AVIF et en WebP, en plusieurs largeurs (vite-imagetools) :
 * le navigateur choisit. Les dimensions viennent du fichier ; rien n’est à saisir ici, sauf les légendes.
 */

/**
 * Texte alternatif et légende de chaque capture, par nom de fichier (sans l’extension).
 * À VÉRIFIER : en attente des légendes de Wladimir. Sans entrée ici, le texte alternatif est tiré du
 * nom du fichier (`altProvisoire`) et la capture n’a pas de légende.
 * Exemple : `'realisation-13-1': { alt: 'Ce que montre l’image.', legende: 'Légende affichée dessous.' }`
 */
export const legendes: Record<string, { alt: string; legende?: string }> = {}

/** Sortie de vite-imagetools (`as=picture`) : une liste de sources par format, et l’image de repli. */
interface Picture {
  sources: Record<string, string>
  img: { src: string; w: number; h: number }
}

const fichiers = import.meta.glob<Picture>('../assets/captures/*.{png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
  query: { w: '480;960;1600', format: 'avif;webp', as: 'picture', withoutEnlargement: '' },
})

const NOMS_VEILLE: Record<CleCaptureVeille, string> = {
  agregateur: 'l’agrégateur de flux RSS',
  bot: 'le bot Discord',
}

/** Texte alternatif provisoire, tiré du nom du fichier. À VÉRIFIER : à remplacer par une entrée de `legendes`. */
function altProvisoire(nom: string): string {
  const realisation = /^realisation-(\d+)-(\d+)$/.exec(nom)
  if (realisation) return `Capture d’écran ${Number(realisation[2])} de la réalisation ${Number(realisation[1])}`
  const veille = /^veille-(agregateur|bot)$/.exec(nom)
  if (veille) return `Capture d’écran : ${NOMS_VEILLE[veille[1] as CleCaptureVeille]}`
  return 'Capture d’écran'
}

const parRealisation = new Map<number, { ordre: number; capture: Capture }[]>()
const parOutil = new Map<string, Capture>()

for (const [chemin, image] of Object.entries(fichiers)) {
  const nom = chemin.slice(chemin.lastIndexOf('/') + 1).replace(/\.[^.]+$/, '')
  const capture: Capture = {
    nom,
    src: image.img.src,
    largeur: image.img.w,
    hauteur: image.img.h,
    sources: Object.entries(image.sources).map(([format, srcset]) => ({ type: `image/${format}`, srcset })),
    alt: legendes[nom]?.alt ?? altProvisoire(nom),
    legende: legendes[nom]?.legende,
  }
  const realisation = /^realisation-(\d+)-(\d+)$/.exec(nom)
  const veille = /^veille-(agregateur|bot)$/.exec(nom)
  if (realisation) {
    const numero = Number(realisation[1])
    parRealisation.set(numero, [...(parRealisation.get(numero) ?? []), { ordre: Number(realisation[2]), capture }])
  } else if (veille) parOutil.set(veille[1]!, capture)
  else if (import.meta.env.DEV) {
    console.warn(`Capture ignorée : « ${nom} » ne suit pas la convention (src/assets/captures/LISEZ-MOI.md).`)
  }
}

/** Captures d’une réalisation, dans l’ordre de leur numéro (`realisation-<n>-<ordre>`). */
export function capturesRealisation(numero: number): Capture[] {
  return [...(parRealisation.get(numero) ?? [])].sort((a, b) => a.ordre - b.ordre).map((entree) => entree.capture)
}

/** Capture d’un outil de veille (`veille-agregateur`, `veille-bot`), si elle a été déposée. */
export function captureVeille(cle: CleCaptureVeille): Capture | undefined {
  return parOutil.get(cle)
}
