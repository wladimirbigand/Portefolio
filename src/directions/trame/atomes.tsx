import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import type { Logo, NomPicto, SectionMeta } from '../../content'
import { numeroSection } from '../../lib/demo'
import { sections } from '../../content'
import { NumeroParticules, TitreTordu } from './Effets'
import { Pastille, Picto } from './Picto'
import type { NomAction } from './Picto'

/** Ressorts communs : amortis, sans rebond visible. */
export const RESSORT = { type: 'spring', stiffness: 110, damping: 22, mass: 1 } as const
export const RESSORT_VIF = { type: 'spring', stiffness: 420, damping: 32 } as const
export const VUE = { once: true, amount: 0.2 } as const

/**
 * Révélation au défilement. Le contenu reste lisible avant l'animation : il part d'une opacité
 * partielle et d'un léger décalage, jamais de zéro.
 */
export function Revele({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0.45, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VUE}
      transition={RESSORT}
    >
      {children}
    </motion.div>
  )
}

/** Filet qui se trace de gauche à droite à l'arrivée du bloc. Décoratif. */
export function Filet() {
  return (
    <motion.span
      className="p-filet"
      aria-hidden="true"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={VUE}
      transition={{ ...RESSORT, stiffness: 70 }}
    />
  )
}

/**
 * Grand repère numéroté d'une section : un chiffre net, qui se défait en particules sous le curseur
 * (voir `Effets.tsx`). Décoratif.
 */
export function Numero({ valeur }: { valeur: string }) {
  return <NumeroParticules valeur={valeur} />
}

export function Bouton({
  href,
  plein,
  picto,
  children,
  ...reste
}: {
  href: string
  plein?: boolean
  /** Picto décoratif, devant le libellé. */
  picto?: NomPicto | NomAction
  children: ReactNode
  download?: boolean
  'aria-label'?: string
}) {
  return (
    <motion.a
      className={plein ? 'p-bouton p-bouton-plein' : 'p-bouton'}
      href={href}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={RESSORT_VIF}
      {...reste}
    >
      {picto && <Picto nom={picto} />}
      {children}
    </motion.a>
  )
}


/**
 * Plaque d'un logo : un aplat blanc à filet, pour que le logo garde ses couleurs dans les deux thèmes.
 * Le fichier est servi localement, avec ses dimensions (aucun saut de mise en page).
 */
export function Plaque({ logo }: { logo: Logo }) {
  return (
    <p className="p-plaque">
      <img src={logo.src} alt={logo.alt} width={logo.largeur} height={logo.hauteur} loading="lazy" decoding="async" />
    </p>
  )
}

/**
 * Grand titre d'une section : ses lettres se tordent sous le curseur. Le titre porte son texte entier
 * en `aria-label`, et reste un texte HTML sélectionnable.
 */
export function Titre({ id, texte, nomPropre }: { id: string; texte: string; nomPropre?: boolean }) {
  return (
    <h2 id={id} className="p-titre" translate={nomPropre ? 'no' : undefined} aria-label={texte}>
      <TitreTordu texte={texte} />
    </h2>
  )
}

/**
 * En-tête d'une section : un filet, le numéro (calculé d'après la navigation), la pastille de son picto,
 * le titre (le libellé de la navigation) et son chapô.
 * `children` : ce que la section pose à droite du titre (une réserve, des filtres, un logo).
 * `nom` : le nom de l'organisme présenté (école, entreprise), écrit sous le titre.
 */
export function Entete({
  section,
  idTitre,
  className,
  nom,
  children,
}: {
  section: SectionMeta
  idTitre: string
  className?: string
  nom?: string
  children?: ReactNode
}) {
  return (
    <header className={className ? `p-entete ${className}` : 'p-entete'}>
      <Filet />
      <Numero valeur={numeroSection(section)} />
      <Revele className="p-entete-texte">
        <div className="p-entete-titre">
          <Pastille nom={section.picto} taille="l" rang={sections.indexOf(section)} />
          <Titre id={idTitre} texte={section.titre} />
        </div>
        {nom && (
          <p className="p-entete-nom" translate="no">
            {nom}
          </p>
        )}
        {section.sousTitre && <p className="p-chapo">{section.sousTitre}</p>}
      </Revele>
      {children}
    </header>
  )
}
