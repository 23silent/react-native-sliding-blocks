import { ItemsMap, PathSegment } from '../types'

export const rowsToItemsMap = (
  rows: PathSegment[][],
  removing: boolean = false
): ItemsMap => {
  const items: ItemsMap = {}
  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    const elements = rows[rowIndex]
    for (let itemIndex = 0; itemIndex < elements.length; itemIndex++) {
      const element = elements[itemIndex]
      items[element.id] = { ...element, rowIndex, itemIndex, removing }
    }
  }
  return items
}
