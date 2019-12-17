import { useState, useMemo } from 'react';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';
import { Http, http } from './http';
import { useRxEffect } from './use-rx-effect';

function useReqRes<Req, Res>(api$: (req: Req) => Observable<Res>): [Observable<Http<Req, Res>>, (value?: Req) => void] {
  const req$ = new Subject<Req>();
  const res$ = req$.pipe(http(api$));
  return [res$, req$.next.bind(req$)];
}

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
  const [res$, submitReq] = useMemo(() => useReqRes(api$), [api$]);
  const [res, setRes] = useState<Http<Req, Res>>();
  useRxEffect(res$, (nextRes: Http<Req, Res>) => {
    setRes(nextRes);
    if (next) {
      next(nextRes);
    }
  });
  return [res, submitReq];
}
