import React, { useCallback, useMemo, useEffect } from 'react'
import classnames from 'classnames'
import { Placement } from '@popperjs/core'
import { useCssHandles } from 'vtex.css-handles'

import Popper from './components/Popper'
import TrapFocus from './components/TrapFocus'
import Fade from './components/Animations/Fade'
import OutsideClickHandler from './components/OutsideClickHandler'
import { usePopoverState, usePopoverDispatch } from './PopoverContext'
import useEventCallback from './modules/useEventCallback'
import handleContainerStyle, { RestoreFn } from './modules/handleContainerStyle'

type TransitionComponentType = 'fade'

interface Props {
  role?: string
  placement: Placement
  children: React.ReactNode
  backdrop?: 'visible' | 'none'
  scrollBehavior?: 'lock-page-scroll' | 'close-on-scroll' | 'default'
  transitionComponent: TransitionComponentType
}

function useTransition(option: TransitionComponentType) {
  return useMemo(() => {
    const lowerCaseOption = option.toLowerCase() as TransitionComponentType
    switch (lowerCaseOption) {
      case 'fade':
        return Fade
      default:
        return Fade
    }
  }, [option])
}

const CSS_HANDLES = ['container']

export default function Popover(props: Props) {
  const {
    role,
    children,
    placement,
    backdrop = 'none',
    scrollBehavior = 'default',
    transitionComponent = 'fade',
  } = props
  const { open, containerRef, triggerMode } = usePopoverState()
  const dispatch = usePopoverDispatch()
  const handles = useCssHandles(CSS_HANDLES)
  const TransitionComponent = useTransition(transitionComponent)

  const containerClasses = classnames(
    handles.container,
    'outline-0 pv2 bg-base br bl bb bt b--muted-4 br2 w-100'
  )

  const handleClose = useCallback(
    (e: Event) => {
      const triggerClicked = containerRef?.current?.contains(
        e.target as Node | null
      )
      if (!triggerClicked) {
        dispatch({ type: 'CLOSE_POPOVER' })
      }
    },
    [containerRef, dispatch]
  )

  const handleKeydown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key !== 'Escape' || triggerMode !== 'click') {
        return
      }
      dispatch({ type: 'CLOSE_POPOVER' })
    },
    [dispatch, triggerMode]
  )

  const closeOnScroll = useEventCallback((e: any) => {
    e.preventDefault()
    dispatch({ type: 'CLOSE_POPOVER' })
  })

  useEffect(() => {
    let restore: RestoreFn | null = null
    if (open) {
      if (scrollBehavior === 'close-on-scroll') {
        window.addEventListener('scroll', closeOnScroll)
      } else if (scrollBehavior === 'lock-page-scroll') {
        restore = handleContainerStyle(window?.document.body)
      }
    }

    return () => {
      window.removeEventListener('scroll', closeOnScroll)
      if (restore) {
        restore()
      }
    }
  }, [closeOnScroll, scrollBehavior, open])

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (triggerMode === 'click') {
        // The Trigger works as a toggle, so if this event
        // go up to the Trigger it will close the Popover
        e.stopPropagation()
        e.preventDefault()
      }
    },
    [triggerMode]
  )

  return (
    <Popper
      transition
      open={open}
      backdrop={backdrop === 'visible' ? 'clickable' : 'none'}
      placement={placement}
      anchorEl={containerRef?.current}
    >
      {({ TransitionProps }: any) => (
        <OutsideClickHandler onOutsideClick={handleClose}>
          <TrapFocus open={open}>
            <TransitionComponent {...TransitionProps}>
              <div
                role={role}
                tabIndex={-1}
                onClick={handleClick}
                onKeyDown={handleKeydown}
                className={containerClasses}
              >
                {children}
              </div>
            </TransitionComponent>
          </TrapFocus>
        </OutsideClickHandler>
      )}
    </Popper>
  )
}
