import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import { motion } from 'motion/react'
import { capturesRealisation, realisations, realisationsLibelles, ui } from '../../content'
import type { Realisation } from '../../content'
import { dateLongue } from '../../lib/dates'
import { fichierPublic } from '../../lib/url'
import { BlocDocument } from './Apercu'
import { RESSORT } from './atomes'
import { Fenetre } from './Fenetre'
import { Galerie } from './Galerie'
import { Picto } from './Picto'
import { ancreRealisation, deuxChiffres, insecable, numeroDepuisAncre } from './realisations'

/** Numéro de la réalisation dont la fiche est ouverte, ou `null`. */
const ContexteFiche = createContext<number | null>(null)

/** Numéro de la fiche ouverte : la liste des réalisations s'assure que sa ligne est affichée. */
export function useFicheOuverte(): number | null {
  return useContext(ContexteFiche)
}

/** Commandes des fiches pour la palette : ouvrir une fiche sans lien d'origine, fermer celle qui est ouverte. */
interface CommandesFiches {
  ouvrir: (numero: number) => void
  fermer: () => void
}

const ContexteCommandes = createContext<CommandesFiches>({ ouvrir: () => {}, fermer: () => {} })

export function useCommandesFiches(): CommandesFiches {
  return useContext(ContexteCommandes)
}

const premier = realisations[0]!.numero
const dernier = realisations[realisations.length - 1]!.numero
const total = deuxChiffres(realisations.length)

/** URL de la page courante avec une autre ancre. */
const urlAncre = (ancre: string): string => `${window.location.pathname}${window.location.search}#${ancre}`

/** Classe de la marque d'état : pleine en accent (en cours), pleine en encre (terminée), creuse (en suspens). */
const CLASSE_STATUT: Record<Realisation['statut'], string> = {
  termine: 'p-etat p-etat-fait',
  'en-cours': 'p-etat',
  'en-suspens': 'p-etat p-etat-attente',
}

/** Contenu de la fiche : l'en-tête officiel, puis les rubriques rédigées. Rien n'est inventé. */
function ContenuFiche({ realisation, idTitre }: { realisation: Realisation; idTitre: string }) {
  const { numero, fiche } = realisation
  // Les captures viennent du dossier `src/assets/captures/` (`realisation-<n>-<ordre>`).
  const captures = capturesRealisation(numero)
  const documents = fiche?.preuves?.documents ?? []
  // Un lien public ne s'affiche qu'une fois validé.
  const liens = (fiche?.preuves?.liens ?? []).filter((lien) => lien.valide)
  const actions = fiche?.actions ?? []
  const outils = fiche?.outils ?? []
  const redigee = Boolean(
    fiche?.contexte || actions.length || outils.length || fiche?.securite || fiche?.resultat || fiche?.limites,
  )
  const avecPreuves = captures.length + documents.length + liens.length > 0
  const { rubriques } = realisationsLibelles

  return (
    <>
      <header className="p-fiche-entete">
        <p className="p-label">{realisationsLibelles.intitule}</p>
        {/* L'intitulé officiel, mot pour mot : c'est lui que le jury compare au tableau de synthèse. */}
        <h2 id={idTitre} className="p-fiche-intitule">
          <span className="sr-only">{realisationsLibelles.ficheDe(numero)} : </span>
          {insecable(realisation.intitule)}
        </h2>
        <dl className="p-fiche-reperes">
          <div>
            <dt>{realisationsLibelles.periode}</dt>
            <dd>
              {(realisation.finPrevue ? realisationsLibelles.duFinPrevue : realisationsLibelles.duAu)(
                dateLongue(realisation.debut),
                dateLongue(realisation.fin),
              )}
            </dd>
          </div>
          <div>
            <dt>{realisationsLibelles.cadre}</dt>
            <dd>
              {realisation.contextePrecision
                ? insecable(realisation.contextePrecision)
                : realisation.contextes.map((contexte, rang) => (
                    <span key={contexte} translate="no">
                      {rang > 0 && ' · '}
                      {realisationsLibelles.contextes[contexte]}
                    </span>
                  ))}
            </dd>
          </div>
          <div>
            <dt>{realisationsLibelles.statut}</dt>
            <dd className={CLASSE_STATUT[realisation.statut]}>
              <span className="p-etat-marque" aria-hidden="true" />
              {realisationsLibelles.statuts[realisation.statut]}
            </dd>
          </div>
        </dl>
      </header>

      <div className="p-fiche-rubriques">
        {!redigee && (
          <div className="p-fiche-a-venir">
            <p className="p-etat p-etat-attente">
              <span className="p-etat-marque" aria-hidden="true" />
              <span>
                {realisationsLibelles.ficheAVenir}
                <span className="p-etat-detail">{realisationsLibelles.ficheAVenirDetail}</span>
              </span>
            </p>
          </div>
        )}
        {fiche?.contexte && (
          <section className="p-rubrique">
            <h3 className="p-label">{rubriques.contexte}</h3>
            <p>{fiche.contexte}</p>
          </section>
        )}
        {actions.length > 0 && (
          <section className="p-rubrique">
            <h3 className="p-label">{rubriques.actions}</h3>
            <ul className="p-fiche-actions" role="list">
              {actions.map((action) => (
                <li key={action}>{action}</li>
              ))}
            </ul>
          </section>
        )}
        {outils.length > 0 && (
          <section className="p-rubrique">
            <h3 className="p-label">{rubriques.outils}</h3>
            <ul className="p-environnement" role="list">
              {outils.map((outil, rang) => (
                <li key={outil}>
                  {outil}
                  {rang < outils.length - 1 && <span className="p-environnement-point" aria-hidden="true" />}
                </li>
              ))}
            </ul>
          </section>
        )}
        {fiche?.securite && (
          <section className="p-rubrique">
            <h3 className="p-label">{rubriques.securite}</h3>
            <p>{fiche.securite}</p>
          </section>
        )}
        {fiche?.resultat && (
          <section className="p-rubrique">
            <h3 className="p-label">{rubriques.resultat}</h3>
            <p>{fiche.resultat}</p>
          </section>
        )}
        {fiche?.limites && (
          <section className="p-rubrique">
            <h3 className="p-label">{rubriques.limites}</h3>
            <p>{fiche.limites}</p>
          </section>
        )}
        {avecPreuves && (
          <section className="p-rubrique">
            <h3 className="p-label">{rubriques.preuves}</h3>
            <div className="p-preuves">
              {/* Un clic sur une capture l'ouvre en grand (`Galerie.tsx`). */}
              {captures.length > 0 && <Galerie captures={captures} numero={numero} />}
              {documents.length > 0 && (
                <ul className="p-documents" role="list" aria-label={realisationsLibelles.documents}>
                  {documents.map((document) => (
                    <li key={document.url} className="p-document">
                      <BlocDocument
                        label={document.label}
                        url={fichierPublic(document.url)}
                        titreApercu={realisationsLibelles.titreDocument(document.label, numero)}
                        nom={(action) => realisationsLibelles.pourDocument(action, document.label, numero)}
                      />
                    </li>
                  ))}
                </ul>
              )}
              {liens.length > 0 && (
                <ul className="p-fiche-liens" role="list" aria-label={realisationsLibelles.liens}>
                  {liens.map((lien) => (
                    <li key={lien.url}>
                      <a className="p-lien" href={lien.url} target="_blank" rel="noreferrer" translate="no">
                        {lien.label}
                        <Picto nom="externe" />
                      </a>
                      {lien.precision && ' '}
                      {lien.precision && (
                        <span className="p-fiche-lien-precision">
                          {realisationsLibelles.lienPrecision(lien.precision)}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}
      </div>
    </>
  )
}

/** Bouton vers la fiche voisine : son sens, et le titre court de la réalisation où il mène. */
function Voisine({
  sens,
  realisation,
  aller,
}: {
  sens: 'precedente' | 'suivante'
  realisation: Realisation | undefined
  aller: (numero: number) => void
}) {
  return (
    <button
      type="button"
      className={`p-voisine p-voisine-${sens}`}
      // En bout de liste, le bouton reste focalisable (le focus ne se perd pas) mais ne fait rien.
      aria-disabled={realisation ? undefined : true}
      onClick={() => realisation && aller(realisation.numero)}
    >
      <span className="p-voisine-fleche" aria-hidden="true">
        <Picto nom={sens === 'precedente' ? 'precedent' : 'suivant'} />
      </span>
      <span className="p-voisine-texte">
        <span className="p-voisine-sens">{realisationsLibelles[sens]}</span>
        {realisation && (
          <span className="p-voisine-titre">
            <span className="sr-only"> : {realisationsLibelles.realisation(realisation.numero)}, </span>
            <span aria-hidden="true">{deuxChiffres(realisation.numero)} · </span>
            {realisation.titreCourt}
          </span>
        )}
      </span>
    </button>
  )
}

/**
 * Fiches de réalisation : une seule fenêtre superposée pour les 16 réalisations.
 * - L'URL suit la fiche ouverte (`#realisation-1` à `#realisation-16`) : charger la page sur une de ces
 *   ancres ouvre la fiche, et le bouton Retour du navigateur la ferme.
 * - Tout lien vers une de ces ancres (ligne de Projets, carte d'Entreprise) ouvre la fiche.
 * - Boutons précédent / suivant et flèches du clavier pour passer d'une fiche à l'autre.
 * - À la fermeture, le focus revient à l'élément d'origine s'il menait à cette fiche ; sinon à la ligne
 *   de la réalisation affichée, dans Projets.
 */
export function FournisseurFiches({ children }: { children: ReactNode }) {
  const [numero, setNumero] = useState<number | null>(() => numeroDepuisAncre(window.location.hash))
  /** Élément qui a ouvert la fenêtre, et la fiche qu'il a ouverte. */
  const origine = useRef<{ element: HTMLElement; numero: number } | null>(null)
  /** Dernière fiche affichée : celle sur laquelle on ferme. */
  const affichee = useRef<number | null>(numero)
  if (numero !== null) affichee.current = numero
  /** Sens du dernier changement de fiche (−1, 0 ou 1) : la fiche entre du côté où l'on va. */
  const sens = useRef(0)
  /** Fiche ouverte depuis la palette : à la fermeture, la page reste où elle était. */
  const sansRetour = useRef(false)
  const idTitre = useId()

  const ouvrir = useCallback((cible: number, element: HTMLElement) => {
    origine.current = { element, numero: cible }
    sansRetour.current = false
    sens.current = 0
    const url = urlAncre(ancreRealisation(cible))
    // Une entrée d'historique par ouverture : le bouton Retour ferme la fiche.
    if (numeroDepuisAncre(window.location.hash) === null) window.history.pushState({ fiche: true }, '', url)
    else window.history.replaceState(window.history.state, '', url)
    setNumero(cible)
  }, [])

  // D'une fiche à l'autre : l'URL suit, sans ajouter d'entrée (Retour ferme toujours la fenêtre).
  const aller = useCallback((cible: number) => {
    if (cible < premier || cible > dernier) return
    sens.current = cible > (affichee.current ?? cible) ? 1 : -1
    window.history.replaceState(window.history.state, '', urlAncre(ancreRealisation(cible)))
    setNumero(cible)
  }, [])

  const fermer = useCallback(() => {
    const etat: unknown = window.history.state
    if (typeof etat === 'object' && etat !== null && 'fiche' in etat) {
      // La fiche a été ouverte depuis la page : on revient à l'entrée d'avant.
      window.history.back()
      return
    }
    // Arrivée directe sur l'ancre : pas d'entrée d'avant. L'URL revient à la section Projets.
    window.history.replaceState(null, '', urlAncre('projets'))
    setNumero(null)
  }, [])

  // Palette : la fiche s'ouvre sans lien d'origine. Si une fiche est déjà ouverte, elle est remplacée.
  const commandes = useMemo<CommandesFiches>(
    () => ({
      ouvrir: (cible) => {
        const url = urlAncre(ancreRealisation(cible))
        sens.current = 0
        if (numeroDepuisAncre(window.location.hash) === null) {
          origine.current = null
          sansRetour.current = true
          window.history.pushState({ fiche: true }, '', url)
        } else window.history.replaceState(window.history.state, '', url)
        setNumero(cible)
      },
      // Sans toucher à l'historique ni au focus : la palette emmène ailleurs juste après.
      fermer: () => {
        if (numeroDepuisAncre(window.location.hash) === null) return
        sansRetour.current = true
        setNumero(null)
      },
    }),
    [],
  )

  useEffect(() => {
    // Retour, Suivant, ancre saisie à la main : la fenêtre suit l'URL.
    const surAncre = () => {
      sens.current = 0
      setNumero(numeroDepuisAncre(window.location.hash))
    }
    // `popstate` n'ouvre ou ne change que la fiche. La fermeture attend `hashchange` : entre les deux,
    // le navigateur remet le focus sur la page, et celui qu'on rendrait à la ligne serait perdu.
    const surHistorique = () => {
      if (numeroDepuisAncre(window.location.hash) !== null) surAncre()
    }
    // Un lien vers une réalisation ouvre sa fiche, sans faire défiler la page.
    const surClic = (evenement: MouseEvent) => {
      if (evenement.defaultPrevented || evenement.button !== 0) return
      if (evenement.ctrlKey || evenement.metaKey || evenement.shiftKey || evenement.altKey) return
      const lien = evenement.target instanceof Element ? evenement.target.closest<HTMLElement>('a[href^="#"]') : null
      const cible = lien ? numeroDepuisAncre(lien.getAttribute('href') ?? '') : null
      if (!lien || cible === null) return
      evenement.preventDefault()
      ouvrir(cible, lien)
    }
    window.addEventListener('popstate', surHistorique)
    window.addEventListener('hashchange', surAncre)
    document.addEventListener('click', surClic)
    return () => {
      window.removeEventListener('popstate', surHistorique)
      window.removeEventListener('hashchange', surAncre)
      document.removeEventListener('click', surClic)
    }
  }, [ouvrir])

  const retour = useCallback((): HTMLElement | null | false => {
    const fermee = affichee.current
    if (sansRetour.current) {
      sansRetour.current = false
      origine.current = null
      return false
    }
    if (fermee === null) return null
    const depart = origine.current
    origine.current = null
    if (depart && depart.numero === fermee && depart.element.isConnected) return depart.element
    return document.querySelector<HTMLElement>(`#${ancreRealisation(fermee)} a`)
  }, [])

  // Flèches gauche et droite : fiche précédente, fiche suivante.
  const surTouche = (evenement: KeyboardEvent<HTMLDialogElement>) => {
    if (numero === null || evenement.ctrlKey || evenement.metaKey || evenement.altKey || evenement.shiftKey) return
    if (evenement.key === 'ArrowLeft') aller(numero - 1)
    else if (evenement.key === 'ArrowRight') aller(numero + 1)
    else return
    evenement.preventDefault()
  }

  const rang = realisations.findIndex((realisation) => realisation.numero === numero)
  const realisation = realisations[rang]

  return (
    <ContexteFiche value={numero}>
      <ContexteCommandes value={commandes}>{children}</ContexteCommandes>
      <Fenetre
        ouverte={realisation !== undefined}
        onFermer={fermer}
        idTitre={idTitre}
        className="p-fenetre-fiche"
        retour={retour}
        onKeyDown={surTouche}
      >
        {realisation && (
          <>
            <header className="p-fenetre-barre">
              <p className="p-fenetre-titre">
                <span aria-hidden="true">
                  {realisationsLibelles.rang(deuxChiffres(realisation.numero), total)}
                </span>
                <span className="sr-only" role="status">
                  {realisationsLibelles.rangAnnonce(realisation.numero, realisations.length)}
                </span>
              </p>
              <div className="p-fenetre-actions">
                <button type="button" className="p-bouton" onClick={fermer}>
                  <Picto nom="fermer" />
                  {ui.fenetre.fermer}
                </button>
              </div>
            </header>
            {/* Zone défilante : focalisable, pour défiler au clavier même sans lien dans la fiche. */}
            <div className="p-fenetre-corps" tabIndex={0} role="group" aria-labelledby={idTitre}>
              <motion.article
                key={realisation.numero}
                className="p-fiche-realisation"
                initial={{ opacity: 0.45, x: sens.current * 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={RESSORT}
              >
                <ContenuFiche realisation={realisation} idTitre={idTitre} />
              </motion.article>
            </div>
            <nav className="p-fenetre-pied" aria-label={realisationsLibelles.navigation}>
              <Voisine sens="precedente" realisation={realisations[rang - 1]} aller={aller} />
              <Voisine sens="suivante" realisation={realisations[rang + 1]} aller={aller} />
            </nav>
          </>
        )}
      </Fenetre>
    </ContexteFiche>
  )
}
