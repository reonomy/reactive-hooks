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
export function hasNext<T>(
  subject$: Observable<T> | Subject<T> | BehaviorSubject<T>
): subject$ is Subject<T> | BehaviorSubject<T> {
  return typeof (subject$ as Subject<T>).next !== 'undefined';
}

/**
 * Gets initial value if the root observable is a behavior subject (as this will emit synchronously)
 * @param observable$
 */

// since we don't know what initial observable value is
// we use a unique object pointer to indicate "no initial value" with certainty
export const UNSET_VALUE = {};

export function initialObservableValue<T>(observable$: Observable<T>): T | {} {
  let initialValue: T | {} = UNSET_VALUE;

  observable$
    .subscribe(val => {
      initialValue = val;
    })
    .unsubscribe();

  return initialValue;
}

interface RxConfig<V, S> {
  isSubject: boolean;
  initVal: V;
  hadInitVal: boolean;
  isNext: boolean;
  nextValue?: (value?: V) => void;
  observer: MutableObserver<S>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createRxConfig<S extends Observable<any> | Subject<any> | BehaviorSubject<any>>(
  subject$: S
): RxConfig<any, S> {
  const initVal = initialObservableValue(subject$);
  const hadInitVal = initVal !== UNSET_VALUE;
  const isSubject = hasNext(subject$);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nextValue = isSubject ? (subject$ as Subject<any>).next.bind(subject$) : undefined;

  const observer = new MutableObserver<S>();

  return {
    isSubject,
    initVal,
    hadInitVal,
    isNext: !hadInitVal,
    nextValue,
    observer
  };
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
  const initObj = useMemo(() => createRxConfig(subject$), [subject$]);
  const [value, setValue] = useState(() => (initObj.hadInitVal ? initObj.initVal : undefined));

  initObj.observer.setNext(nextValue => {
    if (initObj.isNext) {
      setValue(nextValue);
    } else {
      initObj.isNext = true;
      delete initObj.initVal; // eliminate reference after using
    }
  });

  useRx(subject$, initObj.observer);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return [value, initObj.nextValue] as any;
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
  const next = useMemo(() => subject$.next.bind(subject$), [subject$]);
  return next;
}
