/**
 * Precomputed presets for explosion particles.
 * All values are plain data for worklet compatibility.
 */

const PARTICLE_COUNT = 18

/** Seeded pseudo-random for deterministic presets */
function seeded(seed: number): () => number {
  return () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
}

export type TrajectoryParticle = {
  angle: number
  distMult: number
  speedCurve: number
  /** Multiplier for jump arc (up then down); varies per particle */
  arcMult: number
}

export type ShapeParticle = {
  shape: 0 | 1 | 2 | 3
  sizeMult: number
  rotation: number
}

const TRAJECTORY_PRESET_COUNT = 8
const SHAPE_PRESET_COUNT = 8

function buildTrajectoryPreset(seedBase: number): TrajectoryParticle[] {
  const r = seeded(seedBase)
  const particles: TrajectoryParticle[] = []
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const angle = r() * Math.PI * 2
    const distMult = 0.6 + r() * 0.8
    const speedCurve = 0.7 + r() * 0.6
    const arcMult = 0.4 + r() * 1.2
    particles.push({ angle, distMult, speedCurve, arcMult })
  }
  return particles
}

function buildShapePreset(seedBase: number): ShapeParticle[] {
  const r = seeded(seedBase)
  const particles: ShapeParticle[] = []
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const shape = Math.floor(r() * 4) as 0 | 1 | 2 | 3
    const sizeMult = 0.5 + r() * 1.2
    const rotation = r() * Math.PI * 2
    particles.push({ shape, sizeMult, rotation })
  }
  return particles
}

export const TRAJECTORY_PRESETS: TrajectoryParticle[][] = Array.from(
  { length: TRAJECTORY_PRESET_COUNT },
  (_, i) => buildTrajectoryPreset(1000 + i * 7919)
)

export const SHAPE_PRESETS: ShapeParticle[][] = Array.from(
  { length: SHAPE_PRESET_COUNT },
  (_, i) => buildShapePreset(2000 + i * 7919)
)

export const EXPLOSION_PRESET_COUNT = Math.max(
  TRAJECTORY_PRESET_COUNT,
  SHAPE_PRESET_COUNT
)

export { PARTICLE_COUNT }
