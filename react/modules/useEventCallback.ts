import { useRef, useCallback } from 'react'

import useEnhancedEffect from './useEnhancedEffect'

// https://github.com/facebook/react/issues/14099#issuecomment-440013892
export default function useEventCallback(fn: Function) {
  const ref = useRef(fn)

  useEnhancedEffect(() => {
    ref.current = fn
  })

  return useCallback((...args) => ref.current(...args), [])
}
