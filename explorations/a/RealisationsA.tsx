import { motion } from 'motion/react'
import { realisations } from '@/content'
import { numeroSectionFormate } from '@/lib/sections'
import { realisationsMisesEnAvant } from '../partage/donnees'
import { CarteA } from './CarteA'
import { useMotionPreset, variantsEntree, variantsGroupe } from '../partage/MotionPresetContext'

const { section } = realisations

/** Emplacements du bento : 5 cellules exactement (1 grande + 2 empilées + 2 larges). */
const CELLULES = [
  'md:col-span-4 md:row-span-2',
  'md:col-span-2',
  'md:col-span-2',
  'md:col-span-3',
  'md:col-span-3',
] as const

/** Aperçu des réalisations mises en avant : grille bento asymétrique. */
export function RealisationsA() {
  const { preset } = useMotionPreset()
  const entree = variantsEntree(preset)
  return (
    <section id={section.ancre} className="mx-auto max-w-[1200px] px-5 py-24 md:px-10">
      <motion.header
        variants={entree}
        initial="cache"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        className="max-w-[62ch]"
      >
        <p className="meta text-muted flex gap-3">
          <span className="font-code">{numeroSectionFormate(section.ancre)}</span>
          <span>{section.label}</span>
        </p>
        <h2 className="titre text-h2 mt-3">{section.titre}</h2>
        {section.sousTitre && <p className="text-body text-muted mt-4">{section.sousTitre}</p>}
      </motion.header>

      <motion.ul
        variants={variantsGroupe(preset)}
        initial="cache"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="mt-12 grid auto-rows-[minmax(15rem,auto)] gap-3 md:grid-cols-6"
      >
        {realisationsMisesEnAvant.map((realisation, index) => {
          const principale = index === 0
          return (
            <motion.li
              key={realisation.id}
              variants={entree}
              className={`transition-ui flex flex-col rounded-xl border p-6 shadow-[inset_0_1px_0_var(--c-surface-2)] md:p-7 ${
                CELLULES[index] ?? 'md:col-span-3'
              } ${principale ? 'border-line bg-accent-soft' : 'border-rule bg-surface hover:bg-surface-2'}`}
            >
              <CarteA realisation={realisation} principale={principale} />
            </motion.li>
          )
        })}
      </motion.ul>
    </section>
  )
}
