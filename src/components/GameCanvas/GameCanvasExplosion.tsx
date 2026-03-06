import { Group, Picture, Skia } from '@shopify/react-native-skia'
import React, { memo, useMemo } from 'react'
import { useDerivedValue } from 'react-native-reanimated'

import type { ExplosionPoolSlotSharedValues } from '../../engine/useSharedValuesMap'

import {
  EXPLOSION_PRESET_COUNT,
  PARTICLE_COUNT,
  SHAPE_PRESETS,
  TRAJECTORY_PRESETS
} from './explosionPresets'

const EXPLOSION_RADIUS = 120
const BASE_PARTICLE_SIZE = 18
const RISE_HEIGHT = 55
const FALL_DISTANCE = 200
const PICTURE_SIZE = 450
const CENTER = PICTURE_SIZE / 2

type Props = {
  slot: ExplosionPoolSlotSharedValues
  slotIndex: number
}

/**
 * Renders a particle explosion from a pool slot.
 * Block-breaking effect: small debris bursts up briefly, then falls to the bottom.
 * Each cell of a multi-cell block gets its own explosion (triggered per-cell in engine bridge).
 */
export const GameCanvasExplosion = memo(function GameCanvasExplosion({
  slot,
  slotIndex
}: Props): React.JSX.Element {
  const paint = useMemo(() => Skia.Paint(), [])
  const recorder = useMemo(() => Skia.PictureRecorder(), [])

  const picture = useDerivedValue(() => {
    'worklet'
    const progress = slot.progress.value
    const canvas = recorder.beginRecording(
      Skia.XYWHRect(0, 0, PICTURE_SIZE, PICTURE_SIZE)
    )

    if (progress > 0) {
      const trajPreset =
        TRAJECTORY_PRESETS[slotIndex % TRAJECTORY_PRESETS.length]
      const shapePreset = SHAPE_PRESETS[slotIndex % SHAPE_PRESETS.length]
      const color = slot.color.value

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const traj = trajPreset[i] ?? trajPreset[0]
        const shape = shapePreset[i] ?? shapePreset[0]

        const easedProgress = 1 - Math.pow(1 - progress, traj.speedCurve)
        const distance = easedProgress * EXPLOSION_RADIUS * traj.distMult
        const cx = CENTER + Math.cos(traj.angle) * distance
        const baseCy = CENTER + Math.sin(traj.angle) * distance
        const rise = -Math.sin(progress * Math.PI) * RISE_HEIGHT * traj.arcMult
        const fall = progress * progress * FALL_DISTANCE * traj.arcMult
        const cy = baseCy + rise + fall

        const alpha = (1 - progress) * 0.92
        const sizeScale = Math.pow(progress, 0.6) * (1 - progress * 0.4)
        const size = BASE_PARTICLE_SIZE * shape.sizeMult * sizeScale

        paint.setColor(Skia.Color(color))
        paint.setAlphaf(alpha)

        const half = size / 2
        const rect = Skia.XYWHRect(cx - half, cy - half, size, size)

        if (shape.shape === 0) {
          canvas.drawCircle(cx, cy, size / 2, paint)
        } else if (shape.shape === 1) {
          canvas.drawRect(rect, paint)
        } else if (shape.shape === 2) {
          const rrect = Skia.RRectXY(rect, size * 0.3, size * 0.3)
          canvas.drawRRect(rrect, paint)
        } else {
          const path = Skia.Path.Make()
          const r = size / 2
          for (let v = 0; v < 4; v++) {
            const a = (v / 4) * Math.PI * 2 + shape.rotation
            const px = cx + Math.cos(a) * r
            const py = cy + Math.sin(a) * r
            if (v === 0) path.moveTo(px, py)
            else path.lineTo(px, py)
          }
          path.close()
          canvas.drawPath(path, paint)
        }
      }
    }

    return recorder.finishRecordingAsPicture()
  }, [slot, slotIndex, recorder, paint])

  const transform = useDerivedValue(
    () => [
      { translateX: slot.centerX.value - CENTER },
      { translateY: slot.centerY.value - CENTER }
    ],
    [slot]
  )

  const opacity = useDerivedValue(
    () => (slot.progress.value > 0 ? 1 : 0),
    [slot]
  )

  return (
    <Group transform={transform} opacity={opacity}>
      <Picture picture={picture} />
    </Group>
  )
})
