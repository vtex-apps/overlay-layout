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
    if (dispatch) {
      dispatch({
        type: 'SET_CONTAINER_REF',
        payload: { containerRef },
      })
    }
  }, [dispatch, containerRef])

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'SET_TRIGGER_MODE',
        payload: { triggerMode: trigger },
      })
    }
  }, [dispatch, trigger])

  const handleKeydown = (e: React.KeyboardEvent<TriggerElement>) => {
    if (e.key !== 'Enter' || trigger !== 'click') {
      return
    }

    if (dispatch) {
      e.stopPropagation()
      dispatch({ type: 'OPEN_POPOVER' })
    }
  }

  const handleClick = (e: React.MouseEvent<TriggerElement>) => {
    if (trigger !== 'click') {
      return
    }

    e.stopPropagation()
    e.preventDefault()

    if (dispatch) {
      if (open) {
        dispatch({ type: 'CLOSE_POPOVER' })
      } else {
        dispatch({ type: 'OPEN_POPOVER' })
      }
    }
  }

  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      if (dispatch) {
        dispatch({ type: 'OPEN_POPOVER' })
      }
    }
  }

  const handleMouseLeave = () => {
    if (trigger === 'hover') {
      if (dispatch) {
        dispatch({ type: 'CLOSE_POPOVER' })
      }
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
