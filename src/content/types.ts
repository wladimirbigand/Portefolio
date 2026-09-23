// Types du contenu du portfolio. Tout le texte du site vit dans src/content/ et respecte ces types.

/* ─── Primitives ─── */

export type Lien = {
  /** Libellé court de la section, sans numéro (le numéro est calculé par `src/lib/sections.ts`). */
  label: string
  href: string
  externe?: boolean
}

export type Image = {
  src: string
  alt: string
}

/** En-tête commun à chaque section (label court, titre, sous-titre). */
export type EnTeteSection = {
  ancre: string
  /** Libellé court de la section, sans numéro (le numéro est calculé par `src/lib/sections.ts`). */
  label: string
  titre: string
  /** Partie du titre à mettre en valeur visuellement (doit apparaître dans `titre`). */
  titreAccent?: string
  sousTitre?: string
}

/** Noms d'icônes lucide-react utilisables depuis le contenu (résolus côté composants). */
export type IconeNom =
  | 'user'
  | 'code'
  | 'wrench'
  | 'package'
  | 'server'
  | 'award'
  | 'settings'
  | 'hard-drive'
  | 'mail'
  | 'linkedin'
  | 'github'
  | 'map-pin'
  | 'share'
  | 'bot'
  | 'newspaper'

/* ─── Site (navigation, libellés d'interface) ─── */

export type ElementNav = {
  /** Libellé court de la section, sans numéro (le numéro est calculé par `src/lib/sections.ts`). */
  label: string
  ancre: string
}

export type Site = {
  titre: string
  logo: { initiale: string; nom: string; ariaLabel: string }
  navigation: ElementNav[]
  cta: ElementNav
  libelles: {
    themeClair: string
    themeSombre: string
    basculerTheme: string
    ouvrirMenu: string
    fermerMenu: string
    retourHaut: string
    chronoSession: string
    chronoPresentation: string
    progressionScroll: string
    scroll: string
    lienExterne: string
    /** Placeholder visible pour un champ encore marqué TODO(wladimir). */
    aCompleter: string
    navigationPrincipale: string
    sectionCourante: string
    allerAuContenu: string
  }
  footer: {
    copyright: string
    signature: string
  }
  /** Mode Présentation (oral devant le jury). */
  presentation: {
    /** Durée du compte à rebours, en minutes. Seule source de vérité : aucune durée codée ailleurs. */
    dureeMinutes: number
  }
}

/* ─── Profil / hero ─── */

export type Profil = {
  prenom: string
  nom: string
  accroche: string
  rolesTyping: string[]
  description: string
  photo: Image
  reseaux: (Lien & { icone: IconeNom })[]
  ctaPrincipal: Lien
  ctaSecondaire: Lien
}

/* ─── Parcours ─── */

export type ElementParcours = {
  nom: string
  description: string
  stack?: string[]
  /** Lien vers une réalisation détaillée, si elle existe. */
  realisation?: RealisationId
}

export type GroupeParcours = {
  titre: string
  elements: ElementParcours[]
}

export type EtapeParcours = {
  id: string
  periode: string
  titre: string
  organisation?: string
  description?: string
  groupes?: GroupeParcours[]
  certifications?: CertificationId[]
  enCours?: boolean
}

export type Parcours = {
  section: EnTeteSection
  etapes: EtapeParcours[]
  libelleCertifications: string
}

/* ─── Formation (Campus Ermitage) ─── */

export type FormationProposee = {
  code: string
  nom: string
  description: string
  estMaFormation?: boolean
  optionsMisesEnAvant?: string[]
}

export type EtapeParcoursNumerique = {
  /** Libellé court de la section, sans numéro (le numéro est calculé par `src/lib/sections.ts`). */
  label: string
  niveau?: string
  etat: 'passe' | 'actuel' | 'futur'
}

export type Formation = {
  section: EnTeteSection
  etablissement: {
    nom: string
    site: Lien
    logo: Image
  }
  partenariat: string
  accroche: string
  accrocheAccent: string
  description: string
  tags: { label: string; misEnAvant?: boolean }[]
  titreFormations: string
  libelleMaFormation: string
  formations: FormationProposee[]
  titreParcoursNumerique: string
  parcoursNumerique: EtapeParcoursNumerique[]
}

/* ─── Entreprise ─── */

export type InfoEntreprise = {
  id: string
  /** Libellé court de la section, sans numéro (le numéro est calculé par `src/lib/sections.ts`). */
  label: string
  valeur: string
  icone: IconeNom
}

export type Entreprise = {
  section: EnTeteSection
  nom: string
  site: Lien
  logo: Image
  typeStructure: string
  poste: string
  resumeMission: string
  tags: { label: string; misEnAvant?: boolean }[]
  infos: InfoEntreprise[]
  titreRealisations: string
  /** Réalisations en entreprise à mettre en avant dans cette section. */
  realisations: RealisationId[]
}

/* ─── Compétences ─── */

/** Compétences du bloc 1 du BTS SIO (matrice de synthèse). */
export type CompetenceBlocId =
  'patrimoine' | 'incidents' | 'presence-en-ligne' | 'mode-projet' | 'service' | 'dev-pro'

export type CompetenceBloc = {
  id: CompetenceBlocId
  intitule: string
}

export type Niveau = 'notions' | 'pratique' | 'maitrise'

export type CompetenceTechnique = {
  id: string
  nom: string
  niveau: Niveau
  /** Réalisations qui prouvent la compétence. */
  realisations: RealisationId[]
  /** Certifications qui appuient la compétence. */
  certifications?: CertificationId[]
}

export type CategorieCompetences = {
  id: string
  titre: string
  competences: CompetenceTechnique[]
}

export type Competences = {
  section: EnTeteSection
  niveaux: Record<Niveau, { label: string; description: string }>
  categories: CategorieCompetences[]
  bloc: {
    titre: string
    description: string
    competences: CompetenceBloc[]
  }
}

/* ─── Réalisations ─── */

export type RealisationId =
  | 'samba-ad'
  | 'jitsi-dolibarr'
  | 'schema-vlan'
  | 'support-utilisateurs'
  | 'n8n-dolibarr'
  | 'plateforme-formation'
  | 'portail-open-data'
  | 'infra-reseau-audit'
  | 'site-jean-pouzet'
  | 'site-diablandes'
  | 'bot-discord-veille'

export type CadreRealisation = 'entreprise' | 'formation' | 'personnel'

export type StatutRealisation = 'termine' | 'en-cours' | 'a-venir'

export type Preuve =
  | { type: 'image'; src: string; alt: string; legende?: string }
  | { type: 'schema'; src: string; alt: string; legende?: string }
  | { type: 'lien'; href: string; label: string }
  | { type: 'document'; href: string; label: string }

export type Realisation = {
  id: RealisationId
  titre: string
  sousTitre?: string
  cadre: CadreRealisation
  statut: StatutRealisation
  /** Précision affichée à côté du statut (ex. « non pérennisé », « en continu »). */
  noteStatut?: string
  periode: string
  resume: string
  contexte: string
  objectifs: string[]
  missions: string[]
  stack: string[]
  /** Ids des compétences du bloc 1 (competences.ts). */
  competences: CompetenceBlocId[]
  preuves: Preuve[]
  misEnAvant: boolean
}

export type Realisations = {
  section: EnTeteSection
  libelles: {
    cadres: Record<CadreRealisation, string>
    statuts: Record<StatutRealisation, string>
    contexte: string
    objectifs: string
    missions: string
    stack: string
    competences: string
    preuves: string
    aucunePreuve: string
    cadre: string
    statut: string
    periode: string
    voirFiche: string
    ficheDetaillee: string
  }
  liste: Realisation[]
}

/* ─── Certifications ─── */

export type CertificationId =
  'toeic' | 'voltaire' | 'mooc-cnil' | 'secnum' | 'mooc-ia' | 'ebios' | 'mooc-osint'

export type StatutCertification = 'obtenue' | 'en-cours'

export type Certification = {
  id: CertificationId
  nom: string
  organisme: string
  detail: string
  statut: StatutCertification
  image: Image
  tags: string[]
}

export type Certifications = {
  section: EnTeteSection
  libellesStatut: Record<StatutCertification, string>
  aVenir: { titre: string; detail: string; description: string }
  liste: Certification[]
}

/* ─── Veille ─── */

export type OutilVeille = {
  id: string
  etape: number
  nom: string
  role: string
  description: string
  fonctionnement: string[]
  stack?: string[]
  icone: IconeNom
  /** Sources suivies (comptes, plateformes, flux…). */
  sources: Lien[]
  thematiques: string[]
  captures: Image[]
  lien?: Lien
}

export type Veille = {
  section: EnTeteSection
  titrePipeline: string
  outils: OutilVeille[]
  thematiques: string[]
}

/* ─── Épreuves ─── */

export type Epreuve = {
  id: string
  code: string
  titre: string
  description: string
  icone: IconeNom
  /** Chemin du PDF dans public/. Absent tant que le document n'est pas disponible. */
  pdf?: string
}

export type Epreuves = {
  section: EnTeteSection
  libelles: {
    apercu: string
    telecharger: string
    indisponible: string
    indisponibleDetail: string
    fermerApercu: string
    titreApercu: string
  }
  liste: Epreuve[]
}

/* ─── Contact ─── */

export type ChampFormulaire = {
  nom: 'nom' | 'email' | 'message'
  /** Libellé court de la section, sans numéro (le numéro est calculé par `src/lib/sections.ts`). */
  label: string
  placeholder: string
  type: 'text' | 'email' | 'textarea'
}

export type Contact = {
  section: EnTeteSection
  titre: string
  description: string
  email: string
  liens: (Lien & { icone: IconeNom })[]
  localisation: { label: string; icone: IconeNom }
  formulaire: {
    /** Endpoint Formspree (https://formspree.io/f/<id>). */
    endpoint: string
    champs: ChampFormulaire[]
    envoyer: string
    envoiEnCours: string
    succes: string
    erreur: string
  }
}
