import { useEffect } from 'react';

export interface Disposable {
  (): (() => void) | void;
}

/**
 * `useMountEffect`
 *
 * Handles component onMount() in the render function.
 * @param {Disposable} onMountCallback - this function will be called only once when the component is mounted.
 */
export function useMountEffect(onMountCallback: Disposable) {
  useEffect(() => onMountCallback(), []);
}

export default useMountEffect;
