import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { realisations } from '@/content'
import { ancreFiche, realisationsMisesEnAvant } from '../partage/donnees'
import { useMotionPreset, variantsEntree, variantsGroupe } from '../partage/MotionPresetContext'
import { MetaRealisationC } from './MetaRealisationC'

const { section, libelles } = realisations

/** Aperçu des réalisations comme un sommaire de revue : un article principal, puis les autres. */
export function RealisationsC() {
  const { preset } = useMotionPreset()
  const entree = variantsEntree(preset)
  const [principale, ...autres] = realisationsMisesEnAvant

  return (
    <section id={section.ancre} className="px-5 py-24 md:px-[8vw] md:py-32">
      <motion.header
        variants={entree}
        initial="cache"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        className="max-w-[46rem]"
      >
        <h2 className="titre text-h2">{section.titre}</h2>
        {section.sousTitre && <p className="text-body text-muted mt-4">{section.sousTitre}</p>}
      </motion.header>

      {principale && (
        <motion.article
          variants={entree}
          initial="cache"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="border-fg mt-16 max-w-[52rem] border-t pt-8"
        >
          <MetaRealisationC realisation={principale} />
          <h3 className="titre text-h2 mt-3">{principale.titre}</h3>
          <p className="text-lead mt-4 max-w-[62ch]">{principale.resume}</p>
          <a
            href={`#${ancreFiche(principale.id)}`}
            className="font-ui text-ui fort text-accent transition-ui mt-6 inline-flex items-center gap-2 underline decoration-1 underline-offset-[6px] hover:decoration-2"
          >
            {libelles.voirFiche}
            <ArrowRight aria-hidden="true" size={18} />
          </a>
        </motion.article>
      )}

      <motion.ul
        variants={variantsGroupe(preset)}
        initial="cache"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="mt-16 grid max-w-[76rem] gap-x-14 gap-y-12 md:grid-cols-2"
      >
        {autres.map((realisation) => (
          <motion.li key={realisation.id} variants={entree} className="border-rule border-t pt-6">
            <MetaRealisationC realisation={realisation} />
            <h3 className="titre text-h3 mt-2">{realisation.titre}</h3>
            <p className="text-body text-muted mt-3">{realisation.resume}</p>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  )
}
