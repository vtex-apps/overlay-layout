import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  MutableRefObject,
} from 'react'
import {
  State,
  Instance,
  createPopper,
  VirtualElement,
  ModifierArguments,
  Placement as PopperPlacementType,
} from '@popperjs/core'

import Portal from './Portal'
import setRef from '../modules/setRef'
import useForkRef from '../modules/useForkRef'

interface Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  anchorEl?:
    | null
    | VirtualElement
    | (() => VirtualElement)
    | React.RefObject<HTMLElement>
  children: React.ReactNode
  open?: boolean
  placement?: PopperPlacementType
  transition?: boolean
  role?: string
}

function getAnchorEl(anchorEl: React.ReactNode) {
  return typeof anchorEl === 'function' ? anchorEl() : anchorEl
}

const Popper = React.forwardRef(function Popper(props: Props, ref) {
  const {
    role,
    anchorEl,
    children,
    open = false,
    transition = false,
    placement: initialPlacement = 'bottom',
    ...rest
  } = props

  const tooltipRef = useRef<HTMLElement>(null)
  const ownRef = useForkRef(tooltipRef, ref)
  const popperRef: MutableRefObject<Instance | null> = useRef<Instance>(null)
  const [placement, setPlacement] = useState(initialPlacement)
  const [exited, setExited] = useState(true)

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

    const handlePopperFirstUpdate = (data: Partial<State>) => {
      if (data.placement) {
        setPlacement(data.placement)
      }
    }

    const handlePopperUpdate = (data: ModifierArguments<{}>) => {
      setPlacement(data.state.placement)
    }

    const popper = createPopper(getAnchorEl(anchorEl), tooltipRef.current, {
      placement: initialPlacement,
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
            mainAxis: false,
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

  return (
    <Portal>
      <div
        role={role}
        ref={handleRef}
        style={{ position: 'fixed', left: 0, top: 0 }}
        {...rest}
      >
        {typeof children === 'function' ? children(childProps) : children}
      </div>
    </Portal>
  )
})

export default Popper
