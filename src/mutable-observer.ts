import { NextObserver } from 'rxjs/internal/types';

export class MutableObserver<T> implements NextObserver<T> {
  private nextCallback: (value: T) => void = () => {};

  public setNext(next: (value: T) => void) {
    this.nextCallback = next;
  }

  public next(value: T) {
    return this.nextCallback(value);
  }
}
