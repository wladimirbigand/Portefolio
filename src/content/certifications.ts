import type { Certification, SectionMeta } from './types'

/** Pas de sous-titre : rien ne doit suggérer que tout est validé. Le statut s’affiche sur chaque ligne. */
export const certificationsSection: SectionMeta = {
  id: 'certifications',
  nav: 'Certifications',
  titre: 'Certifications',
  picto: 'certifications',
}

export const certificationsLibelles = {
  statuts: {
    obtenu: 'Obtenu',
    'en-cours': 'En cours',
  } satisfies Record<Certification['statut'], string>,
  /** Bouton affiché quand une attestation est fournie : elle s’ouvre dans la fenêtre superposée. */
  attestation: 'Voir l’attestation',
  /** Nom accessible du bouton, et titre de la fenêtre : « Attestation — MOOC RGPD ». */
  attestationDe: (nom: string) => `Attestation — ${nom}`,
}

/**
 * Pas d’image trouvée sur le web : chaque certification a un emblème en particules, dessiné par le site
 * à partir de son `sigle` (l’organisme, ou la certification elle-même).
 * Pas de dates pour les MOOC tant que les attestations ne sont pas retrouvées. Quand Wladimir fournira
 * une attestation, renseigner `attestation` (image ou PDF dans `public/`) : le bouton apparaîtra.
 */
export const certifications: Certification[] = [
  {
    nom: 'Certificat Voltaire',
    sigle: 'Voltaire',
    organisme: 'Voltaire',
    statut: 'obtenu',
    score: '714 points',
    // À VÉRIFIER : date d’obtention (l’ancien site indiquait 2025).
  },
  { nom: 'MOOC RGPD', sigle: 'CNIL', organisme: 'CNIL', statut: 'obtenu' },
  { nom: 'SecNumAcadémie', sigle: 'ANSSI', organisme: 'ANSSI', statut: 'obtenu' },
  { nom: 'Les fondamentaux de l’IA', sigle: 'CNFPT', organisme: 'CNFPT', statut: 'obtenu' },
  // Deuxième certification de l’ANSSI : l’emblème prend le sigle de la certification, pour les distinguer.
  { nom: 'MOOC EBIOS Risk Manager', sigle: 'EBIOS', organisme: 'ANSSI', statut: 'en-cours' },
  { nom: 'MOOC OSINT', sigle: 'OSINT', organisme: 'OSINT-FR', statut: 'en-cours' },
]
