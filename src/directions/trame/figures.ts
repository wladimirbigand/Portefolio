/**
 * Figures de la trame : où va chaque point selon la section lue.
 * Chaque section a sa configuration réseau (route, anneau, étoile, bus, VLAN, pare-feu, arbre, maillage, liaison).
 *
 * Repère d'une figure :
 * - réserve en hauteur (cas général) : x de −1 à 1, y de −1,5 à 1,5 (le format 2 × 3 du portrait) ;
 * - réserve en largeur (`paysage` > 0, rapport largeur / hauteur) : y de −1 à 1, x de −paysage à paysage.
 *   La figure des épreuves a sa propre composition en largeur ; les autres sont simplement couchées.
 * - figure alignée sur une liste (parcours, formation) : la réserve est un rail posé à côté de la liste.
 *   L'unité vaut la demi-largeur du rail (x de −1 à 1), et chaque point d'arrêt est à la hauteur de sa
 *   ligne, mesurée dans la page (voir `schemaAligne`).
 */
import { entrees } from '../../lib/demo'

const TAU = Math.PI * 2
const sortie: [number, number] = [0, 0]

/** Ce qu'une figure a besoin de savoir sur un point : son rang et ses deux tirages (0 à 1). */
export interface Tirage {
  /** Rang du point, de 0 (premier) à 1 (dernier). */
  u: number
  a: number
  b: number
}

/** Pose un point du repère en hauteur ; dans une réserve en largeur, la figure est couchée. */
function poser(x: number, y: number, paysage: number): void {
  if (paysage > 0) {
    sortie[0] = y
    sortie[1] = x
  } else {
    sortie[0] = x
    sortie[1] = y
  }
}

/** Brique d'un schéma : un équipement (disque), une liaison (segment), un halo (anneau) ou une zone (nuage). */
type Brique =
  | { t: 'noeud'; x: number; y: number; r: number }
  | { t: 'lien'; x1: number; y1: number; x2: number; y2: number }
  | { t: 'halo'; x: number; y: number; r: number }
  | { t: 'zone'; x1: number; y1: number; x2: number; y2: number; poids: number }

export interface Schema {
  briques: Brique[]
  /** Part cumulée des points attribuée à chaque brique (0 à 1). */
  cumul: number[]
}

const noeud = (x: number, y: number, r: number): Brique => ({ t: 'noeud', x, y, r })
const lien = (x1: number, y1: number, x2: number, y2: number): Brique => ({ t: 'lien', x1, y1, x2, y2 })
const halo = (x: number, y: number, r: number): Brique => ({ t: 'halo', x, y, r })
const zone = (x1: number, y1: number, x2: number, y2: number, poids: number): Brique => ({
  t: 'zone',
  x1,
  y1,
  x2,
  y2,
  poids,
})
/** Contour d'un rectangle : quatre liaisons. */
const cadre = (x1: number, y1: number, x2: number, y2: number): Brique[] => [
  lien(x1, y1, x2, y1),
  lien(x2, y1, x2, y2),
  lien(x2, y2, x1, y2),
  lien(x1, y2, x1, y1),
]

/** Répartit les points : un équipement pèse selon sa surface, une liaison selon sa longueur. */
function schema(briques: Brique[]): Schema {
  const poids = briques.map((brique) => {
    switch (brique.t) {
      case 'noeud':
        return brique.r * brique.r * 22
      case 'lien':
        return Math.hypot(brique.x2 - brique.x1, brique.y2 - brique.y1) * 0.55
      case 'halo':
        return brique.r * TAU * 0.5
      default:
        return brique.poids
    }
  })
  const total = poids.reduce((somme, valeur) => somme + valeur, 0)
  let courant = 0
  const cumul = poids.map((valeur) => (courant += valeur / total))
  return { briques, cumul }
}

/** Étoile : un commutateur central et six postes. */
function etoile(): Brique[] {
  const briques: Brique[] = [noeud(0, 0, 0.3)]
  for (let k = 0; k < 6; k++) {
    const angle = (k / 6) * TAU + TAU / 12
    const x = Math.cos(angle) * 0.8
    const y = Math.sin(angle) * 1.05
    briques.push(lien(0, 0, x, y), noeud(x, y, 0.16))
  }
  return briques
}

/** Maillage : sept nœuds, chacun relié à plusieurs voisins. */
function maillage(): Brique[] {
  const points: [number, number][] = [
    [-0.6, -1.15],
    [0.55, -1],
    [-0.78, -0.05],
    [0.05, -0.2],
    [0.75, 0.2],
    [-0.45, 1.05],
    [0.5, 1.15],
  ]
  const paires: [number, number][] = [
    [0, 1], [0, 2], [0, 3], [1, 3], [1, 4], [2, 3], [3, 4], [2, 5], [3, 5], [3, 6], [4, 6], [5, 6],
  ]
  return [
    ...paires.map(([de, vers]) => lien(points[de]![0], points[de]![1], points[vers]![0], points[vers]![1])),
    ...points.map(([x, y]) => noeud(x, y, 0.15)),
  ]
}

/** Anneau : cinq postes sur une boucle, comme les cinq formations du campus. Le plus gros est le BTS SIO. */
function anneau(): Brique[] {
  const briques: Brique[] = [halo(0, 0, 0.78)]
  for (let k = 0; k < 5; k++) {
    const angle = (k / 5) * TAU - TAU / 4
    briques.push(noeud(Math.cos(angle) * 0.78, Math.sin(angle) * 0.78, k === 0 ? 0.26 : 0.15))
  }
  return briques
}

/** Schémas en hauteur, par section (clé : l'ancre de la section). */
const SCHEMAS: Record<string, Schema> = {
  // Parcours : une route à quatre sauts, du plus récent (en haut) au plus ancien. Le projet est un
  // anneau creux (pas encore atteint), la formation en cours le plus gros équipement.
  // Repli seulement : dans la page, la route est alignée sur les étapes (voir `ALIGNEES`).
  parcours: schema([
    halo(-0.5, -1.22, 0.19),
    lien(-0.36, -1.1, 0.45, -0.42),
    noeud(0.45, -0.42, 0.27),
    lien(0.45, -0.42, -0.45, 0.42),
    noeud(-0.45, 0.42, 0.17),
    lien(-0.45, 0.42, 0.4, 1.22),
    noeud(0.4, 1.22, 0.14),
  ]),
  // Formation : topologie en anneau. Repli seulement : dans la page, l'anneau est aligné sur les formations.
  formation: schema(anneau()),
  // Entreprise : topologie en étoile.
  entreprise: schema(etoile()),
  // Épreuves : un bus et ses trois postes (version en hauteur ; la version en largeur est plus bas).
  epreuves: schema([
    lien(-0.55, -1.3, -0.55, 1.3),
    lien(-0.55, -0.9, 0.2, -0.9),
    noeud(0.45, -0.9, 0.25),
    lien(-0.55, 0, 0.2, 0),
    noeud(0.45, 0, 0.25),
    lien(-0.55, 0.9, 0.2, 0.9),
    noeud(0.45, 0.9, 0.25),
  ]),
  // Projets : deux VLAN séparés, reliés par le seul commutateur.
  projets: schema([
    ...cadre(-0.92, -1.4, 0.92, -0.5),
    noeud(-0.52, -0.95, 0.15),
    noeud(0, -0.95, 0.15),
    noeud(0.52, -0.95, 0.15),
    lien(0, -0.5, 0, 0.5),
    noeud(0, 0, 0.2),
    ...cadre(-0.92, 0.5, 0.92, 1.4),
    noeud(-0.52, 0.95, 0.15),
    noeud(0, 0.95, 0.15),
    noeud(0.52, 0.95, 0.15),
  ]),
  // Compétences : un pare-feu qui filtre. Trafic en vrac au-dessus, une file ordonnée dessous.
  competences: schema([
    zone(-0.92, -1.4, 0.92, -0.35, 1.5),
    zone(-0.95, -0.12, -0.16, 0.02, 0.8),
    zone(0.16, -0.12, 0.95, 0.02, 0.8),
    lien(0, -0.3, 0, 0.95),
    noeud(0, 1.15, 0.24),
  ]),
  // Certifications : un arbre, de la racine aux feuilles.
  certifications: schema([
    noeud(0, -1.15, 0.22),
    lien(0, -1.15, -0.5, -0.15),
    lien(0, -1.15, 0.5, -0.15),
    noeud(-0.5, -0.15, 0.18),
    noeud(0.5, -0.15, 0.18),
    lien(-0.5, -0.15, -0.76, 0.95),
    lien(-0.5, -0.15, -0.26, 0.95),
    lien(0.5, -0.15, 0.26, 0.95),
    lien(0.5, -0.15, 0.76, 0.95),
    noeud(-0.76, 0.95, 0.13),
    noeud(-0.26, 0.95, 0.13),
    noeud(0.26, 0.95, 0.13),
    noeud(0.76, 0.95, 0.13),
  ]),
  // Veille : un maillage de sources.
  veille: schema(maillage()),
  // Contact : une liaison point à point, et le halo de celui qui écoute.
  contact: schema([
    noeud(0, -0.95, 0.26),
    lien(0, -0.95, 0, 0.8),
    noeud(0, 0.8, 0.26),
    halo(0, 0.8, 0.5),
  ]),
}

/** Épreuves, réserve en largeur : le bus court sous trois postes. `p` = rapport largeur / hauteur. */
const BUS_LARGE = new Map<number, Schema>()
function busLarge(paysage: number): Schema {
  const cle = Math.round(paysage * 10)
  let trouve = BUS_LARGE.get(cle)
  if (!trouve) {
    const pas = Math.min(2.1, paysage * 0.64)
    trouve = schema([
      lien(-pas - 0.75, 0.72, pas + 0.75, 0.72),
      ...[-pas, 0, pas].flatMap((x) => [lien(x, 0.1, x, 0.72), noeud(x, -0.32, 0.5)]),
    ])
    BUS_LARGE.set(cle, trouve)
  }
  return trouve
}

/** Compositions propres à une réserve en largeur, par section. */
const LARGES: Record<string, (paysage: number) => Schema> = {
  epreuves: busLarge,
}

/**
 * Figures alignées sur une liste : un point d'arrêt par ligne, à la hauteur de cette ligne.
 * `arrets` : hauteur de chaque ligne, dans l'ordre de la liste, en unités depuis le centre du rail.
 * `unite` : demi-largeur du rail, en pixels. Les rayons sont donnés en pixels (ils ne grossissent pas
 * avec le rail) et bornés par sa largeur.
 */
const ALIGNEES: Record<string, (arrets: readonly number[], unite: number) => Brique[]> = {
  // Parcours : une route qui relie les étapes dans l'ordre, de la plus récente à la plus ancienne.
  // Le projet est un anneau creux (pas encore atteint), la formation en cours le plus gros équipement.
  parcours: (arrets, unite) => {
    const tailles = [15, 20, 13, 11]
    const rayons = arrets.map((_, rang) => Math.min(tailles[Math.min(rang, tailles.length - 1)]!, unite * 0.85) / unite)
    // La route serpente si le rail est assez large ; sinon elle descend tout droit.
    const ecart = Math.max(0, Math.min(0.42, 0.95 - Math.max(...rayons)))
    const x = arrets.map((_, rang) => (rang % 2 === 0 ? -ecart : ecart))
    const briques: Brique[] = [halo(x[0]!, arrets[0]!, rayons[0]!)]
    for (let rang = 1; rang < arrets.length; rang++) {
      let x1 = x[rang - 1]!
      let y1 = arrets[rang - 1]!
      if (rang === 1) {
        // La liaison part du bord de l'anneau, pas de son centre : il reste creux.
        const d = Math.hypot(x[1]! - x1, arrets[1]! - y1) || 1
        x1 += ((x[1]! - x1) / d) * rayons[0]!
        y1 += ((arrets[1]! - y1) / d) * rayons[0]!
      }
      briques.push(lien(x1, y1, x[rang]!, arrets[rang]!), noeud(x[rang]!, arrets[rang]!, rayons[rang]!))
    }
    return briques
  },
  // Formation : un anneau de postes, un par formation. La boucle descend le long de la liste, puis
  // revient par la gauche. Le plus gros poste est la première formation (le BTS SIO).
  formation: (arrets, unite) => {
    const droite = 0.3
    const gauche = -0.6
    const dernier = arrets.length - 1
    const briques: Brique[] = []
    for (let rang = 0; rang <= dernier; rang++) {
      if (rang > 0) briques.push(lien(droite, arrets[rang - 1]!, droite, arrets[rang]!))
      briques.push(noeud(droite, arrets[rang]!, Math.min(rang === 0 ? 13 : 8, unite * 0.6) / unite))
    }
    briques.push(
      lien(droite, arrets[dernier]!, gauche, arrets[dernier]!),
      lien(gauche, arrets[dernier]!, gauche, arrets[0]!),
      lien(gauche, arrets[0]!, droite, arrets[0]!),
    )
    return briques
  },
}

/** Vrai si la figure de cette section s'aligne sur une liste (`data-arret="<id>"` sur chaque ligne). */
export function estAlignee(id: string): boolean {
  return id in ALIGNEES
}

const MEMO_ALIGNEES = new Map<string, { cle: string; schema: Schema }>()

/**
 * Schéma d'une figure alignée, pour les points d'arrêt mesurés dans la page. Il n'est recomposé que
 * si une mesure a changé (redimensionnement, liste qui bouge).
 */
export function schemaAligne(id: string, arrets: readonly number[], unite: number): Schema | null {
  const composer = ALIGNEES[id]
  if (!composer || arrets.length < 2 || unite <= 0) return null
  let cle = unite.toFixed(1)
  for (const arret of arrets) cle += `|${(arret * unite).toFixed(1)}`
  const memo = MEMO_ALIGNEES.get(id)
  if (memo && memo.cle === cle) return memo.schema
  const nouveau = schema(composer(arrets, unite))
  MEMO_ALIGNEES.set(id, { cle, schema: nouveau })
  return nouveau
}

/** Ancre de chaque état : 0 = accueil, puis les sections dans l'ordre de la navigation. */
const IDS: string[] = entrees.map((entree) => entree.id)

/** État (rang dans la navigation) d'une section, d'après son ancre. */
export function etatDe(id: string): number {
  return IDS.indexOf(id)
}

/**
 * Place d'un point dans la figure de la section d'état `etat` (son rang dans la navigation, à partir de 1).
 * Le tableau renvoyé est réutilisé d'un appel à l'autre : lire ses deux valeurs tout de suite.
 */
export function figure(etat: number, tirage: Tirage, paysage: number): [number, number] {
  const id = IDS[etat] ?? ''
  const composer = paysage > 0 ? LARGES[id] : undefined
  placer(composer ? composer(paysage) : (SCHEMAS[id] ?? SCHEMAS.contact!), tirage)
  // Une composition en largeur est déjà dans son repère ; les autres sont couchées si besoin.
  if (!composer) poser(sortie[0], sortie[1], paysage)
  return sortie
}

/**
 * Place d'un point dans un schéma, dans le repère du schéma. Même tableau réutilisé que `figure`.
 */
export function placer({ briques, cumul }: Schema, { u, a, b }: Tirage): [number, number] {
  let rang = 0
  while (rang < cumul.length - 1 && u > cumul[rang]!) rang++
  const brique = briques[rang]!
  let x = 0
  let y = 0
  switch (brique.t) {
    case 'noeud': {
      const r = brique.r * Math.sqrt(b)
      x = brique.x + Math.cos(a * TAU) * r
      y = brique.y + Math.sin(a * TAU) * r
      break
    }
    case 'lien':
      x = brique.x1 + (brique.x2 - brique.x1) * a + (b - 0.5) * 0.025
      y = brique.y1 + (brique.y2 - brique.y1) * a + (b - 0.5) * 0.025
      break
    case 'halo':
      x = brique.x + Math.cos(a * TAU) * (brique.r + (b - 0.5) * 0.03)
      y = brique.y + Math.sin(a * TAU) * (brique.r + (b - 0.5) * 0.03)
      break
    default:
      x = brique.x1 + (brique.x2 - brique.x1) * a
      y = brique.y1 + (brique.y2 - brique.y1) * b
  }
  sortie[0] = x
  sortie[1] = y
  return sortie
}
