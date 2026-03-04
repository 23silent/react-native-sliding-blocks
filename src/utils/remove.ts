import { COLUMNS_COUNT } from '../consts'
import { PathSegment } from '../types'

export const remove = (
  input: PathSegment[][]
): {
  data: PathSegment[][]
  toRemove: PathSegment[][]
  hasChanges: boolean
} => {
  // Initial check for fulfilled rows using original input
  const fulfilledRows = input.map(row => {
    const sum = row.reduce((acc, item) => acc + (item.end - item.start), 0)
    return sum === COLUMNS_COUNT
  })

  // Early exit if no fulfilled rows
  if (!fulfilledRows.some(Boolean)) {
    return {
      data: input,
      toRemove: [],
      hasChanges: false
    }
  }

  // Proceed with sorting only if needed
  const sortedRows = input.map(row =>
    [...row].sort((a, b) => a.start - b.start)
  )

  const removeSet: Set<string>[] = sortedRows.map(() => new Set())
  const superSegments: Array<{ rowIndex: number; item: PathSegment }> = []

  // Mark fulfilled rows and collect super segments
  sortedRows.forEach((row, rowIndex) => {
    if (fulfilledRows[rowIndex]) {
      row.forEach(item => removeSet[rowIndex].add(item.id))
      row.forEach(item => {
        if (item.super) superSegments.push({ rowIndex, item })
      })
    }
  })

  // Process super segments
  superSegments.forEach(({ rowIndex, item }) => {
    const checkAdjacentRow = (adjRowIndex: number) => {
      if (adjRowIndex < 0 || adjRowIndex >= sortedRows.length) return
      const adjRow = sortedRows[adjRowIndex]
      const overlapEnd = item.end

      // Binary search for first segment with start >= overlapEnd
      let left = 0,
        right = adjRow.length
      while (left < right) {
        const mid = (left + right) >> 1
        adjRow[mid].start < overlapEnd ? (left = mid + 1) : (right = mid)
      }

      // Check overlapping segments
      for (let i = 0; i < left; i++) {
        const adjItem = adjRow[i]
        if (adjItem.end > item.start) {
          removeSet[adjRowIndex].add(adjItem.id)
        }
      }
    }

    checkAdjacentRow(rowIndex - 1) // Previous row
    checkAdjacentRow(rowIndex + 1) // Next row
  })

  // Build results
  const toUpdate: PathSegment[][] = []
  const toRemove: PathSegment[][] = []
  sortedRows.forEach((row, rowIndex) => {
    const remaining = row.filter(item => !removeSet[rowIndex].has(item.id))
    const removed = row.filter(item => removeSet[rowIndex].has(item.id))
    toUpdate.push(remaining)
    toRemove.push(removed)
  })

  return { data: toUpdate, toRemove, hasChanges: true }
}
