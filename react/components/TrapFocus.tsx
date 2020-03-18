import React, { useEffect, useRef } from 'react'

import useForkRef from '../modules/useForkRef'
import ownerDocument from '../modules/ownerDocument'

interface Props {
  children: React.ReactElement
  open: boolean
}

const TrapFocus = function TrapFocus(props: Props) {
  const { children, open } = props
  const rootRef: React.MutableRefObject<HTMLElement | null> = useRef(null)
  /*
   * I'm just passing rootRef here because I know this will not receive
   * non class components as children that don't have fowardedRef
   */
  const handleRef = useForkRef(rootRef, (children as any)?.ref)

  useEffect(() => {
    if (!open) {
      return
    }

    /*
     * Popperjs probably always starts the element at the top of the screen.
     * So if I try to focus after it positions the element in the right place
     * the scroll will go to the top of the page. That's why I have to use
     * the requestAnimationFrame
     * */
    requestAnimationFrame(() => {
      // And we need two because of IE11
      requestAnimationFrame(() => {
        const doc = ownerDocument(rootRef.current)
        /*
         * We should only try to focus if no element that is inside of
         * rootRef is not the current focused element
         */
        if (!rootRef.current?.contains(doc.activeElement)) {
          if (!rootRef.current?.hasAttribute('tabIndex')) {
            ;(rootRef.current as any).setAttribute('tabIndex', -1)
          }
          rootRef.current?.focus()
        }
      })
    })
  }, [open])

  return <>{React.cloneElement(children, { ref: handleRef })}</>
}

export default TrapFocus
