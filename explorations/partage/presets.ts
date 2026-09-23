import { motionA } from '../a/motion'
import { motionB } from '../b/motion'
import { motionC } from '../c/motion'
import { motionD } from '../d/motion'
import type { PisteId, PresetMotion } from './types'

export const PRESETS_MOTION: Record<PisteId, PresetMotion> = {
  a: motionA,
  b: motionB,
  c: motionC,
  d: motionD,
}
