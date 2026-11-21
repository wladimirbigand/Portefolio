import { useEffect, useRef } from 'react'
import { animate, useReducedMotion } from 'motion/react'
import type { MotionValue } from 'motion/react'
import { demo, profil } from '../../content'
import type { Theme } from '../../lib/theme'
import { hasard } from '../commun/toile'
import { echantillonner } from './Trame'
import type { Points } from './Trame'
import { estAlignee, etatDe, figure, placer, schemaAligne } from './figures'
import type { Tirage } from './figures'

/**
 * La trame sur un appareil tactile (`pointer: coarse`) : « posée ».
 *
 * Sur un téléphone, la page défile sur le fil du compositeur, sans attendre le script. Une toile fixe
 * redessinée à chaque image ne peut donc pas suivre une réserve : la figure traîne, se fige, puis
 * rattrape la page. Ici, chaque réserve porte sa propre toile, **dans le flux** : elle défile avec la
 * page, sans aucun dessin.
 *
 * - Une figure se compose quand sa réserve entre à l'écran (les points arrivent en vague), puis se
 *   pose et s'arrête : aucune boucle continue, aucun dessin pendant le défilement.
 * - Le portrait se disperse à mesure que l'on quitte l'accueil, et se reforme quand on y revient :
 *   c'est le défilement qui pilote, image par image. Un appui bref dessus lance l'onde ; un double
 *   appui bascule entre les points et la photo, avec la fusion du bureau (voir `Page.tsx`).
 * - Netteté : chaque toile est taillée à la densité de l'écran (plafonnée à 3), calée sur la grille
 *   des pixels de l'écran ; au repos, chaque point est posé sur un pixel entier.
 * - Aucune toile ne dépend de la hauteur de la fenêtre : la barre d'adresse peut apparaître ou
 *   disparaître sans rien effacer.
 * - Mouvement réduit : chaque figure est dessinée posée, sans arrivée ; le portrait ne se disperse pas.
 */

const TAU = Math.PI * 2
/** Densité de pixels maximale d'une toile : 3, la densité d'un iPhone. */
const DENSITE_MAX = 3
/** Points par ligne du portrait : sous 768 px, puis au-delà (tablette). */
const COLONNES_MOBILE = 64
const COLONNES_LARGE = 110
const REQUETE_MOBILE = '(max-width: 47.99em)'
/** Débord d'une toile de figure autour de sa réserve (px) : la place d'un point posé au bord. */
const MARGE = 10
/** Arrivée d'une figure : durée du trajet d'un point (s), et étalement des départs (s). */
const DUREE_POINT = 0.6
const ETALEMENT = 0.55
/** D'où part un point qui arrive : au plus à cette distance de sa place (px). */
const ELAN = 44
/** Un point de figure pour cette surface de réserve (px²), comme sur grand écran. */
const SURFACE_PAR_POINT = 26
const POINTS_MAX = 3000
/** Durée de l'onde (s). */
const DUREE_ONDE = 1.5
/** Durée de la fusion points → photo (s) : celle du bureau (`Trame.tsx`). */
const DUREE_FUSION = 0.7
/** En dessous de ce rayon (px), un point est tracé en carré. */
const RAYON_CARRE = 1.3
const TAILLE_LOT = 600

let ondeTactile: () => void = () => {}
/** Appui bref sur le portrait : un front traverse les points, de gauche à droite. */
export function lancerOndeTactile(): void {
  ondeTactile()
}

function lisser(v: number): number {
  const u = Math.min(1, Math.max(0, v))
  return u * u * (3 - 2 * u)
}
function lisserEntre(a: number, b: number, v: number): number {
  return lisser((v - a) / (b - a))
}

/** Une réserve et sa toile. Les longueurs sont en pixels CSS, dans le repère de la toile. */
interface Pose {
  element: HTMLElement
  id: string
  portrait: boolean
  toile: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  densite: number
  n: number
  /** Place de chaque point, calée sur la grille des pixels. */
  tx: Float32Array
  ty: Float32Array
  /** Figure : écart de départ et retard de chaque point. Portrait : direction de la dispersion. */
  dx: Float32Array
  dy: Float32Array
  retard: Float32Array
  /** Rayon : commun à la figure, propre à chaque point dans le portrait. */
  rayon: number
  rayons: Float32Array
  /** Portrait : abscisse de chaque point dans la trame (−1 à 1), pour l'onde. */
  abscisse: Float32Array
  unite: number
  /** Portrait : défilement (px) au bout duquel il est entièrement dispersé. */
  course: number
  enVue: boolean
  /** Instant de départ de l'arrivée en cours (ms), ou −1. */
  depart: number
  /** Dernière dispersion dessinée (0 à 1), ou −1 si rien n'est dessiné. */
  dessine: number
  /** Portrait : dernière fusion dessinée (0 : points, 1 : photo). */
  fusionDessinee: number
}

const VIDE = new Float32Array(0)

interface Props {
  theme: Theme
  /** Mode photo : la photo remplace les points du portrait. */
  photo: boolean
  opacitePhoto: MotionValue<number>
}

export function TramePosee({ theme, photo, opacitePhoto }: Props) {
  const reduit = useReducedMotion() ?? false
  const rafraichir = useRef<() => void>(() => {})
  const animer = useRef<() => void>(() => {})
  const courant = useRef({ theme, photo })
  courant.current = { theme, photo }

  useEffect(() => {
    const racine = document.querySelector<HTMLElement>('.da-trame')
    if (!racine) return
    const mobile = window.matchMedia(REQUETE_MOBILE)
    const poses = new Map<Element, Pose>()
    const actives = new Set<Pose>()
    let points: Points | null = null
    let encre = '#000'
    let accent = '#000'
    let demande = 0
    let departOnde = -1
    let detruit = false
    // Fusion points → photo (0 : points, 1 : photo), et instant de la dernière image (ms).
    let fusion = courant.current.photo ? 1 : 0
    let dernier = 0
    const tirage: Tirage = { u: 0, a: 0, b: 0 }

    for (const element of racine.querySelectorAll<HTMLElement>('[data-reserve]')) {
      const toile = document.createElement('canvas')
      const ctx = toile.getContext('2d')
      if (!ctx) continue
      const id = element.dataset.reserve ?? ''
      toile.className = 'p-toile-posee'
      toile.setAttribute('aria-hidden', 'true')
      element.append(toile)
      poses.set(element, {
        element, id, portrait: id === demo.accueil.id, toile, ctx, densite: 1, n: 0,
        tx: VIDE, ty: VIDE, dx: VIDE, dy: VIDE, retard: VIDE, rayon: 0, rayons: VIDE, abscisse: VIDE,
        unite: 0, course: 1, enVue: false, depart: -1, dessine: -1, fusionDessinee: -1,
      })
    }

    const lireCouleurs = () => {
      const style = getComputedStyle(racine)
      encre = style.getPropertyValue('--p-encre').trim() || '#000'
      accent = style.getPropertyValue('--p-accent').trim() || encre
    }

    /** Taille la toile sur sa réserve, calée sur les pixels de l'écran, et calcule la place des points. */
    const tailler = (pose: Pose) => {
      const { element, toile } = pose
      const zone = element.getBoundingClientRect()
      pose.n = 0
      pose.dessine = -1
      if (zone.width < 2 || zone.height < 2) {
        toile.style.display = 'none'
        return
      }
      toile.style.display = ''
      const d = Math.min(DENSITE_MAX, window.devicePixelRatio || 1)
      pose.densite = d
      // Le portrait déborde de sa réserve : c'est la place des points qui se dispersent.
      const libre = Math.min(zone.left, document.documentElement.clientWidth - zone.right)
      const cote = pose.portrait ? Math.max(0, Math.floor(Math.min(72, libre))) : MARGE
      const haut = pose.portrait ? 24 : MARGE
      // En bas, la toile s'arrête avant le texte qui suit le portrait : aucun point ne passe dessus.
      const bas = pose.portrait ? 18 : MARGE
      // Calage : le coin de la toile tombe sur un pixel entier de l'écran, elle n'est pas rééchantillonnée.
      const gauchePage = (zone.left + window.scrollX - cote) * d
      const hautPage = (zone.top + window.scrollY - haut) * d
      const fx = (gauchePage - Math.floor(gauchePage)) / d
      const fy = (hautPage - Math.floor(hautPage)) / d
      const largeur = Math.ceil((zone.width + cote * 2 + fx) * d)
      const hauteur = Math.ceil((zone.height + haut + bas + fy) * d)
      toile.style.left = `${-cote - fx}px`
      toile.style.top = `${-haut - fy}px`
      toile.style.width = `${largeur / d}px`
      toile.style.height = `${hauteur / d}px`
      if (toile.width !== largeur) toile.width = largeur
      if (toile.height !== hauteur) toile.height = hauteur
      const ox = cote + fx
      const oy = haut + fy
      const caler = (v: number) => Math.round(v * d) / d

      if (pose.portrait) {
        const p = points
        if (!p) return
        // Le pas de la trame vaut un nombre entier de pixels de l'écran : la grille est régulière et nette.
        const pas = Math.max(1, Math.round(((Math.min(zone.width / 2, zone.height / 3) * 2) / p.colonnes) * d)) / d
        const unite = (pas * p.colonnes) / 2
        const cx = caler(ox + zone.width / 2 - unite + pas / 2) + unite - pas / 2
        const cy = caler(oy + zone.height / 2 - unite * 1.5 + pas / 2) + unite * 1.5 - pas / 2
        const ton = courant.current.theme === 'dark' ? p.tonSombre : p.tonClair
        pose.n = p.n
        pose.unite = unite
        pose.tx = new Float32Array(p.n)
        pose.ty = new Float32Array(p.n)
        pose.dx = new Float32Array(p.n)
        pose.dy = new Float32Array(p.n)
        pose.rayons = new Float32Array(p.n)
        pose.retard = p.h1
        pose.abscisse = p.origineX
        for (let i = 0; i < p.n; i++) {
          pose.tx[i] = cx + p.origineX[i]! * unite
          pose.ty[i] = cy + p.origineY[i]! * unite
          // Dispersion : vers l'extérieur, un peu plus vers le bas.
          pose.dx[i] = (p.origineX[i]! * 0.5 + (p.h2[i]! - 0.5) * 1.3) * unite * 0.55
          pose.dy[i] = (p.h3[i]! - 0.25) * unite * 0.6
          pose.rayons[i] = pas * 0.58 * Math.sqrt(ton[i]!)
        }
        // Entièrement dispersé quand le bas du portrait approche de la barre.
        pose.course = Math.max(1, zone.top + window.scrollY + zone.height * 0.85 - 60)
        return
      }

      // Figure d'une section : le même repère que sur grand écran (voir `Trame.tsx`).
      const etat = etatDe(pose.id)
      const centreX = ox + zone.width / 2
      const centreY = oy + zone.height / 2
      const rapport = zone.width / zone.height
      let unite = 0
      let paysage = 0
      let schema = null
      if (estAlignee(pose.id)) {
        // Figure alignée sur une liste : un point d'arrêt à la hauteur de chaque ligne.
        const milieu = zone.top + zone.height / 2
        const hauteurs: number[] = []
        for (const ligne of document.querySelectorAll(`[data-arret="${pose.id}"]`)) {
          const cadre = ligne.getBoundingClientRect()
          if (cadre.height > 0) hauteurs.push((cadre.top + cadre.height / 2 - milieu) / (zone.width / 2))
        }
        schema = schemaAligne(pose.id, hauteurs, zone.width / 2)
        if (schema) unite = zone.width / 2
      }
      if (!schema) {
        if (rapport < 1.25) unite = Math.min(zone.width / 2, zone.height / 3)
        else {
          paysage = Math.min(16, rapport)
          unite = Math.min(zone.height / 2, zone.width / 3) * 0.94
        }
      }
      const n = Math.min(POINTS_MAX, Math.round((zone.width * zone.height) / SURFACE_PAR_POINT))
      const alea = hasard(4242 + etat)
      pose.n = n
      pose.unite = unite
      pose.rayon = Math.min(2.2, Math.max(1.1, ((unite * 2) / COLONNES_MOBILE) * 0.24))
      pose.tx = new Float32Array(n)
      pose.ty = new Float32Array(n)
      pose.dx = new Float32Array(n)
      pose.dy = new Float32Array(n)
      pose.retard = new Float32Array(n)
      for (let i = 0; i < n; i++) {
        tirage.u = (i + 0.5) / n
        tirage.a = alea()
        tirage.b = alea()
        const place = schema ? placer(schema, tirage) : figure(etat, tirage, paysage)
        pose.tx[i] = caler(centreX + place[0] * unite)
        pose.ty[i] = caler(centreY + place[1] * unite)
        // Arrivée : chaque point vient d'un peu plus loin, et la figure se trace brique après brique.
        const angle = alea() * TAU
        const distance = (0.35 + 0.65 * alea()) * ELAN
        pose.dx[i] = Math.cos(angle) * distance
        pose.dy[i] = Math.sin(angle) * distance
        pose.retard[i] = (tirage.u * 0.8 + alea() * 0.2) * ETALEMENT
      }
    }

    /** Dessine une figure : `age` secondes après le début de son arrivée (`Infinity` : posée). */
    const dessinerFigure = (pose: Pose, age: number) => {
      const { ctx, densite: d, toile } = pose
      ctx.setTransform(d, 0, 0, d, 0, 0)
      ctx.clearRect(0, 0, toile.width / d, toile.height / d)
      for (const passe of [0, 1]) {
        // Un point sur vingt-cinq en accent, un peu plus gros.
        const r0 = passe === 1 ? pose.rayon * 1.5 : pose.rayon
        ctx.beginPath()
        for (let i = passe === 1 ? 0 : 1; i < pose.n; i++) {
          if ((i % 25 === 0 ? 1 : 0) !== passe) continue
          const k = Math.min(1, Math.max(0, (age - pose.retard[i]!) / DUREE_POINT))
          if (k <= 0) continue
          const reste = (1 - k) * (1 - k) * (1 - k)
          const r = r0 * (1 - reste)
          const x = pose.tx[i]! + pose.dx[i]! * reste
          const y = pose.ty[i]! + pose.dy[i]! * reste
          ctx.moveTo(x + r, y)
          ctx.arc(x, y, r, 0, TAU)
        }
        ctx.fillStyle = passe === 1 ? accent : encre
        ctx.fill()
      }
      pose.dessine = age === Infinity ? 1 : 0
    }

    /** Dessine le portrait : dispersé de `s` (0 : entier, 1 : parti), avec l'onde éventuelle. */
    const dessinerPortrait = (pose: Pose, s: number, ageOnde: number) => {
      const { ctx, densite: d, toile } = pose
      ctx.setTransform(d, 0, 0, d, 0, 0)
      ctx.clearRect(0, 0, toile.width / d, toile.height / d)
      pose.dessine = s
      pose.fusionDessinee = fusion
      // Fusion : les points grossissent, se touchent et s'effacent sous la photo, comme sur bureau.
      const alpha = 1 - lisserEntre(0.35, 0.95, fusion)
      if (alpha <= 0.004) return
      const gonfle = 1 + 0.85 * fusion
      const front = ageOnde >= 0 ? -1.45 + ageOnde * 2.4 : 99
      const u = pose.unite
      let lot = 0
      ctx.fillStyle = encre
      ctx.globalAlpha = alpha
      ctx.beginPath()
      for (let i = 0; i < pose.n; i++) {
        // Les points ne partent pas tous ensemble : `retard` (0 à 1) étale les départs.
        const k = s <= 0 ? 0 : lisser(s * 1.55 - pose.retard[i]! * 0.55)
        let r = pose.rayons[i]! * (1 - k) * gonfle
        if (r < 0.3) continue
        let x = pose.tx[i]! + pose.dx[i]! * k
        let y = pose.ty[i]! + pose.dy[i]! * k
        if (front < 9) {
          const ecart = (pose.abscisse[i]! - front) / 0.17
          if (ecart > -3 && ecart < 3) {
            const g = Math.exp(-ecart * ecart)
            x += g * u * 0.04
            y += g * Math.sin(pose.ty[i]! * 0.09 + ageOnde * 16) * u * 0.035
            r *= 1 + 0.7 * g
          }
        }
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
      }
      ctx.fill()
      ctx.globalAlpha = 1
    }

    const dispersion = (pose: Pose) => (reduit ? 0 : Math.min(1, Math.max(0, window.scrollY / pose.course)))

    const image = (maintenant: number) => {
      demande = 0
      if (detruit) return
      const dt = dernier === 0 ? 1 / 60 : Math.min(0.05, (maintenant - dernier) / 1000)
      dernier = maintenant
      // Fusion points ↔ photo : elle avance vers le mode choisi, et pilote l'opacité de la photo.
      const cible = courant.current.photo ? 1 : 0
      if (fusion !== cible) {
        const pas = reduit ? 1 : dt / DUREE_FUSION
        fusion = cible > fusion ? Math.min(1, fusion + pas) : Math.max(0, fusion - pas)
        if (!reduit) opacitePhoto.set(lisserEntre(0.2, 0.85, fusion))
      }
      // La photo arrive : l'onde lancée par le premier appui d'un double appui s'arrête.
      if (cible === 1) departOnde = -1
      for (const pose of actives) {
        const age = (maintenant - pose.depart) / 1000
        if (age >= DUREE_POINT + ETALEMENT) {
          // Tous les points sont arrivés : la figure est posée, et la boucle s'arrête pour elle.
          dessinerFigure(pose, Infinity)
          pose.depart = -1
          actives.delete(pose)
        } else dessinerFigure(pose, Math.max(0, age))
      }
      let onde = false
      for (const pose of poses.values()) {
        if (!pose.portrait || pose.n === 0) continue
        const s = dispersion(pose)
        let ageOnde = -1
        if (departOnde >= 0) {
          ageOnde = (maintenant - departOnde) / 1000
          if (ageOnde > DUREE_ONDE) {
            departOnde = -1
            ageOnde = -1
          } else onde = true
        }
        // Hors de l'écran et entièrement dispersé : rien à dessiner.
        if (ageOnde >= 0 || s !== pose.dessine || fusion !== pose.fusionDessinee) {
          if (pose.enVue || pose.dessine !== 1 || s !== 1) dessinerPortrait(pose, s, ageOnde)
        }
      }
      if (actives.size > 0 || onde || fusion !== cible) demande = window.requestAnimationFrame(image)
      else dernier = 0
    }
    const planifier = () => {
      if (demande === 0 && !detruit) demande = window.requestAnimationFrame(image)
    }

    /** La réserve entre à l'écran : sa figure se compose. */
    const composer = (pose: Pose) => {
      if (pose.portrait) return planifier()
      if (pose.n === 0) tailler(pose)
      if (pose.n === 0) return
      if (reduit) return dessinerFigure(pose, Infinity)
      pose.depart = performance.now()
      actives.add(pose)
      dessinerFigure(pose, 0)
      planifier()
    }

    /** Taille ou couleurs changées : tout est redessiné dans son état posé, sans rejouer l'arrivée. */
    const retailler = (pose: Pose) => {
      tailler(pose)
      if (pose.portrait) {
        if (pose.n > 0) dessinerPortrait(pose, dispersion(pose), -1)
      } else if (pose.n > 0 && pose.enVue && !actives.has(pose)) dessinerFigure(pose, Infinity)
    }
    rafraichir.current = () => {
      lireCouleurs()
      for (const pose of poses.values()) retailler(pose)
    }
    animer.current = planifier

    const tailles = new ResizeObserver((entrees) => {
      for (const entree of entrees) {
        const pose = poses.get(entree.target)
        if (pose) retailler(pose)
      }
    })
    const vue = new IntersectionObserver(
      (entrees) => {
        for (const entree of entrees) {
          const pose = poses.get(entree.target)
          if (!pose) continue
          if (entree.isIntersecting && !pose.enVue) {
            pose.enVue = true
            composer(pose)
          } else if (!entree.isIntersecting) pose.enVue = false
        }
      },
      // Une réserve compte comme entrée quand elle a dépassé le bord de l'écran, pas dès son premier pixel.
      { rootMargin: '-7% 0px -7% 0px' },
    )

    const image0 = new Image()
    image0.decoding = 'async'
    const echantillon = () => {
      if (detruit || !image0.complete || image0.naturalWidth === 0) return
      points = echantillonner(image0, mobile.matches ? COLONNES_MOBILE : COLONNES_LARGE)
      for (const pose of poses.values()) if (pose.portrait) retailler(pose)
    }
    image0.onload = echantillon
    image0.src = profil.photoDetouree
    mobile.addEventListener('change', echantillon)

    ondeTactile = () => {
      if (reduit || courant.current.photo) return
      // Une onde à la fois.
      if (departOnde < 0) departOnde = performance.now()
      planifier()
    }

    lireCouleurs()
    for (const pose of poses.values()) {
      tailles.observe(pose.element)
      vue.observe(pose.element)
    }
    // Les polices arrivent après le premier rendu : les lignes bougent, les figures alignées aussi.
    void document.fonts.ready.then(() => {
      if (!detruit) rafraichir.current()
    })
    window.addEventListener('scroll', planifier, { passive: true })
    window.addEventListener('orientationchange', rafraichir.current)

    return () => {
      detruit = true
      if (demande !== 0) window.cancelAnimationFrame(demande)
      tailles.disconnect()
      vue.disconnect()
      image0.onload = null
      mobile.removeEventListener('change', echantillon)
      window.removeEventListener('scroll', planifier)
      window.removeEventListener('orientationchange', rafraichir.current)
      for (const pose of poses.values()) pose.toile.remove()
      ondeTactile = () => {}
      rafraichir.current = () => {}
      animer.current = () => {}
    }
  }, [reduit, opacitePhoto])

  // Thème : les couleurs sont relues et tout est redessiné, posé.
  useEffect(() => {
    rafraichir.current()
  }, [theme])

  // Mode photo : la fusion habituelle (les points grossissent et se fondent dans la photo), menée par
  // la boucle. En mouvement réduit, un simple fondu court de la photo.
  useEffect(() => {
    animer.current()
    if (!reduit) return
    const fondu = animate(opacitePhoto, photo ? 1 : 0, { duration: 0.2, ease: 'linear' })
    return () => fondu.stop()
  }, [photo, reduit, opacitePhoto])

  return null
}
