import type { Realisations } from './types'

// TODO(wladimir): valider le mapping réalisations ↔ compétences du bloc 1 (champ `competences`),
// proposé ici à titre indicatif.

export const realisations: Realisations = {
  section: {
    ancre: 'realisations',
    label: 'Réalisations',
    titre: 'Mes réalisations',
    titreAccent: 'réalisations',
    sousTitre:
      "Des projets concrets menés en entreprise et en formation, allant de l'infrastructure réseau au développement web.",
  },
  libelles: {
    cadres: { entreprise: 'Entreprise', formation: 'Formation', personnel: 'Personnel' },
    statuts: { termine: 'Terminé', 'en-cours': 'En cours', 'a-venir': 'À venir' },
    contexte: 'Contexte',
    objectifs: 'Objectifs',
    missions: 'Missions',
    stack: 'Stack',
    competences: 'Compétences mobilisées',
    preuves: 'Preuves',
    aucunePreuve: 'Captures et schémas à venir.',
  },
  liste: [
    /* ─── 1. Samba AD ─── */
    {
      id: 'samba-ad',
      titre: 'Maquette utilisateurs/serveurs Samba AD',
      sousTitre: "Migration de l'infrastructure vers Linux",
      cadre: 'entreprise',
      statut: 'termine',
      periode: 'À préciser', // TODO(wladimir): période (mois/année)
      resume:
        "Maquette d'un serveur Samba AD (contrôleur de domaine) avec deux clients Ubuntu 26.04 LTS joints au domaine.",
      contexte:
        "Lot-et-Garonne Numérique mène un projet de migration de l'ensemble de son infrastructure vers Linux, avec Samba AD en remplacement d'Active Directory. Cette maquette s'inscrit dans ce projet.",
      // TODO(wladimir): objectifs précis de la maquette (valider la jonction, tester les GPO, les partages…).
      objectifs: [],
      missions: [
        'Installer et configurer un serveur Samba AD en contrôleur de domaine.',
        'Joindre deux postes clients Ubuntu 26.04 LTS au domaine.',
        // TODO(wladimir): autres missions (création des utilisateurs/groupes, DNS, partages, tests…).
      ],
      // TODO(wladimir): OS du serveur, hyperviseur utilisé (Hyper-V ?), outils de jonction (realmd, SSSD, winbind ?).
      stack: ['Samba AD', 'Ubuntu 26.04 LTS', 'Linux'],
      competences: ['patrimoine', 'service', 'mode-projet'],
      // TODO(wladimir): captures (jonction au domaine, console d'admin…), schéma de la maquette.
      preuves: [],
      misEnAvant: true,
    },

    /* ─── 2. Jitsi Meet + Dolibarr ─── */
    {
      id: 'jitsi-dolibarr',
      titre: 'Jitsi Meet + Dolibarr derrière un reverse proxy',
      cadre: 'entreprise',
      statut: 'termine',
      periode: 'À préciser', // TODO(wladimir): période
      resume:
        "Installation et configuration, sur un serveur dédié de l'entreprise, de la visioconférence Jitsi Meet et de l'ERP/CRM Dolibarr, avec un reverse proxy en frontal.",
      contexte:
        "Mise à disposition de deux services pour l'entreprise sur un serveur dédié : la visioconférence Jitsi Meet et l'ERP/CRM Dolibarr, exposés via un reverse proxy.",
      // TODO(wladimir): objectifs (besoin métier, remplacement d'un outil existant ?).
      objectifs: [],
      missions: [
        'Installer et configurer Jitsi Meet (visioconférence).',
        'Installer et configurer Dolibarr (ERP/CRM).',
        'Mettre en place un reverse proxy en frontal des deux services.',
      ],
      // TODO(wladimir): logiciel de reverse proxy (Nginx, Caddy, Apache, Traefik ?), gestion du TLS
      // (Let's Encrypt ?), OS du serveur.
      stack: ['Jitsi Meet', 'Dolibarr', 'Reverse proxy'],
      competences: ['service', 'patrimoine'],
      // TODO(wladimir): captures (interfaces, configuration du reverse proxy), schéma de flux.
      preuves: [],
      misEnAvant: true,
    },

    /* ─── 3. Schéma réseau & VLAN ─── */
    {
      id: 'schema-vlan',
      titre: 'Schéma réseau et segmentation VLAN',
      cadre: 'entreprise',
      statut: 'termine',
      periode: 'À préciser', // TODO(wladimir): période
      resume:
        "Schéma du réseau de l'entreprise différenciant les VLANs, dans le cadre de la cartographie et de la documentation de l'architecture réseau.",
      contexte:
        "Cartographie et documentation de l'architecture réseau de l'entreprise (schémas logiques et physiques).",
      // TODO(wladimir): objectifs (documentation, préparation d'une évolution, audit ?).
      objectifs: [],
      missions: [
        "Réaliser les schémas logiques et physiques du réseau de l'entreprise.",
        'Différencier les VLANs sur le schéma.',
      ],
      stack: ['Draw.io', 'VLAN'],
      competences: ['patrimoine'],
      // TODO(wladimir): schéma anonymisé (pas d'adressage ni de noms sensibles).
      preuves: [],
      misEnAvant: true,
    },

    /* ─── 4. Support utilisateurs ─── */
    {
      id: 'support-utilisateurs',
      titre: 'Support et dépannage utilisateurs',
      cadre: 'entreprise',
      statut: 'en-cours',
      noteStatut: 'En continu',
      periode: '2025 – maintenant', // TODO(wladimir): confirmer la date de début
      resume: 'Dépannage et assistance auprès de mes collègues.',
      contexte: 'Support de proximité auprès des collègues de Lot-et-Garonne Numérique.',
      objectifs: [],
      // TODO(wladimir): exemples précis d'incidents traités (symptôme, diagnostic, résolution).
      missions: [],
      // TODO(wladimir): outils utilisés (ticketing, prise en main à distance…).
      stack: [],
      competences: ['incidents'],
      preuves: [],
      misEnAvant: true,
    },

    /* ─── 5. n8n ↔ Dolibarr ─── */
    {
      id: 'n8n-dolibarr',
      titre: 'Automatisation n8n ↔ Dolibarr',
      cadre: 'entreprise',
      statut: 'a-venir',
      periode: 'À préciser', // TODO(wladimir): période prévue
      resume:
        'Déploiement de n8n sous Docker pour automatiser des workflows à partir de Dolibarr (notifications, alertes…).',
      contexte:
        "Dolibarr est en place dans l'entreprise ; n8n permettra d'automatiser des workflows à partir de ses données.",
      // TODO(wladimir): workflows visés précisément.
      objectifs: ['Automatiser des notifications et des alertes à partir de Dolibarr.'],
      missions: ['Déployer n8n sous Docker.', 'Concevoir des workflows connectés à Dolibarr.'],
      stack: ['n8n', 'Docker', 'Dolibarr'],
      competences: ['service', 'mode-projet'],
      preuves: [],
      misEnAvant: true,
    },

    /* ─── 6. Plateforme de formation interne ─── */
    {
      id: 'plateforme-formation',
      titre: 'Plateforme de formation interne',
      cadre: 'entreprise',
      statut: 'termine', // TODO(wladimir): confirmer le statut
      periode: 'À préciser', // TODO(wladimir): période
      resume: "Développement d'une plateforme web de formation en interne avec Next.js.",
      contexte: "Développement d'outils internes pour Lot-et-Garonne Numérique.",
      objectifs: [], // TODO(wladimir): objectifs
      missions: ['Développer une plateforme web de formation en interne avec Next.js.'],
      stack: ['Next.js'], // TODO(wladimir): compléter (TypeScript ? base de données ? hébergement ?)
      competences: ['service', 'mode-projet'],
      preuves: [], // TODO(wladimir): captures
      misEnAvant: false,
    },

    /* ─── 7. Portail Open Data ─── */
    {
      id: 'portail-open-data',
      titre: 'Portail Open Data',
      cadre: 'entreprise',
      statut: 'termine',
      noteStatut: 'Non pérennisé',
      periode: 'À préciser', // TODO(wladimir): période
      resume:
        'Gestion et intégration de données ouvertes via OpenDataSoft (solution non poursuivie).',
      contexte:
        "Lot-et-Garonne Numérique contribue à l'ouverture des données publiques. Le portail open data a été géré avec OpenDataSoft, solution finalement non pérennisée.",
      objectifs: [], // TODO(wladimir): objectifs
      missions: ['Gérer et intégrer des données ouvertes dans le portail OpenDataSoft.'],
      stack: ['OpenDataSoft'],
      competences: ['presence-en-ligne'],
      preuves: [], // TODO(wladimir): captures
      misEnAvant: false,
    },

    /* ─── 8. Infrastructure réseau & audit ─── */
    {
      id: 'infra-reseau-audit',
      titre: 'Infrastructure réseau & audit',
      cadre: 'formation',
      statut: 'termine', // TODO(wladimir): confirmer
      periode: 'À préciser', // TODO(wladimir): période
      resume:
        "Cartographie et analyse d'une infrastructure réseau existante. Proposition d'améliorations pour la sécurité : segmentation, ACL, durcissement des accès.",
      contexte: "Cartographie et analyse d'une infrastructure réseau existante.", // TODO(wladimir): contexte (BTS ? quelle infra ?)
      objectifs: ["Proposer des améliorations pour la sécurité de l'infrastructure."],
      missions: [
        "Cartographier et analyser l'infrastructure réseau existante.",
        'Proposer des améliorations : segmentation, ACL, durcissement des accès.',
      ],
      stack: ['Cisco', 'ACL', 'VLAN', 'Audit'],
      competences: ['patrimoine'],
      preuves: [], // TODO(wladimir): captures
      misEnAvant: false,
    },

    /* ─── 9. Jean Pouzet ─── */
    {
      id: 'site-jean-pouzet',
      titre: 'Site Association Jean Pouzet',
      sousTitre: 'Site vitrine avec menu Admin',
      cadre: 'formation',
      statut: 'termine',
      periode: 'ESIEA · Campus Numérique 47 (2023 – 2025)', // TODO(wladimir): année précise
      resume:
        'Site avec backend et interface administrateur sécurisée : authentification, gestion des contenus, médias et paramètres.',
      contexte: "Projet réalisé pendant ma formation à l'ESIEA pour le Centre Jean Pouzet.",
      objectifs: ["Permettre à l'association une gestion autonome de son site."],
      missions: [
        'Développer le site vitrine et son backend.',
        'Créer une interface administrateur sécurisée : authentification, gestion des contenus, médias et paramètres.',
      ],
      stack: ['HTML', 'CSS', 'JS', 'Bootstrap', 'PHP', 'SQL'],
      competences: ['presence-en-ligne', 'mode-projet'],
      preuves: [], // TODO(wladimir): captures, lien éventuel
      misEnAvant: false,
    },

    /* ─── 10. Diab'Landes ─── */
    {
      id: 'site-diablandes',
      titre: "Site Association Diab'Landes",
      sousTitre: 'Site vitrine avec menu Admin',
      cadre: 'formation',
      statut: 'termine',
      periode: 'ESIEA · Campus Numérique 47 (2023 – 2025)', // TODO(wladimir): année précise
      resume: "Site pour une association d'enfants malades du diabète de type 1.",
      contexte: "Projet réalisé pendant ma formation à l'ESIEA pour l'association Diab'Landes.",
      objectifs: ["Permettre à l'association une gestion autonome de son site."],
      missions: [
        'Développer le site vitrine.',
        'Créer une interface administrateur pour la gestion des contenus et des actualités.',
      ],
      stack: ['HTML', 'CSS', 'JS', 'PHP', 'SQL'],
      competences: ['presence-en-ligne', 'mode-projet'],
      preuves: [], // TODO(wladimir): captures, lien éventuel
      misEnAvant: false,
    },
  ],
}
