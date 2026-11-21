import { createContext, useCallback, useContext, useEffect, useId, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { demo, epreuvesActions, ui } from '../../content'
import { REQUETE_MOBILE, useMedia } from '../../lib/media'
import { urlApercuPdf } from '../../lib/url'
import { Bouton, RESSORT_VIF } from './atomes'
import { Fenetre } from './Fenetre'
import { Picto } from './Picto'
import { insecable } from './realisations'

/** Document à montrer dans la fenêtre d'aperçu. */
interface DocumentApercu {
  /** URL du PDF (déjà préfixée par la base du site). */
  url: string
  /** Titre court de la fenêtre : « Épreuve E6 · Fiche 1 ». */
  titre: string
  /** Une image (attestation) au lieu d'un PDF : son texte alternatif et ses dimensions. */
  image?: { alt: string; largeur?: number; hauteur?: number }
}

interface Apercu {
  ouvrir: (document: DocumentApercu) => void
  fermer: () => void
}

const ContexteApercu = createContext<Apercu>({ ouvrir: () => {}, fermer: () => {} })

/** Ouvre (ou ferme) l'aperçu commun depuis n'importe quel composant de la page. */
export function useApercu(): Apercu {
  return useContext(ContexteApercu)
}

/**
 * Aperçu d'un document, commun à toute la page : une seule fenêtre superposée, que n'importe quel bloc de document
 * peut ouvrir. Le PDF occupe presque tout l'écran, la page ajustée à la largeur.
 */
export function FournisseurApercu({ children }: { children: ReactNode }) {
  const [apercu, setDocument] = useState<DocumentApercu | null>(null)
  const idTitre = useId()
  const fermer = useCallback(() => setDocument(null), [])
  const valeur = useMemo(() => ({ ouvrir: setDocument, fermer }), [fermer])

  // Bouton Retour du navigateur : il referme la fiche de réalisation dessous, donc l'aperçu aussi.
  useEffect(() => {
    window.addEventListener('hashchange', fermer)
    return () => window.removeEventListener('hashchange', fermer)
  }, [fermer])

  return (
    <ContexteApercu value={valeur}>
      {children}
      <Fenetre ouverte={apercu !== null} onFermer={fermer} idTitre={idTitre} className="p-fenetre-pdf">
        {apercu && (
          <>
            <header className="p-fenetre-barre">
              <h2 id={idTitre} className="p-fenetre-titre">
                {apercu.titre}
              </h2>
              <div className="p-fenetre-actions">
                <a className="p-lien" href={apercu.url} target="_blank" rel="noreferrer">
                  {demo.epreuves.ouvrirOnglet}
                  <Picto nom="externe" />
                </a>
                <Bouton plein picto="telecharger" href={apercu.url} download>
                  {epreuvesActions.telecharger}
                </Bouton>
                <button type="button" className="p-bouton" onClick={fermer} data-premier-focus="">
                  <Picto nom="fermer" />
                  {ui.fenetre.fermer}
                </button>
              </div>
            </header>
            {apercu.image ? (
              // Zone défilante : focalisable, pour défiler au clavier.
              <div className="p-fenetre-image" tabIndex={0} role="group" aria-labelledby={idTitre}>
                <img
                  src={apercu.url}
                  alt={apercu.image.alt}
                  width={apercu.image.largeur}
                  height={apercu.image.hauteur}
                  decoding="async"
                />
              </div>
            ) : (
            <object
              className="p-fenetre-document"
              data={urlApercuPdf(apercu.url)}
              type="application/pdf"
              aria-label={epreuvesActions.apercuTitre}
            >
              <p>
                {demo.epreuves.apercuImpossible}{' '}
                <a className="p-lien" href={apercu.url} download>
                  {epreuvesActions.telecharger}
                </a>
              </p>
            </object>
            )}
          </>
        )}
      </Fenetre>
    </ContexteApercu>
  )
}

interface PropsDocument {
  /** Repère court : « Fiche 1 », « Fiche descriptive E6 ». */
  label: string
  /** Intitulé du document, s'il en a un. */
  titre?: string
  /** URL du PDF (déjà préfixée par la base du site). */
  url: string
  /** Titre de la fenêtre d'aperçu. */
  titreApercu: string
  /** Nom accessible d'une action : « Télécharger — Fiche 1, épreuve E6 ». */
  nom: (action: string) => string
}

/**
 * Bloc d'un document disponible : son état, son intitulé, puis Télécharger, Aperçu et le lien vers un
 * nouvel onglet. L'aperçu s'ouvre dans la fenêtre superposée ; sous 768 px, le bouton Aperçu est un
 * lien qui ouvre le PDF dans un nouvel onglet (les navigateurs mobiles affichent mal un PDF intégré).
 */
export function BlocDocument({ label, titre, url, titreApercu, nom }: PropsDocument) {
  const { ouvrir } = useApercu()
  const mobile = useMedia(REQUETE_MOBILE)

  return (
    <>
      <p className="p-etat">
        <span className="p-etat-marque" aria-hidden="true" />
        <span>
          <span className="p-document-label">{label}</span> · {demo.epreuves.disponible} · {demo.epreuves.format}
        </span>
      </p>
      {titre && <p className="p-document-titre">{insecable(titre)}</p>}
      <div className="p-actions">
        <Bouton plein picto="telecharger" href={url} download aria-label={nom(epreuvesActions.telecharger)}>
          {epreuvesActions.telecharger}
        </Bouton>
        {mobile ? (
          <a
            className="p-bouton"
            href={url}
            target="_blank"
            rel="noreferrer"
            aria-label={nom(epreuvesActions.apercuOnglet)}
          >
            <Picto nom="apercu" />
            {epreuvesActions.apercu}
          </a>
        ) : (
          <motion.button
            type="button"
            className="p-bouton"
            aria-haspopup="dialog"
            aria-label={nom(epreuvesActions.apercu)}
            onClick={() => ouvrir({ url, titre: titreApercu })}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={RESSORT_VIF}
          >
            <Picto nom="apercu" />
            {epreuvesActions.apercu}
          </motion.button>
        )}
        <a className="p-lien" href={url} target="_blank" rel="noreferrer" aria-label={nom(demo.epreuves.ouvrirOnglet)}>
          {demo.epreuves.ouvrirOnglet}
          <Picto nom="externe" />
        </a>
      </div>
    </>
  )
}
