import { useExploration } from './ExplorationContext'
import type { Theme } from './types'

/** Thème actif et bascule, partagés entre le hero des layouts et le mixeur. */
export function useTheme(): { theme: Theme; basculer: () => void } {
  const { combinaison, modifier } = useExploration()
  return {
    theme: combinaison.theme,
    basculer: () => modifier({ theme: combinaison.theme === 'sombre' ? 'clair' : 'sombre' }),
  }
}
