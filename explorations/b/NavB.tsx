import { AnimatePresence, motion } from 'motion/react'
import { ChevronDown, Timer } from 'lucide-react'
import { site } from '@/content'
import { useMenuMobile } from '../partage/useMenuMobile'
import { useMotionPreset } from '../partage/MotionPresetContext'
import { useSectionActive } from '../partage/useSectionActive'
import { libellesExploration } from '../partage/libelles'
import { ChronoB } from './ChronoB'

const ANCRES = site.navigation.map((element) => element.ancre)

/** Pilule « barre d'état » : chemin de la section courante, uptime, sélecteur de sections. */
export function NavB() {
  const { preset } = useMotionPreset()
  const active = useSectionActive(ANCRES)
  const {
    ouvert: menuOuvert,
    basculer: basculerMenu,
    fermer: fermerMenu,
    refBouton,
    refPanneau,
  } = useMenuMobile()
  const labelActif = site.navigation.find((element) => element.ancre === active)?.label

  return (
    <header
      data-boot={0}
      className="pointer-events-none fixed inset-x-0 top-3 z-30 flex justify-center px-3"
    >
      <nav
        aria-label={site.libelles.navigationPrincipale}
        className="border-line bg-surface font-ui text-ui pointer-events-auto relative flex w-full max-w-[1320px] items-center gap-2 rounded-full border py-1 pr-1 pl-4 2xl:w-auto 2xl:max-w-none"
      >
        <a
          href="#accueil"
          aria-label={site.logo.ariaLabel}
          className="fort flex h-10 items-center gap-2"
        >
          <span className="border-line bg-accent-fill text-on-accent-fill grid size-7 place-items-center border">
            {site.logo.initiale}
          </span>
          <span className="max-sm:hidden">{site.logo.nom.toLowerCase()}</span>
        </a>

        <p className="text-muted min-w-0 flex-1 truncate 2xl:hidden">
          <span className="sr-only">{site.libelles.sectionCourante} : </span>
          <span aria-hidden="true" className="text-accent">
            ~/
          </span>
          <span className="text-fg">{active ?? ''}</span>
          {labelActif && <span className="sr-only">{labelActif}</span>}
        </p>

        <ul className="hidden items-center 2xl:flex">
          {site.navigation.map((element) => {
            const estActive = active === element.ancre
            return (
              <li key={element.ancre}>
                <a
                  href={`#${element.ancre}`}
                  aria-current={estActive ? 'location' : undefined}
                  className={`transition-ui hover:text-fg block px-2 py-2 ${estActive ? 'fort text-fg' : 'text-muted'}`}
                >
                  <span aria-hidden="true" className={estActive ? 'text-accent' : 'invisible'}>
                    [
                  </span>
                  {element.label}
                  <span aria-hidden="true" className={estActive ? 'text-accent' : 'invisible'}>
                    ]
                  </span>
                </a>
              </li>
            )
          })}
        </ul>

        <p
          className="text-muted flex items-center gap-1.5 max-md:hidden"
          title={site.libelles.chronoSession}
        >
          <Timer aria-hidden="true" size={16} />
          <span className="sr-only">{site.libelles.chronoSession} : </span>
          <ChronoB className="text-fg" />
        </p>

        <button
          ref={refBouton}
          type="button"
          aria-expanded={menuOuvert}
          aria-controls="nav-b-menu"
          onClick={basculerMenu}
          className="border-line transition-ui hover:bg-surface-2 flex h-10 items-center gap-1 border px-3 max-sm:rounded-r-full max-sm:pr-4 2xl:hidden"
        >
          <span>{libellesExploration.b.commandeMenu}</span>
          <span className="sr-only">
            {menuOuvert ? site.libelles.fermerMenu : site.libelles.ouvrirMenu}
          </span>
          <ChevronDown aria-hidden="true" size={16} className={menuOuvert ? 'rotate-180' : ''} />
        </button>
        <a
          href={`#${site.cta.ancre}`}
          className="bg-accent-fill fort text-on-accent-fill transition-ui flex h-10 items-center rounded-full px-4 whitespace-nowrap hover:opacity-90 max-sm:hidden"
        >
          {site.cta.label}
        </a>

        <AnimatePresence>
          {menuOuvert && (
            <motion.div
              ref={refPanneau}
              id="nav-b-menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={preset.ui}
              className="border-line bg-surface absolute top-[calc(100%+0.5rem)] right-0 w-full max-w-[22rem] border 2xl:hidden"
            >
              <ul>
                {site.navigation.map((element) => {
                  const estActive = active === element.ancre
                  return (
                    <li key={element.ancre} className="border-rule border-b last:border-b-0">
                      <a
                        href={`#${element.ancre}`}
                        onClick={() => fermerMenu(false)}
                        aria-current={estActive ? 'location' : undefined}
                        className={`transition-ui hover:bg-surface-2 flex items-center gap-2 px-4 py-3 ${estActive ? 'fort' : ''}`}
                      >
                        <span aria-hidden="true" className="text-accent">
                          {estActive ? '>' : ' '}
                        </span>
                        {element.label}
                      </a>
                    </li>
                  )
                })}
                <li className="sm:hidden">
                  <a
                    href={`#${site.cta.ancre}`}
                    onClick={() => fermerMenu(false)}
                    className="bg-accent-fill fort text-on-accent-fill block px-4 py-3"
                  >
                    {site.cta.label}
                  </a>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
