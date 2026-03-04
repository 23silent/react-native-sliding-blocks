import { Observable, Subscription } from 'rxjs'
import { map, shareReplay } from 'rxjs/operators'

import { nop } from './nop'

export const mapToVoid =
  () =>
  <T>(source$: Observable<T>) =>
    source$.pipe(map(nop))

export const shareReplayLast =
  () =>
  <T>(source$: Observable<T>) =>
    source$.pipe(shareReplay({ bufferSize: 1, refCount: true }))

export class DisposeBag {
  private subscriptions: Subscription[] = []

  add(sub: Subscription) {
    this.subscriptions.push(sub)
  }

  addMany(subs: Subscription[]) {
    this.subscriptions = [...this.subscriptions, ...subs]
  }

  dispose() {
    this.subscriptions.forEach(sub => sub.unsubscribe())
    this.subscriptions = []
  }
}

export const BinderHook = (subs: Subscription[] = []) => ({
  bindAction: <T>(value$: Observable<T>, action: (value: T) => void) =>
    BinderHook([...subs, value$.subscribe(action)]),
  disposeBy: (disposeBag: DisposeBag) => disposeBag.addMany(subs)
})
