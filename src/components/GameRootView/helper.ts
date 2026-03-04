import { KEYS_SIZE } from '../../consts'
import { PathSegmentExt, TaskQueueItem } from '../../types'
import { rowsToItemsMap } from '../../utils/transform'

export const prepareTasks = (
  tasks: TaskQueueItem[],
  prevState: {
    [x: string]: PathSegmentExt | undefined
  },
  prevOverwriteIndex: number
) => {
  let nextOverwriteIndex = prevOverwriteIndex

  let ps = prevState

  const newState = []

  for (let index = 0; index < tasks.length; index++) {
    const { rows, rowsToRemove, step } = tasks[index]

    let score = 0

    const itemsMap = rowsToItemsMap(rows)

    if (rowsToRemove?.length) {
      const toRemove = rowsToRemove?.flat() || []

      // Update score and combo
      if (toRemove?.length > 0) {
        score = toRemove.reduce((acc, item) => acc + item.end - item.start, 0)
      }
      const removalMap = rowsToItemsMap(rowsToRemove, true)
      Object.assign(itemsMap, removalMap)
    }

    const newItems = { ...ps }
    const idToKey = new Map<string, string>()
    const orderedKeys = Object.keys(newItems).sort(
      (a, b) => parseInt(a) - parseInt(b)
    )

    for (const [key, item] of Object.entries(newItems)) {
      if (item) {
        idToKey.set(item.id, key)
      }
    }

    let currentIndex = nextOverwriteIndex

    // itemsMap is always a Record from rowsToItemsMap; assign items to slot keys
    for (const item of Object.values(itemsMap)) {
      const existingKey = idToKey.get(item.id)
      if (existingKey) {
        newItems[existingKey] = item
        continue
      }

      let inserted = false
      let checked = 0

      while (checked < KEYS_SIZE) {
        const targetKey = orderedKeys[currentIndex]
        if (!newItems[targetKey]) {
          newItems[targetKey] = item
          idToKey.set(item.id, targetKey)
          inserted = true
          break
        }

        currentIndex = (currentIndex + 1) % KEYS_SIZE
        checked++
      }

      if (!inserted) {
        const fallbackKey = orderedKeys[nextOverwriteIndex]
        newItems[fallbackKey] = item
        idToKey.set(item.id, fallbackKey)
        currentIndex = (nextOverwriteIndex + 1) % KEYS_SIZE
      }
    }

    nextOverwriteIndex = currentIndex

    ps = newItems

    newState.push({
      rows,
      newState: newItems,
      step,
      nextOverwriteIndex,
      score
    })
  }

  return newState
}
