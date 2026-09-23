import { ArrowUpRight, Moon, Sun } from 'lucide-react'
import { profil, site } from '@/content'
import { ANCRE_ACCUEIL } from '../partage/useSectionActive'
import { TexteTyping } from '../partage/TexteTyping'
import { useTheme } from '../partage/useTheme'
import { libellesExploration } from '../partage/libelles'
import { ChronoB } from './ChronoB'
import { PanneauB } from './PanneauB'

const hote = `${profil.prenom.toLowerCase()}@${profil.nom.toLowerCase()}`

/** Hero en panneaux juxtaposés : identité, session (uptime + thème), photo en vignette. */
export function HeroB() {
  const { theme, basculer } = useTheme()
  return (
    <section id={ANCRE_ACCUEIL} className="mx-auto max-w-[1320px] px-3 pt-24 pb-12 md:px-6">
      <div className="border-line bg-line grid gap-px border lg:grid-cols-12">
        <PanneauB
          titre={`${hote}:~`}
          boot={1}
          statut={libellesExploration.b.statutOk}
          className="lg:col-span-8 lg:row-span-2"
          corpsClassName="p-6 md:p-10"
        >
          <p className="font-ui text-lead text-muted">
            <span aria-hidden="true" className="text-accent">
              {'> '}
            </span>
            {profil.accroche}
          </p>
          <h1 data-boot={4} className="titre text-h1 mt-3">
            {profil.prenom} {profil.nom}
          </h1>
          <p data-boot={5} className="font-code text-lead mt-4 min-h-[1.6em]">
            <span aria-hidden="true" className="text-muted">
              ${' '}
            </span>
            <TexteTyping
              roles={profil.rolesTyping}
              className="text-accent"
              curseur={
                <span className="bg-accent-fill ml-0.5 inline-block h-[1.1em] w-[0.6em] translate-y-[0.18em]" />
              }
            />
          </p>
          <p data-boot={6} className="text-body text-muted mt-6 max-w-[60ch]">
            {profil.description}
          </p>
          <div data-boot={7} className="font-ui text-ui mt-8 flex flex-wrap gap-3">
            <a
              href={profil.ctaPrincipal.href}
              className="border-line bg-accent-fill fort text-on-accent-fill transition-ui inline-flex h-12 items-center border px-5 hover:opacity-90 active:translate-y-px"
            >
              {profil.ctaPrincipal.label}
            </a>
            <a
              href={profil.ctaSecondaire.href}
              className="border-line fort transition-ui hover:bg-surface-2 inline-flex h-12 items-center border px-5 active:translate-y-px"
            >
              {profil.ctaSecondaire.label}
            </a>
          </div>
          <ul data-boot={8} className="font-ui text-ui mt-6 flex flex-wrap gap-4">
            {profil.reseaux.map((reseau) => (
              <li key={reseau.href}>
                <a
                  href={reseau.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted transition-ui hover:text-fg inline-flex items-center gap-1 underline-offset-4 hover:underline"
                >
                  [{reseau.label.toLowerCase()}]
                  <ArrowUpRight aria-hidden="true" size={16} />
                  <span className="sr-only">{site.libelles.lienExterne}</span>
                </a>
              </li>
            ))}
          </ul>
        </PanneauB>

        <PanneauB
          titre={site.libelles.chronoSession}
          boot={3}
          statut={libellesExploration.b.statutOk}
          className="lg:col-span-4"
          corpsClassName="grid gap-5 p-6"
        >
          <p className="font-code text-h2 tabular-nums">
            <ChronoB />
          </p>
          <button
            type="button"
            onClick={basculer}
            className="border-line font-ui text-ui transition-ui hover:bg-surface-2 flex h-12 w-full items-center justify-between border px-4"
          >
            <span>
              <span className="sr-only">{site.libelles.basculerTheme} : </span>
              {theme === 'sombre' ? site.libelles.themeSombre : site.libelles.themeClair}
            </span>
            {theme === 'sombre' ? (
              <Moon aria-hidden="true" size={18} />
            ) : (
              <Sun aria-hidden="true" size={18} />
            )}
          </button>
        </PanneauB>

        <PanneauB
          titre={profil.photo.src.split('/').pop()}
          boot={5}
          className="lg:col-span-4"
          corpsClassName="flex items-center gap-5 p-6"
        >
          <img
            src={profil.photo.src}
            fetchPriority="high"
            alt={profil.photo.alt}
            width={112}
            height={112}
            className="border-line size-28 shrink-0 border object-cover grayscale"
          />
          <div className="meta text-muted grid gap-1">
            <p className="text-fg">
              {profil.prenom} {profil.nom}
            </p>
            <p>{profil.rolesTyping[1]}</p>
          </div>
        </PanneauB>
      </div>
    </section>
  )
}
