import {
  useResponsiveValue,
  MaybeResponsiveInput,
} from 'vtex.responsive-values'
import React, { useEffect, useRef } from 'react'

import {
  useOverlayState,
  useOverlayDispatch,
  OverlayContextProvider,
} from './OverlayContext'
import useForkRef from './modules/useForkRef'

export type TriggerMode = 'click' | 'hover'

interface Props<H extends HTMLElement>
  extends React.DetailedHTMLProps<React.HTMLAttributes<H>, H> {
  children: React.ReactElement
  trigger?: MaybeResponsiveInput<TriggerMode>
}

const BaseTrigger = React.forwardRef(function BaseTrigger(
  props: Props<HTMLElement>,
  ref
) {
  const {
    onClick,
    children,
    onMouseEnter,
    onMouseLeave,
    trigger: triggerProp = 'click',
    ...rest
  } = props
  const trigger = useResponsiveValue(triggerProp)
  const dispatch = useOverlayDispatch()
  const { open } = useOverlayState()
  const containerRef = useRef<HTMLElement>(null)
  const handleRef = useForkRef(containerRef, ref)
  const role = trigger === 'click' ? 'button' : undefined

  useEffect(() => {
    dispatch({
      type: 'SET_CONTAINER_REF',
      payload: { containerRef },
    })
  }, [dispatch, containerRef])

  useEffect(() => {
    dispatch({
      type: 'SET_TRIGGER_MODE',
      payload: { triggerMode: trigger },
    })
  }, [dispatch, trigger])

  const handleKeydown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key !== 'Enter' || trigger !== 'click') {
      return
    }

    e.stopPropagation()
    dispatch({ type: 'OPEN_OVERLAY' })
  }

  const handleClick: React.MouseEventHandler<HTMLElement> = e => {
    if (trigger === 'click') {
      // This is needed to block some parent element to use this event
      // to do some action (like open a Modal or change the url).
      // If you click in the Trigger you want to open the trigger only
      // nothing else.
      e.stopPropagation()
      e.preventDefault()

      if (open) {
        dispatch({ type: 'CLOSE_OVERLAY' })
      } else {
        dispatch({ type: 'OPEN_OVERLAY' })
      }
    }

    if (onClick) {
      onClick(e)
    }
  }

  const handleMouseEnter: React.MouseEventHandler<HTMLElement> = e => {
    if (trigger === 'hover') {
      dispatch({ type: 'OPEN_OVERLAY' })
    }
    if (onMouseEnter) {
      onMouseEnter(e)
    }
  }

  const handleMouseLeave: React.MouseEventHandler<HTMLElement> = e => {
    if (trigger === 'hover') {
      dispatch({ type: 'CLOSE_OVERLAY' })
    }

    if (onMouseLeave) {
      onMouseLeave(e)
    }
  }

  return (
    <>
      {React.cloneElement(children, {
        role,
        ref: handleRef,
        onClick: handleClick,
        onKeyDown: handleKeydown,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        ...rest,
      })}
    </>
  )
})

const EnhancedTrigger = React.forwardRef(function EnhancedTrigger(
  props: Props<HTMLElement>,
  ref
) {
  return (
    <OverlayContextProvider>
      <BaseTrigger {...props} ref={ref} />
    </OverlayContextProvider>
  )
})

export default EnhancedTrigger
