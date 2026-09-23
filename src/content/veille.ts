import type { Veille } from './types'

export const veille: Veille = {
  section: {
    ancre: 'veille',
    label: 'Veille informatique',
    titre: 'Mon écosystème de veille',
    titreAccent: 'veille',
    // TODO(wladimir): relire l'intro.
    sousTitre:
      "Ma veille repose sur trois outils complémentaires, des sources de première main jusqu'aux articles classés par thématiques.",
  },
  titrePipeline: 'Pipeline de veille',
  outils: [
    {
      id: 'reseaux-sociaux',
      etape: 1,
      nom: 'Réseaux sociaux',
      role: 'Sources de première main',
      description: "Je suis des comptes qui publient l'information à la source.",
      fonctionnement: [],
      icone: 'share',
      // TODO(wladimir): comptes et plateformes précis (X, LinkedIn, Mastodon, YouTube… ?).
      sources: [],
      thematiques: [], // TODO(wladimir): thématiques suivies sur les réseaux sociaux
      captures: [],
    },
    {
      id: 'bot-discord',
      etape: 2,
      nom: 'Bot Discord maison',
      role: 'Digests générés par IA',
      description:
        "Via des commandes, j'ajoute des flux RSS au bot, qui me génère des digests grâce à l'API Claude.",
      fonctionnement: [
        "J'ajoute des flux RSS au bot via des commandes Discord.",
        'Le bot récupère les nouveaux articles de ces flux.',
        "Il génère des digests grâce à l'API Claude.",
      ],
      stack: ['Node.js', 'Discord', 'RSS', 'API Claude'],
      icone: 'bot',
      sources: [], // TODO(wladimir): flux RSS suivis par le bot
      thematiques: [], // TODO(wladimir): thématiques couvertes par le bot
      captures: [], // TODO(wladimir): captures d'un digest et des commandes
      // TODO(wladimir): lien vers le dépôt GitHub du bot, s'il est public.
    },
    {
      id: 'site-veille',
      etape: 3,
      nom: 'Site de veille informatique',
      role: 'Agrégation par thématiques (entreprise)',
      description:
        'Le site agrège les articles récents via des flux RSS et les classe par thématiques.',
      fonctionnement: [
        'Agrégation des articles récents via des flux RSS.',
        'Classement des articles par thématiques.',
      ],
      stack: ['RSS'], // TODO(wladimir): technologies du site
      icone: 'newspaper',
      sources: [], // TODO(wladimir): flux RSS agrégés
      thematiques: ['IA', 'Cyber', 'Systèmes & Réseaux'], // TODO(wladimir): compléter la liste (« etc. »)
      captures: [], // TODO(wladimir): capture du site
      // TODO(wladimir): lien vers le site, s'il est accessible publiquement.
    },
  ],
  // TODO(wladimir): liste globale des thématiques suivies.
  thematiques: ['IA', 'Cyber', 'Systèmes & Réseaux'],
}
