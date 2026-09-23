import { motion, useScroll } from 'motion/react'
import { site } from '@/content'
import { sectionsPage } from '../partage/donnees'
import { FicheA } from './FicheA'
import { FooterA } from './FooterA'
import { HeroA } from './HeroA'
import { NavA } from './NavA'
import { RealisationsA } from './RealisationsA'
import { SectionA } from './SectionA'

/** A · Précis : grille bento asymétrique, densité moyenne, surfaces étagées. */
export function LayoutA() {
  const { scrollYProgress } = useScroll()
  return (
    <div className="bg-bg text-fg min-h-[100dvh]">
      <a
        href="#contenu"
        className="bg-accent-fill text-on-accent-fill sr-only z-50 rounded-lg px-4 py-2 focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        {site.libelles.allerAuContenu}
      </a>
      <motion.div
        aria-hidden="true"
        className="bg-accent fixed inset-x-0 top-0 z-40 h-[2px] origin-left"
        style={{ scaleX: scrollYProgress }}
      />
      <NavA />
      <main id="contenu">
        <HeroA />
        {sectionsPage.map((section) =>
          section.ancre === 'realisations' ? (
            <div key={section.ancre}>
              <RealisationsA />
              <FicheA />
            </div>
          ) : (
            <SectionA key={section.ancre} section={section} />
          ),
        )}
      </main>
      <FooterA />
    </div>
  )
}
