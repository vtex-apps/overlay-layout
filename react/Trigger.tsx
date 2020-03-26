import {
  useResponsiveValue,
  MaybeResponsiveInput,
} from 'vtex.responsive-values'
import classnames from 'classnames'
import { useCssHandles } from 'vtex.css-handles'
import React, { useEffect, useRef } from 'react'

import {
  usePopoverState,
  usePopoverDispatch,
  PopoverContextProvider,
} from './PopoverContext'

const CSS_HANDLES = ['trigger']

export type TriggerMode = 'click' | 'hover'

interface Props {
  children: React.ReactNode
  trigger?: MaybeResponsiveInput<TriggerMode>
}

export type TriggerElement = HTMLDivElement & HTMLButtonElement

function Trigger(props: Props) {
  const { children, trigger: triggerProp = 'click' } = props
  const trigger = useResponsiveValue(triggerProp)
  const dispatch = usePopoverDispatch()
  const { open } = usePopoverState()
  const containerRef = useRef<TriggerElement>(null)
  const handles = useCssHandles(CSS_HANDLES)
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
    dispatch({ type: 'OPEN_POPOVER' })
  }

  const handleClick = (e: React.MouseEvent<TriggerElement>) => {
    if (trigger !== 'click') {
      return
    }
    // This is needed to block some parent element to use this event
    // to do some action (like open a Modal or change the url).
    // If you click in the Trigger you want to open the trigger only
    // nothing else.
    e.stopPropagation()
    e.preventDefault()

    if (open) {
      dispatch({ type: 'CLOSE_POPOVER' })
    } else {
      dispatch({ type: 'OPEN_POPOVER' })
    }
  }

  const handleMouseEnter =
    trigger === 'hover'
      ? () => {
          dispatch({ type: 'OPEN_POPOVER' })
        }
      : undefined

  const handleMouseLeave =
    trigger === 'hover'
      ? () => {
          dispatch({ type: 'CLOSE_POPOVER' })
        }
      : undefined

  const containerClasses = classnames(
    handles.trigger,
    'outline-0 bg-transparent bn pa0 dib',
    {
      pointer: trigger === 'click',
    }
  )

  return (
    <div
      role={role}
      tabIndex={0}
      ref={containerRef}
      onClick={handleClick}
      onKeyDown={handleKeydown}
      className={containerClasses}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  )
}

export default function EnhancedTrigger(props: Props) {
  return (
    <PopoverContextProvider>
      <Trigger {...props} />
    </PopoverContextProvider>
  )
}
