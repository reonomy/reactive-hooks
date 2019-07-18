import { Observable } from 'rxjs/internal/Observable';
import { useMemo } from 'react';
import { MutableObserver } from './mutable-observer';
import { useRx } from './use-rx';

/**
 * `useRxEffect`
 *
 * Use this hook when you need to react on observable changes.
 *
 * Example:
 * useRxEffect(name$, (newName) => console.log(newName))
 *
 * This code will print a name in the console on every emit of the observable name$.
 *
 * @param observable$
 * @param next
 */
export function useRxEffect<T>(observable$: Observable<T>, next: (value: T) => void): void {
  const observer: MutableObserver<T> = useMemo(() => new MutableObserver(), [observable$]);
  observer.setNext(next);
  useRx(observable$, observer);
}
