import { AnimatePresence, motion, useScroll } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { site } from '@/content'
import { numeroSectionFormate } from '@/lib/sections'
import { useMenuMobile } from '../partage/useMenuMobile'
import { useMotionPreset } from '../partage/MotionPresetContext'
import { useSectionActive } from '../partage/useSectionActive'

const ANCRES = site.navigation.map((element) => element.ancre)

/**
 * Pilule « indicateur de ligne » : plaque inversée affichant la station courante (numéro + nom),
 * les 9 stations en pastilles (pleine = active, anneau = autre) et une mini-ligne de progression.
 */
export function NavD() {
  const { preset, reduit } = useMotionPreset()
  const active = useSectionActive(ANCRES)
  const {
    ouvert: menuOuvert,
    basculer: basculerMenu,
    fermer: fermerMenu,
    refBouton,
    refPanneau,
  } = useMenuMobile()
  const { scrollYProgress } = useScroll()
  const labelActif = site.navigation.find((element) => element.ancre === active)?.label

  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-30 flex justify-center px-3">
      <nav
        aria-label={site.libelles.navigationPrincipale}
        className="bg-fg font-ui text-ui text-bg pointer-events-auto relative flex w-full max-w-max items-center gap-3 overflow-visible rounded-full py-1.5 pr-1.5 pl-1.5 max-xl:max-w-full max-xl:justify-between"
      >
        <a
          href="#accueil"
          aria-label={site.logo.ariaLabel}
          className="bg-accent-fill font-display text-h3 fort text-on-accent-fill grid size-11 shrink-0 place-items-center rounded-full"
        >
          {site.logo.initiale}
        </a>

        <p className="flex min-w-0 items-center gap-2 overflow-hidden pr-1">
          <span className="sr-only">{site.libelles.sectionCourante} : </span>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={active ?? 'accueil'}
              initial={reduit ? { opacity: 0 } : { y: '110%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              exit={reduit ? { opacity: 0 } : { y: '-110%', opacity: 0 }}
              transition={preset.ressort}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              {active && (
                <span className="font-display text-ui fort text-bg/70">
                  {numeroSectionFormate(active)}
                </span>
              )}
              <span className="fort uppercase">
                {labelActif ?? `${site.logo.initiale}. ${site.logo.nom}`}
              </span>
            </motion.span>
          </AnimatePresence>
        </p>

        <ol className="hidden items-center gap-1 xl:flex">
          {site.navigation.map((element) => {
            const estActive = active === element.ancre
            return (
              <li key={element.ancre}>
                <a
                  href={`#${element.ancre}`}
                  aria-current={estActive ? 'location' : undefined}
                  title={element.label}
                  className="group transition-ui hover:bg-bg/15 flex items-center gap-1.5 rounded-full py-1 pr-1 2xl:pr-2.5"
                >
                  <span
                    className={`font-display text-meta fort transition-ui grid size-8 place-items-center rounded-full ${
                      estActive ? 'bg-bg text-fg' : 'border-bg/60 text-bg border-2'
                    }`}
                  >
                    {numeroSectionFormate(element.ancre)}
                  </span>
                  <span className="sr-only 2xl:not-sr-only">{element.label}</span>
                </a>
              </li>
            )
          })}
        </ol>

        <div className="flex shrink-0 items-center gap-1.5">
          <a
            href={`#${site.cta.ancre}`}
            className="bg-accent-fill fort text-on-accent-fill transition-ui flex h-11 items-center rounded-full px-5 whitespace-nowrap hover:opacity-90 max-sm:hidden"
          >
            {site.cta.label}
          </a>
          <button
            ref={refBouton}
            type="button"
            aria-expanded={menuOuvert}
            aria-controls="nav-d-menu"
            aria-label={menuOuvert ? site.libelles.fermerMenu : site.libelles.ouvrirMenu}
            onClick={basculerMenu}
            className="bg-bg/15 transition-ui hover:bg-bg/25 grid size-11 place-items-center rounded-full xl:hidden"
          >
            {menuOuvert ? (
              <X aria-hidden="true" size={22} />
            ) : (
              <Menu aria-hidden="true" size={22} />
            )}
          </button>
        </div>

        <span
          aria-hidden="true"
          className="bg-bg/20 absolute inset-x-6 bottom-0 h-[3px] overflow-hidden rounded-full"
        >
          <motion.span
            className="bg-accent-fill block h-full origin-left"
            style={{ scaleX: scrollYProgress }}
          />
        </span>

        <AnimatePresence>
          {menuOuvert && (
            <motion.div
              ref={refPanneau}
              id="nav-d-menu"
              initial={{ opacity: 0, y: -preset.deplacement, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -preset.deplacement, scale: 0.97 }}
              transition={preset.ui}
              className="bg-fg text-bg absolute inset-x-0 top-[calc(100%+0.5rem)] origin-top rounded-[20px] p-3 xl:hidden"
            >
              <ol className="grid gap-1">
                {site.navigation.map((element) => {
                  const estActive = active === element.ancre
                  return (
                    <li key={element.ancre}>
                      <a
                        href={`#${element.ancre}`}
                        onClick={() => fermerMenu(false)}
                        aria-current={estActive ? 'location' : undefined}
                        className="transition-ui hover:bg-bg/15 flex items-center gap-3 rounded-full px-2 py-2"
                      >
                        <span
                          className={`font-display fort grid size-9 place-items-center rounded-full ${
                            estActive ? 'bg-bg text-fg' : 'border-bg/60 border-2'
                          }`}
                        >
                          {numeroSectionFormate(element.ancre)}
                        </span>
                        <span className={estActive ? 'fort' : ''}>{element.label}</span>
                      </a>
                    </li>
                  )
                })}
                <li className="sm:hidden">
                  <a
                    href={`#${site.cta.ancre}`}
                    onClick={() => fermerMenu(false)}
                    className="bg-accent-fill fort text-on-accent-fill mt-2 flex h-12 items-center justify-center rounded-full"
                  >
                    {site.cta.label}
                  </a>
                </li>
              </ol>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
