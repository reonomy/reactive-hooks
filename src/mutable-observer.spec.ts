import { MutableObserver } from './mutable-observer';

describe('MutableObserver', () => {
  it('should mutate "next"', () => {
    const mo = new MutableObserver<string>();

    const next1 = jest.fn();
    mo.setNext(next1);
    mo.next('Alice');
    expect(next1).toHaveBeenCalledWith('Alice');

    const next2 = jest.fn();
    mo.setNext(next2);
    mo.next('Bob');
    expect(next2).toHaveBeenCalledWith('Bob');

    expect(next1).toHaveBeenCalledTimes(1);
    expect(next2).toHaveBeenCalledTimes(1);
  });
});
