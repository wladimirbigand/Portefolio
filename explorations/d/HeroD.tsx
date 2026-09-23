import { motion } from 'motion/react'
import { ArrowRight, ArrowUpRight, Moon, Sun, Timer } from 'lucide-react'
import { profil, site } from '@/content'
import { useMotionPreset, variantsEntree, variantsGroupe } from '../partage/MotionPresetContext'
import { ANCRE_ACCUEIL } from '../partage/useSectionActive'
import { TexteTyping } from '../partage/TexteTyping'
import { useTheme } from '../partage/useTheme'
import { ChronoD } from './ChronoD'

/** Hero : la photo en pastille ronde marque l'origine de la ligne ; plaque principale + plaques d'info. */
export function HeroD() {
  const { preset } = useMotionPreset()
  const { theme, basculer } = useTheme()
  const entree = variantsEntree(preset)

  return (
    <section id={ANCRE_ACCUEIL} className="relative pt-28 pb-16 md:pt-32">
      <motion.img
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={preset.ressort}
        src={profil.photo.src}
        fetchPriority="high"
        alt={profil.photo.alt}
        width={80}
        height={80}
        className="border-accent-fill bg-surface absolute top-28 left-[calc(var(--ligne)-var(--gouttiere))] size-12 -translate-x-1/2 rounded-full border-[5px] object-cover md:top-32 md:size-20"
      />
      <motion.div
        variants={variantsGroupe(preset)}
        initial="cache"
        animate="visible"
        className="grid gap-4 lg:grid-cols-12"
      >
        <motion.div
          variants={entree}
          className="bg-surface rounded-[20px] p-7 md:p-12 lg:col-span-8"
        >
          <p className="meta text-muted">{profil.accroche}</p>
          <h1 className="titre text-h1 mt-2">
            {profil.prenom} {profil.nom}
          </h1>
          <p className="font-display text-h3 fort text-accent mt-4 flex min-h-[1.3em] items-center gap-3">
            <ArrowRight aria-hidden="true" className="size-[0.9em] shrink-0" strokeWidth={3} />
            <TexteTyping
              roles={profil.rolesTyping}
              curseur={
                <span className="bg-accent ml-0.5 inline-block h-[0.9em] w-[3px] translate-y-[0.1em]" />
              }
            />
          </p>
          <p className="text-body mt-6 max-w-[58ch]">{profil.description}</p>
          <div className="font-ui text-ui mt-8 flex flex-wrap gap-3">
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={preset.ressort}
              href={profil.ctaPrincipal.href}
              className="bg-accent-fill fort text-on-accent-fill inline-flex h-14 items-center gap-3 rounded-full pr-2 pl-6"
            >
              {profil.ctaPrincipal.label}
              <span className="bg-on-accent-fill/15 grid size-10 place-items-center rounded-full">
                <ArrowRight aria-hidden="true" size={20} />
              </span>
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={preset.ressort}
              href={profil.ctaSecondaire.href}
              className="bg-surface-2 fort inline-flex h-14 items-center rounded-full px-6"
            >
              {profil.ctaSecondaire.label}
            </motion.a>
          </div>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
          <motion.div variants={entree} className="bg-surface rounded-[20px] p-6">
            <p className="meta text-muted flex items-center gap-2">
              <Timer aria-hidden="true" size={18} />
              {site.libelles.chronoSession}
            </p>
            <p className="mt-2">
              <ChronoD />
            </p>
          </motion.div>
          <motion.button
            variants={entree}
            type="button"
            onClick={basculer}
            className="bg-surface transition-ui hover:bg-surface-2 flex items-center gap-4 rounded-[20px] p-6 text-left"
          >
            <span className="bg-fg text-bg grid size-12 shrink-0 place-items-center rounded-full">
              {theme === 'sombre' ? (
                <Moon aria-hidden="true" size={22} />
              ) : (
                <Sun aria-hidden="true" size={22} />
              )}
            </span>
            <span className="font-ui text-ui fort">
              <span className="sr-only">{site.libelles.basculerTheme} : </span>
              {theme === 'sombre' ? site.libelles.themeSombre : site.libelles.themeClair}
            </span>
          </motion.button>
          <motion.ul
            variants={entree}
            className="bg-surface flex flex-wrap gap-2 rounded-[20px] p-6 sm:col-span-2 lg:col-span-1"
          >
            {profil.reseaux.map((reseau) => (
              <li key={reseau.href}>
                <a
                  href={reseau.href}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-surface-2 font-ui text-ui fort transition-ui hover:bg-rule inline-flex h-11 items-center gap-1.5 rounded-full px-4"
                >
                  {reseau.label}
                  <ArrowUpRight aria-hidden="true" size={18} />
                  <span className="sr-only">{site.libelles.lienExterne}</span>
                </a>
              </li>
            ))}
          </motion.ul>
        </div>
      </motion.div>
    </section>
  )
}
