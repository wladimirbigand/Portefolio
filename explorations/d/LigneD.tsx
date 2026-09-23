import { motion, useScroll, useSpring } from 'motion/react'
import { useMotionPreset } from '../partage/MotionPresetContext'

/**
 * La ligne du réseau, qui sert aussi de barre de progression du scroll : le tracé plein avance
 * avec la lecture. En mouvement réduit, la ligne est pleine et statique (voir BarreReduiteD).
 */
export function LigneD() {
  const { preset, reduit } = useMotionPreset()
  const { scrollYProgress } = useScroll()
  const ressort =
    preset.trace.type === 'spring'
      ? {
          stiffness: preset.trace.stiffness ?? 90,
          damping: preset.trace.damping ?? 24,
          restDelta: 0.001,
        }
      : { stiffness: 2000, damping: 200 }
  const progression = useSpring(scrollYProgress, ressort)

  return (
    <div
      aria-hidden="true"
      className="bg-rule absolute top-0 bottom-0 left-(--ligne) w-2 -translate-x-1/2 rounded-full"
    >
      <motion.div
        className="bg-accent-fill absolute inset-0 origin-top rounded-full"
        style={{ scaleY: reduit ? 1 : progression }}
      />
    </div>
  )
}
