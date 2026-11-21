import { useEffect } from 'react'
import type { RefObject } from 'react'
import { useReducedMotion } from 'motion/react'
import type { Theme } from '../../lib/theme'

/**
 * Texte en particules.
 *
 * Le texte reste un vrai texte HTML : l'élément `source` le porte, lisible et sélectionnable. Ce
 * module le redessine en points sur une toile posée par-dessus. Deux comportements :
 *
 * - `useTexteEparpille` (numéros de section, emblèmes) : au repos, le texte est net et la toile est
 *   vide. Quand le curseur passe sur le texte, et seulement sur lui, le texte se défait en points qui
 *   s'éparpillent autour du curseur ; ils reviennent ensuite à leur place, et le texte net reprend le
 *   relais. Le passage se fait sans saut : voir la fonction.
 * - `useParticulesTexte` (bloc de code) : le texte est toujours dessiné en points
 *   (`data-particules="pret"`), et le curseur les écarte comme une loupe.
 *
 * Dans les deux cas, la boucle ne tourne que si le curseur est dessus ou si des points ne sont pas
 * revenus ; elle s'arrête hors de l'écran et quand l'onglet est caché.
 */
export interface OptionsParticules {
  /** Pas de la grille d'échantillonnage, en pixels CSS. */
  pas: number
  /** Rayon d'un point, en pixels CSS. */
  rayon: number
  /** Débord de la toile autour du texte, en pixels CSS : la place des points déplacés. */
  marge: number
  /** Thème courant : les points du bloc de code sont redessinés quand il change. */
  theme?: Theme
}

const TAU = Math.PI * 2

/** Réglages du mouvement. L'éparpillement est plus contenu que le portrait : moins de points. */
const REGLAGES = {
  eparpille: { portee: 46, pousse: 3300, raideur: 150, frein: 13, freinRetour: 22 },
  loupe: { portee: 78, pousse: 5200, raideur: 170, frein: 15 },
} as const

/** Durées du passage texte ↔ particules, en secondes. */
const FONDU_ALLER = 0.16
const LIBERATION = 0.45
const RELIURE = 0.3
const FONDU_RETOUR = 0.18
/** Écart (pixels CSS) en dessous duquel les points qui reviennent se relient au dessin du texte. */
const ECART_RELIURE = 4

/** Courbe douce : départ et arrivée sans à-coup. */
function adoucir(t: number): number {
  return t * t * (3 - 2 * t)
}

/** Mot-clé CSS de la largeur de police, pour l'écriture abrégée de `font` (seule forme admise par la toile). */
function largeurPolice(etirement: string): string {
  const valeur = parseFloat(etirement)
  if (!Number.isFinite(valeur) || valeur >= 100) return 'normal'
  if (valeur <= 62.5) return 'extra-condensed'
  if (valeur <= 75) return 'condensed'
  return 'semi-condensed'
}

/** La police d'un élément, dans l'écriture abrégée attendue par la toile. */
function policeToile(style: CSSStyleDeclaration): string {
  return `${style.fontStyle} ${style.fontWeight} ${largeurPolice(style.fontStretch)} ${style.fontSize} ${style.fontFamily}`
}

interface Nuage {
  n: number
  /** Place de repos de chaque point, dans le repère de la toile (pixels CSS). */
  hx: Float32Array
  hy: Float32Array
  x: Float32Array
  y: Float32Array
  vx: Float32Array
  vy: Float32Array
  /** Un tirage par point (0 à 1) : chacun réagit un peu différemment, les points s'éparpillent. */
  alea: Float32Array
}

function nuageDe(hx: number[], hy: number[]): Nuage | null {
  const n = hx.length
  if (n === 0) return null
  return {
    n,
    hx: Float32Array.from(hx),
    hy: Float32Array.from(hy),
    x: Float32Array.from(hx),
    y: Float32Array.from(hy),
    vx: new Float32Array(n),
    vy: new Float32Array(n),
    // Déterministe : le même éparpillement à chaque passage.
    alea: Float32Array.from({ length: n }, (_, i) => {
      const s = Math.sin(i * 12.9898 + 78.233) * 43758.5453
      return s - Math.floor(s)
    }),
  }
}

/** Dessine le texte de `source` hors écran, ligne par ligne, et en tire une grille de points. */
function echantillonner(source: HTMLElement, pas: number, marge: number): Nuage | null {
  const style = getComputedStyle(source)
  const largeur = source.clientWidth || source.offsetWidth
  const hauteur = source.clientHeight || source.offsetHeight
  if (largeur < 2 || hauteur < 2) return null
  const taille = parseFloat(style.fontSize)
  // Suréchantillonnage : le contour des lettres est lu plus finement que le pas de la grille.
  const finesse = 2
  const tampon = document.createElement('canvas')
  tampon.width = Math.ceil(largeur * finesse)
  tampon.height = Math.ceil(hauteur * finesse)
  const ctx = tampon.getContext('2d', { willReadFrequently: true })
  if (!ctx) return null
  ctx.scale(finesse, finesse)
  ctx.font = policeToile(style)
  if ('letterSpacing' in ctx && style.letterSpacing !== 'normal') {
    ;(ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = style.letterSpacing
  }
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = '#000'
  const mesure = ctx.measureText('Hg')
  const montant = mesure.fontBoundingBoxAscent
  const descente = mesure.fontBoundingBoxDescent
  const interligne = style.lineHeight === 'normal' ? taille * 1.2 : parseFloat(style.lineHeight)
  const lignes = (source.textContent ?? '').split('\n')
  const gauche = parseFloat(style.paddingLeft) || 0
  const haut = parseFloat(style.paddingTop) || 0
  lignes.forEach((ligne, rang) => {
    const base = haut + rang * interligne + (interligne - (montant + descente)) / 2 + montant
    ctx.fillText(ligne, gauche, base)
  })

  const pixels = ctx.getImageData(0, 0, tampon.width, tampon.height).data
  const hx: number[] = []
  const hy: number[] = []
  for (let y = pas / 2; y < hauteur; y += pas) {
    for (let x = pas / 2; x < largeur; x += pas) {
      const px = Math.min(tampon.width - 1, Math.round(x * finesse))
      const py = Math.min(tampon.height - 1, Math.round(y * finesse))
      if (pixels[(py * tampon.width + px) * 4 + 3]! < 120) continue
      hx.push(x + marge)
      hy.push(y + marge)
    }
  }
  return nuageDe(hx, hy)
}

/**
 * Texte toujours dessiné en points (bloc de code) : le curseur les écarte comme une loupe.
 * - Mouvement réduit et toucher (`pointer: coarse`) : une image fixe.
 * - Netteté : la toile est taillée à la densité de l'écran (plafonnée à 2, à 3 au toucher) ; les
 *   points carrés sont posés au repos sur des pixels entiers.
 */
export function useParticulesTexte(
  source: RefObject<HTMLElement | null>,
  toile: RefObject<HTMLCanvasElement | null>,
  { pas, rayon, marge, theme }: OptionsParticules,
): void {
  const reduit = useReducedMotion() ?? false

  useEffect(() => {
    const texte = source.current
    const cible = toile.current
    const ctx = cible?.getContext('2d')
    if (!texte || !cible || !ctx) return
    const tactile = window.matchMedia('(pointer: coarse)').matches
    // Au toucher, l'image est fixe : elle peut suivre la densité d'un iPhone.
    const densiteMax = tactile ? 3 : 2
    // Bloc qui contient le texte et la toile : il porte l'état (`data-particules`), et c'est la zone
    // sensible au curseur.
    const bloc = cible.parentElement ?? texte
    const { portee, pousse, raideur, frein } = REGLAGES.loupe

    let nuage: Nuage | null = null
    let demande = 0
    let dernier = 0
    let visible = true
    let detruit = false
    let encre = '#000'
    let accent = '#000'
    const pointeur = { x: 0, y: 0, dessus: false, force: 0 }

    const dessiner = () => {
      const densite = Math.min(densiteMax, window.devicePixelRatio || 1)
      ctx.setTransform(densite, 0, 0, densite, 0, 0)
      ctx.clearRect(0, 0, cible.width, cible.height)
      if (!nuage) return
      // Très petits points : un carré, indiscernable d'un disque et bien plus rapide à tracer.
      const carre = rayon < 1
      for (const passe of [0, 1]) {
        ctx.beginPath()
        for (let i = 0; i < nuage.n; i++) {
          // Un point sur vingt-cinq en accent, comme dans les figures de la trame.
          if ((i % 25 === 0 ? 1 : 0) !== passe) continue
          const r = passe === 1 ? rayon * 1.25 : rayon
          const x = nuage.x[i]!
          const y = nuage.y[i]!
          if (carre) {
            // Un carré flou est un carré à cheval sur deux pixels : il est calé sur la grille de l'écran.
            const cote = Math.max(1, Math.round(r * 2 * densite)) / densite
            ctx.rect(Math.round((x - r) * densite) / densite, Math.round((y - r) * densite) / densite, cote, cote)
          } else {
            ctx.moveTo(x + r, y)
            ctx.arc(x, y, r, 0, TAU)
          }
        }
        ctx.fillStyle = passe === 1 ? accent : encre
        ctx.fill()
      }
    }

    /** Taille la toile, lit les couleurs et échantillonne le texte. */
    const preparer = () => {
      if (detruit) return
      const densite = Math.min(densiteMax, window.devicePixelRatio || 1)
      const largeur = (texte.clientWidth || texte.offsetWidth) + marge * 2
      const hauteur = (texte.clientHeight || texte.offsetHeight) + marge * 2
      // La toile déborde du texte de `marge` de chaque côté (`offset*` ignore les transformations).
      cible.style.left = `${texte.offsetLeft - marge}px`
      cible.style.top = `${texte.offsetTop - marge}px`
      cible.style.width = `${largeur}px`
      cible.style.height = `${hauteur}px`
      cible.width = Math.round(largeur * densite)
      cible.height = Math.round(hauteur * densite)
      const style = getComputedStyle(cible)
      encre = style.getPropertyValue('--p-encre').trim() || '#000'
      accent = style.getPropertyValue('--p-accent').trim() || encre
      nuage = echantillonner(texte, pas, marge)
    }

    const image = (maintenant: number) => {
      demande = 0
      if (!nuage || detruit) return
      const dt = dernier === 0 ? 1 / 60 : Math.min(0.033, (maintenant - dernier) / 1000)
      dernier = maintenant
      pointeur.force += ((pointeur.dessus ? 1 : 0) - pointeur.force) * Math.min(1, dt * 7)
      const f = pointeur.force
      let agite = pointeur.dessus || f > 0.01
      for (let i = 0; i < nuage.n; i++) {
        let ax = 0
        let ay = 0
        if (f > 0.01) {
          const dx = nuage.x[i]! - pointeur.x
          const dy = nuage.y[i]! - pointeur.y
          const d = Math.hypot(dx, dy) || 0.001
          if (d < portee) {
            const g = (1 - d / portee) * (1 - d / portee) * f * pousse
            ax += (dx / d) * g
            ay += (dy / d) * g
          }
        }
        ax += (nuage.hx[i]! - nuage.x[i]!) * raideur - nuage.vx[i]! * frein
        ay += (nuage.hy[i]! - nuage.y[i]!) * raideur - nuage.vy[i]! * frein
        nuage.vx[i] = nuage.vx[i]! + ax * dt
        nuage.vy[i] = nuage.vy[i]! + ay * dt
        nuage.x[i] = nuage.x[i]! + nuage.vx[i]! * dt
        nuage.y[i] = nuage.y[i]! + nuage.vy[i]! * dt
        if (
          !agite &&
          (Math.abs(nuage.vx[i]!) > 3 ||
            Math.abs(nuage.vy[i]!) > 3 ||
            Math.abs(nuage.x[i]! - nuage.hx[i]!) > 0.25 ||
            Math.abs(nuage.y[i]! - nuage.hy[i]!) > 0.25)
        ) {
          agite = true
        }
      }
      if (!agite) {
        // Tout est revenu : les points reprennent exactement leur place, et la boucle s'arrête.
        nuage.x.set(nuage.hx)
        nuage.y.set(nuage.hy)
        nuage.vx.fill(0)
        nuage.vy.fill(0)
      }
      dessiner()
      if (agite && visible && !document.hidden) demande = window.requestAnimationFrame(image)
      else dernier = 0
    }
    const reveiller = () => {
      if (reduit || demande !== 0 || !visible) return
      if (nuage) demande = window.requestAnimationFrame(image)
    }

    const surPointeur = (evenement: PointerEvent) => {
      if (evenement.pointerType === 'touch') return
      // La toile déborde du texte de `marge` de chaque côté.
      const cadre = texte.getBoundingClientRect()
      pointeur.x = evenement.clientX - cadre.left + marge
      pointeur.y = evenement.clientY - cadre.top + marge
      pointeur.dessus = true
      reveiller()
    }
    const surSortie = () => {
      pointeur.dessus = false
      reveiller()
    }

    const actualiser = () => {
      if (detruit) return
      preparer()
      if (nuage) bloc.dataset.particules = 'pret'
      else delete bloc.dataset.particules
      dessiner()
    }
    const tailles = new ResizeObserver(actualiser)
    tailles.observe(texte)
    const vue = new IntersectionObserver(([entree]) => {
      visible = entree?.isIntersecting ?? true
      if (visible) reveiller()
    })
    vue.observe(cible)
    // La police arrive après le premier dessin : les points sont recalculés avec la bonne.
    void document.fonts.ready.then(actualiser)

    if (!reduit) {
      bloc.addEventListener('pointermove', surPointeur, { passive: true })
      bloc.addEventListener('pointerleave', surSortie)
      document.addEventListener('visibilitychange', reveiller)
    }

    return () => {
      detruit = true
      if (demande !== 0) window.cancelAnimationFrame(demande)
      tailles.disconnect()
      vue.disconnect()
      bloc.removeEventListener('pointermove', surPointeur)
      bloc.removeEventListener('pointerleave', surSortie)
      document.removeEventListener('visibilitychange', reveiller)
      delete bloc.dataset.particules
    }
  }, [source, toile, pas, rayon, marge, theme, reduit])
}

/** Le dessin exact du texte affiché, et les points qu'on en tire. */
interface Glyphe {
  /** Le texte, tracé à la couleur et à la place exactes de celui de la page, à la densité de l'écran. */
  image: HTMLCanvasElement
  nuage: Nuage
  densite: number
  /** Coin haut gauche du texte dans le repère de la toile (pixels CSS). */
  origineX: number
  origineY: number
  encre: string
  accent: string
}

/**
 * Pose la toile sur le texte, y redessine le texte tel qu'il est affiché, et en tire les points.
 *
 * Tout est lu sur le rendu réel : la police calculée, la place du premier caractère (`Range`), la
 * ligne de base (une sonde de taille nulle, posée un instant en fin de texte) et la densité de
 * l'écran. La toile est calée sur les pixels de l'écran, et la part de pixel restante est reportée
 * dans le tracé : le dessin de la toile se superpose au texte, sans décalage ni flou.
 */
function lireGlyphe(texte: HTMLElement, cible: HTMLCanvasElement, pas: number, marge: number): Glyphe | null {
  const bloc = cible.parentElement
  const contenu = texte.textContent ?? ''
  if (!bloc || contenu === '') return null
  // Lectures d'abord.
  const style = getComputedStyle(texte)
  const densite = Math.min(3, window.devicePixelRatio || 1)
  const cadre = texte.getBoundingClientRect()
  const cadreBloc = bloc.getBoundingClientRect()
  if (cadre.width < 2 || cadre.height < 2) return null
  const plage = document.createRange()
  plage.selectNodeContents(texte)
  const debut = plage.getClientRects()[0]?.left ?? cadre.left
  const sonde = document.createElement('span')
  sonde.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline'
  texte.appendChild(sonde)
  const ligneDeBase = sonde.getBoundingClientRect().bottom
  sonde.remove()
  const accent = getComputedStyle(cible).getPropertyValue('--p-accent').trim()

  // La toile : calée sur un pixel entier de l'écran, et d'un nombre entier de pixels.
  const gauche = Math.floor((cadre.left - marge) * densite) / densite
  const haut = Math.floor((cadre.top - marge) * densite) / densite
  const largeur = Math.ceil((cadre.width + marge * 2 + 1) * densite)
  const hauteur = Math.ceil((cadre.height + marge * 2 + 1) * densite)
  cible.style.left = `${gauche - cadreBloc.left - bloc.clientLeft}px`
  cible.style.top = `${haut - cadreBloc.top - bloc.clientTop}px`
  cible.style.width = `${largeur / densite}px`
  cible.style.height = `${hauteur / densite}px`
  cible.width = largeur
  cible.height = hauteur

  const image = document.createElement('canvas')
  image.width = largeur
  image.height = hauteur
  const ctx = image.getContext('2d', { willReadFrequently: true })
  if (!ctx) return null
  ctx.scale(densite, densite)
  ctx.font = policeToile(style)
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = style.color
  if ('fontKerning' in ctx) ctx.fontKerning = style.fontKerning as CanvasFontKerning
  const x = debut - gauche
  // Le navigateur cale la ligne de base d'un texte sur un pixel entier de l'écran : la toile aussi.
  const y = Math.round((ligneDeBase - haut) * densite) / densite
  if (style.letterSpacing === 'normal') {
    ctx.fillText(contenu, x, y)
  } else if ('letterSpacing' in ctx) {
    ;(ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = style.letterSpacing
    ctx.fillText(contenu, x, y)
  } else {
    // Toile sans approche (anciens navigateurs) : chaque caractère est tracé à sa place dans la page.
    const noeud = texte.firstChild
    for (let i = 0; noeud && i < contenu.length; i++) {
      plage.setStart(noeud, i)
      plage.setEnd(noeud, i + 1)
      const place = plage.getClientRects()[0]
      if (place) (ctx as CanvasRenderingContext2D).fillText(contenu[i]!, place.left - gauche, y)
    }
  }

  // Les points : une grille au pas donné, lue dans ce dessin.
  const pixels = ctx.getImageData(0, 0, largeur, hauteur).data
  const hx: number[] = []
  const hy: number[] = []
  for (let py = pas / 2; py < hauteur / densite; py += pas) {
    for (let px = pas / 2; px < largeur / densite; px += pas) {
      const colonne = Math.min(largeur - 1, Math.floor(px * densite))
      const rangee = Math.min(hauteur - 1, Math.floor(py * densite))
      if (pixels[(rangee * largeur + colonne) * 4 + 3]! < 120) continue
      hx.push(px)
      hy.push(py)
    }
  }
  const nuage = nuageDe(hx, hy)
  if (!nuage) return null
  return {
    image,
    nuage,
    densite,
    origineX: cadre.left - gauche,
    origineY: cadre.top - haut,
    encre: style.color,
    accent: accent || style.color,
  }
}

/**
 * Texte net au repos, qui se défait en particules sous le curseur (numéros de section, emblèmes).
 *
 * Deux grandeurs règlent le passage, sans saut dans un sens comme dans l'autre :
 * - le `melange` (0 : le texte de la page ; 1 : la toile). La toile montre d'abord le texte lui-même,
 *   redessiné à l'identique (`lireGlyphe`) : le fondu croisé ne change ni la place, ni la taille, ni
 *   la graisse.
 * - la `liaison` (1 : les points sont tenus dans le dessin du texte ; 0 : ils sont libres). Liés, les
 *   points sont élargis jusqu'à se toucher et découpés par le dessin du texte : ils le recouvrent
 *   exactement. En se libérant (courbe douce), ils reprennent leur taille, le découpage s'efface, et
 *   la poussée du curseur monte.
 *
 * Aller : fondu croisé, puis libération. Retour : les points reviennent à leur place (ressort
 * amorti), se relient au dessin du texte à mesure qu'ils s'en approchent, puis le texte de la page
 * reprend le relais en fondu croisé. `data-particules="actif"` tant que la toile est à l'écran.
 *
 * Mouvement réduit et toucher (`pointer: coarse`) : rien ne se passe, le texte reste net.
 */
export function useTexteEparpille(
  source: RefObject<HTMLElement | null>,
  toile: RefObject<HTMLCanvasElement | null>,
  { pas, rayon, marge }: OptionsParticules,
): void {
  const reduit = useReducedMotion() ?? false

  useEffect(() => {
    const texte = source.current
    const cible = toile.current
    const ctx = cible?.getContext('2d')
    if (!texte || !cible || !ctx || reduit) return
    if (window.matchMedia('(pointer: coarse)').matches) return
    const bloc = cible.parentElement ?? texte
    const { portee, pousse, raideur, frein, freinRetour } = REGLAGES.eparpille
    // Liés, les points se touchent : leur rayon couvre la diagonale d'une case de la grille.
    const rayonLie = pas * 0.75

    let glyphe: Glyphe | null = null
    let masque: HTMLCanvasElement | null = null
    let melange = 0
    let liaison = 1
    let ecart = 0
    let demande = 0
    let dernier = 0
    let visible = true
    const pointeur = { x: 0, y: 0, dessus: false, force: 0 }

    const dessiner = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
      ctx.clearRect(0, 0, cible.width, cible.height)
      if (!glyphe) return
      const { nuage, densite, image } = glyphe
      const libre = adoucir(1 - liaison)
      if (libre > 0) {
        ctx.setTransform(densite, 0, 0, densite, 0, 0)
        const r = rayonLie + (rayon - rayonLie) * libre
        ctx.beginPath()
        for (let i = 0; i < nuage.n; i++) {
          const x = nuage.x[i]!
          const y = nuage.y[i]!
          ctx.moveTo(x + r, y)
          ctx.arc(x, y, r, 0, TAU)
        }
        ctx.fillStyle = glyphe.encre
        ctx.fill()
        // Un point sur vingt-cinq en accent, comme dans les figures de la trame : la couleur vient
        // avec la libération.
        ctx.beginPath()
        for (let i = 0; i < nuage.n; i += 25) {
          const x = nuage.x[i]!
          const y = nuage.y[i]!
          const ra = r * (1 + 0.25 * libre)
          ctx.moveTo(x + ra, y)
          ctx.arc(x, y, ra, 0, TAU)
        }
        ctx.globalAlpha = libre
        ctx.fillStyle = glyphe.accent
        ctx.fill()
        ctx.globalAlpha = 1
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        if (libre < 1) {
          // Découpage par le dessin du texte, qui se relâche avec la libération.
          masque ??= document.createElement('canvas')
          if (masque.width !== image.width || masque.height !== image.height) {
            masque.width = image.width
            masque.height = image.height
          }
          const m = masque.getContext('2d')
          if (m) {
            m.globalAlpha = 1
            m.clearRect(0, 0, masque.width, masque.height)
            m.drawImage(image, 0, 0)
            m.globalAlpha = libre * libre
            m.fillRect(0, 0, masque.width, masque.height)
            ctx.globalCompositeOperation = 'destination-in'
            ctx.drawImage(masque, 0, 0)
            ctx.globalCompositeOperation = 'source-over'
          }
        }
      }
      if (libre < 1) {
        // Le dessin exact du texte, sous les points : entier quand ils sont liés, il s'efface ensuite.
        ctx.globalAlpha = (1 - libre) * (1 - libre)
        ctx.drawImage(image, 0, 0)
        ctx.globalAlpha = 1
      }
    }

    /**
     * Applique le fondu croisé. Les deux dessins sont superposés : la toile finit d'apparaître avant
     * que le texte de la page finisse de s'effacer, pour que l'encre ne pâlisse à aucun moment.
     */
    const fondre = () => {
      cible.style.opacity = String(adoucir(Math.min(1, melange / 0.6)))
      texte.style.opacity = String(1 - adoucir(Math.max(0, (melange - 0.4) / 0.6)))
    }

    /** Rend la main au texte de la page : la toile est vidée, plus rien n'est animé. */
    const terminer = () => {
      if (demande !== 0) window.cancelAnimationFrame(demande)
      demande = 0
      dernier = 0
      glyphe = null
      melange = 0
      liaison = 1
      pointeur.dessus = false
      pointeur.force = 0
      cible.style.opacity = ''
      texte.style.opacity = ''
      delete bloc.dataset.particules
      dessiner()
    }

    const image = (maintenant: number) => {
      demande = 0
      if (!glyphe) return
      const { nuage } = glyphe
      const dt = dernier === 0 ? 1 / 60 : Math.min(0.033, (maintenant - dernier) / 1000)
      dernier = maintenant

      if (pointeur.dessus) {
        // Aller : le fondu croisé d'abord, la libération ensuite.
        melange = Math.min(1, melange + dt / FONDU_ALLER)
        if (melange >= 1) liaison = Math.max(0, liaison - dt / LIBERATION)
      } else {
        // Retour : les points se relient à mesure qu'ils approchent de leur place.
        const visee = 1 - Math.min(1, ecart / ECART_RELIURE)
        if (liaison < visee) liaison = Math.min(visee, liaison + dt / RELIURE)
      }
      const libre = adoucir(1 - liaison)
      pointeur.force += ((pointeur.dessus ? 1 : 0) - pointeur.force) * Math.min(1, dt * 7)
      // La poussée monte après la libération : le texte ne se troue pas avant d'être en points.
      const f = pointeur.force * libre * libre
      const amorti = pointeur.dessus ? frein : freinRetour

      let agite = false
      ecart = 0
      for (let i = 0; i < nuage.n; i++) {
        let ax = 0
        let ay = 0
        if (f > 0.005) {
          const dx = nuage.x[i]! - pointeur.x
          const dy = nuage.y[i]! - pointeur.y
          const d = Math.hypot(dx, dy) || 0.001
          if (d < portee) {
            // Éparpillement : chaque point est poussé plus ou moins fort, et un peu de côté.
            const h = nuage.alea[i]!
            const g = (1 - d / portee) * (1 - d / portee) * f * pousse * (0.45 + 1.1 * h)
            const biais = (h - 0.5) * 1.5
            ax += (dx / d) * g + (-dy / d) * g * biais
            ay += (dy / d) * g + (dx / d) * g * biais
          }
        }
        ax += (nuage.hx[i]! - nuage.x[i]!) * raideur - nuage.vx[i]! * amorti
        ay += (nuage.hy[i]! - nuage.y[i]!) * raideur - nuage.vy[i]! * amorti
        nuage.vx[i] = nuage.vx[i]! + ax * dt
        nuage.vy[i] = nuage.vy[i]! + ay * dt
        nuage.x[i] = nuage.x[i]! + nuage.vx[i]! * dt
        nuage.y[i] = nuage.y[i]! + nuage.vy[i]! * dt
        const e = Math.max(Math.abs(nuage.x[i]! - nuage.hx[i]!), Math.abs(nuage.y[i]! - nuage.hy[i]!))
        if (e > ecart) ecart = e
        if (!agite && (e > 0.25 || Math.abs(nuage.vx[i]!) > 3 || Math.abs(nuage.vy[i]!) > 3)) agite = true
      }

      if (!pointeur.dessus && !agite) {
        // Tous les points sont revenus : ils reprennent exactement leur place.
        nuage.x.set(nuage.hx)
        nuage.y.set(nuage.hy)
        nuage.vx.fill(0)
        nuage.vy.fill(0)
        ecart = 0
        // Reliés au dessin du texte, ils laissent la place au texte de la page (fondu croisé).
        if (liaison >= 1) melange = Math.max(0, melange - dt / FONDU_RETOUR)
      }

      if (!pointeur.dessus && melange <= 0) {
        terminer()
        return
      }
      dessiner()
      fondre()
      if (visible && !document.hidden) demande = window.requestAnimationFrame(image)
      else dernier = 0
    }
    const reveiller = () => {
      if (demande !== 0 || !visible || !glyphe) return
      demande = window.requestAnimationFrame(image)
    }

    const surPointeur = (evenement: PointerEvent) => {
      if (evenement.pointerType === 'touch') return
      if (!glyphe) {
        // Le curseur arrive sur le texte : la toile le redessine à sa place exacte, encore invisible.
        glyphe = lireGlyphe(texte, cible, pas, marge)
        if (!glyphe) return
        melange = 0
        liaison = 1
        ecart = 0
        dessiner()
        fondre()
        bloc.dataset.particules = 'actif'
      }
      const cadre = texte.getBoundingClientRect()
      pointeur.x = evenement.clientX - cadre.left + glyphe.origineX
      pointeur.y = evenement.clientY - cadre.top + glyphe.origineY
      pointeur.dessus = true
      reveiller()
    }
    const surSortie = () => {
      pointeur.dessus = false
      reveiller()
    }

    // Le texte change de taille pendant l'effet (fenêtre redimensionnée) : le texte net revient aussitôt.
    const tailles = new ResizeObserver(() => {
      if (glyphe) terminer()
    })
    tailles.observe(texte)
    const vue = new IntersectionObserver(([entree]) => {
      visible = entree?.isIntersecting ?? true
      if (visible) reveiller()
    })
    vue.observe(texte)

    texte.addEventListener('pointermove', surPointeur, { passive: true })
    texte.addEventListener('pointerleave', surSortie)
    document.addEventListener('visibilitychange', reveiller)

    return () => {
      terminer()
      tailles.disconnect()
      vue.disconnect()
      texte.removeEventListener('pointermove', surPointeur)
      texte.removeEventListener('pointerleave', surSortie)
      document.removeEventListener('visibilitychange', reveiller)
    }
  }, [source, toile, pas, rayon, marge, reduit])
}
