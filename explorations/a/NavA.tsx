import { useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { site } from '@/content'
import { useMenuMobile } from '../partage/useMenuMobile'
import { useMotionPreset } from '../partage/MotionPresetContext'
import { useSectionActive } from '../partage/useSectionActive'

const ANCRES = site.navigation.map((element) => element.ancre)

/** Pilule vitrée qui se contracte au scroll ; fond actif qui glisse d'un lien à l'autre. */
export function NavA() {
  const { preset } = useMotionPreset()
  const active = useSectionActive(ANCRES)
  const {
    ouvert: menuOuvert,
    basculer: basculerMenu,
    fermer: fermerMenu,
    refBouton,
    refPanneau,
  } = useMenuMobile()
  const { scrollY } = useScroll()
  const [compacte, setCompacte] = useState(false)
  useMotionValueEvent(scrollY, 'change', (y) => setCompacte(y > 120))

  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-30 flex justify-center px-4">
      <motion.nav
        layout
        transition={preset.ressort}
        aria-label={site.libelles.navigationPrincipale}
        className="border-rule bg-surface/85 pointer-events-auto relative flex w-full max-w-max items-center gap-2 rounded-full border py-1.5 pr-1.5 pl-2 shadow-[0_8px_24px_-12px_rgb(var(--c-shadow)/0.35),inset_0_1px_0_var(--c-surface-2)] backdrop-blur-md max-xl:max-w-full max-xl:justify-between"
      >
        <a
          href="#accueil"
          aria-label={site.logo.ariaLabel}
          className="font-ui text-ui fort transition-ui hover:bg-surface-2 flex h-10 items-center gap-2 rounded-full px-2"
        >
          <span className="bg-fg text-bg grid size-7 place-items-center rounded-md">
            {site.logo.initiale}
          </span>
          <AnimatePresence initial={false}>
            {!compacte && (
              <motion.span
                key="nom"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={preset.ui}
              >
                {site.logo.nom}
              </motion.span>
            )}
          </AnimatePresence>
        </a>

        <ul className="hidden items-center xl:flex">
          {site.navigation.map((element) => {
            const estActive = active === element.ancre
            return (
              <li key={element.ancre} className="relative">
                {estActive && (
                  <motion.span
                    layoutId="nav-a-actif"
                    transition={preset.ressort}
                    className="bg-surface-2 absolute inset-0 rounded-full shadow-[inset_0_0_0_1px_var(--c-rule)]"
                  />
                )}
                <a
                  href={`#${element.ancre}`}
                  aria-current={estActive ? 'location' : undefined}
                  className={`font-ui text-ui transition-ui hover:text-fg relative block rounded-full px-3 py-2 ${
                    estActive ? 'fort text-fg' : 'text-muted'
                  }`}
                >
                  {element.label}
                </a>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center gap-1.5">
          <a
            href={`#${site.cta.ancre}`}
            className="bg-accent-fill font-ui text-ui fort text-on-accent-fill transition-ui flex h-10 items-center rounded-full px-4 whitespace-nowrap hover:opacity-90"
          >
            {site.cta.label}
          </a>
          <button
            ref={refBouton}
            type="button"
            aria-expanded={menuOuvert}
            aria-controls="nav-a-menu"
            aria-label={menuOuvert ? site.libelles.fermerMenu : site.libelles.ouvrirMenu}
            onClick={basculerMenu}
            className="border-line text-fg transition-ui hover:bg-surface-2 grid size-10 place-items-center rounded-full border xl:hidden"
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
              id="nav-a-menu"
              initial={{ opacity: 0, y: -preset.deplacement }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -preset.deplacement }}
              transition={preset.ui}
              className="border-rule bg-surface absolute inset-x-0 top-[calc(100%+0.5rem)] rounded-2xl border p-2 shadow-[0_16px_40px_-16px_rgb(var(--c-shadow)/0.45)] xl:hidden"
            >
              <ul className="grid gap-0.5">
                {site.navigation.map((element) => (
                  <li key={element.ancre}>
                    <a
                      href={`#${element.ancre}`}
                      onClick={() => fermerMenu(false)}
                      aria-current={active === element.ancre ? 'location' : undefined}
                      className={`font-ui text-body transition-ui hover:bg-surface-2 block rounded-lg px-4 py-3 ${
                        active === element.ancre ? 'fort bg-surface-2' : ''
                      }`}
                    >
                      {element.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  )
}
