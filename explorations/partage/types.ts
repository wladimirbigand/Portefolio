import type { Transition } from 'motion/react'

/** Identifiant d'une piste de direction artistique. */
export type PisteId = 'a' | 'b' | 'c' | 'd'

export const PISTES: readonly PisteId[] = ['a', 'b', 'c', 'd']

export type Theme = 'clair' | 'sombre'

/** Combinaison active du mixeur : chaque couche peut venir d'une piste différente. */
export type Combinaison = {
  layout: PisteId
  palette: PisteId
  type: PisteId
  motion: PisteId
  theme: Theme
}

/**
 * Preset d'animation d'une piste. Toutes les durées et courbes d'un layout viennent d'ici :
 * aucun layout ne code de durée en dur.
 */
export type PresetMotion = {
  /** Interactions d'interface (hover, toggle, menu) : 150–300 ms. */
  ui: Transition
  /** Entrées de section : 400–700 ms. */
  section: Transition
  /** Mouvements « physiques » (indicateur de nav, pastilles, cartes). */
  ressort: Transition
  /** Tracé d'une ligne ou d'une bordure. */
  trace: Transition
  /** Décalage entre éléments d'un groupe, en secondes. */
  decalage: number
  /** Translation verticale d'entrée, en px. */
  deplacement: number
  /** Séquences par étapes (boot) : pas entre deux étapes, en secondes. */
  sequence: { pas: number; dureeEtape: number }
  /** Typing du hero, en millisecondes. */
  typing: { frappe: number; effacement: number; pause: number }
  /** Durée (s) des transitions CSS de couleur/bordure, exposée en variable --d-ui. */
  dureeUiCss: number
  /** Easing CSS équivalent, exposé en variable --e-ui. */
  easingCss: string
}
