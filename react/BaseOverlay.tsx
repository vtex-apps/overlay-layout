import React, { useCallback, useMemo, useEffect, useState } from 'react'
import classnames from 'classnames'
import { useCssHandles } from 'vtex.css-handles'
import { Placement as PopperPlacement } from '@popperjs/core'

import styles from './styles.css'
import Popper from './components/Popper'
import TrapFocus from './components/TrapFocus'
import Fade from './components/Animations/Fade'
import useEventCallback from './modules/useEventCallback'
import OutsideClickHandler from './components/OutsideClickHandler'
import { useOverlayState, useOverlayDispatch } from './OverlayContext'
import handleContainerStyle, { RestoreFn } from './modules/handleContainerStyle'

type TransitionComponentType = 'fade'

interface Offsets {
  distance: number
  skidding: number
}

interface Classes {
  arrow: string
  popper: string
  backdrop: string
  container: string
  popperArrow: string
  backdropContainer: string
  outsideClickHandler: string
}

interface Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  showArrow?: boolean
  children: React.ReactNode
  classes?: Partial<Classes>
  offsets?: Partial<Offsets>
  placement?: PopperPlacement
  backdrop?: 'visible' | 'none'
  scrollBehavior?: 'lock-page-scroll' | 'close-on-scroll' | 'default'
  transitionComponent?: TransitionComponentType
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

const CSS_HANDLES = [
  'arrow',
  'popper',
  'backdrop',
  'container',
  'popperArrow',
  'backdropContainer',
  'outsideClickHandler',
] as const

export default function BaseOverlay(props: Props) {
  const {
    ref,
    role,
    offsets,
    onClick,
    children,
    classes = {},
    backdrop = 'none',
    showArrow = false,
    placement = 'bottom',
    className: classNameProp,
    scrollBehavior = 'default',
    transitionComponent = 'fade',
    ...rest
  } = props
  const { open, containerRef, triggerMode } = useOverlayState()
  const dispatch = useOverlayDispatch()
  const handles = useCssHandles(CSS_HANDLES)
  const [arrowRef, setArrowRef] = useState<HTMLSpanElement | null>(null)
  const TransitionComponent = useTransition(transitionComponent)

  const handleClose = useCallback(
    (e: Event) => {
      const triggerClicked = containerRef?.current?.contains(
        e.target as Node | null
      )
      if (!triggerClicked) {
        dispatch({ type: 'CLOSE_OVERLAY' })
      }
    },
    [containerRef, dispatch]
  )

  const handleKeydown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key !== 'Escape' || triggerMode !== 'click') {
        return
      }
      dispatch({ type: 'CLOSE_OVERLAY' })
    },
    [dispatch, triggerMode]
  )

  const closeOnScroll = useEventCallback((e: any) => {
    e.preventDefault()
    dispatch({ type: 'CLOSE_OVERLAY' })
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

  const handleClick: React.MouseEventHandler<HTMLDivElement> = useCallback(
    e => {
      if (triggerMode === 'click') {
        // The Trigger works as a toggle, so if this event
        // go up to the Trigger it will close the Overlay
        e.stopPropagation()
        e.preventDefault()
      }

      if (onClick) {
        onClick(e)
      }
    },
    [onClick, triggerMode]
  )

  const popperClasses = useMemo(
    () => ({
      container: classes.popper,
      backdrop: classes.backdrop,
      popperArrow: classes.popperArrow,
      backdropContainer: classes.backdropContainer,
    }),
    [classes]
  )

  const containerClasses = classnames(
    handles.container,
    classNameProp,
    classes.container
  )
  const arrowClasses = classnames(handles.arrow, classes.arrow, styles.arrow)

  return (
    <Popper
      transition
      open={open}
      offsets={offsets}
      arrowEl={arrowRef}
      placement={placement}
      classes={popperClasses}
      anchorEl={containerRef?.current}
      backdrop={backdrop !== 'none' ? 'clickable' : 'none'}
    >
      {({ TransitionProps }: any) => (
        <OutsideClickHandler
          onOutsideClick={handleClose}
          className={classes.outsideClickHandler}
        >
          <TrapFocus open={open}>
            <TransitionComponent {...TransitionProps}>
              <div
                role={role}
                tabIndex={-1}
                onClick={handleClick}
                onKeyDown={handleKeydown}
                className={containerClasses}
                {...rest}
              >
                {showArrow && (
                  <span className={arrowClasses} ref={setArrowRef} />
                )}
                {children}
              </div>
            </TransitionComponent>
          </TrapFocus>
        </OutsideClickHandler>
      )}
    </Popper>
  )
}
