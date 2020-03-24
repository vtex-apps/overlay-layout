import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useCallback,
  MutableRefObject,
} from 'react'
import {
  createPopper,
  VirtualElement,
  ModifierArguments,
  State as PopperState,
  Instance as PopperInstance,
  Placement as PopperPlacementType,
} from '@popperjs/core'
import classnames from 'classnames'
import { useCssHandles } from 'vtex.css-handles'

import styles from '../styles.css'
import setRef from '../modules/setRef'
import useForkRef from '../modules/useForkRef'
import Backdrop, { BackdropMode } from './Backdrop'

type AnchorElType =
  | null
  | VirtualElement
  | (() => VirtualElement)
  | React.RefObject<HTMLElement>

interface Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  role?: string
  open?: boolean
  transition?: boolean
  anchorEl?: AnchorElType
  backdrop?: BackdropMode
  children: React.ReactNode
  placement?: PopperPlacementType
}

function getAnchorEl(anchorEl: React.ReactNode) {
  return typeof anchorEl === 'function' ? anchorEl() : anchorEl
}

const CSS_HANDLES = ['popper']

const Popper = forwardRef(function Popper(props: Props, ref) {
  const {
    anchorEl,
    children,
    open = false,
    transition = false,
    backdrop = '',
    role = 'presentation',
    placement: initialPlacement = 'bottom',
    ...rest
  } = props

  const tooltipRef = useRef<HTMLElement>(null)
  const ownRef = useForkRef(tooltipRef, ref)
  const popperRef: MutableRefObject<PopperInstance | null> = useRef<
    PopperInstance
  >(null)
  const [placement, setPlacement] = useState(initialPlacement)
  const [exited, setExited] = useState(true)
  const handles = useCssHandles(CSS_HANDLES)

  // It doesn't have a dependency array because it should update
  // after every render of react
  useEffect(() => {
    if (popperRef.current) {
      popperRef.current.update()
    }
  })

  const handleOpen = useCallback(() => {
    if (!tooltipRef.current || !open) {
      return
    }

    if (popperRef.current) {
      popperRef.current.destroy()
    }

    const handlePopperFirstUpdate = (data: Partial<PopperState>) => {
      if (data.placement) {
        setPlacement(data.placement)
      }
    }

    const handlePopperUpdate = (data: ModifierArguments<{}>) => {
      setPlacement(data.state.placement)
    }

    const popper = createPopper(getAnchorEl(anchorEl), tooltipRef.current, {
      placement: initialPlacement,
      strategy: 'fixed',
      onFirstUpdate: handlePopperFirstUpdate,
      modifiers: [
        {
          name: 'afterWrite',
          enabled: true,
          phase: 'afterWrite',
          fn: handlePopperUpdate,
        },
        {
          name: 'preventOverflow',
          options: {
            mainAxis: true,
            altAxis: false,
            ...(window && { boundary: window }),
          },
        },
      ],
    })
    popperRef.current = popper
  }, [open, initialPlacement, anchorEl])

  const handleRef = useCallback(
    node => {
      setRef(ownRef, node)
      handleOpen()
    },
    [ownRef, handleOpen]
  )

  const handleEnter = () => {
    setExited(false)
  }

  const handleClose = () => {
    if (!popperRef.current) {
      return
    }

    popperRef.current.destroy()
  }

  const handleExited = () => {
    setExited(true)
    handleClose()
  }

  useEffect(() => {
    handleOpen()
  }, [handleOpen])

  useEffect(() => {
    return () => {
      handleClose()
    }
  }, [])

  useEffect(() => {
    if (!open && !transition) {
      handleClose()
    }
  }, [open, transition])

  if (!open && (!transition || exited)) {
    return null
  }

  const childProps: any = { placement }

  if (transition) {
    childProps.TransitionProps = {
      in: open,
      onEnter: handleEnter,
      onExited: handleExited,
    }
  }

  const classes = classnames(handles.popper, styles.dropdown)

  return (
    <div className={classes} role={role} ref={handleRef} {...rest}>
      {typeof children === 'function' ? children(childProps) : children}
      {backdrop !== 'none' && <Backdrop open={open} />}
    </div>
  )
})

export default Popper
