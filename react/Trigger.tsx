import classnames from 'classnames'
import { useCssHandles } from 'vtex.css-handles'
import React, { useEffect, useRef } from 'react'

import {
  usePopoverDispatch,
  PopoverContextProvider,
  usePopoverState,
} from './components/PopoverContext'

const CSS_HANDLES = ['trigger']

export type TriggerMode = 'click' | 'hover'

interface Props {
  children: React.ReactNode
  trigger?: TriggerMode
}

export type TriggerElement = HTMLDivElement & HTMLButtonElement

function Trigger(props: Props) {
  const { children, trigger = 'click' } = props
  const dispatch = usePopoverDispatch()
  const { open } = usePopoverState()
  const containerRef = useRef<TriggerElement>(null)
  const handles = useCssHandles(CSS_HANDLES)
  const ContainerTag = trigger === 'click' ? 'button' : 'div'

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

  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      dispatch({ type: 'OPEN_POPOVER' })
    }
  }

  const handleMouseLeave = () => {
    if (trigger === 'hover') {
      dispatch({ type: 'CLOSE_POPOVER' })
    }
  }

  const classes = classnames(
    handles.trigger,
    'outline-0 bg-transparent bn pa0 dib'
  )

  return (
    <ContainerTag
      tabIndex={0}
      ref={containerRef}
      className={classes}
      onClick={handleClick}
      onKeyDown={handleKeydown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </ContainerTag>
  )
}

export default function EnhancedTrigger(props: Props) {
  return (
    <PopoverContextProvider>
      <Trigger {...props} />
    </PopoverContextProvider>
  )
}
