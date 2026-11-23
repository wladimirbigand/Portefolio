import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import { motion } from 'motion/react'
import { realisationsLibelles, ui } from '../../content'
import type { Capture } from '../../content'
import { useZoom } from '../../lib/zoom'
import { RESSORT } from './atomes'
import { ImageCapture } from './Capture'
import { Fenetre } from './Fenetre'
import { Picto } from './Picto'
import { deuxChiffres } from './realisations'

/** Une galerie ouverte en grand : ses captures, celle qui est affichée, et la réalisation d'où elles viennent. */
interface Ouverture {
  captures: Capture[]
  rang: number
  numero: number
}

type Ouvrir = (captures: Capture[], rang: number, numero: number) => void

const ContexteGalerie = createContext<Ouvrir>(() => {})

/** Glissement horizontal qui change de capture : au moins 48 px, et nettement plus large que haut. */
const GLISSEMENT = 48

/**
 * Capture en grand, dans la fenêtre superposée : l'image entière dans la zone, sa légende dessous,
 * puis « Précédente » et « Suivante ». On passe aussi d'une capture à l'autre par les flèches du
 * clavier et, au toucher, en glissant. Zoom : le bouton, un double-clic, ou un pincement ; zoomée,
 * l'image défile dans sa zone (et le glissement ne change plus de capture).
 */
function CaptureEnGrand({
  ouverture,
  idTitre,
  aller,
  sens,
  onFermer,
}: {
  ouverture: Ouverture
  idTitre: string
  aller: (rang: number) => void
  sens: number
  onFermer: () => void
}) {
  const { captures, rang, numero } = ouverture
  const capture = captures[rang]!
  const zone = useRef<HTMLDivElement>(null)
  const { zoom, regler, basculer } = useZoom(zone)
  const agrandi = zoom > 1

  // Une autre capture : elle s'affiche entière.
  useEffect(() => regler(1), [rang, regler])

  // Glissement à un doigt, image entière : capture précédente ou suivante.
  const depart = useRef<{ x: number; y: number } | null>(null)
  const zoomCourant = useRef(zoom)
  zoomCourant.current = zoom
  useEffect(() => {
    const cadre = zone.current
    if (!cadre) return
    const debut = (evenement: TouchEvent) => {
      const doigt = evenement.touches[0]
      depart.current =
        evenement.touches.length === 1 && doigt && zoomCourant.current === 1
          ? { x: doigt.clientX, y: doigt.clientY }
          : null
    }
    const fin = (evenement: TouchEvent) => {
      const origine = depart.current
      const doigt = evenement.changedTouches[0]
      depart.current = null
      if (!origine || !doigt || evenement.touches.length > 0 || zoomCourant.current !== 1) return
      const dx = doigt.clientX - origine.x
      const dy = doigt.clientY - origine.y
      if (Math.abs(dx) < GLISSEMENT || Math.abs(dx) < Math.abs(dy) * 1.5) return
      aller(dx < 0 ? rang + 1 : rang - 1)
    }
    cadre.addEventListener('touchstart', debut, { passive: true })
    cadre.addEventListener('touchend', fin)
    return () => {
      cadre.removeEventListener('touchstart', debut)
      cadre.removeEventListener('touchend', fin)
    }
  }, [aller, rang])

  const total = captures.length
  const voisine = (vers: 'precedente' | 'suivante') => {
    const cible = vers === 'precedente' ? rang - 1 : rang + 1
    const possible = cible >= 0 && cible < total
    return (
      <button
        type="button"
        className={`p-voisine p-voisine-${vers}`}
        // En bout de galerie, le bouton reste focalisable (le focus ne se perd pas) mais ne fait rien.
        aria-disabled={possible ? undefined : true}
        onClick={() => possible && aller(cible)}
      >
        <span className="p-voisine-fleche" aria-hidden="true">
          <Picto nom={vers === 'precedente' ? 'precedent' : 'suivant'} />
        </span>
        <span className="p-voisine-texte">
          <span className="p-voisine-sens">
            {vers === 'precedente' ? realisationsLibelles.capturePrecedente : realisationsLibelles.captureSuivante}
          </span>
        </span>
      </button>
    )
  }

  return (
    <>
      <header className="p-fenetre-barre">
        <h2 id={idTitre} className="p-fenetre-titre">
          <span aria-hidden="true">
            {realisationsLibelles.captureDe(numero).replace(String(numero), deuxChiffres(numero))} ·{' '}
            {realisationsLibelles.rangCapture(rang + 1, total)}
          </span>
          <span className="sr-only" role="status">
            {realisationsLibelles.captureDe(numero)}, {realisationsLibelles.rangCaptureAnnonce(rang + 1, total)}
          </span>
        </h2>
        <div className="p-fenetre-actions">
          <button type="button" className="p-bouton" onClick={() => basculer()}>
            <Picto nom={agrandi ? 'dezoomer' : 'zoomer'} />
            {agrandi ? ui.zoom.dezoomer : ui.zoom.zoomer}
          </button>
          <button type="button" className="p-bouton" onClick={onFermer} data-premier-focus="">
            <Picto nom="fermer" />
            {ui.fenetre.fermer}
          </button>
        </div>
      </header>
      {/* Zone défilante quand l'image est zoomée : focalisable, pour défiler au clavier. */}
      <div
        ref={zone}
        className="p-capture-zone"
        tabIndex={0}
        role="group"
        aria-labelledby={idTitre}
        data-agrandi={agrandi ? '' : undefined}
        onDoubleClick={(evenement) => basculer(evenement.clientX, evenement.clientY)}
      >
        <motion.figure
          key={capture.nom}
          className="p-capture-image"
          initial={{ opacity: 0.45, x: sens * 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={RESSORT}
        >
          <ImageCapture capture={capture} largeurs={agrandi ? `${Math.round(zoom * 100)}vw` : '100vw'} immediat />
        </motion.figure>
      </div>
      {/* La légende a toujours sa ligne : la zone de l'image ne change pas de taille d'une capture à l'autre. */}
      <p className="p-capture-legende">{capture.legende ?? capture.alt}</p>
      <nav className="p-fenetre-pied" aria-label={realisationsLibelles.navigationCaptures}>
        {voisine('precedente')}
        {voisine('suivante')}
      </nav>
    </>
  )
}

/**
 * Galerie commune à toute la page : une seule fenêtre superposée, que la galerie de n'importe quelle
 * fiche peut ouvrir. Elle se pose au-dessus de la fiche ; Échap ne ferme qu'elle, et le focus revient
 * à la vignette.
 */
export function FournisseurGalerie({ children }: { children: ReactNode }) {
  const [ouverture, setOuverture] = useState<Ouverture | null>(null)
  /** Sens du dernier changement de capture (−1, 0 ou 1) : l'image entre du côté où l'on va. */
  const sens = useRef(0)
  const idTitre = useId()
  const fermer = useCallback(() => setOuverture(null), [])
  const ouvrir = useCallback<Ouvrir>((captures, rang, numero) => {
    sens.current = 0
    setOuverture({ captures, rang, numero })
  }, [])

  const aller = useCallback((rang: number) => {
    setOuverture((actuelle) => {
      if (!actuelle || rang < 0 || rang >= actuelle.captures.length || rang === actuelle.rang) return actuelle
      sens.current = rang > actuelle.rang ? 1 : -1
      return { ...actuelle, rang }
    })
  }, [])

  // Bouton Retour du navigateur : il referme la fiche dessous, donc la capture aussi.
  useEffect(() => {
    window.addEventListener('hashchange', fermer)
    return () => window.removeEventListener('hashchange', fermer)
  }, [fermer])

  // Flèches gauche et droite : capture précédente, capture suivante.
  const surTouche = (evenement: KeyboardEvent<HTMLDialogElement>) => {
    if (!ouverture || evenement.ctrlKey || evenement.metaKey || evenement.altKey || evenement.shiftKey) return
    if (evenement.key === 'ArrowLeft') aller(ouverture.rang - 1)
    else if (evenement.key === 'ArrowRight') aller(ouverture.rang + 1)
    else return
    evenement.preventDefault()
  }

  const valeur = useMemo(() => ouvrir, [ouvrir])

  return (
    <ContexteGalerie value={valeur}>
      {children}
      <Fenetre
        ouverte={ouverture !== null}
        onFermer={fermer}
        idTitre={idTitre}
        className="p-fenetre-capture"
        onKeyDown={surTouche}
      >
        {ouverture && (
          <CaptureEnGrand
            ouverture={ouverture}
            idTitre={idTitre}
            aller={aller}
            sens={sens.current}
            onFermer={fermer}
          />
        )}
      </Fenetre>
    </ContexteGalerie>
  )
}

/**
 * Galerie d'une fiche : les captures en vignettes légendées. Chaque vignette est un bouton qui ouvre
 * la capture en grand, nommé par son numéro (« Agrandir la capture 2 »). La légende n'est lue qu'une
 * fois, sous la vignette ; elle est le texte alternatif de l'image une fois ouverte en grand.
 */
export function Galerie({ captures, numero }: { captures: Capture[]; numero: number }) {
  const ouvrir = useContext(ContexteGalerie)
  return (
    <ul className="p-galerie" role="list" aria-label={realisationsLibelles.captures}>
      {captures.map((capture, rang) => (
        <li key={capture.nom}>
          <figure>
            <button
              type="button"
              className="p-galerie-bouton"
              aria-haspopup="dialog"
              aria-label={realisationsLibelles.agrandir(rang + 1)}
              onClick={() => ouvrir(captures, rang, numero)}
            >
              {/* Sans légende, la vignette garde son texte alternatif ; avec, la légende dessous la décrit déjà. */}
              <ImageCapture
                capture={capture}
                alt={capture.legende ? '' : undefined}
                largeurs="(min-width: 64em) 22rem, (min-width: 44em) 45vw, 92vw"
              />
              <span className="p-galerie-loupe" aria-hidden="true">
                <Picto nom="zoomer" />
              </span>
            </button>
            {capture.legende && <figcaption>{capture.legende}</figcaption>}
          </figure>
        </li>
      ))}
    </ul>
  )
}
