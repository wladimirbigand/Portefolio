import { PISTES, type Combinaison, type PisteId, type Theme } from './types'

/** Thème par défaut de chaque piste (axe 1 de la matrice). */
export const THEME_PAR_DEFAUT: Record<PisteId, Theme> = {
  a: 'sombre',
  b: 'sombre',
  c: 'clair',
  d: 'clair',
}

function lirePiste(parametres: URLSearchParams, cle: string, secours: PisteId): PisteId {
  const valeur = parametres.get(cle)
  return PISTES.find((piste) => piste === valeur) ?? secours
}

function themeSysteme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'sombre' : 'clair'
}

/** Lit la combinaison depuis l'URL (?explorations&layout=c&palette=b&type=a&motion=a&theme=dark). */
export function lireCombinaison(recherche: string): Combinaison {
  const parametres = new URLSearchParams(recherche)
  const layout = lirePiste(parametres, 'layout', 'a')
  const theme = parametres.get('theme')
  return {
    layout,
    palette: lirePiste(parametres, 'palette', layout),
    type: lirePiste(parametres, 'type', layout),
    motion: lirePiste(parametres, 'motion', layout),
    theme: theme === 'dark' ? 'sombre' : theme === 'light' ? 'clair' : themeSysteme(),
  }
}

/** Écrit la combinaison dans l'URL, en conservant les autres paramètres (mixeur, nav…). */
export function ecrireCombinaison(combinaison: Combinaison): void {
  const actuels = new URLSearchParams(window.location.search)
  const suite = new URLSearchParams()
  for (const [cle, valeur] of actuels) {
    if (!['explorations', 'layout', 'palette', 'type', 'motion', 'theme'].includes(cle)) {
      suite.set(cle, valeur)
    }
  }
  const coeur = [
    'explorations',
    `layout=${combinaison.layout}`,
    `palette=${combinaison.palette}`,
    `type=${combinaison.type}`,
    `motion=${combinaison.motion}`,
    `theme=${combinaison.theme === 'sombre' ? 'dark' : 'light'}`,
  ].join('&')
  const reste = suite.toString()
  const url = `${window.location.pathname}?${coeur}${reste ? `&${reste}` : ''}${window.location.hash}`
  window.history.replaceState(null, '', url)
}
