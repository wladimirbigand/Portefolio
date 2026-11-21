import { contact } from './contact'
import { entreprise } from './entreprise'
import { ecole, formationSection } from './formation'
import type { EtapeParcours, SectionMeta } from './types'

export const parcoursSection: SectionMeta = {
  id: 'parcours',
  nav: 'Parcours',
  titre: 'Parcours',
  picto: 'parcours',
}

/** Libellés d’état d’une étape. */
export const parcoursLibelles = {
  actuel: 'En cours',
  projet: 'Projet',
}

/**
 * Quatre étapes, une par ligne, de la plus récente à la plus ancienne.
 * L’étape BTS renvoie vers la section Formation : la description du Campus Ermitage n’est pas répétée ici.
 */
export const parcours: EtapeParcours[] = [
  {
    // À VÉRIFIER : intitulé complet de « AIS » (probablement « Administrateur d’infrastructures sécurisées »).
    periode: '2027',
    titre: 'Bachelor AIS en alternance',
    organisme: ecole.nom,
    lieu: ecole.lieu,
    // Même phrase que l’accroche du contact : une seule source.
    description: contact.accroche,
    etat: 'projet',
  },
  {
    periode: '2025 – 2027',
    titre: 'BTS SIO option SISR, en alternance',
    organisme: ecole.nom,
    lieu: ecole.lieu,
    etat: 'actuel',
    renvois: [
      { label: 'Voir la formation', url: `#${formationSection.id}` },
      { label: `Alternance chez ${entreprise.nom}`, url: '#entreprise' },
    ],
  },
  {
    periode: '2023 – 2025',
    titre: 'ESIEA',
    organisme: 'Campus numérique 47',
    lieu: 'Agen',
    description:
      'Formation « Administrateur de systèmes et réseaux sécurisés » (Bac+2), parcours non diplômant.',
    etat: 'passe',
  },
  {
    periode: '2021 – 2023',
    titre: 'Baccalauréat STI2D, spécialité Énergie et Environnement',
    organisme: 'Institution Sainte-Catherine',
    lieu: 'Villeneuve-sur-Lot',
    etat: 'passe',
  },
]
