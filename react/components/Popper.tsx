import React, {
  useRef,
  useMemo,
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
  Modifier as PopperModifier,
  Placement as PopperPlacementType,
} from '@popperjs/core'
import classnames from 'classnames'
import { useCssHandles } from 'vtex.css-handles'

import styles from '../styles.css'
import setRef from '../modules/setRef'
import useForkRef from '../modules/useForkRef'
import { useOverlayDispatch } from '../OverlayContext'
import Backdrop, { BackdropMode } from '../Backdrop'

interface Offsets {
  distance: number
  skidding: number
}

type AnchorElType =
  | null
  | VirtualElement
  | (() => VirtualElement)
  | React.RefObject<HTMLElement>

interface Classes {
  container: string
  popperArrow: string
  backdrop: string
  backdropContainer: string
}

interface Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  role?: string
  open?: boolean
  transition?: boolean
  backdrop?: BackdropMode
  anchorEl?: AnchorElType
  children: React.ReactNode
  classes?: Partial<Classes>
  offsets?: Partial<Offsets>
  arrowEl?: HTMLElement | null
  placement?: PopperPlacementType
}

function getAnchorEl(anchorEl: React.ReactNode) {
  return typeof anchorEl === 'function' ? anchorEl() : anchorEl
}

const defaultOffsets: Offsets = {
  distance: 0,
  skidding: 0,
}

const CSS_HANDLES = ['popper', 'popperArrow'] as const

const Popper = forwardRef(function Popper(props: Props, ref) {
  const {
    arrowEl,
    anchorEl,
    children,
    open = false,
    classes = {},
    backdrop = 'none',
    transition = false,
    role = 'presentation',
    className: classNameProp,
    offsets: offsetsProp = defaultOffsets,
    placement: initialPlacement = 'bottom',
    ...rest
  } = props

  const tooltipRef = useRef<HTMLElement>(null)
  const ownRef = useForkRef(tooltipRef, ref)
  const dispatch = useOverlayDispatch()
  const handles = useCssHandles(CSS_HANDLES)
  const popperRef: MutableRefObject<PopperInstance | null> = useRef<
    PopperInstance
  >(null)
  const [placement, setPlacement] = useState(initialPlacement)
  const [exited, setExited] = useState(true)

  // It doesn't have a dependency array because it should update
  // after every render of react
  useEffect(() => {
    if (popperRef.current) {
      popperRef.current.update()
    }
  })

  const popperModifiers = useMemo(() => {
    const handlePopperUpdate = (data: ModifierArguments<{}>) => {
      setPlacement(data.state.placement)
    }

    const { distance, skidding } = {
      ...defaultOffsets,
      ...offsetsProp,
    }

    const modifiers: Partial<PopperModifier<unknown>>[] = [
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
      {
        name: 'offset',
        options: {
          offset: [skidding, distance],
        },
      },
    ]

    if (arrowEl) {
      modifiers.push({
        name: 'arrow',
        options: {
          element: arrowEl,
        },
      })
    }

    return modifiers
  }, [arrowEl, offsetsProp])

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

    const popper = createPopper(getAnchorEl(anchorEl), tooltipRef.current, {
      modifiers: popperModifiers,
      placement: initialPlacement,
      onFirstUpdate: handlePopperFirstUpdate,
    })
    popperRef.current = popper
  }, [open, anchorEl, initialPlacement, popperModifiers])

  const handleRef = useCallback(
    node => {
      setRef(ownRef, node)
      handleOpen()
    },
    [ownRef, handleOpen]
  )

  const handleEnter = () => {
    setExited(false)
    dispatch({ type: 'SET_EXITED', payload: { exited: false } })
  }

  const handleClose = () => {
    if (!popperRef.current) {
      return
    }

    popperRef.current.destroy()
  }

  const handleExited = () => {
    setExited(true)
    dispatch({ type: 'SET_EXITED', payload: { exited: true } })
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

  const backdropClasses = useMemo(
    () => ({
      backdrop: classes.backdrop,
      backdropContainer: classes.backdropContainer,
    }),
    [classes]
  )

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

  const popperArrowClasses = classnames(
    handles.popperArrow,
    classes.popperArrow,
    styles.popperArrow
  )

  const containerClasses = classnames(
    handles.popper,
    classNameProp,
    classes.container,
    styles.dropdown,
    {
      [popperArrowClasses]: Boolean(arrowEl),
    }
  )

  return (
    <div className={containerClasses} role={role} ref={handleRef} {...rest}>
      {typeof children === 'function' ? children(childProps) : children}
      {backdrop !== 'none' && (
        <Backdrop
          open={open}
          classes={backdropClasses}
          exited={!transition || exited}
        />
      )}
    </div>
  )
})

export default Popper
