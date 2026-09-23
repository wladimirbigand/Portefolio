import type { Competences } from './types'

// TODO(wladimir): valider chaque niveau. Proposition issue des anciens pourcentages :
// ≥ 80 % → maîtrise, 60–79 % → pratique, < 60 % → notions. Les compétences qui n'avaient
// pas de pourcentage (tags) sont proposées en « pratique » ou « notions » à confirmer.

export const competences: Competences = {
  section: {
    ancre: 'competences',
    label: '06 — Compétences',
    titre: 'Mon stack',
    titreAccent: 'stack',
    sousTitre:
      'Un ensemble de compétences techniques acquises en formation, en projets personnels et en entreprise.',
  },
  niveaux: {
    notions: { label: 'Notions', description: 'Bases acquises, utilisation guidée.' },
    pratique: { label: 'Pratique', description: 'Utilisation régulière en autonomie.' },
    maitrise: { label: 'Maîtrise', description: 'Utilisation avancée, capable de transmettre.' },
  },
  categories: [
    {
      id: 'systemes-reseaux',
      titre: 'Systèmes & Réseaux',
      competences: [
        {
          id: 'linux-windows-server',
          nom: 'Linux / Windows Server',
          niveau: 'maitrise', // ancien : 80 %
          realisations: ['samba-ad', 'jitsi-dolibarr'],
        },
        {
          id: 'active-directory',
          nom: 'Active Directory / Samba AD',
          niveau: 'pratique', // ancien : 75 % (« Active Directory »)
          realisations: ['samba-ad'],
        },
        {
          id: 'tcp-ip',
          nom: 'TCP/IP / DHCP / DNS',
          niveau: 'pratique', // ancien : 70 %
          realisations: ['schema-vlan', 'infra-reseau-audit'],
        },
        {
          id: 'packet-tracer',
          nom: 'Cisco Packet Tracer',
          niveau: 'pratique', // ancien : 65 %
          realisations: ['infra-reseau-audit'],
        },
        {
          id: 'scripting',
          nom: 'Scripting Bash / PowerShell',
          niveau: 'pratique', // ancien : 60 %
          realisations: [], // TODO(wladimir): réalisation qui prouve le scripting ?
        },
      ],
    },
    {
      id: 'securite',
      titre: 'Sécurité',
      competences: [
        {
          id: 'durcissement',
          nom: 'Durcissement des accès',
          niveau: 'notions', // TODO(wladimir): niveau
          realisations: ['infra-reseau-audit'],
        },
        {
          id: 'acl',
          nom: 'ACL',
          niveau: 'notions', // TODO(wladimir): niveau
          realisations: ['infra-reseau-audit'],
        },
        {
          id: 'vlan',
          nom: 'VLAN / segmentation',
          niveau: 'pratique', // TODO(wladimir): niveau
          realisations: ['schema-vlan', 'infra-reseau-audit'],
        },
        {
          id: 'reverse-proxy',
          nom: 'Reverse proxy',
          niveau: 'pratique', // TODO(wladimir): niveau
          realisations: ['jitsi-dolibarr'],
        },
        {
          id: 'tls',
          nom: 'TLS',
          niveau: 'notions', // TODO(wladimir): niveau
          realisations: ['jitsi-dolibarr'], // TODO(wladimir): confirmer que le TLS est géré sur ce projet
        },
        {
          id: 'sensibilisation',
          nom: 'Sensibilisation (MOOC ANSSI)',
          niveau: 'notions', // TODO(wladimir): niveau
          realisations: [],
          certifications: ['secnum', 'ebios'],
        },
      ],
    },
    {
      id: 'developpement-web',
      titre: 'Développement Web',
      competences: [
        {
          id: 'html-css',
          nom: 'HTML5 / CSS3',
          niveau: 'maitrise', // ancien : 85 %
          realisations: ['site-jean-pouzet', 'site-diablandes', 'plateforme-formation'],
        },
        {
          id: 'javascript',
          nom: 'JavaScript',
          niveau: 'pratique', // ancien : 70 %
          realisations: ['site-jean-pouzet', 'site-diablandes', 'plateforme-formation'],
        },
        {
          id: 'bootstrap',
          nom: 'Bootstrap / Responsive',
          niveau: 'pratique', // ancien : 75 %
          realisations: ['site-jean-pouzet'],
        },
        {
          id: 'php-sql',
          nom: 'PHP / SQL',
          niveau: 'pratique', // ancien : 65 %
          realisations: ['site-jean-pouzet', 'site-diablandes'],
        },
        {
          id: 'nextjs',
          nom: 'Next.js',
          niveau: 'notions', // TODO(wladimir): niveau (absent de l'ancienne liste)
          realisations: ['plateforme-formation'],
        },
        {
          id: 'csharp-unity',
          nom: 'C# / Unity',
          niveau: 'notions', // ancien : 55 %
          realisations: [], // TODO(wladimir): garder cette compétence sans réalisation associée ?
        },
      ],
    },
    {
      id: 'outils-devops',
      titre: 'Outils & DevOps',
      competences: [
        { id: 'git', nom: 'Git / GitHub', niveau: 'pratique', realisations: [] }, // TODO(wladimir): niveau, preuve
        { id: 'ci-cd', nom: 'CI/CD', niveau: 'notions', realisations: [] }, // TODO(wladimir): niveau, preuve
        { id: 'vscode', nom: 'VS Code', niveau: 'maitrise', realisations: [] }, // TODO(wladimir): niveau
        { id: 'docker', nom: 'Docker', niveau: 'notions', realisations: ['n8n-dolibarr'] }, // TODO(wladimir): niveau
        {
          id: 'virtualisation',
          nom: 'Virtualisation (Hyper-V, VMware, VirtualBox)',
          niveau: 'pratique', // TODO(wladimir): niveau
          realisations: ['samba-ad'], // TODO(wladimir): confirmer que la maquette est virtualisée
        },
        { id: 'drawio', nom: 'Draw.io', niveau: 'pratique', realisations: ['schema-vlan'] }, // TODO(wladimir): niveau
        { id: 'optimisation-web', nom: 'Optimisation web', niveau: 'notions', realisations: [] }, // TODO(wladimir): niveau, preuve
      ],
    },
  ],
  bloc: {
    // TODO(wladimir): confirmer avec la grille officielle (intitulés exacts du bloc 1).
    titre: 'Compétences du bloc 1 — BTS SIO',
    description:
      'Synthèse des compétences du bloc « Support et mise à disposition de services informatiques » mobilisées par mes réalisations.',
    competences: [
      { id: 'patrimoine', intitule: 'Gérer le patrimoine informatique' },
      {
        id: 'incidents',
        intitule: "Répondre aux incidents et aux demandes d'assistance et d'évolution",
      },
      { id: 'presence-en-ligne', intitule: "Développer la présence en ligne de l'organisation" },
      { id: 'mode-projet', intitule: 'Travailler en mode projet' },
      { id: 'service', intitule: 'Mettre à disposition des utilisateurs un service informatique' },
      { id: 'dev-pro', intitule: 'Organiser son développement professionnel' },
    ],
  },
}
