import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Award,
  Boxes,
  BrainCircuit,
  BriefcaseBusiness,
  Building2,
  CalendarRange,
  Check,
  CirclePause,
  ClipboardCheck,
  Copy,
  Database,
  Download,
  ExternalLink,
  Eye,
  Flag,
  FolderKanban,
  Globe,
  GraduationCap,
  History,
  Layers,
  LayoutDashboard,
  Mail,
  MapPin,
  Menu,
  MessagesSquare,
  Moon,
  Network,
  Radar,
  Route,
  Rss,
  Search,
  Send,
  Server,
  ShieldCheck,
  SquareTerminal,
  Sun,
  UserPlus,
  UserRound,
  Video,
  Workflow,
  Wrench,
  X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { siDiscord, siFeedly, siGithub } from 'simple-icons'
import type { SimpleIcon } from 'simple-icons'
import type { NomPicto } from '../../content'

/**
 * Le système de pictos du site (DESIGN.md, « Pictos »).
 * - Un seul trait : 2 px à toutes les tailles (l'épaisseur des contours de bouton), bouts et angles ronds.
 * - Quatre tailles, et pas d'autre : 18, 22, 28 et 44 px.
 * - Une couleur : celle du texte qui le porte (`currentColor`) dans un bouton ou un lien, l'accent ailleurs.
 * - Toujours décoratif : le texte voisin dit la même chose. Le picto est masqué aux lecteurs d'écran.
 * Les pictos au trait viennent de lucide-react ; les logos de marque (Feedly, Discord, GitHub) de
 * simple-icons, en une seule couleur. Rien ne vient d'un CDN.
 */

/** Pictos de l'interface (actions des boutons et des liens), nommés par ce qu'ils font. */
export type NomAction =
  | 'telecharger'
  | 'apercu'
  | 'externe'
  | 'fermer'
  | 'sombre'
  | 'clair'
  | 'menu'
  | 'haut'
  | 'suivant'
  | 'precedent'
  | 'recherche'
  | 'copier'
  | 'fait'
  | 'ecrire'
  | 'pause'
  | 'avant'
  | 'poste'
  | 'periode'
  | 'environnement'

type Dessin = LucideIcon | SimpleIcon

const DESSINS: Record<NomPicto | NomAction, Dessin> = {
  // Les neuf sections.
  parcours: Route,
  formation: GraduationCap,
  entreprise: Building2,
  epreuves: ClipboardCheck,
  projets: FolderKanban,
  competences: Wrench,
  certifications: Award,
  veille: Radar,
  contact: MessagesSquare,
  // Groupes de compétences et thèmes de veille.
  systemes: Server,
  reseau: Network,
  scripts: SquareTerminal,
  virtualisation: Boxes,
  automatisation: Workflow,
  ctf: Flag,
  web: Globe,
  cybersecurite: ShieldCheck,
  ia: BrainCircuit,
  // Réalisations mises en avant.
  donnees: Database,
  serveur: Server,
  arrivee: UserPlus,
  visio: Video,
  'tableau-de-bord': LayoutDashboard,
  // Veille et contact. LinkedIn n'est distribué ni par simple-icons ni par lucide-react (1.77, sans
  // logos de marque) : un picto au trait (une personne) le remplace.
  rss: Rss,
  feedly: siFeedly,
  discord: siDiscord,
  email: Mail,
  linkedin: UserRound,
  github: siGithub,
  lieu: MapPin,
  // Interface.
  telecharger: Download,
  apercu: Eye,
  externe: ExternalLink,
  fermer: X,
  sombre: Moon,
  clair: Sun,
  menu: Menu,
  haut: ArrowUp,
  suivant: ArrowRight,
  precedent: ArrowLeft,
  recherche: Search,
  copier: Copy,
  fait: Check,
  ecrire: Send,
  pause: CirclePause,
  avant: History,
  poste: BriefcaseBusiness,
  periode: CalendarRange,
  environnement: Layers,
}

/** Les quatre tailles, en pixels. */
export const TAILLES = { s: 18, m: 22, l: 28, xl: 44 } as const
export type TaillePicto = keyof typeof TAILLES

/** Épaisseur du trait, en pixels, à toutes les tailles. */
const TRAIT = 2

function estMarque(dessin: Dessin): dessin is SimpleIcon {
  return 'path' in dessin
}

/** Un picto. Décoratif : il double un texte, il n'est jamais lu. */
export function Picto({
  nom,
  taille = 's',
  className,
}: {
  nom: NomPicto | NomAction
  taille?: TaillePicto
  className?: string
}) {
  const dessin = DESSINS[nom]
  const cote = TAILLES[taille]
  const classe = className ? `p-picto ${className}` : 'p-picto'
  if (estMarque(dessin)) {
    return (
      <svg
        className={classe}
        viewBox="0 0 24 24"
        width={cote}
        height={cote}
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
      >
        <path d={dessin.path} />
      </svg>
    )
  }
  const Trait = dessin
  return (
    <Trait
      className={classe}
      size={cote}
      strokeWidth={TRAIT}
      absoluteStrokeWidth
      aria-hidden="true"
      focusable="false"
    />
  )
}

/** Ton d'une pastille ou d'un visuel : les deux tons alternent d'un élément au suivant. */
export function ton(rang: number): 1 | 2 {
  return rang % 2 === 0 ? 1 : 2
}

/**
 * Pastille : un picto sur un aplat teinté, à angles vifs. Ton 1 : le cobalt sur la teinte bleutée ;
 * ton 2 : le vermillon sur la teinte chaude.
 */
export function Pastille({
  nom,
  taille = 'm',
  rang = 0,
}: {
  nom: NomPicto | NomAction
  taille?: TaillePicto
  /** Rang dans une série : il donne le ton (1 ou 2). */
  rang?: number
}) {
  return (
    <span className="p-pastille" data-taille={taille} data-ton={ton(rang)} aria-hidden="true">
      <Picto nom={nom} taille={taille} />
    </span>
  )
}
