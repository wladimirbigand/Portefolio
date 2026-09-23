import { motion } from 'motion/react'
import { ArrowUpRight, Moon, Sun } from 'lucide-react'
import { profil, site } from '@/content'
import { useMotionPreset, variantsEntree, variantsGroupe } from '../partage/MotionPresetContext'
import { ANCRE_ACCUEIL } from '../partage/useSectionActive'
import { TexteTyping } from '../partage/TexteTyping'
import { useTheme } from '../partage/useTheme'
import { ChronoC } from './ChronoC'

/** Hero en une colonne, aligné à gauche, portrait en signature d'auteur. */
export function HeroC() {
  const { preset } = useMotionPreset()
  const { theme, basculer } = useTheme()
  const entree = variantsEntree(preset)

  return (
    <section id={ANCRE_ACCUEIL} className="px-5 pt-36 pb-24 md:px-[8vw] md:pt-44">
      <motion.div
        variants={variantsGroupe(preset)}
        initial="cache"
        animate="visible"
        className="max-w-[46rem]"
      >
        <motion.div variants={entree} className="flex items-center gap-4">
          <img
            src={profil.photo.src}
            fetchPriority="high"
            alt={profil.photo.alt}
            width={64}
            height={64}
            className="size-16 rounded-full object-cover"
          />
          <p className="font-ui text-ui text-muted">{profil.accroche}</p>
        </motion.div>
        <motion.h1 variants={entree} className="titre text-h1 mt-6">
          {profil.prenom} {profil.nom}
        </motion.h1>
        <motion.p
          variants={entree}
          className="accent-style text-lead text-accent mt-4 min-h-[1.65em]"
        >
          <TexteTyping
            roles={profil.rolesTyping}
            curseur={
              <span className="bg-accent ml-0.5 inline-block h-[1em] w-px translate-y-[0.12em]" />
            }
          />
        </motion.p>
        <motion.p variants={entree} className="text-body mt-6 max-w-[60ch]">
          {profil.description}
        </motion.p>
        <motion.div
          variants={entree}
          className="font-ui text-ui mt-10 flex flex-wrap items-center gap-x-8 gap-y-4"
        >
          <a
            href={profil.ctaPrincipal.href}
            className="bg-accent-fill fort text-on-accent-fill transition-ui inline-flex h-12 items-center rounded-md px-6 hover:opacity-90 active:translate-y-px"
          >
            {profil.ctaPrincipal.label}
          </a>
          <a
            href={profil.ctaSecondaire.href}
            className="fort decoration-line transition-ui hover:decoration-accent underline decoration-1 underline-offset-[6px]"
          >
            {profil.ctaSecondaire.label}
          </a>
        </motion.div>
        <motion.div
          variants={entree}
          className="border-rule font-ui text-ui text-muted mt-14 flex flex-wrap items-center gap-x-6 gap-y-3 border-t pt-5"
        >
          {profil.reseaux.map((reseau) => (
            <a
              key={reseau.href}
              href={reseau.href}
              target="_blank"
              rel="noreferrer"
              className="transition-ui hover:text-fg inline-flex items-center gap-1 underline-offset-4 hover:underline"
            >
              {reseau.label}
              <ArrowUpRight aria-hidden="true" size={16} />
              <span className="sr-only">{site.libelles.lienExterne}</span>
            </a>
          ))}
          <p>
            {site.libelles.chronoSession} <ChronoC />
          </p>
          <button
            type="button"
            onClick={basculer}
            className="transition-ui hover:bg-surface hover:text-fg inline-flex items-center gap-2 rounded-md px-2 py-1"
          >
            {theme === 'sombre' ? (
              <Moon aria-hidden="true" size={16} />
            ) : (
              <Sun aria-hidden="true" size={16} />
            )}
            <span className="sr-only">{site.libelles.basculerTheme} : </span>
            {theme === 'sombre' ? site.libelles.themeSombre : site.libelles.themeClair}
          </button>
        </motion.div>
      </motion.div>
    </section>
  )
}
