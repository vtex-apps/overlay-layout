import React, { useCallback, useMemo } from 'react'
import classnames from 'classnames'
import { Placement } from '@popperjs/core'
import { useCssHandles } from 'vtex.css-handles'

import Popper from './components/Popper'
import TrapFocus from './components/TrapFocus'
import Fade from './components/Animations/Fade'
import OutsideClickHandler from './components/OutsideClickHandler'
import {
  usePopoverState,
  usePopoverDispatch,
} from './components/PopoverContext'

type TransitionComponentType = 'fade'

interface Props {
  children: React.ReactNode
  placement: Placement
  role?: string
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

const CSS_HANDLES = ['backgroundElement']

export default function Popover(props: Props) {
  const { children, placement, role, transitionComponent = 'fade' } = props
  const { open, containerRef, triggerMode } = usePopoverState()
  const dispatch = usePopoverDispatch()
  const handles = useCssHandles(CSS_HANDLES)
  const TransitionComponent = useTransition(transitionComponent)

  const backgroundElementClasses = classnames(
    handles.backgroundElement,
    'outline-0 ma2 pa3 bg-base br bl bb bt b--muted-4 br2 w-100'
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
                className={backgroundElementClasses}
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
