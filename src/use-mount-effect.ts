import { useEffect, useState } from 'react';

/**
 * `useMountEffect`
 *
 * Handles component onMount() in the render function.
 * @param {VoidFunction} onMountCallback - this function will be called only once when the component is mounted.
 */
export function useMountEffect(onMountCallback: VoidFunction) {
  const [wasMounted, setMounted] = useState(false);

  useEffect(() => {
    if (!wasMounted) {
      setMounted(true);
      onMountCallback();
    }
  });
}

export default useMountEffect;
