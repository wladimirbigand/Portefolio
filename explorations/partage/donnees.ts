// Données dérivées de src/content/, communes aux 4 layouts. Aucun texte n'est écrit ici.
import {
  certifications,
  competences,
  contact,
  entreprise,
  epreuves,
  formation,
  parcours,
  realisations,
  site,
  veille,
  type CadreRealisation,
  type CompetenceBlocId,
  type EnTeteSection,
  type Realisation,
  type RealisationId,
} from '@/content'

const ENTETES: readonly EnTeteSection[] = [
  parcours.section,
  formation.section,
  entreprise.section,
  epreuves.section,
  realisations.section,
  competences.section,
  certifications.section,
  veille.section,
  contact.section,
]

export type SectionPage = {
  ancre: string
  label: string
  entete: EnTeteSection
}

/** Sections de la page, dans l'ordre de site.navigation. */
export const sectionsPage: readonly SectionPage[] = site.navigation.map((element) => {
  const entete = ENTETES.find((candidat) => candidat.ancre === element.ancre)
  if (!entete) throw new Error(`Section sans en-tête de contenu : ${element.ancre}`)
  return { ancre: element.ancre, label: element.label, entete }
})

export const realisationsMisesEnAvant: readonly Realisation[] = realisations.liste.filter(
  (realisation) => realisation.misEnAvant,
)

function trouverRealisation(id: RealisationId): Realisation {
  const realisation = realisations.liste.find((candidat) => candidat.id === id)
  if (!realisation) throw new Error(`Réalisation introuvable : ${id}`)
  return realisation
}

/** Réalisation prototypée en fiche détaillée. */
export const ficheSamba: Realisation = trouverRealisation('samba-ad')

/** Ancre de la fiche détaillée d'une réalisation. */
export function ancreFiche(id: RealisationId): string {
  return `realisation-${id}`
}

export function intituleCompetence(id: CompetenceBlocId): string {
  return competences.bloc.competences.find((competence) => competence.id === id)?.intitule ?? id
}

const ORDRE_CADRES: readonly CadreRealisation[] = ['entreprise', 'formation', 'personnel']

/** Cadres qui ont au moins une réalisation : une ligne vide n'est jamais affichée. */
export const cadresUtilises: readonly CadreRealisation[] = ORDRE_CADRES.filter((cadre) =>
  realisations.liste.some((realisation) => realisation.cadre === cadre),
)

export function nombreRealisations(cadre: CadreRealisation): number {
  return realisations.liste.filter((realisation) => realisation.cadre === cadre).length
}

/** Lettre de ligne (signalétique) d'un cadre, tirée de son libellé de contenu. */
export function lettreCadre(cadre: CadreRealisation): string {
  return realisations.libelles.cadres[cadre].charAt(0).toUpperCase()
}
