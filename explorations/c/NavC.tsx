import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { site } from '@/content'
import { useMenuMobile } from '../partage/useMenuMobile'
import { useMotionPreset } from '../partage/MotionPresetContext'
import { useNavMasquee } from '../partage/useNavMasquee'
import { useSectionActive } from '../partage/useSectionActive'

const ANCRES = site.navigation.map((element) => element.ancre)

/** Pilule fine et claire, masquée au scroll vers le bas pour libérer la lecture. */
export function NavC() {
  const { preset } = useMotionPreset()
  const active = useSectionActive(ANCRES)
  const {
    ouvert: menuOuvert,
    basculer: basculerMenu,
    fermer: fermerMenu,
    refBouton,
    refPanneau,
  } = useMenuMobile()
  const [focusDedans, setFocusDedans] = useState(false)
  const masquee = useNavMasquee(menuOuvert || focusDedans)

  return (
    <motion.header
      initial={false}
      animate={{ y: masquee ? '-150%' : '0%', opacity: masquee ? 0 : 1 }}
      transition={preset.ui}
      onFocus={() => setFocusDedans(true)}
      onBlur={(evenement) => {
        if (!evenement.currentTarget.contains(evenement.relatedTarget)) setFocusDedans(false)
      }}
      className="pointer-events-none fixed inset-x-0 top-4 z-30 flex justify-center px-4"
    >
      <nav
        aria-label={site.libelles.navigationPrincipale}
        className="border-rule bg-bg font-ui text-ui pointer-events-auto relative flex w-full max-w-max items-center gap-1 rounded-full border py-1 pr-1 pl-4 max-xl:max-w-full max-xl:justify-between"
      >
        <a
          href="#accueil"
          aria-label={site.logo.ariaLabel}
          className="fort flex h-10 items-center pr-3"
        >
          {site.logo.initiale}. {site.logo.nom}
        </a>
        <ul className="hidden items-center xl:flex">
          {site.navigation.map((element) => {
            const estActive = active === element.ancre
            return (
              <li key={element.ancre}>
                <a
                  href={`#${element.ancre}`}
                  aria-current={estActive ? 'location' : undefined}
                  className={`transition-ui hover:text-fg block px-2.5 py-2 underline-offset-[6px] hover:underline ${
                    estActive
                      ? 'fort text-fg decoration-accent underline decoration-2'
                      : 'text-muted'
                  }`}
                >
                  {element.label}
                </a>
              </li>
            )
          })}
        </ul>
        <div className="flex items-center gap-1">
          <a
            href={`#${site.cta.ancre}`}
            className="bg-accent-fill fort text-on-accent-fill transition-ui flex h-10 items-center rounded-full px-4 whitespace-nowrap hover:opacity-90"
          >
            {site.cta.label}
          </a>
          <button
            ref={refBouton}
            type="button"
            aria-expanded={menuOuvert}
            aria-controls="nav-c-menu"
            aria-label={menuOuvert ? site.libelles.fermerMenu : site.libelles.ouvrirMenu}
            onClick={basculerMenu}
            className="transition-ui hover:bg-surface grid size-10 place-items-center rounded-full xl:hidden"
          >
            {menuOuvert ? (
              <X aria-hidden="true" size={20} />
            ) : (
              <Menu aria-hidden="true" size={20} />
            )}
          </button>
        </div>

        <AnimatePresence>
          {menuOuvert && (
            <motion.div
              ref={refPanneau}
              id="nav-c-menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={preset.ui}
              className="border-rule bg-bg absolute inset-x-0 top-[calc(100%+0.5rem)] rounded-md border px-6 py-4 xl:hidden"
            >
              <ul className="grid">
                {site.navigation.map((element) => (
                  <li key={element.ancre} className="border-rule border-b last:border-b-0">
                    <a
                      href={`#${element.ancre}`}
                      onClick={() => fermerMenu(false)}
                      aria-current={active === element.ancre ? 'location' : undefined}
                      className={`font-body text-lead block py-3 ${active === element.ancre ? 'fort decoration-accent underline decoration-2 underline-offset-4' : ''}`}
                    >
                      {element.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  )
}
