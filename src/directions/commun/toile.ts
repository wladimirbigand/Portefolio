import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import { useReducedMotion } from 'motion/react'
import type { Theme } from '../../lib/theme'

/** Tout ce qu'un objet vivant reçoit pour dessiner une image. Les longueurs sont en pixels CSS. */
export interface Cadre {
  ctx: CanvasRenderingContext2D
  l: number
  h: number
  /** Temps écoulé (s) et durée de l'image (s). Figés à 0 en mouvement réduit. */
  t: number
  dt: number
  /** Curseur dans le repère de la toile, lissé. `force` vaut 0 quand il est loin, 1 quand il est dessus. */
  pointeur: { x: number; y: number; force: number }
  /** Transition d'état : de l'état `de` vers l'état `vers`, `k` allant de 0 à 1 (linéaire). */
  de: number
  vers: number
  k: number
  /** Défilement de la page, de 0 (haut) à 1 (bas), et sa vitesse lissée (écrans par seconde). */
  defilement: number
  vitesse: number
  /** Couleurs lues dans les variables CSS de la piste (clé = nom de la variable). */
  couleurs: Record<string, string>
  theme: Theme
  reduit: boolean
}

interface Options {
  /** Index de la section lue (0 = accueil … 8 = contact). */
  etat: number
  theme: Theme
  /** Variables CSS à lire sur la toile, ex. `['--p-encre', '--p-accent']`. */
  variables: readonly string[]
  dessiner: (cadre: Cadre) => void
  /** Change quand une ressource de l'objet est prête (image chargée…) : force un nouveau dessin. */
  pret?: unknown
  /** Vrai quand le curseur ne doit rien déformer (mode photo). */
  sansPointeur?: boolean
}

const DUREE_TRANSITION = 1.1

/** Adoucit une progression linéaire : départ franc, fin longue. */
export function amortir(k: number): number {
  const u = 1 - Math.min(1, Math.max(0, k))
  return 1 - u * u * u
}

export function melanger(a: number, b: number, k: number): number {
  return a + (b - a) * k
}

/** Générateur pseudo-aléatoire déterministe : le même dessin à chaque chargement. */
export function hasard(graine: number): () => number {
  let s = graine >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let r = Math.imul(s ^ (s >>> 15), 1 | s)
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Boucle de dessin commune aux objets vivants (canvas 2D).
 * - Taille : suit l'élément (ResizeObserver), densité de pixels plafonnée à 2. Changer la taille d'une
 *   toile l'efface : elle est redessinée aussitôt, dans la même image (pas d'image vide).
 * - Aucune mesure inutile : la place de la toile et la hauteur de la page sont lues quand la mise en
 *   page change, pas à chaque image.
 * - Mouvement : une image par rafraîchissement, en pause quand l'onglet est caché.
 * - Mouvement réduit : aucune boucle. Une image fixe est dessinée à chaque changement
 *   (taille, section, thème), directement dans l'état final.
 */
export function useToile(ref: RefObject<HTMLCanvasElement | null>, options: Options): void {
  const reduit = useReducedMotion() ?? false
  const temps = useRef(0)
  const courant = useRef(options)
  courant.current = options
  const redessiner = useRef<() => void>(() => {})

  useEffect(() => {
    const toile = ref.current
    const ctx = toile?.getContext('2d')
    if (!toile || !ctx) return

    let l = 0
    let h = 0
    let visible = true
    let demande = 0
    let dernier = 0
    let t = temps.current
    let de = courant.current.etat
    let vers = de
    let k = 1
    let couleurs: Record<string, string> = {}
    let themeLu: Theme | null = null
    const brut = { x: -9999, y: -9999, souris: false }
    const pointeur = { x: 0, y: 0, force: 0 }
    let defilementLu = 0
    let vitesse = 0
    // Mesures gardées d'une image à l'autre : place de la toile dans la fenêtre, course du défilement.
    let gauche = 0
    let haut = 0
    let course = 0

    const mesurer = () => {
      const zone = toile.getBoundingClientRect()
      const densite = Math.min(2, window.devicePixelRatio || 1)
      l = zone.width
      h = zone.height
      gauche = zone.left
      haut = zone.top
      course = document.documentElement.scrollHeight - window.innerHeight
      const largeur = Math.max(1, Math.round(l * densite))
      const hauteur = Math.max(1, Math.round(h * densite))
      if (toile.width !== largeur || toile.height !== hauteur) {
        toile.width = largeur
        toile.height = hauteur
      }
      ctx.setTransform(densite, 0, 0, densite, 0, 0)
    }

    const image = (maintenant: number) => {
      demande = 0
      const o = courant.current
      const dt = reduit || dernier === 0 ? 0 : Math.max(0, Math.min(0.05, (maintenant - dernier) / 1000))
      dernier = maintenant
      t += dt
      temps.current = t

      if (o.etat !== vers) {
        de = vers
        vers = o.etat
        k = 0
      }
      k = reduit ? 1 : Math.min(1, k + dt / DUREE_TRANSITION)

      if (themeLu !== o.theme) {
        const style = getComputedStyle(toile)
        couleurs = Object.fromEntries(
          o.variables.map((nom) => [nom, style.getPropertyValue(nom).trim()]),
        )
        themeLu = o.theme
      }

      const cx = brut.x - gauche
      const cy = brut.y - haut
      const marge = 90
      const dessus =
        !reduit &&
        !o.sansPointeur &&
        brut.souris &&
        cx > -marge &&
        cx < l + marge &&
        cy > -marge &&
        cy < h + marge
      const suivi = Math.min(1, dt * 9)
      if (dessus) {
        if (pointeur.force < 0.01) {
          pointeur.x = cx
          pointeur.y = cy
        }
        pointeur.x += (cx - pointeur.x) * suivi
        pointeur.y += (cy - pointeur.y) * suivi
      }
      pointeur.force += ((dessus ? 1 : 0) - pointeur.force) * Math.min(1, dt * 5)

      const defilement = course > 0 ? Math.min(1, Math.max(0, window.scrollY / course)) : 0
      if (dt > 0) {
        const instantanee = ((defilement - defilementLu) * course) / window.innerHeight / dt
        // Bornée : un saut d'ancre ne doit pas se lire comme un défilement fulgurant.
        const bornee = Math.max(-3, Math.min(3, instantanee))
        vitesse += (bornee - vitesse) * Math.min(1, dt * 6)
      }
      defilementLu = defilement

      if (l > 0 && h > 0) {
        o.dessiner({
          ctx,
          l,
          h,
          t,
          dt,
          pointeur,
          de,
          vers,
          k,
          defilement,
          vitesse,
          couleurs,
          theme: o.theme,
          reduit,
        })
      }
      if (!reduit && visible && !document.hidden) demande = window.requestAnimationFrame(image)
    }

    const planifier = () => {
      if (demande === 0) demande = window.requestAnimationFrame(image)
    }
    redessiner.current = planifier

    const tailles = new ResizeObserver(() => {
      mesurer()
      // La toile vient peut-être d'être effacée : on la redessine tout de suite, sans attendre l'image suivante.
      if (demande !== 0) window.cancelAnimationFrame(demande)
      image(performance.now())
    })
    tailles.observe(toile)
    // La hauteur de la page change (police chargée, filtre, liste qui s'allonge) : la course du défilement aussi.
    tailles.observe(document.body)
    const vue = new IntersectionObserver(([entree]) => {
      visible = entree?.isIntersecting ?? true
      if (visible) {
        dernier = 0
        vitesse = 0
        planifier()
      }
    })
    vue.observe(toile)

    const surPointeur = (evenement: PointerEvent) => {
      brut.x = evenement.clientX
      brut.y = evenement.clientY
      brut.souris = evenement.pointerType === 'mouse'
    }
    const surSortie = () => {
      brut.souris = false
    }
    const surReveil = () => {
      dernier = 0
      planifier()
    }
    window.addEventListener('pointermove', surPointeur, { passive: true })
    document.documentElement.addEventListener('pointerleave', surSortie)
    document.addEventListener('visibilitychange', surReveil)
    // En mouvement réduit, l'image fixe suit quand même le défilement : la figure reste dans sa réserve.
    if (reduit) window.addEventListener('scroll', planifier, { passive: true })

    mesurer()
    planifier()

    return () => {
      if (demande !== 0) window.cancelAnimationFrame(demande)
      tailles.disconnect()
      vue.disconnect()
      window.removeEventListener('pointermove', surPointeur)
      document.documentElement.removeEventListener('pointerleave', surSortie)
      document.removeEventListener('visibilitychange', surReveil)
      window.removeEventListener('scroll', planifier)
      redessiner.current = () => {}
    }
  }, [ref, reduit])

  // Section, thème ou ressource : on relance un dessin (indispensable en mouvement réduit).
  useEffect(() => {
    redessiner.current()
  }, [options.etat, options.theme, options.pret, options.sansPointeur])
}
