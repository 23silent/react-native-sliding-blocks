import {
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  pairwise,
  startWith,
  Subject
} from 'rxjs'

import { CELL_SIZE, ROWS_COUNT } from '../../consts'
import { nop } from '../../utils/nop'
import { RootViewModel } from '../GameRootView/viewModel'

type StateValue = {
  yValue: number
  xValue: number
  opacityValue: number
  widthValue: number
  colorValue: string
}

const initialStateValue: StateValue = {
  yValue: ROWS_COUNT * CELL_SIZE,
  xValue: -1 * CELL_SIZE,
  opacityValue: 0,
  widthValue: 0,
  colorValue: '#fff'
}

export class ItemViewModel {
  private readonly gestureX$ = new Subject<number>()

  readonly state$: Observable<StateValue>
  readonly removeTrigger$: Observable<void>
  readonly isActive$: Observable<boolean>

  constructor(
    private itemKey: string,
    private readonly rootViewModel: RootViewModel
  ) {
    const item$ = this.rootViewModel.onChangeItems$.pipe(
      map(items => items[itemKey]),
      distinctUntilChanged(),
      startWith(undefined)
    )

    this.isActive$ = combineLatest([
      this.rootViewModel.activeItem$,
      item$
    ]).pipe(
      map(
        ([activeItem, item]) =>
          !!activeItem && !!item && activeItem?.id === item?.id
      )
    )

    this.removeTrigger$ = item$.pipe(
      pairwise(),
      filter(([prev, next]) => !prev?.removing && !!next?.removing),
      map(nop)
    )

    this.state$ = item$.pipe(
      filter(item => !item?.removing),
      map(item =>
        item
          ? {
              yValue: item.rowIndex * CELL_SIZE,
              xValue: item.start * CELL_SIZE,
              widthValue: (item.end - item.start) * CELL_SIZE,
              opacityValue: 0.8,
              colorValue: item.color
            }
          : initialStateValue
      )
    )
  }

  removeItem = (): void => {
    this.rootViewModel.removeItem(this.itemKey)
  }
}
