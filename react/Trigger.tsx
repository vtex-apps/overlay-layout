import classnames from 'classnames'
import { useCssHandles } from 'vtex.css-handles'
import React, { useEffect, useRef, useCallback } from 'react'

import {
  PopoverContextProvider,
  usePopoverDispatch,
  usePopoverState,
} from './components/PopoverContext'

const CSS_HANDLES = ['triggerContainer']

interface Props {
  children: React.ReactNode
}

function Trigger(props: Props) {
  const { children } = props
  const dispatch = usePopoverDispatch()
  const { open } = usePopoverState()
  const containerRef = useRef<HTMLDivElement>(null)
  const handles = useCssHandles(CSS_HANDLES)

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'SET_CONTAINER_REF',
        payload: { containerRef },
      })
    }
  }, [dispatch, containerRef])

  useEffect(() => {
    if (open && containerRef.current) {
      containerRef.current.focus()
    }
  }, [open])

  const handleKeydown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Enter' && e.key !== 'Escape') {
      return
    }

    if (dispatch) {
      if (e.key === 'Enter' && !open) {
        e.stopPropagation()
        dispatch({ type: 'OPEN_POPOVER' })
      } else if (e.key === 'Escape' && open) {
        e.stopPropagation()
        dispatch({ type: 'CLOSE_POPOVER' })
      }
    }
  }

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    e.preventDefault()

    if (dispatch) {
      dispatch({ type: 'OPEN_POPOVER' })
    }
  }

  const handleBlur = useCallback(() => {
    if (dispatch) {
      dispatch({ type: 'CLOSE_POPOVER' })
    }
  }, [dispatch])

  const classes = classnames(handles.triggerContainer, 'relative outline-0 dib')

  return (
    <div
      tabIndex={0}
      role="button"
      ref={containerRef}
      onBlur={handleBlur}
      className={classes}
      onClick={handleClick}
      onKeyDown={handleKeydown}
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
