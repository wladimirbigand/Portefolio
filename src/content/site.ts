import type { SectionMeta } from './types'
import { parcoursSection } from './parcours'
import { formationSection } from './formation'
import { entrepriseSection } from './entreprise'
import { epreuvesSection } from './epreuves'
import { projetsSection } from './projets'
import { competencesSection } from './competences'
import { certificationsSection } from './certifications'
import { veilleSection } from './veille'
import { contactSection } from './contact'
import { meta, urlSite } from './meta'

/** Titre, langue et adresse du site : voir `meta.ts` (référencement et partage). */
export const site = {
  titre: meta.titre,
  langue: meta.langue,
  url: urlSite,
}

/**
 * Sections du site, dans l’ordre de la navigation. Cet ordre donne aussi leur numéro
 * (01 à 09, calculé d’après la position) : aucun numéro n’est écrit dans le contenu.
 */
export const sections: SectionMeta[] = [
  parcoursSection,
  formationSection,
  entrepriseSection,
  epreuvesSection,
  projetsSection,
  competencesSection,
  certificationsSection,
  veilleSection,
  contactSection,
]

export const navigation = {
  retourHaut: 'Revenir en haut de la page',
  cta: 'Me contacter',
  ouvrirMenu: 'Ouvrir le menu',
  fermerMenu: 'Fermer le menu',
  changerTheme: 'Changer de thème',
  defiler: 'Scroll',
}

export const piedDePage = {
  /** L’année est calculée à l’affichage : `piedDePage.copyright(new Date().getFullYear())`. */
  copyright: (annee: number) => `© ${annee} Wladimir Bigand`,
  mention: 'BTS SIO SISR · Campus Ermitage',
}
