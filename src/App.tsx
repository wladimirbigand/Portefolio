import { MotionConfig } from 'motion/react'
import { ui } from './content'
import Page from './directions/trame/Page'
import { useTheme } from './lib/theme'

export function App() {
  const { theme, basculer } = useTheme()

  return (
    // reducedMotion="user" : Motion respecte prefers-reduced-motion pour toute l'app.
    <MotionConfig reducedMotion="user">
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-base focus:bg-accent focus:px-4 focus:py-2 focus:font-semibold focus:text-sur-accent"
      >
        {ui.evitement}
      </a>
      <Page theme={theme} basculer={basculer} />
    </MotionConfig>
  )
}
