import { motion } from 'motion/react'
import { ArrowRight, ArrowUpRight, Moon, Sun, Timer } from 'lucide-react'
import { profil, site } from '@/content'
import { useMotionPreset, variantsEntree, variantsGroupe } from '../partage/MotionPresetContext'
import { ANCRE_ACCUEIL } from '../partage/useSectionActive'
import { TexteTyping } from '../partage/TexteTyping'
import { useTheme } from '../partage/useTheme'
import { ChronoA } from './ChronoA'

/** Hero en deux colonnes : texte à gauche, carte d'identité en bento à droite. */
export function HeroA() {
  const { preset } = useMotionPreset()
  const { theme, basculer } = useTheme()
  const entree = variantsEntree(preset)

  return (
    <section
      id={ANCRE_ACCUEIL}
      className="mx-auto max-w-[1200px] px-5 pt-32 pb-20 md:px-10 md:pt-36"
    >
      <motion.div
        variants={variantsGroupe(preset)}
        initial="cache"
        animate="visible"
        className="grid items-center gap-10 lg:grid-cols-12"
      >
        <div className="lg:col-span-7">
          <motion.p variants={entree} className="font-ui text-lead text-muted">
            {profil.accroche}
          </motion.p>
          <motion.h1 variants={entree} className="titre text-h1 mt-2">
            {profil.prenom} {profil.nom}
          </motion.h1>
          <motion.p
            variants={entree}
            className="font-code text-lead text-accent mt-4 min-h-[1.6em]"
          >
            <TexteTyping
              roles={profil.rolesTyping}
              curseur={
                <span className="bg-accent ml-0.5 inline-block h-[1.05em] w-[0.5em] translate-y-[0.15em]" />
              }
            />
          </motion.p>
          <motion.p variants={entree} className="text-body text-muted mt-6 max-w-[58ch]">
            {profil.description}
          </motion.p>
          <motion.div variants={entree} className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={profil.ctaPrincipal.href}
              className="group bg-accent-fill font-ui text-ui fort text-on-accent-fill transition-ui inline-flex h-12 items-center gap-2 rounded-lg px-5 hover:opacity-90 active:translate-y-px"
            >
              {profil.ctaPrincipal.label}
              <ArrowRight
                aria-hidden="true"
                size={18}
                className="transition-transform duration-(--d-ui) ease-(--e-ui) group-hover:translate-x-0.5"
              />
            </a>
            <a
              href={profil.ctaSecondaire.href}
              className="border-line font-ui text-ui fort transition-ui hover:bg-surface-2 inline-flex h-12 items-center rounded-lg border px-5 active:translate-y-px"
            >
              {profil.ctaSecondaire.label}
            </a>
          </motion.div>
          <motion.ul variants={entree} className="mt-6 flex flex-wrap gap-5">
            {profil.reseaux.map((reseau) => (
              <li key={reseau.href}>
                <a
                  href={reseau.href}
                  target="_blank"
                  rel="noreferrer"
                  className="font-ui text-ui text-muted transition-ui hover:text-fg inline-flex items-center gap-1 underline-offset-4 hover:underline"
                >
                  {reseau.label}
                  <ArrowUpRight aria-hidden="true" size={16} />
                  <span className="sr-only">{site.libelles.lienExterne}</span>
                </a>
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div variants={entree} className="grid grid-cols-2 gap-3 lg:col-span-5">
          <div className="border-rule bg-surface col-span-2 flex items-center gap-5 rounded-xl border p-5 shadow-[inset_0_1px_0_var(--c-surface-2)]">
            <img
              src={profil.photo.src}
              fetchPriority="high"
              alt={profil.photo.alt}
              width={96}
              height={96}
              className="size-24 shrink-0 rounded-lg object-cover"
            />
            <div>
              <p className="fort">
                {profil.prenom} {profil.nom}
              </p>
              <p className="text-body text-muted mt-1">{profil.rolesTyping[0]}</p>
            </div>
          </div>
          <div className="border-rule bg-surface rounded-xl border p-5 shadow-[inset_0_1px_0_var(--c-surface-2)]">
            <p className="meta text-muted flex items-center gap-2">
              <Timer aria-hidden="true" size={16} />
              {site.libelles.chronoSession}
            </p>
            <ChronoA />
          </div>
          <button
            type="button"
            onClick={basculer}
            className="border-rule bg-surface transition-ui hover:bg-surface-2 flex flex-col items-start justify-between rounded-xl border p-5 text-left shadow-[inset_0_1px_0_var(--c-surface-2)]"
          >
            {theme === 'sombre' ? (
              <Moon aria-hidden="true" size={22} />
            ) : (
              <Sun aria-hidden="true" size={22} />
            )}
            <span className="font-ui text-ui fort mt-4">
              <span className="sr-only">{site.libelles.basculerTheme} : </span>
              {theme === 'sombre' ? site.libelles.themeSombre : site.libelles.themeClair}
            </span>
          </button>
        </motion.div>
      </motion.div>
    </section>
  )
}
