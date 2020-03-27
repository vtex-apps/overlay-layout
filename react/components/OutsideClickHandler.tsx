import React, { useCallback, useRef, forwardRef, useEffect } from 'react'
import { addEventListener } from 'consolidated-events'
import { useCssHandles } from 'vtex.css-handles'

import setRef from '../modules/setRef'
import useForkRef from '../modules/useForkRef'

interface Props {
  children: React.ReactNode
  disabled?: boolean
  useCapture?: boolean
  onOutsideClick?: EventListener
}

const CSS_HANDLES = ['outsideClickHandler'] as const

const OutsideClickHandler = forwardRef(function OutsideClickHandler(
  props: Props,
  ref
) {
  const {
    children,
    disabled = false,
    useCapture = true,
    onOutsideClick,
  } = props
  const rootRef = useRef<HTMLDivElement>(null)
  const ownRef = useForkRef(rootRef, ref)
  const removeMouseUpRef = useRef<Function | null>()
  const removeMouseDownRef = useRef<Function | null>()
  const handles = useCssHandles(CSS_HANDLES)
  const handleRef = useCallback(
    node => {
      setRef(ownRef, node)
    },
    [ownRef]
  )

  const handleMouseUp = useCallback(
    e => {
      const isDescendantOfRoot = rootRef.current?.contains(e.target)
      if (removeMouseUpRef.current) {
        removeMouseUpRef.current()
        removeMouseUpRef.current = null
      }

      if (!isDescendantOfRoot && onOutsideClick) {
        onOutsideClick(e)
      }
    },
    [onOutsideClick]
  )

  const handleMouseDown = useCallback(
    e => {
      const isDescendantOfRoot = rootRef.current?.contains(e.target)
      if (!isDescendantOfRoot) {
        if (removeMouseUpRef.current) {
          removeMouseUpRef.current()
          removeMouseDownRef.current = null
        }

        removeMouseUpRef.current = addEventListener(
          window?.document,
          'mouseup',
          handleMouseUp,
          { capture: useCapture }
        )
      }
    },
    [handleMouseUp, useCapture]
  )

  const addMouseDownEventListener = useCallback(
    (useCapture: boolean) => {
      removeMouseDownRef.current = addEventListener(
        window?.document,
        'mousedown',
        handleMouseDown,
        {
          capture: useCapture,
        }
      )
    },
    [handleMouseDown]
  )

  const removeEventListeners = () => {
    if (removeMouseUpRef.current) {
      removeMouseUpRef.current()
      removeMouseUpRef.current = null
    }

    if (removeMouseDownRef.current) {
      removeMouseDownRef.current()
      removeMouseDownRef.current = null
    }
  }

  useEffect(() => {
    if (disabled) {
      removeEventListeners()
    } else {
      if (removeMouseUpRef.current) {
        removeMouseUpRef.current()
        removeMouseUpRef.current = null
      }
      addMouseDownEventListener(useCapture)
    }

    return () => removeEventListeners()
  }, [addMouseDownEventListener, disabled, useCapture])

  return (
    <div className={handles.outsideClickHandler} ref={handleRef}>
      {children}
    </div>
  )
})

export default OutsideClickHandler
