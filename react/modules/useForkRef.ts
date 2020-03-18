import { useMemo } from 'react'

import setRef from './setRef'

export default function useForkRef<T>(
  refA: React.Ref<T> | ((instance: T | null) => void) | null | undefined,
  refB: React.Ref<T> | ((instance: T | null) => void) | null | undefined
): React.Ref<T> {
  return useMemo(() => {
    if (!refA && !refB) {
      return null
    }

    return refValue => {
      setRef(refA, refValue)
      setRef(refB, refValue)
    }
  }, [refA, refB])
}
