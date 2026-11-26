import { useEffect, useRef, useState } from 'react'
import { animate, useReducedMotion } from 'motion/react'
import type { MotionValue } from 'motion/react'
import { profil } from '../../content'
import { entrees } from '../../lib/demo'
import type { Theme } from '../../lib/theme'
import { frequenceEcran } from '../commun/ecran'
import { hasard, useToile } from '../commun/toile'
import type { Cadre } from '../commun/toile'
import { estAlignee, figure, placer, schemaAligne } from './figures'
import type { Schema, Tirage } from './figures'

const TAU = Math.PI * 2
/**
 * Trame régulière au format 2 × 3 : nombre de points par ligne. Dense sur grand écran, moins sous
 * 768 px. Chaque liste est une suite de paliers : si la fluidité chute, la trame passe au suivant.
 * La source est la photo détourée en pleine définition.
 */
const PALIERS_BUREAU = [150, 120, 96, 70]
const PALIERS_MOBILE = [64, 52, 40]
const REQUETE_MOBILE = '(max-width: 47.99em)'
/**
 * Sécurité de fluidité : la page est comparée à l'écran, dont la fréquence est mesurée au démarrage
 * (`frequenceEcran`). Si elle rend moins de cette part des images que l'écran affiche, pendant ce
 * nombre de secondes de suite, la densité baisse d'un palier. Un écran à 30 Hz n'y est donc pour rien.
 */
const PART_MIN = 0.8
const SECONDES_LENTES = 3
/** Au-delà de cette fréquence, l'exigence ne monte plus : 48 images par seconde restent fluides sur un écran à 144 ou 240 Hz. */
const FREQUENCE_PLAFOND = 60
/** Après un chargement ou un changement de densité, la mesure attend (ms) : le démarrage n'est pas représentatif. */
const DELAI_MESURE = 2500
/** Durée de la fusion points → photo (s). */
const DUREE_FUSION = 0.7

/** En dessous de ce rayon (px), un point est tracé en carré : indiscernable à l'œil, bien plus rapide. */
const RAYON_CARRE = 1.3
/** Nombre de points du portrait remplis d'un coup. */
const TAILLE_LOT = 600

/** Onde : au survol du prénom, un front traverse le portrait de gauche à droite. */
let departOnde = -1
const DUREE_ONDE = 1.5
export function lancerOnde(): void {
  const maintenant = performance.now()
  // Une onde à la fois : un survol répété ne les empile pas.
  if (departOnde < 0 || maintenant - departOnde > DUREE_ONDE * 1000) departOnde = maintenant
}

export interface Points {
  n: number
  colonnes: number
  /** Place de chaque point dans le portrait, en unités de trame : x de −1 à 1, y de −1,5 à 1,5. */
  origineX: Float32Array
  origineY: Float32Array
  /** Taille du point dans le portrait (0 à 1), en thème clair et en thème sombre. */
  tonClair: Float32Array
  tonSombre: Float32Array
  /** Trois tirages par point : départ et place dans la figure (h1, h2), présence dans les petites réserves (h3). */
  h1: Float32Array
  h2: Float32Array
  h3: Float32Array
  /** Position et vitesse, en unités de trame, dans le repère de la réserve `repere[i]`. */
  x: Float32Array
  y: Float32Array
  vx: Float32Array
  vy: Float32Array
  rayon: Float32Array
  repere: Int8Array
  place: boolean
}

/** Repère d'une réserve : son centre à l'écran, l'unité de trame en pixels, et son format. */
interface Repere {
  cx: number
  cy: number
  unite: number
  /** 0 pour une réserve en hauteur ; sinon son rapport largeur / hauteur. */
  paysage: number
  aire: number
  /** Figure alignée sur une liste : le schéma composé d'après les lignes mesurées. Sinon `null`. */
  schema: Schema | null
}

function lisser(a: number, b: number, v: number): number {
  const u = Math.min(1, Math.max(0, (v - a) / (b - a)))
  return u * u * (3 - 2 * u)
}

/** Lit la photo détourée (fond transparent) et en tire les points de la trame. */
export function echantillonner(image: HTMLImageElement, colonnes: number): Points | null {
  const lignes = Math.round(colonnes * 1.5)
  const tampon = document.createElement('canvas')
  tampon.width = colonnes
  tampon.height = lignes
  const ctx = tampon.getContext('2d', { willReadFrequently: true })
  if (!ctx) return null
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(image, 0, 0, colonnes, lignes)
  const pixels = ctx.getImageData(0, 0, colonnes, lignes).data

  const ox: number[] = []
  const oy: number[] = []
  const clair: number[] = []
  const sombre: number[] = []
  for (let j = 0; j < lignes; j++) {
    for (let i = 0; i < colonnes; i++) {
      const p = (j * colonnes + i) * 4
      const alpha = pixels[p + 3]! / 255
      // Hors de la silhouette : du blanc pour le thème clair (aucun point), rien pour le thème sombre.
      // Luminance (la source peut être en couleurs).
      const gris = 0.299 * pixels[p]! + 0.587 * pixels[p + 1]! + 0.114 * pixels[p + 2]!
      const lum = 1 - alpha + (alpha * gris) / 255
      const nx = ((i + 0.5) / colonnes) * 2 - 1
      const ny = (((j + 0.5) / lignes) * 2 - 1) * 1.5
      // Vignette ovale : la trame se dissout vers les bords au lieu de finir en rectangle.
      const ovale = 1 - lisser(0.8, 1.06, Math.hypot(nx, ny / 1.5))
      // Le cadrage se resserre autour de la tête et ne s'ouvre qu'aux épaules.
      const bord = Math.min(1.1, ny < 0.7 ? 0.7 : 0.7 + (ny - 0.7) * 1.2)
      const masque = ovale * (1 - lisser(bord - 0.14, bord + 0.04, Math.abs(nx)))
      // Clair : un point par zone sombre, demi-teintes allégées pour que le visage reste lisible.
      // Sombre : un point par zone claire de la silhouette.
      const c = Math.pow(1 - lum, 1.5) * masque
      const s = alpha < 0.5 ? 0 : Math.pow(lum, 2.1) * masque * 1.3
      if (c < 0.07 && s < 0.07) continue
      ox.push(nx)
      oy.push(ny)
      clair.push(c)
      sombre.push(s)
    }
  }

  const n = ox.length
  const alea = hasard(4242)
  return {
    n,
    colonnes,
    origineX: Float32Array.from(ox),
    origineY: Float32Array.from(oy),
    tonClair: Float32Array.from(clair),
    tonSombre: Float32Array.from(sombre),
    h1: Float32Array.from({ length: n }, alea),
    h2: Float32Array.from({ length: n }, alea),
    h3: Float32Array.from({ length: n }, alea),
    x: new Float32Array(n),
    y: new Float32Array(n),
    vx: new Float32Array(n),
    vy: new Float32Array(n),
    rayon: new Float32Array(n),
    repere: new Int8Array(n),
    place: false,
  }
}

const VARIABLES = ['--p-encre', '--p-accent'] as const

interface Props {
  /** Index de la section lue : 0 = accueil (portrait), puis les sections dans l'ordre de la navigation. */
  etat: number
  theme: Theme
  /** Mode photo : à l'accueil, les points se fondent dans la photo et le curseur ne déforme plus rien. */
  photo: boolean
  /** Opacité de la photo de l'accueil (0 à 1), pilotée par la fusion. */
  opacitePhoto: MotionValue<number>
}

/**
 * La trame : une toile fixe, plein écran, derrière le contenu. Les points composent le portrait
 * dans la réserve de l'accueil, puis, à chaque section, une figure dans la réserve de cette section
 * (`data-reserve="<id>"`). Une réserve est une boîte vide de la mise en page : la figure n'est donc
 * jamais sous le texte. Purement décorative ici : le portrait est décrit par sa réserve (`role="img"`).
 */
export function Trame({ etat, theme, photo, opacitePhoto }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)
  const points = useRef<Points | null>(null)
  const fusion = useRef<number | null>(null)
  const reperes = useRef<{ image: number; vus: Int32Array; liste: Repere[] }>({
    image: 0,
    vus: new Int32Array(entrees.length),
    liste: entrees.map(() => ({ cx: 0, cy: 0, unite: 0, paysage: 0, aire: 0, schema: null })),
  })
  /** Sécurité de fluidité : palier de densité courant, et mesure des images par seconde. */
  const palier = useRef(0)
  const mesure = useRef({ debut: 0, dernier: 0, images: 0, lentes: 0, reprise: 0 })
  /** Fréquence de l'écran (images par seconde) ; 0 tant qu'elle n'est pas mesurée. */
  const ecran = useRef(0)
  const reconstruire = useRef<() => void>(() => {})
  const arrets = useRef<number[]>([])
  const [pret, setPret] = useState(0)
  const reduit = useReducedMotion() ?? false

  // La trame : rééchantillonnée quand on passe le seuil mobile (moins de points, plus gros).
  useEffect(() => {
    const media = window.matchMedia(REQUETE_MOBILE)
    const image = new Image()
    image.decoding = 'async'
    const construire = () => {
      // Le portrait attend la mesure de l'écran (huit images, en général) : elle se fait page au repos.
      if (!image.complete || image.naturalWidth === 0 || ecran.current === 0) return
      const paliers = media.matches ? PALIERS_MOBILE : PALIERS_BUREAU
      palier.current = Math.min(palier.current, paliers.length - 1)
      const colonnes = paliers[palier.current]!
      points.current = echantillonner(image, colonnes)
      mesure.current.reprise = performance.now() + DELAI_MESURE
      mesure.current.lentes = 0
      // Densité, nombre de points et fréquence de l'écran, lisibles depuis la page (mesure de fluidité).
      if (ref.current) {
        ref.current.dataset.ecran = String(Math.round(ecran.current))
        ref.current.dataset.colonnes = String(colonnes)
        ref.current.dataset.points = String(points.current?.n ?? 0)
      }
      setPret((n) => n + 1)
    }
    // Fluidité insuffisante : un palier de moins, s'il en reste un.
    reconstruire.current = () => {
      const paliers = media.matches ? PALIERS_MOBILE : PALIERS_BUREAU
      if (palier.current >= paliers.length - 1) return
      palier.current++
      construire()
    }
    let monte = true
    void frequenceEcran().then((frequence) => {
      if (!monte) return
      ecran.current = frequence
      construire()
    })
    image.onload = construire
    image.src = profil.photoDetouree
    media.addEventListener('change', construire)
    return () => {
      monte = false
      image.onload = null
      reconstruire.current = () => {}
      media.removeEventListener('change', construire)
    }
  }, [])

  // Mouvement réduit : pas de fusion animée, un simple fondu court de la photo.
  const photoVisible = photo && etat === 0
  useEffect(() => {
    if (!reduit) return
    const fondu = animate(opacitePhoto, photoVisible ? 1 : 0, { duration: 0.2, ease: 'linear' })
    return () => fondu.stop()
  }, [reduit, photoVisible, opacitePhoto])

  /** Repère de la réserve d'une section, mesuré une fois par image. */
  const lireRepere = (index: number, l: number, h: number): Repere => {
    const memo = reperes.current
    const repere = memo.liste[index]!
    if (memo.vus[index] === memo.image) return repere
    memo.vus[index] = memo.image
    const id = entrees[index]?.id ?? ''
    for (const element of document.querySelectorAll(`[data-reserve~="${id}"]`)) {
      const zone = element.getBoundingClientRect()
      if (zone.width < 2 || zone.height < 2) continue
      repere.cx = zone.left + zone.width / 2
      repere.cy = zone.top + zone.height / 2
      repere.aire = zone.width * zone.height
      const rapport = zone.width / zone.height
      repere.schema = null
      if (estAlignee(id)) {
        // Figure alignée sur une liste : un point d'arrêt à la hauteur de chaque ligne, mesurée ici
        // à chaque image (elle suit donc un redimensionnement, ou une ligne qui se met en place).
        const unite = zone.width / 2
        const hauteurs = arrets.current
        hauteurs.length = 0
        for (const ligne of document.querySelectorAll(`[data-arret="${id}"]`)) {
          const cadre = ligne.getBoundingClientRect()
          if (cadre.height > 0) hauteurs.push((cadre.top + cadre.height / 2 - repere.cy) / unite)
        }
        repere.schema = schemaAligne(id, hauteurs, unite)
        if (repere.schema) {
          repere.paysage = 0
          repere.unite = unite
          return repere
        }
      }
      if (index === 0 || rapport < 1.25) {
        repere.paysage = 0
        repere.unite = Math.min(zone.width / 2, zone.height / 3)
      } else {
        repere.paysage = Math.min(16, rapport)
        repere.unite = Math.min(zone.height / 2, zone.width / 3) * 0.94
      }
      return repere
    }
    // Réserve introuvable (jamais vue) : la figure se pose au centre de l'écran.
    if (repere.unite === 0) {
      repere.cx = l / 2
      repere.cy = h / 2
      repere.unite = Math.min(l, h) / 6
      repere.aire = l * h
    }
    return repere
  }

  const tirage: Tirage = { u: 0, a: 0, b: 0 }

  const dessiner = ({ ctx, l, h, dt, pointeur, de, vers, k, vitesse, couleurs, theme: actuel, reduit: fixe }: Cadre) => {
    ctx.clearRect(0, 0, l, h)
    const p = points.current
    if (!p) return
    reperes.current.image++

    // Sécurité de fluidité : images comptées par tranches d'une seconde, et comparées à ce que l'écran
    // affiche. Trois tranches lentes de suite font baisser la densité d'un palier. Une pause (onglet
    // caché, toile hors écran) ne compte pas.
    if (!fixe) {
      const m = mesure.current
      const maintenant = performance.now()
      if (maintenant < m.reprise || maintenant - m.dernier > 1500) {
        m.debut = maintenant
        m.images = 0
      } else {
        m.images++
        const ecoule = maintenant - m.debut
        if (ecoule >= 1000) {
          const rendues = (m.images * 1000) / ecoule
          // La page vient de rendre plus d'images que la fréquence mesurée : l'écran va au moins aussi
          // vite (mesure prise pendant un démarrage chargé). On la corrige.
          if (rendues > ecran.current * 1.1) {
            ecran.current = rendues
            ctx.canvas.dataset.ecran = String(Math.round(rendues))
          }
          m.lentes = rendues < PART_MIN * Math.min(ecran.current, FREQUENCE_PLAFOND) ? m.lentes + 1 : 0
          m.debut = maintenant
          m.images = 0
          if (m.lentes >= SECONDES_LENTES) {
            m.lentes = 0
            // Hors de l'image en cours : la trame est rééchantillonnée, puis redessinée.
            window.setTimeout(reconstruire.current, 0)
          }
        }
      }
      m.dernier = maintenant
    }

    // Fusion points → photo : seulement à l'accueil, une fois les points revenus dans le portrait.
    const cibleFusion = photo && vers === 0 && k > 0.75 ? 1 : 0
    let f = fusion.current ?? cibleFusion
    if (fixe) f = cibleFusion
    else if (f !== cibleFusion) {
      const pas = dt / DUREE_FUSION
      f = cibleFusion > f ? Math.min(1, f + pas) : Math.max(0, f - pas)
    }
    fusion.current = f
    if (!fixe) opacitePhoto.set(lisser(0.2, 0.85, f))
    const alphaPortrait = 1 - lisser(0.35, 0.95, f)

    const ton = actuel === 'dark' ? p.tonSombre : p.tonClair
    const fige = fixe || !p.place

    const portee = 0.5
    const pousse = pointeur.force * 46

    // Onde : position du front (en unités de trame), ou hors champ quand aucune onde ne court.
    let front = 99
    let ageOnde = 0
    if (!fixe && departOnde >= 0) {
      ageOnde = (performance.now() - departOnde) / 1000
      if (ageOnde > DUREE_ONDE) departOnde = -1
      else front = -1.45 + ageOnde * 2.4
    }

    const figures = new Path2D()
    const accent = new Path2D()
    // Le portrait est rempli par lots : un seul tracé de milliers de disques coûte bien plus cher
    // à remplir que plusieurs petits.
    const encre = couleurs['--p-encre'] || '#000'
    const portraitVisible = alphaPortrait > 0.004
    let lot = 0
    ctx.fillStyle = encre
    ctx.globalAlpha = alphaPortrait
    ctx.beginPath()
    for (let i = 0; i < p.n; i++) {
      // Les points ne partent pas tous ensemble : la figure se recompose en vague.
      const parti = k >= p.h1[i]! * 0.55
      const etatPoint = parti ? vers : de
      const repere = lireRepere(etatPoint, l, h)
      const ancien = p.repere[i]!
      if (ancien !== etatPoint) {
        // Le point change de réserve : même place à l'écran, exprimée dans le nouveau repère.
        if (p.place) {
          const source = lireRepere(ancien, l, h)
          p.x[i] = (source.cx + p.x[i]! * source.unite - repere.cx) / repere.unite
          p.y[i] = (source.cy + p.y[i]! * source.unite - repere.cy) / repere.unite
          p.vx[i] = (p.vx[i]! * source.unite) / repere.unite
          p.vy[i] = (p.vy[i]! * source.unite) / repere.unite
        }
        p.repere[i] = etatPoint
      }

      const pas = (repere.unite * 2) / p.colonnes
      let tx = p.origineX[i]!
      let ty = p.origineY[i]!
      let tr = pas * 0.58 * Math.sqrt(ton[i]!) * (1 + 0.85 * f)
      if (etatPoint !== 0) {
        tirage.u = i / p.n
        tirage.a = p.h1[i]!
        tirage.b = p.h2[i]!
        const place = repere.schema ? placer(repere.schema, tirage) : figure(etatPoint, tirage, repere.paysage)
        tx = place[0]
        ty = place[1]
        // Dans une petite réserve, une partie seulement des points reste visible : la figure ne s'empâte pas.
        const visible = p.h3[i]! <= repere.aire / (p.n * 26)
        tr = visible ? Math.min(2.2, Math.max(1.1, pas * 0.24)) : 0
      }

      if (fige) {
        p.x[i] = tx
        p.y[i] = ty
        p.vx[i] = 0
        p.vy[i] = 0
        p.rayon[i] = tr
      } else {
        const ex = tx - p.x[i]!
        const ey = ty - p.y[i]!
        // Loin de sa place (changement de réserve), le point est freiné : il arrive sans dépasser.
        const frein = 8.5 + 6.7 * Math.min(1, Math.hypot(ex, ey) / 2)
        let ax = ex * 58 - p.vx[i]! * frein
        let ay = ey * 58 - p.vy[i]! * frein
        if (pousse > 0.01) {
          const dx = p.x[i]! - (pointeur.x - repere.cx) / repere.unite
          const dy = p.y[i]! - (pointeur.y - repere.cy) / repere.unite
          const d = Math.hypot(dx, dy)
          if (d < portee && d > 0.0001) {
            const force = (1 - d / portee) * (1 - d / portee) * pousse
            ax += (dx / d) * force
            ay += (dy / d) * force
          }
        }
        // Onde : le front pousse les points du portrait et les fait grossir sur son passage.
        if (front < 9 && etatPoint === 0) {
          const ecart = (p.origineX[i]! - front) / 0.17
          if (ecart > -3 && ecart < 3) {
            const g = Math.exp(-ecart * ecart)
            ax += g * 7
            ay += g * Math.sin(p.origineY[i]! * 7 + ageOnde * 16) * 9
            tr *= 1 + 0.7 * g
          }
        }
        // Inertie au défilement : les points traînent un peu derrière la page.
        ay -= vitesse * (0.3 + p.h2[i]!) * 5
        p.vx[i] = p.vx[i]! + ax * dt
        p.vy[i] = p.vy[i]! + ay * dt
        p.x[i] = p.x[i]! + p.vx[i]! * dt
        p.y[i] = p.y[i]! + p.vy[i]! * dt
        p.rayon[i] = p.rayon[i]! + (tr - p.rayon[i]!) * Math.min(1, dt * 7)
      }

      const r = p.rayon[i]!
      if (r < 0.35) continue
      const x = repere.cx + p.x[i]! * repere.unite
      const y = repere.cy + p.y[i]! * repere.unite
      if (y < -8 || y > h + 8 || x < -8 || x > l + 8) continue
      if (etatPoint === 0) {
        // Portrait : monochrome. Ces points s'effacent quand la photo prend le relais.
        if (!portraitVisible) continue
        if (r < RAYON_CARRE) ctx.rect(x - r, y - r, r * 2, r * 2)
        else {
          ctx.moveTo(x + r, y)
          ctx.arc(x, y, r, 0, TAU)
        }
        if (++lot >= TAILLE_LOT) {
          ctx.fill()
          ctx.beginPath()
          lot = 0
        }
      } else if (i % 25 === 0) {
        // L'accent n'apparaît que dans les figures, sur un point sur vingt-cinq.
        accent.moveTo(x + r * 1.5, y)
        accent.arc(x, y, r * 1.5, 0, TAU)
      } else {
        figures.moveTo(x + r, y)
        figures.arc(x, y, r, 0, TAU)
      }
    }
    p.place = true

    if (portraitVisible) ctx.fill()
    ctx.globalAlpha = 1
    ctx.fill(figures)
    ctx.fillStyle = couleurs['--p-accent'] || '#000'
    ctx.fill(accent)

  }

  useToile(ref, {
    etat,
    theme,
    variables: VARIABLES,
    dessiner,
    pret: `${pret}-${photo}`,
    sansPointeur: photo,
  })
  return <canvas ref={ref} className="p-toile" aria-hidden="true" />
}
