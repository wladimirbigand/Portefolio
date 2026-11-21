import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { codeHaproxy } from '../../content'
import { REQUETE_TACTILE, useMedia } from '../../lib/media'
import { useThemeCourant } from '../../lib/theme'
import { useParticulesTexte, useTexteEparpille } from '../commun/particules'
import { Picto } from './Picto'
import { ancreRealisation } from './realisations'

/**
 * Effets de texte du site : numéros de section et emblèmes de certification qui se défont en
 * particules sous le curseur, bloc de code dessiné en particules, titres dont les lettres se tordent. Dans les trois cas, le texte reste
 * un vrai texte HTML, que l'on peut sélectionner.
 */

/**
 * Grand numéro de section. Au repos : un chiffre net, qui glisse dans son masque à l'arrivée.
 * Quand le curseur passe sur le chiffre, et seulement sur lui, il se défait en particules qui
 * s'éparpillent autour du curseur, puis se reforment. Le passage du texte aux points, et retour, se
 * fait sans saut (voir `useTexteEparpille`). Décoratif (le titre suit).
 * Au toucher : un chiffre net et immobile, sans toile, sans particules ni glissement.
 */
export function NumeroParticules({ valeur }: { valeur: string }) {
  const texte = useRef<HTMLSpanElement>(null)
  const toile = useRef<HTMLCanvasElement>(null)
  const tactile = useMedia(REQUETE_TACTILE)
  useTexteEparpille(texte, toile, { pas: 2.6, rayon: 1.45, marge: 30 })
  if (tactile) {
    return (
      <span className="p-numero" aria-hidden="true">
        {valeur}
      </span>
    )
  }
  return (
    <span className="p-numero p-particules" aria-hidden="true">
      <span className="p-numero-masque">
        <motion.span
          ref={texte}
          className="p-particules-texte"
          initial={{ y: '45%' }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ type: 'spring', stiffness: 110, damping: 22, mass: 1 }}
        >
          {valeur}
        </motion.span>
      </span>
      <canvas ref={toile} className="p-particules-toile" />
    </span>
  )
}

/**
 * Emblème d'une certification : son sigle, dans un cadre à filet. Même comportement que les numéros
 * de section, en plus contenu : net au repos (un vrai texte), il s'éparpille quand le curseur passe
 * sur les lettres, puis se reforme. Décoratif : l'organisme est écrit dans la ligne.
 * Au toucher : le sigle net, sans toile ni particules.
 */
export function EmblemeParticules({ sigle }: { sigle: string }) {
  const texte = useRef<HTMLSpanElement>(null)
  const toile = useRef<HTMLCanvasElement>(null)
  const tactile = useMedia(REQUETE_TACTILE)
  useTexteEparpille(texte, toile, { pas: 2.1, rayon: 1.15, marge: 22 })
  if (tactile) {
    return (
      <span className="p-embleme" aria-hidden="true" translate="no">
        <span className="p-embleme-sigle">{sigle}</span>
      </span>
    )
  }
  return (
    <span className="p-embleme" aria-hidden="true" translate="no">
      <span className="p-particules">
        <span ref={texte} className="p-particules-texte p-embleme-sigle">
          {sigle}
        </span>
        <canvas ref={toile} className="p-particules-toile" />
      </span>
    </span>
  )
}

/**
 * Bloc de code en particules : la configuration HAProxy de la réalisation 3, dans la section
 * Compétences. Le curseur écarte les points comme une loupe. Le code est un vrai `<pre>` (lu,
 * sélectionnable, copiable).
 */
export function CodeParticules() {
  const texte = useRef<HTMLPreElement>(null)
  const toile = useRef<HTMLCanvasElement>(null)
  const theme = useThemeCourant()
  useParticulesTexte(texte, toile, { pas: 1.25, rayon: 0.72, marge: 14, theme })
  return (
    <figure className="p-code" aria-labelledby="p-code-titre">
      <figcaption>
        <p id="p-code-titre" className="p-label">
          {codeHaproxy.titre}
        </p>
        <a className="p-lien" href={`#${ancreRealisation(codeHaproxy.realisation)}`} aria-haspopup="dialog">
          {codeHaproxy.lien}
          <Picto nom="suivant" />
        </a>
      </figcaption>
      {/* Zone défilante sur petit écran : focalisable, pour défiler au clavier. */}
      <div className="p-code-cadre" tabIndex={0} role="group" aria-labelledby="p-code-titre">
        <div className="p-particules">
          <pre ref={texte} className="p-particules-texte p-code-texte" translate="no">
            <code>{codeHaproxy.lignes.join('\n')}</code>
          </pre>
          <canvas ref={toile} className="p-particules-toile" aria-hidden="true" />
        </div>
      </div>
    </figure>
  )
}

/** Portée de la torsion autour du curseur, en pixels. */
const PORTEE = 120
/** Cinq grandeurs par lettre : décalage x, décalage y, rotation, inclinaison, étirement vertical. */
const GRANDEURS = 5

/**
 * Titre dont les lettres se tordent au passage du curseur, puis reviennent en place (ressort).
 * Chaque lettre est un vrai caractère dans un `span` ; le titre porte son texte entier en
 * `aria-label` (posé par l'en-tête), les lettres sont donc masquées aux lecteurs d'écran.
 * Rien ne bouge en mouvement réduit, ni au toucher. `will-change` n'est posé sur les lettres que
 * pendant la déformation (`data-tordu`).
 */
export function TitreTordu({ texte }: { texte: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduit = useReducedMotion() ?? false

  useEffect(() => {
    const racine = ref.current
    if (!racine || reduit) return
    const lettres = [...racine.querySelectorAll<HTMLElement>('.p-lettre')]
    const n = lettres.length
    const centreX = new Float32Array(n)
    const centreY = new Float32Array(n)
    const valeur = new Float32Array(n * GRANDEURS)
    const vitesse = new Float32Array(n * GRANDEURS)
    const cible = new Float32Array(GRANDEURS)
    const pointeur = { x: 0, y: 0, dessus: false }
    let demande = 0
    let dernier = 0
    let visible = true

    // Centres au repos : `offset*` ignore les transformations en cours.
    const mesurer = () => {
      lettres.forEach((lettre, i) => {
        let x = lettre.offsetLeft + lettre.offsetWidth / 2
        let y = lettre.offsetTop + lettre.offsetHeight / 2
        const mot = lettre.offsetParent
        if (mot instanceof HTMLElement && mot !== racine) {
          x += mot.offsetLeft
          y += mot.offsetTop
        }
        centreX[i] = x
        centreY[i] = y
      })
    }

    const image = (maintenant: number) => {
      demande = 0
      const dt = dernier === 0 ? 1 / 60 : Math.min(0.033, (maintenant - dernier) / 1000)
      dernier = maintenant
      let agite = pointeur.dessus
      for (let i = 0; i < n; i++) {
        cible.fill(0)
        if (pointeur.dessus) {
          const dx = centreX[i]! - pointeur.x
          const dy = centreY[i]! - pointeur.y
          const d = Math.hypot(dx, dy) || 0.001
          if (d < PORTEE) {
            const g = (1 - d / PORTEE) * (1 - d / PORTEE)
            cible[0] = (dx / d) * g * 14
            cible[1] = (dy / d) * g * 10
            cible[2] = (dx / PORTEE) * g * 16
            cible[3] = -(dx / PORTEE) * g * 18
            cible[4] = g * 0.42
          }
        }
        for (let k = 0; k < GRANDEURS; k++) {
          const j = i * GRANDEURS + k
          const acceleration = (cible[k]! - valeur[j]!) * 210 - vitesse[j]! * 17
          vitesse[j] = vitesse[j]! + acceleration * dt
          valeur[j] = valeur[j]! + vitesse[j]! * dt
          if (Math.abs(valeur[j]!) > 0.02 || Math.abs(vitesse[j]!) > 0.2) agite = true
        }
        const j = i * GRANDEURS
        lettres[i]!.style.transform = agite
          ? `translate(${valeur[j]!.toFixed(2)}px, ${valeur[j + 1]!.toFixed(2)}px) rotate(${valeur[j + 2]!.toFixed(2)}deg) skewX(${valeur[j + 3]!.toFixed(2)}deg) scaleY(${(1 + valeur[j + 4]!).toFixed(3)})`
          : ''
      }
      if (agite && visible && !document.hidden) demande = window.requestAnimationFrame(image)
      else {
        dernier = 0
        if (!agite) {
          valeur.fill(0)
          vitesse.fill(0)
          lettres.forEach((lettre) => (lettre.style.transform = ''))
          // Les lettres sont revenues : plus de calque dédié.
          delete racine.dataset.tordu
        }
      }
    }
    const reveiller = () => {
      if (demande === 0 && visible) demande = window.requestAnimationFrame(image)
    }
    const surPointeur = (evenement: PointerEvent) => {
      if (evenement.pointerType === 'touch') return
      if (!pointeur.dessus) mesurer()
      const cadre = racine.getBoundingClientRect()
      pointeur.x = evenement.clientX - cadre.left
      pointeur.y = evenement.clientY - cadre.top
      pointeur.dessus = true
      // Lectures d'abord, écriture ensuite : un calque par lettre, le temps de la déformation.
      if (racine.dataset.tordu === undefined) racine.dataset.tordu = ''
      reveiller()
    }
    const surSortie = () => {
      pointeur.dessus = false
      reveiller()
    }
    const vue = new IntersectionObserver(([entree]) => {
      visible = entree?.isIntersecting ?? true
    })
    vue.observe(racine)
    // Zone sensible : tout le titre (le bloc), pas seulement le dessin des lettres.
    const zone = racine.parentElement ?? racine
    zone.addEventListener('pointermove', surPointeur, { passive: true })
    zone.addEventListener('pointerleave', surSortie)
    return () => {
      if (demande !== 0) window.cancelAnimationFrame(demande)
      vue.disconnect()
      zone.removeEventListener('pointermove', surPointeur)
      zone.removeEventListener('pointerleave', surSortie)
      lettres.forEach((lettre) => (lettre.style.transform = ''))
      delete racine.dataset.tordu
    }
  }, [reduit, texte])

  const mots = texte.split(' ')
  return (
    <span ref={ref} className="p-titre-tordu" aria-hidden="true">
      {mots.map((mot, rang) => (
        // Un mot ne se coupe pas ; les espaces entre les mots restent de vraies espaces.
        <span key={rang}>
          {rang > 0 && ' '}
          <span className="p-mot">
            {[...mot].map((lettre, place) => (
              <span key={place} className="p-lettre">
                {lettre}
              </span>
            ))}
          </span>
        </span>
      ))}
    </span>
  )
}
