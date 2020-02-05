import React, { useCallback } from 'react'
import classnames from 'classnames'
import { Placement } from '@popperjs/core'

import styles from './styles.css'
import Popper from './components/Popper'
import TrapFocus from './components/TrapFocus'
import {
  usePopoverState,
  usePopoverDispatch,
} from './components/PopoverContext'
import OutsideClickHandler from './components/OutsideClickHandler'

interface Props {
  children: React.ReactNode
  placement: Placement
  role?: string
}

export default function Popover(props: Props) {
  const { children, placement, role } = props
  const { open, containerRef } = usePopoverState()
  const dispatch = usePopoverDispatch()

  const classes = classnames(
    styles.paper,
    'outline-0 ma2 pa3 bg-base br bl bb b--muted-4 br2 br--bottom w-100'
  )

  const handleClose = useCallback(() => {
    if (dispatch) {
      dispatch({ type: 'CLOSE_POPOVER' })
    }
  }, [dispatch])

  const handleKeydown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Escape') {
      return
    }
    handleClose()
  }

  return (
    <Popper open={open} placement={placement} anchorEl={containerRef?.current}>
      <OutsideClickHandler onOutsideClick={handleClose}>
        <TrapFocus open={open}>
          <div
            role={role}
            tabIndex={-1}
            className={classes}
            onKeyDown={handleKeydown}
          >
            {children}
          </div>
        </TrapFocus>
      </OutsideClickHandler>
    </Popper>
  )
}
