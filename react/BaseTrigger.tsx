import React, { useEffect, useRef } from 'react'
import {
  useResponsiveValue,
  MaybeResponsiveInput,
} from 'vtex.responsive-values'
import classnames from 'classnames'
import { useCssHandles } from 'vtex.css-handles'

import {
  useOverlayState,
  useOverlayDispatch,
  OverlayContextProvider,
} from './OverlayContext'
import useForkRef from './modules/useForkRef'

export type TriggerMode = 'click' | 'hover' | 'none'

type TriggerElement = HTMLDivElement & HTMLLIElement

interface Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<TriggerElement>,
    TriggerElement
  > {
  children: React.ReactElement
  tag?: 'div' | 'li'
  trigger?: MaybeResponsiveInput<TriggerMode>
}

const CSS_HANDLES = ['trigger'] as const

const BaseTrigger = React.forwardRef(function BaseTrigger(
  props: Props,
  ref: React.Ref<TriggerElement>
) {
  const {
    onClick,
    children,
    onMouseEnter,
    onMouseLeave,
    tag: Tag = 'div',
    className: classNameProp,
    trigger: triggerProp = 'click',
    ...rest
  } = props
  const trigger = useResponsiveValue(triggerProp)
  const dispatch = useOverlayDispatch()
  const { open } = useOverlayState()
  const handles = useCssHandles(CSS_HANDLES)
  const containerRef = useRef<TriggerElement>(null)
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

  const handleKeydown = (e: React.KeyboardEvent<TriggerElement>) => {
    if (e.key !== 'Enter' || trigger !== 'click') {
      return
    }

    e.stopPropagation()
    dispatch({ type: 'OPEN_OVERLAY' })
  }

  const handleClick: React.MouseEventHandler<TriggerElement> = e => {
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
  const handleMouseEnter: React.MouseEventHandler<TriggerElement> = e => {
    if (trigger === 'hover') {
      dispatch({ type: 'OPEN_OVERLAY' })
    }

    if (onMouseEnter) {
      onMouseEnter(e)
    }
  }

  const handleMouseLeave: React.MouseEventHandler<TriggerElement> = e => {
    if (trigger === 'hover') {
      dispatch({ type: 'CLOSE_OVERLAY' })
    }

    if (onMouseLeave) {
      onMouseLeave(e)
    }
  }

  const className = classnames(handles.trigger, classNameProp)

  return (
    <Tag
      role={role}
      ref={handleRef}
      className={className}
      onClick={handleClick}
      onKeyDown={handleKeydown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...rest}
    >
      {children}
    </Tag>
  )
})

const EnhancedTrigger = React.forwardRef(function EnhancedTrigger(
  props: Props,
  ref: React.Ref<TriggerElement>
) {
  return (
    <OverlayContextProvider>
      <BaseTrigger {...props} ref={ref} />
    </OverlayContextProvider>
  )
})

export default EnhancedTrigger
