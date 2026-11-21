/** Types partagés par tous les fichiers de contenu. Source : CONTENU-VALIDE.md. */

/**
 * En-tête d’une section (titre, sous-titre).
 * Le numéro n’est pas une donnée : il est calculé d’après la position dans la navigation.
 */
export interface SectionMeta {
  /** Ancre de la section (sans #). */
  id: string
  /** Libellé court utilisé dans la navigation. */
  nav: string
  /** Identique au libellé de la navigation (`CONTENU-VALIDE.md`, section 10). */
  titre: string
  sousTitre?: string
  /** Picto de l’en-tête de la section. */
  picto: NomPicto
}

/**
 * Nom d’un picto, choisi dans le contenu. La DA décide du dessin (`src/directions/trame/Picto.tsx`) :
 * un picto au trait, ou le logo monochrome d’une marque (`feedly`, `discord`, `github`).
 */
export type NomPicto =
  | 'parcours'
  | 'formation'
  | 'entreprise'
  | 'epreuves'
  | 'projets'
  | 'competences'
  | 'certifications'
  | 'veille'
  | 'contact'
  | 'systemes'
  | 'reseau'
  | 'scripts'
  | 'virtualisation'
  | 'automatisation'
  | 'ctf'
  | 'web'
  | 'donnees'
  | 'serveur'
  | 'arrivee'
  | 'visio'
  | 'tableau-de-bord'
  | 'rss'
  | 'feedly'
  | 'discord'
  | 'email'
  | 'linkedin'
  | 'github'
  | 'lieu'
  | 'cybersecurite'
  | 'ia'

export interface Lien {
  label: string
  url: string
}

/** Logo servi localement (`src/assets/logos/`), toujours affiché avec ses dimensions. */
export interface Logo {
  src: string
  alt: string
  /** Dimensions du fichier, en pixels. */
  largeur: number
  hauteur: number
}

export interface EtapeParcours {
  /** Années, telles qu’affichées : « 2025 – 2027 ». */
  periode: string
  titre: string
  organisme: string
  lieu: string
  description?: string
  /** `projet` : étape à venir, pas encore engagée. */
  etat: 'passe' | 'actuel' | 'projet'
  /** Renvois vers d’autres sections du site (la formation, l’alternance). */
  renvois?: Lien[]
}

/** Formation proposée par le centre de formation. */
export interface FormationProposee {
  sigle: string
  nom: string
  precision?: string
  /** `suivie` : la formation de Wladimir. `ouverte` : nouvelle formation, désormais ouverte. */
  etat?: 'suivie' | 'ouverte'
}

/** Palier du parcours progressif du centre de formation. */
export interface PalierFormation {
  nom: string
  niveau?: string
  etat: 'passe' | 'actuel' | 'suite'
}

/** Document d’une épreuve (tableau de synthèse, fiche descriptive). */
export interface DocumentEpreuve {
  /** Repère court : « Session 2027 », « Fiche 1 ». */
  label: string
  /** Intitulé du document. Absent pour un emplacement « à venir ». */
  titre?: string
  /**
   * Chemin relatif à `public/` (à préfixer par BASE_URL).
   * Absent tant que le document n’est pas fourni : afficher « document à venir », jamais un lien.
   */
  fichier?: string
}

export interface Epreuve {
  code: string
  /** Intitulé officiel de l’épreuve. */
  intitule: string
  description: string
  documents: DocumentEpreuve[]
}

/** Les trois rubriques du tableau de synthèse E5, dans son ordre. */
export type CategorieRealisation = 'formation' | 'pro-1' | 'pro-2'

export type ContexteRealisation = 'Campus Ermitage' | 'LGN'

export type StatutRealisation = 'termine' | 'en-cours' | 'en-suspens'

/**
 * Capture d’écran, déposée dans `src/assets/captures/` et optimisée au build (`captures.ts`).
 * Son nom de fichier décide de l’endroit où elle s’affiche.
 */
export interface Capture {
  /** Nom du fichier, sans extension : `realisation-13-1`, `veille-bot`. */
  nom: string
  /** Image de repli, puis les variantes par format (`srcset` avec leurs largeurs). */
  src: string
  sources: { type: string; srcset: string }[]
  /** Dimensions de l’image de repli, en pixels : elles donnent le rapport largeur / hauteur. */
  largeur: number
  hauteur: number
  /** Texte alternatif : ce que montre l’image. */
  alt: string
  legende?: string
}

/** Les deux captures de Veille : `veille-agregateur.png` et `veille-bot.png`. */
export type CleCaptureVeille = 'agregateur' | 'bot'

/** Document joint à une réalisation. `url` est un chemin relatif à `public/`. */
export type DocumentRealisation = Lien

/**
 * Lien public d’une réalisation. Il ne s’affiche que si `valide` vaut `true` :
 * Wladimir confirme chaque lien avec son tuteur avant de le publier.
 */
export interface LienPublic extends Lien {
  valide: boolean
  /** Précision affichée entre parenthèses après le lien (condition d’accès…). */
  precision?: string
}

/** Les captures ne se déclarent pas ici : elles viennent du dossier `src/assets/captures/`. */
export interface PreuvesRealisation {
  documents?: DocumentRealisation[]
  liens?: LienPublic[]
}

/**
 * Fiche descriptive d’une réalisation, rédigée par Wladimir. Chaque champ est optionnel :
 * sans contenu rédigé, la fiche affiche « fiche détaillée à venir ». Ne rien inventer.
 */
export interface FicheRealisation {
  contexte?: string
  /** « Ce que j’ai fait » : une action par ligne. */
  actions?: string[]
  outils?: string[]
  /** « Sécurité » : rubrique optionnelle. */
  securite?: string
  resultat?: string
  /** « Limites et perspectives » : rubrique optionnelle. */
  limites?: string
  preuves?: PreuvesRealisation
}

/** Réalisation professionnelle du tableau de synthèse E5. */
export interface Realisation {
  /** Rang dans le tableau de synthèse (1 à 16). */
  numero: number
  categorie: CategorieRealisation
  /** Intitulé recopié mot pour mot du tableau de synthèse : ne pas le reformuler. */
  intitule: string
  /** Titre d’affichage seulement. */
  titreCourt: string
  /** Dates ISO (AAAA-MM-JJ). Le format d’affichage est décidé par la DA. */
  debut: string
  fin: string
  /** La date de fin est une estimation : la fiche écrit « fin prévue » devant elle. */
  finPrevue?: boolean
  /** Un contexte, ou les deux (demandée en formation, menée en entreprise). */
  contextes: ContexteRealisation[]
  /** Précision affichée dans le détail quand le contexte ne se résume pas à un nom. */
  contextePrecision?: string
  /**
   * `en-suspens` : les dates indiquent la période où le travail a été mené ; il reprendra plus tard.
   * `en-cours` : le travail se poursuit jusqu’à la date de fin.
   * L’intitulé officiel le dit déjà (« (en cours) », « (en suspens) »).
   */
  statut: StatutRealisation
  /** Picto de la carte (section Entreprise), affiché tant que la réalisation n’a pas de capture (`realisation-<n>-1`). */
  picto?: NomPicto
  /** Contenu de la fiche descriptive. Absent ou vide : « fiche détaillée à venir ». */
  fiche?: FicheRealisation
}

/** Projet antérieur au BTS (bloc secondaire, compact). */
export interface ProjetAnterieur {
  nom: string
  contexte?: string
  /** Années scolaires : « 2024–2025 ». */
  annees?: string
  duree?: string
  description?: string
  technos?: string[]
}

/** Groupe de compétences : une catégorie et ses outils, sans pourcentage ni contexte. */
export interface CategorieCompetences {
  titre: string
  picto: NomPicto
  competences: string[]
}

/** Attestation d’une certification : une image ou un PDF de `public/`, ouvert dans la fenêtre superposée. */
export interface Attestation {
  /** Chemin relatif à `public/` (à préfixer par BASE_URL). */
  fichier: string
  type: 'image' | 'pdf'
  /** Image : texte alternatif et dimensions du fichier, en pixels. */
  alt?: string
  largeur?: number
  hauteur?: number
}

export interface Certification {
  nom: string
  /** Sigle dessiné en particules dans l’emblème : l’organisme, ou la certification elle-même. */
  sigle: string
  /** Absent tant que l’organisme n’est pas confirmé. */
  organisme?: string
  statut: 'obtenu' | 'en-cours'
  score?: string
  annee?: string
  /** Attestation (image ou PDF), quand elle sera fournie. Absente : aucun bouton. */
  attestation?: Attestation
}

/** Outil du dispositif de veille : une carte illustrée. */
export interface OutilVeille {
  nom: string
  description: string
  /** Le logo de l’outil, ou un picto : seul dans le visuel de la carte, ou en petit dans un coin de sa capture. */
  picto: NomPicto
  /** Capture attendue pour cet outil (`veille-<clé>.png`) : dès qu’elle est déposée, la carte l’affiche en grand. */
  capture?: CleCaptureVeille
  /** L’outil est à l’arrêt : la carte l’écrit (« En pause »), avec sa raison. */
  pause?: string
  /** Numéro de la réalisation du tableau de synthèse liée à cet outil. */
  realisation?: number
}

/** Thème de veille suivi. */
export interface ThemeVeille {
  nom: string
  picto: NomPicto
}

export interface MoyenContact {
  /** Le type donne aussi le picto de la ligne. */
  type: 'email' | 'linkedin' | 'github'
  label: string
  url: string
  /** Texte brut à copier (bouton « copier » de l’e-mail). */
  valeur?: string
}
