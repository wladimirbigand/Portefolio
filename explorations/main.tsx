// Explorations de DA : chargé uniquement par import dynamique protégé par import.meta.env.DEV
// (voir src/main.tsx). Rien de ce dossier ne doit atteindre le build de production.
import './explorations.css'
import { useCallback, useLayoutEffect, useMemo, useState, type ComponentType } from 'react'
import { MotionConfig, useReducedMotion } from 'motion/react'
import { LayoutA } from './a/LayoutA'
import { LayoutB } from './b/LayoutB'
import { effacerBootJoue } from './b/boot'
import { LayoutC } from './c/LayoutC'
import { LayoutD } from './d/LayoutD'
import { ecrireCombinaison, lireCombinaison } from './partage/combinaison'
import { ExplorationContext, type EtatExploration } from './partage/ExplorationContext'
import { Mixeur } from './partage/Mixeur'
import { ModeAffichageContext } from './partage/ModeAffichageContext'
import { MotionPresetContext, reduirePreset } from './partage/MotionPresetContext'
import { PRESETS_MOTION } from './partage/presets'
import type { Combinaison, PisteId } from './partage/types'

const LAYOUTS: Record<PisteId, ComponentType> = {
  a: LayoutA,
  b: LayoutB,
  c: LayoutC,
  d: LayoutD,
}

export function ExplorationsApp() {
  const parametres = useMemo(() => new URLSearchParams(window.location.search), [])
  const [combinaison, setCombinaison] = useState<Combinaison>(() =>
    lireCombinaison(window.location.search),
  )
  const [cleRejeu, setCleRejeu] = useState(0)
  const [navAlwaysVisible, setNavAlwaysVisible] = useState(parametres.get('nav') === 'fixe')
  const reduit = useReducedMotion() ?? false

  const preset = useMemo(() => {
    const brut = PRESETS_MOTION[combinaison.motion]
    return reduit ? reduirePreset(brut) : brut
  }, [combinaison.motion, reduit])

  useLayoutEffect(() => {
    const html = document.documentElement
    html.dataset.palette = combinaison.palette
    html.dataset.type = combinaison.type
    html.dataset.layout = combinaison.layout
    html.classList.toggle('dark', combinaison.theme === 'sombre')
    html.style.setProperty('--d-ui', `${preset.dureeUiCss}s`)
    html.style.setProperty('--e-ui', preset.easingCss)
    ecrireCombinaison(combinaison)
    // <meta name="theme-color"> aligné sur le fond de la palette active.
    let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'theme-color'
      document.head.append(meta)
    }
    meta.content = getComputedStyle(html).getPropertyValue('--c-bg').trim()
  }, [combinaison, preset])

  const modifier = useCallback(
    (partiel: Partial<Combinaison>) => setCombinaison((actuelle) => ({ ...actuelle, ...partiel })),
    [],
  )

  const rejouer = useCallback(() => {
    effacerBootJoue()
    window.scrollTo({ top: 0, behavior: 'instant' })
    setCleRejeu((cle) => cle + 1)
  }, [])

  const etat = useMemo<EtatExploration>(
    () => ({ combinaison, modifier, cleRejeu, rejouer }),
    [combinaison, modifier, cleRejeu, rejouer],
  )
  const modeAffichage = useMemo(() => ({ navAlwaysVisible }), [navAlwaysVisible])
  const etatMotion = useMemo(() => ({ preset, reduit }), [preset, reduit])

  const Layout = LAYOUTS[combinaison.layout]

  return (
    <ExplorationContext.Provider value={etat}>
      <ModeAffichageContext.Provider value={modeAffichage}>
        <MotionPresetContext.Provider value={etatMotion}>
          <MotionConfig reducedMotion="user">
            <Layout key={`${combinaison.layout}-${combinaison.motion}-${cleRejeu}`} />
          </MotionConfig>
          {parametres.get('mixeur') !== '0' && (
            <Mixeur navAlwaysVisible={navAlwaysVisible} onNavAlwaysVisible={setNavAlwaysVisible} />
          )}
        </MotionPresetContext.Provider>
      </ModeAffichageContext.Provider>
    </ExplorationContext.Provider>
  )
}
