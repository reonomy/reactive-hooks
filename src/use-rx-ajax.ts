import { useState, useMemo } from 'react';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';
import { Http, http } from './http';
import { useRx } from './use-rx';

/**
 * `useRxAjax`
 *
 * Executes data api calls and returns response and request dispatcher.
 * Optionally a callback function can be provided to react on response.
 *
 * Example:
 * const [response, dispatch] = useRxAjax(api.getSomething);
 *
 * @param api$ - Data API callback `(req: Req) => Observable<Res>`.
 * @param next - (optional) callback to be called when Response status is changed.
 */
export function useRxAjax<Req, Res>(
  api$: (req: Req) => Observable<Res>,
  next?: (response: Http<Req, Res>) => void
): [Http<Req, Res> | undefined, (req: Req) => void] {
  const [req$] = useState(() => new Subject<Req>());
  const res$ = useMemo(() => req$.pipe(http(api$)), [req$]);
  const [res, setRes] = useState<Http<Req, Res>>();
  useRx(res$, {
    next(nextRes) {
      setRes(nextRes);
      if (next) {
        next(nextRes);
      }
    }
  });
  return [res, req$.next.bind(req$)];
}
