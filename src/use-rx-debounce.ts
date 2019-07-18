import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';
import { useMemo } from 'react';
import { debounceTime, switchMap } from 'rxjs/operators';
import { useRxState } from './use-rx-state';
import { useRxEffect } from './use-rx-effect';

export const DEBOUNCE = 500;

/**
 * `useRxDebounce`
 *
 * Applies debounce to a given observable function.
 * Example of usage is autosuggest that debounces http calls when user is typing.
 *
 * @param func$
 * @param next
 */
export function useRxDebounce<In, Out>(
  func$: (input: In) => Observable<Out>,
  next?: (val: Out) => void,
  debounce: number = DEBOUNCE
): [Out | undefined, (input: In) => void] {
  const input$ = useMemo(() => new Subject<In>(), [func$]);
  const output$ = useMemo(
    () =>
      input$.pipe(
        debounceTime(debounce),
        switchMap(input => func$(input))
      ),
    [input$]
  );
  useRxEffect(output$, val => {
    if (next) {
      next(val);
    }
  });
  const [output] = useRxState(output$);
  return [output, input$.next.bind(input$)];
}
