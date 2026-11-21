import { useEffect, useRef } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import { motion } from 'motion/react'
import { RESSORT_VIF } from './atomes'

/** Éléments qui reçoivent le focus au clavier, dans l'ordre du document. */
const ARRETS = 'a[href], button:not([disabled]), input, object, iframe, [tabindex]:not([tabindex="-1"])'

/** Le défilement de la page est bloqué tant qu'au moins une fenêtre est ouverte. */
let fenetresOuvertes = 0

function bloquerDefilement(): void {
  if (fenetresOuvertes++ > 0) return
  const racine = document.documentElement
  // Barre de défilement classique : sa place est gardée, la page ne bouge pas d'un pixel.
  // (Barre superposée, sur mobile ou macOS : elle n'occupe rien, il n'y a rien à garder.)
  if (window.innerWidth > racine.clientWidth) racine.style.scrollbarGutter = 'stable'
  racine.style.overflow = 'hidden'
}

function libererDefilement(): void {
  if (--fenetresOuvertes > 0) return
  const racine = document.documentElement
  racine.style.overflow = ''
  racine.style.scrollbarGutter = ''
}

function dansLEcran(element: HTMLElement): boolean {
  const zone = element.getBoundingClientRect()
  return zone.top >= 0 && zone.bottom <= window.innerHeight
}

interface Props {
  ouverte: boolean
  /** Demande de fermeture : bouton, touche Échap, clic sur le fond. */
  onFermer: () => void
  /** Identifiant du titre de la fenêtre (`aria-labelledby`). */
  idTitre: string
  className?: string
  /**
   * Élément qui reçoit le focus à la fermeture. Par défaut (ou si la fonction renvoie `null`),
   * c'est celui qui avait le focus à l'ouverture. `false` : le focus n'est rendu à personne, et la
   * page ne bouge pas (la palette, quand elle mène ailleurs).
   */
  retour?: () => HTMLElement | null | false
  onKeyDown?: (evenement: KeyboardEvent<HTMLDialogElement>) => void
  children: ReactNode
}

/**
 * Fenêtre superposée commune (aperçu d'un document, fiche de réalisation, palette). Un `<dialog>` natif, ouvert en modal :
 * - le reste de la page est inerte, et la tabulation tourne dans la fenêtre (piège de focus) ;
 * - fermeture par un bouton visible (fourni par le contenu), par Échap et par un clic sur le fond ;
 * - à la fermeture, le focus revient à l'élément d'origine ; le défilement de la page est bloqué entre-temps ;
 * - ouverture animée (fond en fondu, cadre qui monte) ; en mouvement réduit, un simple fondu.
 * Le contenu n'est rendu que pendant l'ouverture.
 */
export function Fenetre({ ouverte, onFermer, idTitre, className, retour, onKeyDown, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const origine = useRef<HTMLElement | null>(null)
  const lireRetour = useRef(retour)
  lireRetour.current = retour

  useEffect(() => {
    const fenetre = ref.current
    if (!ouverte || !fenetre) return
    origine.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    if (!fenetre.open) fenetre.showModal()
    // Le navigateur donne le focus au premier élément de la fenêtre. Quand la barre porte d'autres
    // actions avant lui (aperçu d'un document), le bouton « Fermer » le reprend (`data-premier-focus`).
    fenetre.querySelector<HTMLElement>('[data-premier-focus]')?.focus()
    bloquerDefilement()
    return () => {
      libererDefilement()
      if (fenetre.open) fenetre.close()
      const voulu = lireRetour.current?.()
      if (voulu === false) {
        // Le navigateur vient de rendre le focus à l'ancien élément, peut-être loin de l'écran : on le
        // lâche, pour qu'une fenêtre ouverte ensuite ne ramène pas la page vers lui en se fermant.
        if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
        return
      }
      const cible = voulu ?? origine.current
      // Ouverte au clavier sans élément d'origine (le focus était sur la page) : rien à rendre.
      if (!cible?.isConnected || cible === document.body) return
      if (!dansLEcran(cible)) cible.scrollIntoView({ behavior: 'instant', block: 'center' })
      cible.focus({ preventScroll: true })
    }
  }, [ouverte])

  // Piège de focus : après le dernier arrêt, la tabulation revient au premier (et inversement).
  const surTouche = (evenement: KeyboardEvent<HTMLDialogElement>) => {
    onKeyDown?.(evenement)
    if (evenement.key !== 'Tab' || evenement.defaultPrevented) return
    const arrets = [...evenement.currentTarget.querySelectorAll<HTMLElement>(ARRETS)]
    const premier = arrets[0]
    const dernier = arrets[arrets.length - 1]
    if (!premier || !dernier) return
    if (evenement.shiftKey && document.activeElement === premier) {
      evenement.preventDefault()
      dernier.focus()
    } else if (!evenement.shiftKey && document.activeElement === dernier) {
      evenement.preventDefault()
      premier.focus()
    }
  }

  return (
    <dialog
      ref={ref}
      className={className ? `p-fenetre ${className}` : 'p-fenetre'}
      // Fermée, la fenêtre n'a pas de contenu : son titre n'existe pas encore.
      aria-labelledby={ouverte ? idTitre : undefined}
      onKeyDown={surTouche}
      // Échap : la fermeture passe par l'état du parent (l'URL d'une fiche doit suivre).
      onCancel={(evenement) => {
        evenement.preventDefault()
        onFermer()
      }}
      // Fermeture décidée par le navigateur (Échap insistant) : l'état suit.
      onClose={(evenement) => {
        if (ouverte && !evenement.currentTarget.open) onFermer()
      }}
    >
      {ouverte && (
        <>
          <motion.div
            className="p-fenetre-fond"
            aria-hidden="true"
            onClick={onFermer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          />
          <motion.div
            className="p-fenetre-cadre"
            initial={{ opacity: 0.4, y: 20, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={RESSORT_VIF}
          >
            {children}
          </motion.div>
        </>
      )}
    </dialog>
  )
}
