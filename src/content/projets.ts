import type {
  CategorieRealisation,
  NomPicto,
  ProjetAnterieur,
  Realisation,
  SectionMeta,
} from './types'

export const projetsSection: SectionMeta = {
  id: 'projets',
  nav: 'Projets',
  titre: 'Projets',
  picto: 'projets',
}

/** Rubriques du tableau de synthèse E5, dans son ordre. */
export const categoriesRealisations: {
  id: CategorieRealisation
  titre: string
  /** Libellé court du bouton de filtre. */
  filtre: string
  picto: NomPicto
}[] = [
  { id: 'formation', titre: 'Réalisations en cours de formation', filtre: 'En formation', picto: 'formation' },
  { id: 'pro-1', titre: 'Réalisations en milieu professionnel, 1re année', filtre: '1re année', picto: 'entreprise' },
  { id: 'pro-2', titre: 'Réalisations en milieu professionnel, 2e année', filtre: '2e année', picto: 'entreprise' },
]

export const realisationsLibelles = {
  /** État d’une réalisation, écrit en toutes lettres dans sa fiche (et dans sa ligne s’il n’est pas « terminée »). */
  statuts: {
    termine: 'Terminée',
    'en-cours': 'En cours',
    'en-suspens': 'En suspens',
  },
  /** Libellé du lien vers la fiche descriptive E6 d’une réalisation. */
  ficheE6: 'Fiche descriptive E6',
  /** Document joint à la réalisation 6 (tableau d’audit, version publique). */
  analyseLinux: 'Analyse de compatibilité Linux (version publique)',
  /** Son titre court : la barre de la visionneuse et le nom de ses boutons. */
  analyseLinuxCourt: 'Audit de compatibilité Linux',
  /** Nom accessible d’une vignette de la galerie : « Agrandir la capture 2 ». La légende est lue ensuite, une seule fois. */
  agrandir: (rang: number) => `Agrandir la capture ${rang}`,
  /** Fenêtre d’une capture en grand : « Capture 2 / 4 », et son annonce. */
  rangCapture: (rang: number, total: number) => `Capture ${rang} / ${total}`, // espaces insécables
  rangCaptureAnnonce: (rang: number, total: number) => `Capture ${rang} sur ${total}`,
  captureDe: (numero: number) => `Réalisation ${numero}`,
  navigationCaptures: 'Naviguer entre les captures',
  capturePrecedente: 'Précédente',
  captureSuivante: 'Suivante',
  anterieursTitre: 'Avant le BTS',
  /** Nom complet de chaque contexte, pour le détail d’une réalisation. */
  contextes: {
    'Campus Ermitage': 'Campus Ermitage',
    LGN: 'Lot-et-Garonne Numérique',
  },
  filtresTitre: 'Filtrer les réalisations',
  /** Filtre sans catégorie : les 16 réalisations. */
  toutes: 'Toutes',
  /** Nom accessible d’une ligne : « Réalisation 3 ». */
  realisation: (numero: number) => `Réalisation ${numero}`,
  intitule: 'Intitulé officiel',
  periode: 'Période',
  /** Cadre de la réalisation : le centre de formation, l’entreprise, ou les deux. */
  cadre: 'Contexte',
  statut: 'Statut',
  /** Nom accessible d’une ligne ou d’une carte : « Ouvrir la fiche ». */
  ouvrirFiche: 'ouvrir la fiche',
  /** Titre accessible de la fenêtre : « Fiche de la réalisation 3 ». */
  ficheDe: (numero: number) => `Fiche de la réalisation ${numero}`,
  /** Compteur de la fiche : « Réalisation 03 / 16 ». */
  rang: (numero: string, total: string) => `Réalisation ${numero} / ${total}`,
  /** Annonce aux lecteurs d’écran quand la fiche change. */
  rangAnnonce: (numero: number, total: number) => `Réalisation ${numero} sur ${total}`,
  navigation: 'Naviguer entre les fiches',
  precedente: 'Précédente',
  suivante: 'Suivante',
  /** Rubriques de la fiche descriptive. */
  rubriques: {
    contexte: 'Contexte',
    actions: 'Ce que j’ai fait',
    outils: 'Outils',
    securite: 'Sécurité',
    resultat: 'Résultat',
    limites: 'Limites et perspectives',
    preuves: 'Preuves',
  },
  captures: 'Captures',
  documents: 'Documents',
  liens: 'Liens',
  /** État d’une fiche dont le contenu n’est pas encore rédigé. */
  ficheAVenir: 'Fiche détaillée à venir',
  ficheAVenirDetail: 'Le contexte, les actions, les outils et le résultat seront décrits ici.',
  /** Précision après un lien public : « record.lgnum.fr (l’accès demande un mot de passe…) ». */
  lienPrecision: (precision: string) => `(${precision})`,
  /** Période en toutes lettres : « Du 18 novembre 2026 au 20 novembre 2026 ». */
  duAu: (debut: string, fin: string) => `Du ${debut} au ${fin}`,
  /** Période dont la fin est estimée : « Du 26 octobre 2026, fin prévue le 4 décembre 2026 ». */
  duFinPrevue: (debut: string, fin: string) => `Du ${debut}, fin prévue le ${fin}`,
  /** Annonce du filtre aux lecteurs d’écran : « 7 réalisations affichées ». */
  compte: (nombre: number) =>
    nombre > 1 ? `${nombre} réalisations affichées` : `${nombre} réalisation affichée`,
  /** Nom accessible d’une action sur un document : « Télécharger — Fiche descriptive E6, réalisation 3 ». */
  pourDocument: (action: string, document: string, numero: number) =>
    `${action} — ${document}, réalisation ${numero}`,
  /** Titre de l’aperçu d’un document : « Fiche descriptive E6 · Réalisation 3 ». */
  titreDocument: (document: string, numero: number) => `${document} · Réalisation ${numero}`,
}

/**
 * Les 16 réalisations du tableau de synthèse E5 (session 2027), dans l’ordre exact du tableau.
 * `intitule` est recopié MOT POUR MOT : le jury le compare au tableau papier. Ne pas le reformuler.
 * `titreCourt` sert seulement à l’affichage (propositions, modifiables par Wladimir).
 * `fiche` : contenu de la fiche descriptive, rédigé par Wladimir (`FICHES-CONTENU.md`, hors dépôt) et
 * recopié MOT POUR MOT. Les passages marqués `[?]` dans la source ne sont pas repris : ils sont listés
 * dans `CONTENU-A-METTRE-A-JOUR.md`, avec les preuves attendues. N’en inventer aucun.
 * Preuves : seuls figurent les documents qui existent et les liens publics validés (`valide: true`).
 * La réalisation 16 est un outil interne : elle n’a jamais de lien public.
 */
export const realisations: Realisation[] = [
  // ----- Réalisations en cours de formation -----
  {
    numero: 1,
    categorie: 'formation',
    intitule:
      "Atelier de sensibilisation à la cybersécurité animé en groupe au sein de l’entreprise",
    titreCourt: 'Atelier de sensibilisation cyber',
    debut: '2025-10-01',
    fin: '2025-10-31',
    contextes: ['Campus Ermitage', 'LGN'],
    contextePrecision:
      'Demandé en formation (Campus Ermitage), intervention réalisée chez Lot-et-Garonne Numérique.',
    statut: 'termine',
    fiche: {
      contexte:
        'Dans le cadre du Cybermois, la formation nous demandait de mener une action de sensibilisation. Avec deux camarades de promotion, nous l’avons réalisée dans mon entreprise.',
      actions: [
        'La préparation d’un support de présentation, en équipe.',
        'L’animation d’une intervention auprès des salariés : hameçonnage (phishing), mots de passe et bonnes pratiques de base.',
      ],
      outils: ['PowerPoint'],
      resultat: 'Une intervention jugée intéressante et bien animée par la directrice.',
    },
  },
  {
    numero: 2,
    categorie: 'formation',
    intitule: "Mise en place de deux VLAN à l’aide d’un switch et d’un routeur Mikrotik",
    titreCourt: 'Deux VLAN sur MikroTik',
    debut: '2025-11-20',
    fin: '2025-12-04',
    contextes: ['Campus Ermitage'],
    statut: 'termine',
    fiche: {
      contexte:
        'Travaux pratiques en cours : faire communiquer les postes de deux camarades, placés dans deux VLAN différents.',
      actions: [
        'La configuration d’un routeur MikroTik depuis un poste d’administration.',
        'La création de deux VLAN, avec des ports étiquetés (tagged) et non étiquetés (untagged).',
        'Le routage entre les deux VLAN, puis les tests de communication.',
      ],
      outils: ['MikroTik RouterOS (interface web)', 'switch'],
      resultat:
        'Une configuration fonctionnelle et validée en séance : les deux postes communiquent d’un VLAN à l’autre.',
    },
  },
  {
    numero: 3,
    categorie: 'formation',
    intitule: "Sécurisation et haute disponibilité d’une infrastructure web 3-tiers (NeoRetail)",
    titreCourt: 'Infrastructure 3-tiers haute disponibilité',
    debut: '2026-11-18',
    fin: '2026-11-20',
    contextes: ['Campus Ermitage'],
    statut: 'termine',
    fiche: {
      contexte:
        'Projet pédagogique simulant une prestation pour NeoRetail Solutions, éditeur d’une application SaaS de gestion de stocks. En mars 2024, la panne de son serveur unique a provoqué 8 heures d’arrêt et 187 000 € de pertes. Objectif : supprimer les points de défaillance unique et viser 99,9 % de disponibilité.',
      actions: [
        'Un cluster de deux pare-feux pfSense en CARP, synchronisés par pfsync et XMLRPC.',
        'Un répartiteur HAProxy en DMZ : round-robin, persistance par cookie, contrôles de santé, terminaison TLS 1.2/1.3 conforme aux recommandations de l’ANSSI.',
        'Deux serveurs web Nginx et PHP-FPM isolés, joignables uniquement par le répartiteur.',
        'MariaDB en réplication primaire/réplica, avec des comptes au moindre privilège.',
        'Une segmentation en cinq réseaux (WAN, DMZ, APP, DATA, ADMIN) avec refus par défaut.',
        'Une recette formalisée en six tests, et des procédures d’exploitation.',
      ],
      outils: [
        'Hyper-V',
        'MikroTik RouterOS',
        'pfSense CE',
        'HAProxy 2.8',
        'Nginx',
        'PHP-FPM',
        'MariaDB 10.11',
        'OpenSSL',
        'OpenSSH',
        'PowerShell',
      ],
      resultat:
        'Bascule des pare-feux dans la seconde, panne d’un serveur web absorbée automatiquement, répartition exacte de 50/50 sur 100 requêtes, cloisonnement validé.',
      limites:
        'Le répartiteur reste le dernier point de défaillance unique. Prochaines étapes : un second HAProxy avec Keepalived, puis une supervision Zabbix.',
      preuves: {
        documents: [{ label: realisationsLibelles.ficheE6, url: 'docs/e6-neoretail.pdf' }],
      },
    },
  },

  // ----- Réalisations en milieu professionnel, 1re année -----
  {
    numero: 4,
    categorie: 'pro-1',
    picto: 'donnees',
    intitule: 'Création d’un portail de données intégrant de l’open data et de la closed data',
    titreCourt: 'Portail de données',
    debut: '2025-10-13',
    fin: '2026-03-06',
    contextes: ['LGN'],
    statut: 'termine',
    fiche: {
      contexte:
        'Lot-et-Garonne Numérique souhaitait valoriser des données publiques (open data) et privées au service des collectivités. L’organisation avait souscrit à la plateforme Opendatasoft, devenue Huwise.',
      actions: [
        'La prise en main de la plateforme : un CMS avec des jeux de données intégrés, qui publie un portail sur un sous-domaine du fournisseur.',
        'La création des pages du portail.',
        'La manipulation et la mise en forme des jeux de données avec le langage de composants propre à la plateforme, basé sur Angular.',
      ],
      outils: ['Opendatasoft (Huwise)', 'composants Angular de la plateforme', 'HTML', 'CSS'],
      resultat:
        'Plusieurs pages publiées qui exploitent les jeux de données. L’abonnement n’a pas été reconduit, son coût n’étant pas en rapport avec l’usage. L’éditeur a fermé l’accès à la plateforme début mars 2026, et le portail n’est plus en ligne.',
    },
  },
  {
    numero: 5,
    categorie: 'pro-1',
    intitule: "Réalisation du schéma réseau de l’entreprise",
    titreCourt: 'Schéma réseau',
    debut: '2025-11-24',
    fin: '2025-11-28',
    contextes: ['LGN'],
    statut: 'termine',
    fiche: {
      contexte:
        'Un mois après mon arrivée, ma directrice m’a confié la réalisation du schéma réseau de l’entreprise, qui n’existait pas.',
      actions: [
        'Le recensement de l’infrastructure, de l’arrivée du réseau jusqu’à chaque équipement.',
        'Le relevé des adresses IP et des points de raccordement de chaque élément.',
        'La réalisation du schéma sur Draw.io.',
      ],
      outils: ['Draw.io'],
      resultat: 'Un schéma validé par la directrice, qui sert de référence pour l’infrastructure.',
    },
  },
  {
    numero: 6,
    categorie: 'pro-1',
    intitule:
      "Audit des logiciels métiers de chaque collaborateur en vue d’une migration de l’infrastructure (recensement, compatibilités)",
    titreCourt: 'Audit des logiciels métiers',
    debut: '2026-06-01',
    fin: '2026-06-30',
    contextes: ['LGN'],
    statut: 'termine',
    fiche: {
      contexte:
        'La directrice envisage à terme de migrer l’infrastructure sous Linux. Cet audit prépare cette migration, avec la maquette de la réalisation 7.',
      actions: [
        'Le recensement, auprès de chaque collègue, des logiciels qu’il utilise.',
        'La vérification de leur compatibilité avec Ubuntu 26.04 LTS, et la recherche d’alternatives.',
        'Des tests dans un environnement virtuel (serveur et client Samba AD).',
      ],
      outils: ['Hyper-V', 'Ubuntu 26.04 LTS', 'Samba AD'],
      resultat:
        'La plupart des logiciels sont compatibles ou ont une alternative. Le principal point de vigilance concerne les logiciels de comptabilité et de gestion publique, souvent des clients lourds Windows : certains existent désormais en version web, d’autres restent à vérifier, notamment celui des marchés publics.',
      preuves: {
        documents: [
          {
            label: realisationsLibelles.analyseLinux,
            titreCourt: realisationsLibelles.analyseLinuxCourt,
            url: 'docs/realisation-6-audit.pdf',
          },
        ],
      },
    },
  },
  {
    numero: 7,
    categorie: 'pro-1',
    intitule:
      "Maquette de migration de l’infrastructure : virtualisation, puis réseau de test physique avec serveur Samba AD (en suspens)",
    titreCourt: 'Maquette de migration Samba AD',
    debut: '2026-06-01',
    fin: '2026-07-31',
    contextes: ['LGN'],
    statut: 'en-suspens',
    fiche: {
      contexte:
        'Même projet que la réalisation 6 : préparer une future migration de l’infrastructure sous Linux.',
      actions: [
        'Une première maquette sur des machines virtuelles Hyper-V.',
        'La demande d’équipements physiques à ma directrice, pour travailler dans des conditions réelles.',
        'La création d’un sous-réseau isolé. La machine cliente, équipée de deux cartes réseau, sert de passerelle : la première carte la relie au réseau de l’entreprise, la seconde au serveur Samba AD. Le serveur reste ainsi isolé, et son futur DHCP ne perturbera pas le réseau de production.',
        'L’installation des deux machines à partir de l’image Ubuntu Server 26.04 LTS : le client avec interface graphique, le serveur en version minimale (core).',
      ],
      outils: ['Hyper-V', 'Ubuntu Server 26.04 LTS', 'Samba AD'],
      resultat:
        'La maquette physique est en place. Le projet est en suspens : la migration n’est pas prévue à court terme, et ma directrice m’a confié des missions prioritaires.',
      limites:
        'Prochaines étapes à la reprise : la mise en service du DHCP sur le sous-réseau isolé, puis la jonction de postes clients au domaine Samba AD.',
    },
  },
  {
    numero: 8,
    categorie: 'pro-1',
    picto: 'serveur',
    intitule:
      "Reprise en main d’un serveur dédié OVH : récupération de l’accès (KVM, mode rescue), nettoyage des services et des comptes obsolètes",
    titreCourt: "Reprise d’un serveur OVH",
    debut: '2026-07-15',
    fin: '2026-08-31',
    contextes: ['LGN'],
    statut: 'termine',
    fiche: {
      contexte:
        'Un serveur dédié hérité, utilisé jusque-là pour des expérimentations (un modèle d’IA local avec Ollama, un serveur de messagerie…). Il hébergeait surtout la base de données cartographique qui alimente l’outil des conseillers numériques sous QGIS. Il n’était plus administré, et son accès était perdu.',
      actions: [
        'La tentative de connexion par la console KVM, qui échouait.',
        'La réinitialisation du mot de passe par le mode rescue d’OVH. J’ai compris ensuite que le mot de passe était correct : la console utilisait un clavier QWERTY, et nous le saisissions comme sur un clavier AZERTY.',
        'L’inventaire des services et des comptes, puis la suppression de ce qui était obsolète.',
        'L’application du principe de moindre privilège.',
      ],
      outils: ['OVH (console KVM, mode rescue)', 'SSH', 'Linux'],
      resultat:
        'Un serveur assaini, prêt à héberger plusieurs services en production, avec la base cartographique préservée.',
      limites:
        'Le retour d’expérience : vérifier la disposition du clavier de la console avant toute réinitialisation. La procédure de reprise est désormais documentée.',
    },
  },
  {
    numero: 9,
    categorie: 'pro-1',
    intitule:
      "Dépannage de l’imprimante multifonction : accès admin via le prestataire, configuration du scan to mail et scan to folder par utilisateur",
    titreCourt: 'Dépannage du copieur',
    debut: '2026-08-10',
    fin: '2026-08-14',
    contextes: ['LGN'],
    statut: 'termine',
    fiche: {
      contexte:
        'Une collègue signalait que la numérisation vers e-mail (scan to mail) ne fonctionnait pas.',
      actions: [
        'Le contact avec le prestataire informatique, pour obtenir une règle d’accès temporaire à l’interface web d’administration du copieur.',
        'La configuration, depuis mon poste, du scan to mail et du scan to folder pour chaque utilisateur. L’interface web offre des réglages absents de l’écran du copieur.',
        'La demande de fermeture de la règle d’accès une fois la configuration terminée.',
      ],
      outils: ['Interface web d’administration du copieur'],
      resultat: 'Les collègues numérisent de nouveau vers leur boîte mail et vers leur dossier.',
    },
  },
  {
    numero: 10,
    categorie: 'pro-1',
    picto: 'arrivee',
    intitule:
      "Préparation de l’arrivée de la responsable informatique : compte Active Directory, droits, boîte Exchange avec le prestataire",
    titreCourt: "Arrivée d’une collaboratrice",
    debut: '2026-08-17',
    fin: '2026-08-28',
    contextes: ['LGN'],
    statut: 'termine',
    fiche: {
      contexte:
        'Le recrutement d’une responsable informatique. Jusque-là, j’étais le seul membre du service informatique et je rendais compte directement à ma directrice.',
      actions: [
        'La création de son compte dans l’Active Directory.',
        'L’attribution de ses droits sur les dossiers partagés du serveur.',
        'La création de sa boîte Exchange, avec le prestataire.',
        'Un accompagnement le premier jour : gestionnaire de mots de passe KeePassXC, logiciels, connexion du lecteur réseau.',
      ],
      outils: ['Active Directory', 'Exchange', 'KeePassXC', 'partages réseau Windows'],
      resultat: 'Un poste et des accès opérationnels dès son arrivée, sans incident.',
    },
  },

  // ----- Réalisations en milieu professionnel, 2e année -----
  {
    numero: 11,
    categorie: 'pro-2',
    intitule:
      'Gestion des accès à la base de données cartographique (QGIS) : création et administration des comptes des conseillers numériques',
    titreCourt: 'Accès QGIS',
    debut: '2026-09-01',
    fin: '2026-09-30',
    contextes: ['LGN'],
    statut: 'termine',
    fiche: {
      contexte:
        'Les conseillers numériques utilisent QGIS pour exploiter la base de données cartographique (PostgreSQL/PostGIS) hébergée sur le serveur dédié. Ils s’y connectaient avec un compte commun, supprimé lors de la reprise du serveur (réalisation 8).',
      actions: [
        'La création d’un compte PostgreSQL individuel pour chaque conseiller, limité aux droits nécessaires (principe du moindre privilège).',
        'La transmission à chacun de ses propres identifiants.',
        'L’ajustement des règles du pare-feu du serveur (UFW) pour rétablir les connexions légitimes.',
      ],
      outils: ['PostgreSQL', 'PostGIS', 'QGIS', 'UFW'],
      resultat:
        'Les conseillers se connectent de nouveau à leur environnement SIG, chacun avec son compte, et le compte commun a disparu.',
      limites: 'Fiabiliser l’accès à distance des conseillers (travail en cours).',
    },
  },
  {
    numero: 12,
    categorie: 'pro-2',
    intitule:
      "Déploiement sur sous-domaine d’un agrégateur de flux RSS pour la veille technologique",
    titreCourt: 'Agrégateur RSS',
    debut: '2026-09-01',
    fin: '2026-09-30',
    contextes: ['LGN'],
    statut: 'termine',
    fiche: {
      contexte:
        'Donner à l’entreprise, et aux salariés qui le souhaitent, un outil de veille technologique centralisé.',
      actions: [
        'Le recueil des besoins : agréger les articles de plusieurs sources et les trier par catégorie (cybersécurité, IA…).',
        'Un développement assisté par IA (Claude Code), à partir de ces besoins.',
        'Le déploiement sur un sous-domaine de l’organisation.',
        'La protection de l’accès par un compte dédié à l’entreprise, avec un mot de passe robuste conservé dans le coffre-fort de mots de passe du service informatique. L’outil ne contient aucune donnée sensible : ce compte unique suffit à en réserver l’usage aux salariés.',
      ],
      // « Langage et framework » : marqué [?] dans la source, non repris.
      outils: ['Claude Code', 'flux RSS'],
      resultat:
        'Une application fonctionnelle, qui sert aussi à ma propre veille (voir la section Veille).',
    },
  },
  {
    numero: 13,
    categorie: 'pro-2',
    picto: 'visio',
    intitule:
      "Déploiement de Jitsi Meet (visioconférence open source) sur un sous-domaine de l’organisation",
    titreCourt: 'Jitsi Meet',
    debut: '2026-09-01',
    fin: '2026-10-31',
    contextes: ['LGN'],
    statut: 'termine',
    fiche: {
      contexte:
        'Ma directrice souhaitait une solution de visioconférence auto-hébergée, après une visioconférence interrompue par la limite de participants de l’abonnement utilisé.',
      actions: [
        'Le choix de Jitsi Meet face à BigBlueButton, les deux solutions proposées par ma directrice.',
        'Le déploiement de Jitsi Meet en conteneurs Docker, sur un sous-domaine de l’organisation, derrière Nginx.',
        'La configuration des composants de la plateforme (Jicofo…).',
        'L’enregistrement et la publication des webinaires : les enregistrements réalisés par Jibri arrivent sur le serveur OVH, puis un script Bash les renomme et les publie automatiquement sur un site de rediffusion destiné aux adhérents de la centrale d’achat. C’est une idée que j’ai proposée à ma directrice.',
        'Une surveillance régulière du service.',
      ],
      outils: ['Jitsi Meet', 'Jicofo', 'Jibri', 'Docker', 'Nginx', 'Bash'],
      resultat:
        'L’équipe organise des webinaires régulièrement, sans incident, et les adhérents accèdent aux rediffusions.',
      limites:
        'Certains participants en mairie ne parviennent pas à se connecter, probablement parce que leur pare-feu bloque les flux média en UDP. Piste : faire passer ces flux par le port 443 en TLS, rarement filtré.',
      preuves: {
        // Liens publics validés. « record » fait partie de cette réalisation (rediffusion des webinaires).
        liens: [
          { label: 'meet.lgnum.fr', url: 'https://meet.lgnum.fr', valide: true },
          {
            label: 'record.lgnum.fr',
            url: 'https://record.lgnum.fr',
            valide: true,
            precision:
              'l’accès aux rediffusions demande un mot de passe fourni dans l’espace adhérent',
          },
        ],
      },
    },
  },
  {
    numero: 14,
    categorie: 'pro-2',
    intitule:
      "Déploiement et administration de l’ERP/CRM Dolibarr : gestion des droits, suivi des demandes et évolutions des collaborateurs (en cours)",
    titreCourt: 'ERP/CRM Dolibarr',
    debut: '2026-09-01',
    fin: '2027-06-30',
    contextes: ['LGN'],
    statut: 'en-cours',
    fiche: {
      contexte:
        'Ma directrice souhaitait adopter Dolibarr, notamment pour la gestion des ressources humaines, et m’a demandé de l’étudier.',
      actions: [
        'L’étude de l’outil, puis son installation et sa mise en production sur le serveur dédié.',
        'L’ouverture des droits à l’ensemble des utilisateurs pendant la phase de test, toujours en cours, pour faciliter la prise en main.',
        'Le passage de relais fonctionnel à l’assistante de direction, chargée du projet. J’assure la partie technique : les demandes, les évolutions, l’administration et la surveillance au quotidien.',
        'Une instance de test séparée, en conteneur Docker, pour expérimenter sans toucher à la production (voir la réalisation 15).',
      ],
      outils: ['Dolibarr', 'Linux', 'Docker (instance de test)'],
      resultat:
        'Dolibarr est en production et utilisé par l’équipe. Je l’administre jusqu’à la fin de mon alternance.',
      limites:
        'Une fois l’outil adopté par l’équipe, restreindre les droits par profil (principe du moindre privilège).',
    },
  },
  {
    numero: 15,
    categorie: 'pro-2',
    intitule:
      'Automatisation de workflows Dolibarr avec n8n : notifications mail sur tickets et validation de devis (en cours)',
    titreCourt: 'Workflows n8n',
    debut: '2026-10-26',
    // Fin estimée : le développement est en cours.
    fin: '2026-12-04',
    finPrevue: true,
    contextes: ['LGN'],
    statut: 'en-cours',
    fiche: {
      contexte:
        'Les notifications natives de Dolibarr, par exemple à la création d’un ticket, sont difficiles à mettre en place. Une collègue du service informatique m’a suggéré n8n, un outil d’automatisation que je voulais tester.',
      actions: [
        'Un environnement de test isolé : une instance Dolibarr et une instance n8n, en conteneurs Docker.',
        'La construction de workflows complets selon les besoins de l’entreprise : création de tickets, demandes de congés, validations, et ouverture et clôture des devis selon les personnes concernées.',
        'Des notifications par e-mail aux bonnes étapes.',
      ],
      outils: ['n8n', 'Dolibarr', 'Docker'],
      resultat: 'Des workflows complets et fonctionnels en environnement de test.',
      limites: 'Passage en production prévu, avec une fin estimée au 4 décembre 2026.',
    },
  },
  {
    numero: 16,
    categorie: 'pro-2',
    picto: 'tableau-de-bord',
    intitule:
      "Développement et déploiement d’une application web métier de suivi des dossiers fibre : centralisation des fichiers Excel, tableau de bord, KPI, alertes et gestion des utilisateurs par rôles, sur un sous-domaine dédié",
    titreCourt: 'Suivi des dossiers fibre',
    debut: '2026-09-15',
    fin: '2026-10-03',
    contextes: ['LGN'],
    statut: 'termine',
    fiche: {
      contexte:
        'Un collègue suivait ses dossiers fibre dans des tableurs Excel stockés sur son poste, ce qui compliquait le travail avec ses collègues. Deux solutions ont d’abord été testées sans succès : Grist, trop limité, et le module Projets de Dolibarr.',
      actions: [
        'La proposition d’une application web sur mesure.',
        'La rédaction d’un cahier des charges avec le collègue, de l’appel du client jusqu’à la clôture du dossier.',
        'Un développement assisté par IA (Claude Code), à partir de ce cahier des charges.',
        'Les fonctionnalités : création et suivi des dossiers, tableau de bord et KPI, alertes, gestion des utilisateurs par rôles.',
        'Le déploiement sur un sous-domaine dédié.',
      ],
      // « Langage et framework » : marqué [?] dans la source, non repris.
      outils: ['Claude Code'],
      securite:
        'HTTPS ; authentification par comptes individuels, avec des droits différents selon le rôle ; sauvegardes régulières du serveur.',
      resultat: 'Une première version livrée et déployée sur son sous-domaine.',
      limites:
        'Prochaine étape : intégrer les retours des utilisateurs après leur phase de test. Cette suite attend que d’autres priorités soient traitées.',
    },
  },
]

/** Avant le BTS : bloc secondaire, compact. */
export const projetsAnterieurs: ProjetAnterieur[] = [
  {
    nom: 'Association Jean Pouzet',
    contexte: 'ESIEA',
    annees: '2024–2025',
    duree: 'Deux semestres',
    description:
      "D’abord un site vitrine (HTML, CSS, JS), puis un back-office avec une interface d’administration pour modifier les textes, les images et le contenu (PHP, SQL, Bootstrap).",
    technos: ['HTML', 'CSS', 'JS', 'PHP', 'SQL', 'Bootstrap'],
  },
  {
    nom: "Association Diab’Landes",
    contexte: 'ESIEA',
    annees: '2023–2024',
    duree: 'Un semestre',
    description: 'Site vitrine (HTML, CSS, JS).',
    technos: ['HTML', 'CSS', 'JS'],
  },
  {
    nom: 'Accorderie Agenaise',
    contexte: 'ESIEA',
    annees: '2023–2024',
    duree: 'Premier semestre',
    description: 'Site vitrine (HTML, CSS, JS).',
    technos: ['HTML', 'CSS', 'JS'],
  },
]
