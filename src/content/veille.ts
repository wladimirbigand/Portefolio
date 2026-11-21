import type { OutilVeille, SectionMeta, ThemeVeille } from './types'

export const veilleSection: SectionMeta = {
  id: 'veille',
  nav: 'Veille',
  titre: 'Veille',
  picto: 'veille',
}

/**
 * Le dispositif de veille : trois cartes illustrées, dans l’ordre de la chaîne
 * (`CONTENU-VALIDE.md`, section 9). Plus de bloc « Mon sujet », ni de sources, ni de notes.
 */
export const dispositifVeille: { titre: string; outils: OutilVeille[] } = {
  titre: 'Mon dispositif',
  outils: [
    {
      nom: 'Feedly',
      description: 'Agrégation et tri des sources.',
      picto: 'feedly',
    },
    {
      nom: 'Agrégateur de flux RSS',
      description:
        'Déployé sur un sous-domaine de Lot-et-Garonne Numérique : articles en temps réel, triés par catégorie.',
      // En attente : `src/assets/captures/veille-agregateur.png`, une capture de l’application.
      picto: 'rss',
      capture: 'agregateur',
      realisation: 12,
    },
    {
      nom: 'Bot Discord',
      description:
        'Développé en JavaScript : des commandes pour lui assigner des flux RSS, et des synthèses quotidiennes générées par IA, programmées et envoyées en message privé ou dans un salon dédié.',
      // En attente : `src/assets/captures/veille-bot.png`, une synthèse de septembre 2026, datée.
      picto: 'discord',
      capture: 'bot',
      pause: 'Pour maîtriser le coût de l’API d’IA.',
    },
  ],
}

/** Une seule ligne, sous les cartes. */
export const themesVeille: { titre: string; themes: ThemeVeille[] } = {
  titre: 'Thèmes suivis',
  themes: [
    { nom: 'Cybersécurité', picto: 'cybersecurite' },
    { nom: 'Intelligence artificielle', picto: 'ia' },
    { nom: 'Systèmes et réseaux', picto: 'reseau' },
  ],
}

export const veilleLibelles = {
  /** État d’un outil à l’arrêt, écrit en toutes lettres sur sa carte. */
  enPause: 'En pause',
  /** Lien d’un outil vers la fiche de sa réalisation : « Voir la fiche de la réalisation 12 ». */
  voirFiche: (numero: number) => `Voir la fiche de la réalisation ${numero}`,
}
