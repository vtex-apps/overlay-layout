import React, { useMemo } from 'react'
import { Placement as PopperPlacement } from '@popperjs/core'

import BaseOverlay from './BaseOverlay'

type TransitionComponentType = 'fade'

interface Offsets {
  distance: number
  skidding: number
}

interface Props {
  role?: string
  showArrow?: boolean
  children: React.ReactNode
  offsets?: Partial<Offsets>
  placement?: PopperPlacement
  backdrop?: 'visible' | 'none'
  scrollBehavior?: 'lock-page-scroll' | 'close-on-scroll' | 'default'
  transitionComponent: TransitionComponentType
}

export default function OverlayLayout(props: Props) {
  const classes = useMemo(
    () => ({
      arrow: 'c-on-base--inverted',
      backdrop: 'bg-base--inverted',
      container: 'outline-0 pv2 bg-base br bl bb bt b--muted-4 br2 w-100',
    }),
    []
  )
  return <BaseOverlay {...props} classes={classes} />
}
