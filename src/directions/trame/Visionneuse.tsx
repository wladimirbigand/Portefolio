import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { demo, epreuvesActions, FICHIER_TEXTE, pagesDocument, ui } from '../../content'
import type { PagesDocument } from '../../content'
import { fichierPublic } from '../../lib/url'
import { useZoom } from '../../lib/zoom'
import { Bouton } from './atomes'
import { Picto } from './Picto'

const { visionneuse } = ui

/** Largeur d'affichage d'une page, ajustée à la zone (même plafond que `.p-visionneuse-pages`). */
const LARGEUR_PAGE = '(min-width: 72rem) 68rem, 100vw'

/** Pages d'un document, d'après son URL publique (préfixée par la base du site). Absent : PDF non converti. */
export function pagesDepuisUrl(url: string): PagesDocument | undefined {
  const base = import.meta.env.BASE_URL
  return pagesDocument(url.startsWith(base) ? url.slice(base.length) : url)
}

function srcset(pages: PagesDocument, numero: number, format: 'avif' | 'webp'): string {
  return pages.largeurs
    .map((largeur) => `${fichierPublic(`${pages.dossier}/${numero}-${largeur}.${format}`)} ${largeur}w`)
    .join(', ')
}

const prechargees = new Set<string>()

/**
 * Précharge la première page d'un document (au survol ou au focus du bouton Aperçu) : elle est là
 * quand la fenêtre s'ouvre. Une seule fois par document ; sans effet pour un PDF non converti.
 */
export function prechargerDocument(url: string): void {
  const pages = pagesDepuisUrl(url)
  if (!pages || prechargees.has(url)) return
  prechargees.add(url)
  const lien = document.createElement('link')
  lien.rel = 'preload'
  lien.as = 'image'
  // Un navigateur qui ne lit pas l'AVIF ignore ce préchargement (il chargera le WebP à l'ouverture).
  lien.type = 'image/avif'
  lien.imageSrcset = srcset(pages, 1, 'avif')
  lien.imageSizes = LARGEUR_PAGE
  document.head.append(lien)
}

type Texte = { etat: 'attente' } | { etat: 'erreur' } | { etat: 'pret'; pages: string[] }

interface Props {
  /** URL du PDF (déjà préfixée par la base du site). */
  url: string
  /** Titre court de la fenêtre : « Épreuve E6 · Fiche 1 ». */
  titre: string
  idTitre: string
  pages: PagesDocument
  onFermer: () => void
}

/**
 * Visionneuse d'un PDF, dans la fenêtre superposée. Les pages ont été converties en images au build
 * (`scripts/pdf-en-images.mjs`) : aucun lecteur PDF n'est demandé au navigateur, mobile compris.
 * - Les pages défilent à la verticale ; chacune a sa place réservée dès l'ouverture (rapport largeur /
 *   hauteur du manifeste) et se charge à l'approche (`loading="lazy"`), la première tout de suite.
 * - Le compteur « Page 2 / 8 » suit le défilement.
 * - Clavier : flèches haut et bas (défilement), flèches gauche et droite, Page précédente et Page
 *   suivante (page par page), Début et Fin.
 * - Zoom : le bouton, un double-clic sur la page, ou un pincement.
 * - « Version texte » remplace les images par le texte extrait du PDF.
 */
export function Visionneuse({ url, titre, idTitre, pages, onFermer }: Props) {
  const zone = useRef<HTMLDivElement>(null)
  const total = pages.pages.length
  const [page, setPage] = useState(1)
  const [enTexte, setEnTexte] = useState(false)
  const [texte, setTexte] = useState<Texte>({ etat: 'attente' })
  const { zoom, basculer } = useZoom(zone, !enTexte)
  const reduit = useReducedMotion()

  // Le texte n'est chargé qu'à la première demande.
  const demande = useRef(false)
  const basculerTexte = () => {
    setEnTexte((actuel) => !actuel)
    if (demande.current) return
    demande.current = true
    fetch(fichierPublic(`${pages.dossier}/${FICHIER_TEXTE}`))
      .then((reponse) => (reponse.ok ? reponse.json() : Promise.reject(new Error(String(reponse.status)))))
      .then((lu: unknown) => {
        if (!Array.isArray(lu)) throw new Error('format')
        setTexte({ etat: 'pret', pages: lu.map(String) })
      })
      .catch(() => {
        demande.current = false
        setTexte({ etat: 'erreur' })
      })
  }

  /** Blocs des pages (images ou texte), dans l'ordre. */
  const blocs = useCallback(
    () => [...(zone.current?.querySelectorAll<HTMLElement>('[data-page]') ?? [])],
    [],
  )

  // Le compteur suit le défilement : la page courante est celle qui passe sous le premier tiers de la zone.
  useEffect(() => {
    const cadre = zone.current
    if (!cadre) return
    let attente = 0
    const mesurer = () => {
      attente = 0
      // Fenêtre pas encore affichée (la visionneuse est montée juste avant son ouverture) : rien à mesurer.
      if (!cadre.clientHeight) return
      const repere = cadre.getBoundingClientRect().top + cadre.clientHeight / 3
      let courante = 1
      for (const bloc of blocs()) {
        if (bloc.getBoundingClientRect().top <= repere) courante = Number(bloc.dataset.page)
      }
      // En bout de document, la dernière page est la page courante, même si elle est courte.
      if (cadre.scrollTop + cadre.clientHeight >= cadre.scrollHeight - 2) courante = total
      setPage(courante)
    }
    const surDefilement = () => {
      if (!attente) attente = requestAnimationFrame(mesurer)
    }
    mesurer()
    cadre.addEventListener('scroll', surDefilement, { passive: true })
    // La zone prend sa taille à l'ouverture de la fenêtre, puis à chaque redimensionnement ou zoom.
    const taille = new ResizeObserver(surDefilement)
    taille.observe(cadre)
    return () => {
      taille.disconnect()
      cadre.removeEventListener('scroll', surDefilement)
      cancelAnimationFrame(attente)
    }
  }, [blocs, total, enTexte, texte])

  const allerA = useCallback(
    (numero: number) => {
      const cadre = zone.current
      const bloc = blocs()[Math.min(total, Math.max(1, numero)) - 1]
      if (!cadre || !bloc) return
      const haut = bloc.getBoundingClientRect().top - cadre.getBoundingClientRect().top + cadre.scrollTop
      cadre.scrollTo({ top: haut - 12, behavior: reduit ? 'instant' : 'smooth' })
    },
    [blocs, total, reduit],
  )

  // Clavier, où que soit le focus dans la fenêtre (il est sur « Fermer » à l'ouverture).
  const pageCourante = useRef(page)
  pageCourante.current = page
  useEffect(() => {
    const cadre = zone.current
    const fenetre = cadre?.closest('dialog')
    if (!cadre || !fenetre) return
    const surTouche = (evenement: KeyboardEvent) => {
      if (evenement.ctrlKey || evenement.metaKey || evenement.altKey || evenement.shiftKey) return
      const pas = Math.max(80, cadre.clientHeight * 0.2)
      switch (evenement.key) {
        case 'ArrowDown':
          cadre.scrollBy({ top: pas, behavior: 'instant' })
          break
        case 'ArrowUp':
          cadre.scrollBy({ top: -pas, behavior: 'instant' })
          break
        case 'ArrowRight':
        case 'PageDown':
          allerA(pageCourante.current + 1)
          break
        case 'ArrowLeft':
        case 'PageUp':
          allerA(pageCourante.current - 1)
          break
        case 'Home':
          allerA(1)
          break
        case 'End':
          allerA(total)
          break
        default:
          return
      }
      evenement.preventDefault()
    }
    fenetre.addEventListener('keydown', surTouche)
    return () => fenetre.removeEventListener('keydown', surTouche)
  }, [allerA, total])

  const agrandi = zoom > 1
  // Zoomée, la page demande une image plus large : le navigateur passe à la grande.
  const largeurs = agrandi ? `${Math.round(zoom * 100)}vw` : LARGEUR_PAGE

  return (
    <>
      <header className="p-fenetre-barre p-visionneuse-barre">
        <div className="p-visionneuse-titres">
          <h2 id={idTitre} className="p-fenetre-titre">
            {titre}
          </h2>
          {/* Suit le défilement : pas annoncé en continu (le texte alternatif de chaque page dit son rang). */}
          <p className="p-visionneuse-compteur">{visionneuse.compteur(page, total)}</p>
        </div>
        <div className="p-visionneuse-outils" role="group" aria-label={visionneuse.outils}>
          <button
            type="button"
            className="p-bouton"
            // En version texte, le zoom n'a pas d'objet : le bouton reste en place, sans effet.
            aria-disabled={enTexte ? true : undefined}
            onClick={() => !enTexte && basculer()}
          >
            <Picto nom={agrandi ? 'dezoomer' : 'zoomer'} />
            {agrandi ? ui.zoom.dezoomer : ui.zoom.zoomer}
          </button>
          <button type="button" className="p-bouton" aria-pressed={enTexte} onClick={basculerTexte}>
            <Picto nom="texte" />
            {visionneuse.texte}
          </button>
          <a className="p-lien" href={url} target="_blank" rel="noreferrer">
            {demo.epreuves.ouvrirOnglet}
            <Picto nom="externe" />
          </a>
          <Bouton plein picto="telecharger" href={url} download>
            {epreuvesActions.telecharger}
          </Bouton>
        </div>
        <button type="button" className="p-bouton p-visionneuse-fermer" onClick={onFermer} data-premier-focus="">
          <Picto nom="fermer" />
          {ui.fenetre.fermer}
        </button>
      </header>
      {/* Zone défilante : focalisable, pour défiler au clavier. */}
      <div
        ref={zone}
        className="p-visionneuse"
        tabIndex={0}
        role="group"
        aria-label={visionneuse.pages}
        data-agrandi={agrandi ? '' : undefined}
        data-texte={enTexte ? '' : undefined}
        onDoubleClick={(evenement) => !enTexte && basculer(evenement.clientX, evenement.clientY)}
      >
        {enTexte ? (
          <div className="p-visionneuse-texte">
            {texte.etat === 'attente' && <p role="status">{visionneuse.texteChargement}</p>}
            {texte.etat === 'erreur' && <p role="alert">{visionneuse.texteErreur}</p>}
            {texte.etat === 'pret' &&
              texte.pages.map((contenu, rang) => (
                <section key={rang} data-page={rang + 1} aria-labelledby={`${idTitre}-page-${rang + 1}`}>
                  <h3 id={`${idTitre}-page-${rang + 1}`} className="p-label">
                    {visionneuse.titrePage(rang + 1)}
                  </h3>
                  {contenu ? <p>{contenu}</p> : <p className="p-visionneuse-vide">{visionneuse.texteVide}</p>}
                </section>
              ))}
          </div>
        ) : (
          <ol className="p-visionneuse-pages" role="list">
            {pages.pages.map((dimensions, rang) => (
              <li
                key={rang}
                data-page={rang + 1}
                // La place de la page est réservée avant le chargement de son image : aucun saut.
                style={{ aspectRatio: `${dimensions.largeur} / ${dimensions.hauteur}` }}
              >
                <picture>
                  <source type="image/avif" srcSet={srcset(pages, rang + 1, 'avif')} sizes={largeurs} />
                  <source type="image/webp" srcSet={srcset(pages, rang + 1, 'webp')} sizes={largeurs} />
                  <img
                    src={fichierPublic(`${pages.dossier}/${rang + 1}-${pages.largeurs[0]}.webp`)}
                    alt={visionneuse.altPage(titre, rang + 1, total)}
                    width={dimensions.largeur}
                    height={dimensions.hauteur}
                    loading={rang === 0 ? 'eager' : 'lazy'}
                    fetchPriority={rang === 0 ? 'high' : undefined}
                    decoding="async"
                    draggable={false}
                  />
                </picture>
              </li>
            ))}
          </ol>
        )}
      </div>
    </>
  )
}
