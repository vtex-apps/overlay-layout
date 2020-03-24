import React from 'react'
import classnames from 'classnames'
import { useCssHandles } from 'vtex.css-handles'
import { TransitionProps } from 'react-transition-group/Transition'

import Fade from './Animations/Fade'

export type BackdropMode = 'display' | 'clickable' | 'none'

interface Props {
  open: boolean
  transitionDuration?: TransitionProps['timeout']
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}

const CSS_HANDLES = ['backdropContainer', 'backdrop']

const Backdrop: React.FC<Props> = props => {
  const { children, open, onClick, transitionDuration } = props
  const handles = useCssHandles(CSS_HANDLES)

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onClick) {
      onClick(e)
    }
  }

  const classes = classnames(handles.backdropContainer, 'fixed left-0 top-0')

  return (
    <Fade in={open} timeout={transitionDuration}>
      <div className={classes}>
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
