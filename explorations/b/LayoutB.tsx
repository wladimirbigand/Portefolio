import { motion, useScroll } from 'motion/react'
import { site } from '@/content'
import { sectionsPage } from '../partage/donnees'
import { FicheB } from './FicheB'
import { FooterB } from './FooterB'
import { HeroB } from './HeroB'
import { NavB } from './NavB'
import { RealisationsB } from './RealisationsB'
import { SectionB } from './SectionB'
import { useBoot } from './useBoot'

/** B · Infra : panneaux juxtaposés type terminal, densité compacte, séquence de boot. */
export function LayoutB() {
  const { scrollYProgress } = useScroll()
  const { scope, enCours } = useBoot<HTMLDivElement>()
  return (
    <div
      ref={scope}
      data-boot-etat={enCours ? 'en-cours' : 'termine'}
      className="bg-bg text-fg min-h-[100dvh] [&[data-boot-etat=en-cours]_[data-boot]]:opacity-0"
    >
      <a
        href="#contenu"
        className="bg-accent-fill font-ui text-on-accent-fill sr-only z-50 px-4 py-2 focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        {site.libelles.allerAuContenu}
      </a>
      <motion.div
        aria-hidden="true"
        className="bg-accent-fill fixed inset-x-0 top-0 z-40 h-[3px] origin-left"
        style={{ scaleX: scrollYProgress }}
      />
      <NavB />
      <main id="contenu">
        <HeroB />
        {sectionsPage.map((section) =>
          section.ancre === 'realisations' ? (
            <div key={section.ancre}>
              <RealisationsB />
              <FicheB />
            </div>
          ) : (
            <SectionB key={section.ancre} section={section} />
          ),
        )}
      </main>
      <FooterB />
    </div>
  )
}
