import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { demo, epreuves, epreuvesActions, realisations, realisationsLibelles, ui } from '../../content'
import { entrees } from '../../lib/demo'
import type { Theme } from '../../lib/theme'
import { fichierPublic } from '../../lib/url'
import { useApercu } from './Apercu'
import { Fenetre } from './Fenetre'
import { Picto } from './Picto'
import { useCommandesFiches } from './Fiches'
import { deuxChiffres, numeroDepuisAncre } from './realisations'

type Genre = 'section' | 'realisation' | 'document' | 'action'

/** Ce que fait un résultat quand on l'ouvre. */
type Effet =
  | { t: 'section'; id: string }
  | { t: 'realisation'; numero: number }
  | { t: 'document'; url: string; titre: string }
  | { t: 'theme' }
  | { t: 'portrait' }
  | { t: 'oral' }

interface Entree {
  cle: string
  genre: Genre
  /** Repère en chasse fixe, au début de la ligne : « 06 », « 13 », « E6 ». */
  repere: string
  label: string
  /** Texte où l'on cherche, déjà normalisé (sans accents, en minuscules). */
  mots: string
  /** Numéro de réalisation : « 13 » et « 03 » le retrouvent. */
  numero?: number
  effet: Effet
}

const GENRES: Genre[] = ['section', 'realisation', 'document', 'action']

/** Sans accents et en minuscules : « epreuves » trouve « Épreuves ». */
function normaliser(texte: string): string {
  return texte
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[ ⁠’']/g, ' ')
    .toLowerCase()
}

const { palette } = ui

const FICHIERS_EPREUVES = new Set(
  epreuves.flatMap((epreuve) => epreuve.documents.flatMap((document) => (document.fichier ? [document.fichier] : []))),
)

/** Les résultats qui ne changent jamais : l'accueil et les 9 sections, les 16 réalisations, les documents. */
const FIXES: Entree[] = [
  ...entrees.map(
    (entree): Entree => ({
      cle: `section-${entree.id}`,
      genre: 'section',
      repere: entree.numero,
      label: entree.nav,
      mots: normaliser(`${entree.nav} ${entree.id} ${entree.numero}`),
      effet: { t: 'section', id: entree.id },
    }),
  ),
  ...realisations.map(
    (realisation): Entree => ({
      cle: `realisation-${realisation.numero}`,
      genre: 'realisation',
      repere: deuxChiffres(realisation.numero),
      label: realisation.titreCourt,
      // Numéro, titre court, intitulé officiel, outils et documents de la fiche.
      mots: normaliser(
        [
          palette.realisation(realisation.numero),
          realisation.titreCourt,
          realisation.intitule,
          ...(realisation.fiche?.outils ?? []),
          ...(realisation.fiche?.preuves?.documents ?? []).map((document) => document.label),
        ].join(' '),
      ),
      numero: realisation.numero,
      effet: { t: 'realisation', numero: realisation.numero },
    }),
  ),
  ...epreuves.flatMap((epreuve) =>
    epreuve.documents.flatMap((document): Entree[] =>
      document.fichier
        ? [
            {
              cle: `document-${epreuve.code}-${document.label}`,
              genre: 'document',
              repere: epreuve.code,
              label: document.titre ? `${document.label} · ${document.titre}` : document.label,
              mots: normaliser(
                `${epreuve.code} ${epreuvesActions.mot} ${epreuve.intitule} ${document.label} ${document.titre ?? ''} pdf`,
              ),
              effet: {
                t: 'document',
                url: fichierPublic(document.fichier),
                titre: epreuvesActions.titreApercu(epreuve.code, document.label),
              },
            },
          ]
        : [],
    ),
  ),
  // Documents joints à une réalisation, sauf ceux qui sont déjà ceux d'une épreuve (la fiche E6).
  ...realisations.flatMap((realisation) =>
    (realisation.fiche?.preuves?.documents ?? [])
      .filter((document) => !FICHIERS_EPREUVES.has(document.url))
      .map(
        (document): Entree => ({
          cle: `document-${realisation.numero}-${document.url}`,
          genre: 'document',
          repere: deuxChiffres(realisation.numero),
          label: document.label,
          mots: normaliser(
            `${palette.realisation(realisation.numero)} ${realisation.titreCourt} ${document.label} ${document.titreCourt ?? ''} pdf`,
          ),
          effet: {
            t: 'document',
            url: fichierPublic(document.url),
            titre: document.titreCourt ?? realisationsLibelles.titreDocument(document.label, realisation.numero),
          },
        }),
      ),
  ),
]

/** Note d'un résultat pour une recherche (0 : il ne correspond pas). Chaque mot doit être trouvé. */
function noter(entree: Entree, mots: string[]): number {
  const label = normaliser(entree.label)
  const repere = normaliser(entree.repere)
  let note = 0
  for (const mot of mots) {
    if (entree.numero !== undefined && /^\d+$/.test(mot) && Number(mot) === entree.numero) note += 100
    else if (mot === repere) note += 100
    else if (label.startsWith(mot)) note += 20
    else if (label.includes(` ${mot}`)) note += 10
    else if (label.includes(mot)) note += 5
    else if (entree.mots.includes(mot)) note += 1
    else return 0
  }
  return note
}

/** Résultats d'une recherche, rangés par groupe ; le groupe du meilleur résultat passe en premier. */
function chercher(recherche: string, toutes: Entree[]): { genre: Genre; entrees: Entree[] }[] {
  const mots = normaliser(recherche).split(/\s+/).filter(Boolean)
  const notes = new Map<Entree, number>()
  for (const entree of toutes) {
    const note = mots.length === 0 ? 1 : noter(entree, mots)
    if (note > 0) notes.set(entree, note)
  }
  const groupes = GENRES.map((genre) => {
    const trouvees = toutes.filter((entree) => entree.genre === genre && notes.has(entree))
    if (mots.length > 0) trouvees.sort((a, b) => notes.get(b)! - notes.get(a)!)
    return { genre, entrees: trouvees, meilleure: Math.max(0, ...trouvees.map((entree) => notes.get(entree)!)) }
  }).filter((groupe) => groupe.entrees.length > 0)
  if (mots.length > 0) groupes.sort((a, b) => b.meilleure - a.meilleure)
  return groupes
}

/** Amène une section sous la barre, tout de suite (pas de défilement animé : on navigue pendant l'oral). */
function allerA(id: string): void {
  const cible = document.getElementById(id)
  if (!cible) return
  const url = `${window.location.pathname}${window.location.search}#${id}`
  // Une fiche était ouverte : son entrée d'historique devient celle de la section.
  if (numeroDepuisAncre(window.location.hash) !== null) window.history.replaceState(null, '', url)
  else if (window.location.hash !== `#${id}`) window.history.pushState(null, '', url)
  cible.scrollIntoView({ behavior: 'instant', block: 'start' })
}

function dansLEcran(element: HTMLElement): boolean {
  const zone = element.getBoundingClientRect()
  return zone.bottom > 0 && zone.top < window.innerHeight
}

interface Props {
  ouverte: boolean
  onOuverture: (ouverte: boolean | ((actuel: boolean) => boolean)) => void
  theme: Theme
  basculerTheme: () => void
  /** Vrai si le portrait de l'accueil est en mode photo. */
  photo: boolean
  basculerPortrait: () => void
  /** Affiche ou masque le chronomètre du mode oral (comme la touche O). Absent sous 1200 px : l'action n'est pas proposée. */
  basculerOral?: () => void
}

/**
 * Palette de navigation rapide : Ctrl+K (Cmd+K sur Mac) ouvre un champ de recherche dans la fenêtre
 * superposée. Motif « combobox » : le focus reste dans le champ, les flèches parcourent les résultats
 * (`aria-activedescendant`), Entrée ouvre, Échap ferme.
 * - Une section : la page y saute. Une réalisation : sa fiche s'ouvre. Un document : son aperçu
 *   s'ouvre (sous 768 px, dans un nouvel onglet). Une action : le thème, le portrait, ou le mode oral.
 * - Elle s'ouvre aussi par-dessus une fiche ou un aperçu : le résultat choisi les remplace.
 */
export function Palette({ ouverte, onOuverture, theme, basculerTheme, photo, basculerPortrait, basculerOral }: Props) {
  const [recherche, setRecherche] = useState('')
  const [active, setActive] = useState(0)
  const idTitre = useId()
  const idListe = useId()
  const champ = useRef<HTMLInputElement>(null)
  /** Élément qui avait le focus à l'ouverture : il le retrouve si la palette se ferme sans rien ouvrir. */
  const origine = useRef<HTMLElement | null>(null)
  /** Le résultat choisi mène ailleurs : le focus n'est pas rendu, et `suite` s'exécute une fois fermée. */
  const ailleurs = useRef(false)
  const suite = useRef<(() => void) | null>(null)
  const fiches = useCommandesFiches()
  const apercu = useApercu()

  const toutes = useMemo<Entree[]>(
    () => [
      ...FIXES,
      {
        cle: 'action-theme',
        genre: 'action',
        repere: '',
        label: theme === 'dark' ? palette.actions.themeClair : palette.actions.themeSombre,
        mots: normaliser(palette.motsActions.theme),
        effet: { t: 'theme' },
      },
      {
        cle: 'action-portrait',
        genre: 'action',
        repere: '',
        label: photo ? palette.actions.points : palette.actions.photo,
        mots: normaliser(palette.motsActions.portrait),
        effet: { t: 'portrait' },
      },
      ...(basculerOral
        ? [
            {
              cle: 'action-oral',
              genre: 'action',
              repere: '',
              label: palette.actions.oral,
              mots: normaliser(palette.motsActions.oral),
              effet: { t: 'oral' },
            } satisfies Entree,
          ]
        : []),
    ],
    [theme, photo, basculerOral],
  )
  const groupes = useMemo(() => chercher(recherche, toutes), [recherche, toutes])
  const resultats = useMemo(() => groupes.flatMap((groupe) => groupe.entrees), [groupes])
  const idOption = (rang: number) => `${idListe}-${rang}`

  // Ctrl+K ou Cmd+K, partout dans la page : ouvre la palette, ou la referme.
  useEffect(() => {
    const surTouche = (evenement: globalThis.KeyboardEvent) => {
      if (evenement.key.toLowerCase() !== 'k' || !(evenement.ctrlKey || evenement.metaKey)) return
      if (evenement.altKey || evenement.shiftKey) return
      evenement.preventDefault()
      onOuverture((actuel) => !actuel)
    }
    window.addEventListener('keydown', surTouche)
    return () => window.removeEventListener('keydown', surTouche)
  }, [onOuverture])

  // À chaque ouverture : champ vide, premier résultat, et mémoire de l'élément d'origine.
  const [vue, setVue] = useState(ouverte)
  if (vue !== ouverte) {
    setVue(ouverte)
    if (ouverte) {
      setRecherche('')
      setActive(0)
    }
  }
  useEffect(() => {
    if (ouverte) {
      ailleurs.current = false
      suite.current = null
      // La fenêtre vient de prendre le focus : l'élément d'origine est celui qu'elle a retenu avant.
      return
    }
    // Fermée (la fenêtre a déjà rendu la page) : ce que le résultat choisi demandait.
    const faire = suite.current
    suite.current = null
    faire?.()
  }, [ouverte])

  // Le résultat actif reste visible dans la liste.
  useEffect(() => {
    if (ouverte) document.getElementById(`${idListe}-${active}`)?.scrollIntoView({ block: 'nearest' })
  }, [ouverte, active, idListe])

  const fermer = useCallback(() => onOuverture(false), [onOuverture])

  const choisir = (entree: Entree | undefined) => {
    if (!entree) return
    const { effet } = entree
    if (effet.t === 'theme' || effet.t === 'oral') {
      // Rien ne bouge dans la page : la palette se ferme et rend le focus.
      if (effet.t === 'theme') basculerTheme()
      else basculerOral?.()
      fermer()
      return
    }
    ailleurs.current = true
    if (effet.t === 'realisation') {
      apercu.fermer()
      fiches.ouvrir(effet.numero)
    } else if (effet.t === 'document') {
      apercu.ouvrir({ url: effet.url, titre: effet.titre })
    } else {
      // Une section, ou le portrait (à l'accueil) : fiche et aperçu se ferment, puis la page y saute.
      apercu.fermer()
      fiches.fermer()
      const id = effet.t === 'section' ? effet.id : demo.accueil.id
      if (effet.t === 'portrait') basculerPortrait()
      suite.current = () => allerA(id)
    }
    fermer()
  }

  const surTouche = (evenement: KeyboardEvent<HTMLInputElement>) => {
    if (evenement.key === 'ArrowDown' || evenement.key === 'ArrowUp') {
      evenement.preventDefault()
      if (resultats.length === 0) return
      const pas = evenement.key === 'ArrowDown' ? 1 : -1
      setActive((actuel) => (actuel + pas + resultats.length) % resultats.length)
    } else if (evenement.key === 'Enter') {
      evenement.preventDefault()
      choisir(resultats[active])
    }
  }

  let rang = -1
  return (
    <Fenetre
      ouverte={ouverte}
      onFermer={fermer}
      idTitre={idTitre}
      className="p-fenetre-palette"
      retour={() => {
        const depart = origine.current
        origine.current = null
        if (ailleurs.current || !depart?.isConnected || !dansLEcran(depart)) return false
        return depart
      }}
    >
      <header className="p-fenetre-barre p-palette-barre">
        <h2 id={idTitre} className="sr-only">
          {palette.titre}
        </h2>
        <Picto nom="recherche" taille="m" className="p-palette-loupe" />
        <input
          ref={champ}
          className="p-palette-champ"
          type="text"
          name="recherche"
          role="combobox"
          aria-label={palette.champ}
          aria-expanded="true"
          aria-controls={idListe}
          aria-autocomplete="list"
          aria-activedescendant={resultats.length > 0 ? idOption(active) : undefined}
          placeholder={palette.indice}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          enterKeyHint="go"
          value={recherche}
          onChange={(evenement) => {
            setRecherche(evenement.target.value)
            setActive(0)
          }}
          onKeyDown={surTouche}
          // Juste avant que la fenêtre prenne le focus : l'élément qui l'avait.
          onFocus={(evenement) => {
            const avant = evenement.relatedTarget
            if (origine.current === null && avant instanceof HTMLElement) origine.current = avant
          }}
        />
        <div className="p-fenetre-actions">
          <button type="button" className="p-bouton" onClick={fermer}>
            <Picto nom="fermer" />
            {ui.fenetre.fermer}
          </button>
        </div>
      </header>
      <p className="sr-only" role="status">
        {palette.compte(resultats.length)}
      </p>
      <div className="p-fenetre-corps p-palette-corps">
        <div id={idListe} className="p-palette-liste" role="listbox" aria-label={palette.resultats}>
          {groupes.map((groupe) => (
            <div key={groupe.genre} role="group" aria-labelledby={`${idListe}-${groupe.genre}`}>
              <p id={`${idListe}-${groupe.genre}`} className="p-label p-palette-groupe" role="presentation">
                {palette.groupes[groupe.genre]}
              </p>
              {groupe.entrees.map((entree) => {
                rang++
                const place = rang
                return (
                  <div
                    key={entree.cle}
                    id={idOption(place)}
                    className="p-palette-option"
                    role="option"
                    aria-selected={place === active}
                    onPointerMove={() => setActive(place)}
                    onClick={() => choisir(entree)}
                  >
                    <span className="p-palette-repere" aria-hidden={entree.repere ? undefined : true}>
                      {entree.repere}
                    </span>
                    <span className="p-palette-label">{entree.label}</span>
                    <span className="p-palette-effet">{palette.effets[entree.genre]}</span>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
        {resultats.length === 0 && <p className="p-palette-vide">{palette.aucun(recherche.trim())}</p>}
      </div>
      <footer className="p-fenetre-pied p-palette-pied">
        <p>{palette.touches}</p>
      </footer>
    </Fenetre>
  )
}
