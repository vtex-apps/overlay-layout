import classnames from 'classnames'
import { useCssHandles } from 'vtex.css-handles'
import React, { useEffect, useRef } from 'react'

import {
  usePopoverDispatch,
  PopoverContextProvider,
} from './components/PopoverContext'

const CSS_HANDLES = ['triggerContainer']

// TODO hover trigger
type TriggerMode = 'click' | 'hover'

interface Props {
  children: React.ReactNode
  trigger?: TriggerMode
}

export type TriggerElement = HTMLDivElement & HTMLButtonElement

function Trigger(props: Props) {
  const { children, trigger = 'click' } = props
  const dispatch = usePopoverDispatch()
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

  const handleKeydown = (e: React.KeyboardEvent<TriggerElement>) => {
    if (e.key !== 'Enter') {
      return
    }

    if (dispatch) {
      e.stopPropagation()
      dispatch({ type: 'OPEN_POPOVER' })
    }
  }

  const handleClick = (e: React.MouseEvent<TriggerElement>) => {
    e.stopPropagation()
    e.preventDefault()

    if (dispatch) {
      dispatch({ type: 'OPEN_POPOVER' })
    }
  }

  const classes = classnames(
    handles.triggerContainer,
    'outline-0 bg-transparent bn pa0'
  )

  return (
    <ContainerTag
      tabIndex={0}
      ref={containerRef}
      className={classes}
      onClick={handleClick}
      onKeyDown={handleKeydown}
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
