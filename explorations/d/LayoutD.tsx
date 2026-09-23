import { motion, useScroll } from 'motion/react'
import { site } from '@/content'
import { sectionsPage } from '../partage/donnees'
import { useMotionPreset } from '../partage/MotionPresetContext'
import { FicheD } from './FicheD'
import { FooterD } from './FooterD'
import { HeroD } from './HeroD'
import { LigneD } from './LigneD'
import { NavD } from './NavD'
import { RealisationsD } from './RealisationsD'
import { SectionD } from './SectionD'

/**
 * D · Signalétique : composition le long d'une ligne de réseau. Chaque section est une station ;
 * --ligne place la ligne, --gouttiere l'espace réservé à gauche du contenu.
 */
export function LayoutD() {
  const { reduit } = useMotionPreset()
  const { scrollYProgress } = useScroll()
  return (
    <div className="bg-bg text-fg min-h-[100dvh] [--gouttiere:3.75rem] [--ligne:1.5rem] md:[--gouttiere:7rem] md:[--ligne:3rem]">
      <a
        href="#contenu"
        className="bg-accent-fill font-ui text-on-accent-fill sr-only z-50 rounded-full px-5 py-2 focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        {site.libelles.allerAuContenu}
      </a>
      {reduit && (
        <motion.div
          aria-hidden="true"
          className="bg-accent-fill fixed inset-x-0 top-0 z-40 h-1 origin-left"
          style={{ scaleX: scrollYProgress }}
        />
      )}
      <NavD />
      <main id="contenu" className="relative mx-auto max-w-[1280px] pr-4 pl-(--gouttiere) md:pr-10">
        <LigneD />
        <HeroD />
        {sectionsPage.map((section) =>
          section.ancre === 'realisations' ? (
            <div key={section.ancre}>
              <RealisationsD />
              <FicheD />
            </div>
          ) : (
            <SectionD key={section.ancre} section={section} />
          ),
        )}
      </main>
      <FooterD />
    </div>
  )
}
