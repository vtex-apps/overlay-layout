import React, { useEffect, useRef } from 'react'
import classnames from 'classnames'
import { useCssHandles } from 'vtex.css-handles'
import { TransitionProps } from 'react-transition-group/Transition'

import Fade from './Animations/Fade'
import ownerDocument from '../modules/ownerDocument'

export type BackdropMode = 'display' | 'clickable' | 'none'

interface Props {
  open: boolean
  exited: boolean
  transitionDuration?: TransitionProps['timeout']
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}

const CSS_HANDLES = ['backdropContainer', 'backdrop'] as const

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

const Backdrop: React.FC<Props> = props => {
  const { children, open, onClick, transitionDuration, exited } = props
  const handles = useCssHandles(CSS_HANDLES)
  const rootRef = useRef(null)
  const overflowX = useRef<string>()

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

  const classes = classnames(handles.backdropContainer, 'fixed left-0 top-0')

  return (
    <Fade in={open} timeout={transitionDuration}>
      <div className={classes} ref={rootRef}>
        <div
          role="presentation"
          onClick={handleClick}
          className={`${handles.backdrop} bg-base--inverted o-50 h-100`}
        >
          {children}
        </div>
      </div>
    </Fade>
  )
}

export default React.memo(Backdrop)
