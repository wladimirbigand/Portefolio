import { motion, useScroll } from 'motion/react'
import { site } from '@/content'
import { sectionsPage } from '../partage/donnees'
import { FicheC } from './FicheC'
import { FooterC } from './FooterC'
import { HeroC } from './HeroC'
import { NavC } from './NavC'
import { RealisationsC } from './RealisationsC'
import { SectionC } from './SectionC'

/** C · Éditorial clair : colonne de lecture + notes en marge, aéré, plat. */
export function LayoutC() {
  const { scrollYProgress } = useScroll()
  return (
    <div className="bg-bg text-fg min-h-[100dvh]">
      <a
        href="#contenu"
        className="bg-accent-fill font-ui text-on-accent-fill sr-only z-50 rounded-md px-4 py-2 focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        {site.libelles.allerAuContenu}
      </a>
      <motion.div
        aria-hidden="true"
        className="bg-accent fixed inset-x-0 top-0 z-40 h-[2px] origin-left"
        style={{ scaleX: scrollYProgress }}
      />
      <NavC />
      <main id="contenu">
        <HeroC />
        {sectionsPage.map((section) =>
          section.ancre === 'realisations' ? (
            <div key={section.ancre}>
              <RealisationsC />
              <FicheC />
            </div>
          ) : (
            <SectionC key={section.ancre} section={section} />
          ),
        )}
      </main>
      <FooterC />
    </div>
  )
}
