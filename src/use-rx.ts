import { useEffect } from 'react';
import { Observable } from 'rxjs/internal/Observable';
import { NextObserver } from 'rxjs/internal/types';

let subscriptionsCount = 0;
const isDebugMode = /debug$/m.test(window.location.hash);
const printSubscriptionsCount = isDebugMode
  ? // eslint-disable-next-line no-console
    () => console.debug('%c #', 'color: #40bbc6;', subscriptionsCount)
  : () => {};

/**
 * Internal hook that manages subscriptions.
 */
export function useRx<T>(observable$: Observable<T>, observer: NextObserver<T>): void {
  useEffect(() => {
    const subscription = observable$.subscribe(observer);
    subscriptionsCount++;
    printSubscriptionsCount();
    return () => {
      subscription.unsubscribe();
      subscriptionsCount--;
      printSubscriptionsCount();
    };
  }, [observable$]);
}

/**
 * React Debugger for RxJS observables.
 * Subscribes on observable changes and logs all changes in the console.
 *
 * @param observable$
 * @param tag
 */
export function useRxDebug<T>(observable$: Observable<T>, tag: string): void {
  useRx(observable$, {
    next(res) {
      if (isDebugMode) {
        // eslint-disable-next-line no-console
        console.debug('%c %s →', 'color: #40bbc6;', tag, res);
      }
    },
    error(e) {
      if (isDebugMode) {
        // eslint-disable-next-line no-console
        console.debug('%c %s →', 'color: red; font-weight: bold;', tag, e);
      }
    }
  });
}
