import { useState, useMemo } from 'react';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { useRx } from './use-rx';
import { MutableObserver } from './mutable-observer';

/**
 * Returns `true` if a given observable has a next() method.
 * @param subject$
 */
function hasNext<T>(
  subject$: Observable<T> | Subject<T> | BehaviorSubject<T>
): subject$ is Subject<T> | BehaviorSubject<T> {
  return typeof (subject$ as Subject<T>).next !== 'undefined';
}

/**
 * Returns `true` if a given subject provides current value.
 * @param subject$
 */
function hasValue<T>(subject$: Observable<T> | Subject<T> | BehaviorSubject<T>): subject$ is BehaviorSubject<T> {
  return typeof (subject$ as BehaviorSubject<T>).value !== 'undefined';
}

/**
 * `useRxState`
 *
 * Returns current value and a callback to change it by mutating a given subject.
 * Returns only current value in case of Observable.
 *
 * Example:
 * const [name, setName] = useRxState(name$)
 * where name$ could be new BehaviorSubject('None');
 *
 * setName('Alice') under the hood will call name$.next('Alice')
 *
 * @param subject$
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useRxState<S extends Observable<any> | Subject<any> | BehaviorSubject<any>>(
  subject$: S
): S extends BehaviorSubject<infer T>
  ? [T, (value: T) => void]
  : S extends Subject<infer T>
  ? [T | undefined, (value: T) => void]
  : S extends Observable<infer T>
  ? [T | undefined]
  : never {
  const isSubject = useMemo(() => hasNext(subject$), [subject$]);
  const isBehaviorSubject = useMemo(() => hasValue(subject$), [subject$]);
  const nextObj = useMemo(() => ({ isNext: !isBehaviorSubject }), [subject$]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [value, setValue] = useState(isBehaviorSubject ? (subject$ as BehaviorSubject<any>).value : undefined);

  const observer = useMemo(() => new MutableObserver(), [subject$]);
  observer.setNext(nextValue => {
    if (nextObj.isNext) {
      setValue(nextValue);
    } else {
      nextObj.isNext = true;
    }
  });

  useRx(subject$, observer);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nextValue = isSubject ? (subject$ as Subject<any>).next.bind(subject$) : undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return [value, nextValue] as any;
}

/**
 * `useRxStateResult`
 *
 * For a given observable returns a current value.
 *
 * Example:
 * const name = useRxStateResult(name$)
 *
 * @param observable$
 */
export function useRxStateResult<T>(observable$: Observable<T>): T | undefined {
  const [value] = useRxState(observable$);
  return value;
}

/**
 * `useRxStateAction`
 *
 * For a given subject returns a set function.
 *
 * Example:
 * const setName = useRxStateResult(name$);
 */
export function useRxStateAction<T>(subject$: Subject<T>): (value: T) => void {
  return subject$.next.bind(subject$);
}