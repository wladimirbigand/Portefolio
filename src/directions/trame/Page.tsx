import '@fontsource-variable/schibsted-grotesk/wght.css'
import '@fontsource-variable/martian-mono/standard.css'
import './trame.css'
import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import { AnimatePresence, motion, useMotionValue } from 'motion/react'
import {
  demo,
  epreuves,
  epreuvesActions,
  epreuvesSection,
  navigation,
  piedDePage,
  profil,
  sections,
  ui,
} from '../../content'
import type { Epreuve } from '../../content'
import { entrees, idsPage } from '../../lib/demo'
import { useAncreInitiale } from '../../lib/ancreInitiale'
import { useSectionActive } from '../../lib/sectionActive'
import type { Theme } from '../../lib/theme'
import { REQUETE_TACTILE, useMedia } from '../../lib/media'
import { fichierPublic, modeOral } from '../../lib/url'
import { Curseur } from '../commun/Curseur'
import { BlocDocument, FournisseurApercu } from './Apercu'
import { Bouton, Entete, Filet, RESSORT, RESSORT_VIF, VUE } from './atomes'
import { Certifications } from './Certifications'
import { Competences } from './Competences'
import { Contact } from './Contact'
import { Entreprise } from './Entreprise'
import { FournisseurFiches } from './Fiches'
import { Formation } from './Formation'
import { Palette } from './Palette'
import { Picto } from './Picto'
import { Parcours } from './Parcours'
import { Projets } from './Projets'
import { lancerOnde, Trame } from './Trame'
import { lancerOndeTactile, TramePosee } from './TramePosee'
import { Veille } from './Veille'

interface Props {
  theme: Theme
  basculer: () => void
}

// `?oral` est lu une fois, au chargement : le chronomètre est alors affiché d'emblée. Sinon, la touche O.
const oralAuChargement = modeOral()
/** Raccourci de la palette, tel qu'il s'écrit sur cette machine : « ⌘ K » sur Mac, « Ctrl K » ailleurs. */
const raccourciPalette = /mac|iphone|ipad/i.test(navigator.platform) ? ui.palette.raccourci.mac : ui.palette.raccourci.autre

/** Pictos des deux boutons de l'accueil : voir les projets, écrire. */
const ICONES_ACTIONS = ['projets', 'email'] as const

const CLE_PORTRAIT = 'portfolio:portrait'
/** Double appui sur le portrait (tactile) : deux appuis à moins de 350 ms et de 40 px l'un de l'autre. */
const DELAI_DOUBLE_APPUI = 350
const ECART_DOUBLE_APPUI = 40

/** Choix mémorisé entre les visites. Le stockage peut être refusé (navigation privée) : on s'en passe. */
function lireChoixPortrait(): boolean {
  try {
    return window.localStorage.getItem(CLE_PORTRAIT) === 'photo'
  } catch {
    return false
  }
}

function memoriserChoixPortrait(photo: boolean): void {
  try {
    window.localStorage.setItem(CLE_PORTRAIT, photo ? 'photo' : 'points')
  } catch {
    // Stockage indisponible : le choix vaut pour cette visite seulement.
  }
}

function LigneEpreuve({ epreuve, index }: { epreuve: Epreuve; index: number }) {
  return (
    <motion.li
      className="p-epreuve"
      initial={{ opacity: 0.45, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VUE}
      transition={{ ...RESSORT, delay: 0.06 * index }}
    >
      <Filet />
      <h3 className="p-epreuve-code">
        <span className="p-epreuve-mot">{epreuvesActions.mot}</span>{' '}
        <span className="p-epreuve-sigle">{epreuve.code}</span>
      </h3>
      <div className="p-epreuve-texte">
        <p className="p-epreuve-intitule">{epreuve.intitule}</p>
        <p>{epreuve.description}</p>
      </div>
      <ul className="p-documents" role="list">
        {epreuve.documents.map((document) => (
          <li key={document.label} className="p-document" data-etat={document.fichier ? 'disponible' : 'a-venir'}>
            {document.fichier ? (
              // L'aperçu s'ouvre dans la fenêtre superposée commune (voir `Apercu.tsx`).
              <BlocDocument
                label={document.label}
                titre={document.titre}
                url={fichierPublic(document.fichier)}
                titreApercu={epreuvesActions.titreApercu(epreuve.code, document.label)}
                nom={(action) => demo.epreuves.pour(action, document.label, epreuve.code)}
              />
            ) : (
              <p className="p-etat p-etat-attente">
                <span className="p-etat-marque" aria-hidden="true" />
                <span>
                  <span className="p-document-label">{document.label}</span> · {epreuvesActions.aVenir}
                  <span className="p-etat-detail">{demo.epreuves.aVenirDetail}</span>
                </span>
              </p>
            )}
          </li>
        ))}
      </ul>
    </motion.li>
  )
}

/** Compteur de position dans la barre : « 03 / 09 ». Décoratif : la navigation porte `aria-current`. */
function Compteur({ index }: { index: number }) {
  const entree = entrees[index] ?? entrees[0]!
  return (
    <p className="p-compteur" aria-hidden="true">
      <span className="p-compteur-masque">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={entree.numero}
            className="p-compteur-numero"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={RESSORT_VIF}
          >
            {entree.numero}
          </motion.span>
        </AnimatePresence>
      </span>
      <span>{demo.total('', sections.length).trim()}</span>
    </p>
  )
}

/**
 * Mode oral (touche O, ou `?oral`) : chronomètre mm:ss dans le coin bas gauche. Il démarre à 00:00
 * quand il s'affiche ; masqué, il est démonté, donc remis à zéro. Outil personnel de l'orateur,
 * volontairement discret. `role="timer"` n'est pas annoncé en continu par les lecteurs d'écran.
 */
function Chronometre() {
  const [secondes, setSecondes] = useState(0)

  useEffect(() => {
    const depart = performance.now()
    const battre = () => setSecondes(Math.floor((performance.now() - depart) / 1000))
    const minuterie = window.setInterval(battre, 250)
    return () => window.clearInterval(minuterie)
  }, [])

  const mm = String(Math.floor(secondes / 60)).padStart(2, '0')
  const ss = String(secondes % 60).padStart(2, '0')
  return (
    <p className="p-chrono" role="timer" aria-live="off" aria-label={demo.oral.chronometre}>
      {mm}:{ss}
    </p>
  )
}

/** La page, dans la DA « trame » : l’accueil, les neuf sections dans l’ordre de la navigation, le pied de page et la palette Ctrl+K. Référence : DESIGN.md */
export default function Page({ theme, basculer }: Props) {
  useAncreInitiale()
  const active = useSectionActive(idsPage)
  const index = Math.max(
    0,
    entrees.findIndex((entree) => entree.id === active),
  )
  const [menuOuvert, setMenuOuvert] = useState(false)
  const [photo, setPhoto] = useState(lireChoixPortrait)
  const [palette, setPalette] = useState(false)
  // Mode oral : ni mémorisé ni écrit dans l'URL. Il vaut pour la page ouverte.
  const [oral, setOral] = useState(oralAuChargement)
  const basculerOral = useCallback(() => setOral((actuel) => !actuel), [])
  // Appareil tactile : pas de curseur. La trame est « posée » (une toile par réserve, pilotée par le défilement).
  const tactile = useMedia(REQUETE_TACTILE)
  const opacitePhoto = useMotionValue(photo ? 1 : 0)
  const boutonMenu = useRef<HTMLButtonElement>(null)
  const menu = useRef<HTMLDivElement>(null)

  // Le secret du portrait : un clic (ou un appui) dessus bascule entre les points et la photo.
  const basculerPortrait = useCallback(() => {
    setPhoto((actuel) => {
      memoriserChoixPortrait(!actuel)
      return !actuel
    })
  }, [])

  // Au toucher : un appui bref lance l'onde, un double appui bascule entre les points et la photo.
  // Ce sont de simples `click` : ils ne retiennent pas le défilement, et `touch-action: manipulation`
  // (sur le portrait) écarte le zoom du double appui.
  const dernierAppui = useRef({ instant: -1, x: 0, y: 0 })
  const surAppuiPortrait = useCallback(
    (evenement: MouseEvent<HTMLDivElement>) => {
      const dernier = dernierAppui.current
      const double =
        dernier.instant >= 0 &&
        evenement.timeStamp - dernier.instant < DELAI_DOUBLE_APPUI &&
        Math.hypot(evenement.clientX - dernier.x, evenement.clientY - dernier.y) < ECART_DOUBLE_APPUI
      if (double) {
        dernier.instant = -1
        basculerPortrait()
        return
      }
      dernierAppui.current = { instant: evenement.timeStamp, x: evenement.clientX, y: evenement.clientY }
      lancerOndeTactile()
    },
    [basculerPortrait],
  )

  // Deux touches seules, hors champ de saisie et sans Ctrl, Alt ni Meta :
  // P bascule le portrait (équivalent du clic), O affiche ou masque le chronomètre de l'oral.
  useEffect(() => {
    const surTouche = (evenement: KeyboardEvent) => {
      const touche = evenement.key.toLowerCase()
      if ((touche !== 'p' && touche !== 'o') || evenement.repeat) return
      if (evenement.ctrlKey || evenement.metaKey || evenement.altKey) return
      const cible = evenement.target
      if (cible instanceof HTMLElement && (cible.isContentEditable || /^(input|textarea|select)$/i.test(cible.tagName))) {
        return
      }
      if (touche === 'o') {
        basculerOral()
        return
      }
      // Fenêtre superposée ouverte : la page derrière est inerte, son secret aussi.
      if (document.querySelector('dialog[open]')) return
      basculerPortrait()
    }
    window.addEventListener('keydown', surTouche)
    return () => window.removeEventListener('keydown', surTouche)
  }, [basculerPortrait, basculerOral])

  // Menu ouvert : Échap le referme, et la tabulation tourne entre le bouton et les entrées du menu.
  useEffect(() => {
    if (!menuOuvert) return
    const surTouche = (evenement: KeyboardEvent) => {
      if (evenement.key === 'Escape') {
        setMenuOuvert(false)
        boutonMenu.current?.focus()
        return
      }
      if (evenement.key !== 'Tab' || !boutonMenu.current || !menu.current) return
      const arrets = [boutonMenu.current, ...menu.current.querySelectorAll<HTMLElement>('a[href], button')]
      const premier = arrets[0]!
      const dernier = arrets[arrets.length - 1]!
      const courant = document.activeElement
      if (!(courant instanceof HTMLElement) || !arrets.includes(courant)) {
        evenement.preventDefault()
        premier.focus()
      } else if (evenement.shiftKey && courant === premier) {
        evenement.preventDefault()
        dernier.focus()
      } else if (!evenement.shiftKey && courant === dernier) {
        evenement.preventDefault()
        premier.focus()
      }
    }
    // La navigation passe en ligne sur grand écran : le menu n'a plus lieu d'être.
    const large = window.matchMedia('(min-width: 75em)')
    const surLargeur = () => {
      if (large.matches) setMenuOuvert(false)
    }
    window.addEventListener('keydown', surTouche)
    large.addEventListener('change', surLargeur)
    return () => {
      window.removeEventListener('keydown', surTouche)
      large.removeEventListener('change', surLargeur)
    }
  }, [menuOuvert])

  const bascule = (
    <button type="button" className="p-bouton p-bouton-discret" onClick={basculer}>
      <span className="sr-only">
        {theme === 'dark' ? ui.theme.passerAuClair : ui.theme.passerAuSombre}
      </span>
      <Picto nom={theme === 'dark' ? 'clair' : 'sombre'} />
      <span aria-hidden="true">{demo.basculeTheme[theme]}</span>
    </button>
  )

  const mots = profil.nomComplet.split(' ')

  return (
    <div className="piste da-trame">
      <FournisseurApercu>
      <FournisseurFiches>
      {tactile ? (
        <TramePosee theme={theme} photo={photo} opacitePhoto={opacitePhoto} />
      ) : (
        <Trame etat={index} theme={theme} photo={photo} opacitePhoto={opacitePhoto} />
      )}
      <Curseur />

      <header className="p-barre">
        <a className="p-logo" translate="no" href={`#${demo.accueil.id}`}>
          {profil.logoTexte}
        </a>
        <Compteur index={index} />
        <nav className="p-nav" aria-label={demo.navPrincipale}>
          <ul>
            {sections.map((section) => {
              const courante = section.id === active
              return (
                <li key={section.id}>
                  <a href={`#${section.id}`} aria-current={courante ? 'location' : undefined}>
                    {section.nav}
                    {courante && (
                      <motion.span layoutId="p-nav-actif" className="p-nav-actif" transition={RESSORT_VIF} />
                    )}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="p-barre-fin">{bascule}</div>
        <button
          ref={boutonMenu}
          type="button"
          className="p-bouton p-menu-bouton"
          aria-expanded={menuOuvert}
          aria-controls="p-menu"
          onClick={() => setMenuOuvert((ouvert) => !ouvert)}
        >
          {/* Ouvert, le libellé est long : pas de picto, pour tenir dans la barre en 375 px. */}
          {!menuOuvert && <Picto nom="menu" />}
          {menuOuvert ? navigation.fermerMenu : demo.menu}
        </button>
        <div ref={menu} id="p-menu" className="p-menu" hidden={!menuOuvert}>
          <nav aria-label={demo.sommaire}>
            <ul>
              {entrees.map((entree) => (
                <li key={entree.id}>
                  <a
                    href={`#${entree.id}`}
                    aria-current={entree.id === active ? 'location' : undefined}
                    onClick={() => setMenuOuvert(false)}
                  >
                    <span className="p-menu-numero" aria-hidden="true">
                      {entree.numero}
                    </span>
                    {entree.nav}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          {bascule}
        </div>
      </header>

      {oral && <Chronometre />}

      <main id="contenu" className="p-contenu">
        <section id={demo.accueil.id} className="p-accueil" aria-labelledby="p-nom">
          <div className="p-accueil-texte">
            <p className="p-repere">
              <span className="p-repere-numero" aria-hidden="true">
                00
              </span>
              {profil.accroche}
            </p>
            <h1 id="p-nom" className="p-nom">
              {mots.map((mot, rang) => (
                <Fragment key={mot}>
                  {rang > 0 && ' '}
                  {/* Survoler le prénom lance une onde dans le portrait. */}
                  <span className="p-nom-masque" onPointerEnter={rang === 0 ? lancerOnde : undefined}>
                    <motion.span
                      initial={{ y: '38%', opacity: 0.4 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ ...RESSORT, delay: 0.08 * rang }}
                    >
                      {mot}
                    </motion.span>
                  </span>
                </Fragment>
              ))}
            </h1>
            <ul className="p-roles" aria-label={demo.rolesTitre}>
              <li>{profil.titre}</li>
              {profil.roles.map((role) => (
                <li key={role.texte}>
                  <Picto nom={role.picto} />
                  {role.texte}
                </li>
              ))}
            </ul>
            <p className="p-presentation">{profil.presentation}</p>
            <div className="p-accueil-liens">
              <div className="p-actions">
                {profil.actions.map((action, rang) => (
                  <Bouton key={action.url} href={action.url} plein={rang === 0} picto={ICONES_ACTIONS[rang]}>
                    {action.label}
                  </Bouton>
                ))}
              </div>
              <ul className="p-reseaux" aria-label={demo.reseauxTitre}>
                {profil.reseaux.map((reseau) => (
                  <li key={reseau.url}>
                    <a className="p-lien" href={reseau.url} target="_blank" rel="noreferrer">
                      <Picto nom={reseau.picto} />
                      {reseau.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-accueil-portrait">
            {/*
              Réserve du portrait : les points s'y composent ; la photo s'y superpose en mode photo.
              Un clic bascule de l'un à l'autre. C'est un secret, sans indice visible : pas de rôle de
              bouton ni d'arrêt de tabulation, la touche P en est l'équivalent au clavier.
              Au toucher, un appui bref lance l'onde dans les points ; un double appui bascule.
            */}
            <div
              className="p-portrait"
              data-reserve={demo.accueil.id}
              data-secret=""
              role="img"
              aria-label={profil.photoAlt}
              onClick={tactile ? surAppuiPortrait : basculerPortrait}
            >
              <motion.img
                className="p-portrait-photo"
                src={profil.photoDetouree}
                alt=""
                width={800}
                height={1200}
                decoding="async"
                draggable={false}
                style={{ opacity: opacitePhoto }}
              />
            </div>
          </div>
        </section>

        <Parcours />
        <Formation />
        <Entreprise />

        <section id={epreuvesSection.id} className="p-section" aria-labelledby="p-epreuves-titre">
          <Entete section={epreuvesSection} idTitre="p-epreuves-titre" className="p-entete-figure">
            {/* Espace libre à droite du titre : la figure des épreuves s'y compose, en largeur. */}
            <div className="p-reserve p-reserve-bande" data-reserve={epreuvesSection.id} aria-hidden="true" />
          </Entete>
          <ul className="p-epreuves" role="list">
            {epreuves.map((epreuve, rang) => (
              <LigneEpreuve key={epreuve.code} epreuve={epreuve} index={rang} />
            ))}
          </ul>
        </section>

        <Projets />

        <Competences />
        <Certifications />
        <Veille />
        <Contact />

        <footer className="p-pied">
          <p className="p-pied-mentions">
            <span translate="no">{piedDePage.copyright(new Date().getFullYear())}</span>
            <span>{piedDePage.mention}</span>
          </p>
          <div className="p-pied-liens">
            {/* Seule indication visible de la palette : un bouton discret, qui l'ouvre aussi à la souris et au toucher. */}
            <button
              type="button"
              className="p-pied-palette"
              aria-haspopup="dialog"
              aria-keyshortcuts="Control+K Meta+K"
              onClick={() => setPalette(true)}
            >
              <Picto nom="recherche" />
              {ui.palette.titre}
              <kbd>{raccourciPalette}</kbd>
            </button>
            <a className="p-lien" href={`#${demo.accueil.id}`}>
              {navigation.retourHaut}
              <Picto nom="haut" />
            </a>
          </div>
        </footer>
      </main>
      <Palette
        ouverte={palette}
        onOuverture={setPalette}
        theme={theme}
        basculerTheme={basculer}
        photo={photo}
        basculerPortrait={basculerPortrait}
        basculerOral={basculerOral}
      />
      </FournisseurFiches>
      </FournisseurApercu>
    </div>
  )
}
