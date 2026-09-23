import { motion } from 'motion/react'
import { useMotionPreset } from '../partage/MotionPresetContext'

type Props = { numero: string; className?: string }

/** Arrêt posé sur la ligne principale : disque à anneau épais, numéro de station au centre. */
export function StationD({ numero, className = '' }: Props) {
  const { preset } = useMotionPreset()
  return (
    <motion.span
      aria-hidden="true"
      initial={{ scale: 0.4, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={preset.ressort}
      className={`border-fg bg-surface font-display text-ui fort text-fg absolute left-[calc(var(--ligne)-var(--gouttiere))] grid size-11 -translate-x-1/2 place-items-center rounded-full border-[5px] md:size-14 ${className}`}
    >
      {numero}
    </motion.span>
  )
}
