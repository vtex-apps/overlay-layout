import React, { useEffect, useRef } from 'react'
import classnames from 'classnames'
import { useCssHandles } from 'vtex.css-handles'
import { TransitionProps } from 'react-transition-group/Transition'

import styles from './styles.css'
import Fade from './components/Animations/Fade'
import ownerDocument from './modules/ownerDocument'

export type BackdropMode = 'display' | 'clickable' | 'none'

interface Classes {
  backdropContainer: string
  backdrop: string
}

interface Props {
  open: boolean
  exited: boolean
  classes?: Partial<Classes>
  transitionDuration?: TransitionProps['timeout']
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}

function restoreOverflowX(
  valueRef: React.MutableRefObject<string | undefined>,
  body: HTMLElement
) {
  if (valueRef.current) {
    body.style.overflowX = valueRef.current
    valueRef.current = undefined
  } else {
    body.style.removeProperty('overflow-x')
  }
}

const CSS_HANDLES = ['backdrop', 'backdropContainer'] as const

const Backdrop: React.FC<Props> = props => {
  const {
    open,
    exited,
    onClick,
    children,
    classes = {},
    transitionDuration,
  } = props
  const rootRef = useRef(null)
  const overflowX = useRef<string>()
  const handles = useCssHandles(CSS_HANDLES)

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onClick) {
      onClick(e)
    }
  }

  useEffect(() => {
    let body: HTMLElement
    if (rootRef.current) {
      body = ownerDocument(rootRef.current).body
      if (open) {
        if (body.style.overflowX) {
          overflowX.current = body.style.overflowX
        }
        body.style.overflowX = 'hidden'
      } else if (exited) {
        restoreOverflowX(overflowX, body)
      }
    }

    return () => {
      if (!open && body) {
        restoreOverflowX(overflowX, body)
      }
    }
  }, [open, exited])

  if (!open && exited) {
    return null
  }

  const containerClasses = classnames(
    handles.backdropContainer,
    classes.backdropContainer,
    styles.backdropContainer
  )

  const backdropClasses = classnames(
    handles.backdrop,
    classes.backdrop,
    styles.backdrop
  )

  return (
    <Fade in={open} timeout={transitionDuration}>
      <div className={containerClasses} ref={rootRef}>
        <div
          role="presentation"
          onClick={handleClick}
          className={backdropClasses}
        >
          {children}
        </div>
      </div>
    </Fade>
  )
}

export default React.memo(Backdrop)
