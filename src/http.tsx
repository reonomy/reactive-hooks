import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { OperatorFunction } from 'rxjs/internal/types';
import { switchMap, map, catchError, startWith, take } from 'rxjs/operators';

export type Status = 'succeeded' | 'failed' | 'pending';

export interface Http<Req, Res> {
  status: Status;
  req: Req;
  res?: Res;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any;
}

/**
 * Wraps ajax calls with a status: pending, succeeded or failed.
 * This pipe function is based on switch map, so all previous requests
 * in pending state will be cancelled by emitting a new one.
 *
 * Returned data holds information about status, response and initial request.
 *
 * @param withAjax - transformation function from Request to Observable Response.
 */
export function http<Req, Res>(withAjax: (req: Req) => Observable<Res>): OperatorFunction<Req, Http<Req, Res>> {
  return switchMap((req: Req) =>
    withAjax(req).pipe(
      map(res => ({
        status: 'succeeded' as Status,
        req,
        res
      })),
      startWith({
        status: 'pending' as Status,
        req
      }),
      catchError(res =>
        of({
          status: 'failed' as Status,
          req,
          res,
          error: res.xhr.response
        })
      ),
      // pending + succeeded/failed
      take(2)
    )
  );
}
