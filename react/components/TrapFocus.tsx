import React, { useEffect, useRef, forwardRef } from 'react'

import useForkRef from '../modules/useForkRef'

interface Props {
  children: React.ReactElement
  open: boolean
}

const TrapFocus = forwardRef(function TrapFocus(props: Props, ref) {
  const { children, open } = props
  const childRef = useRef<HTMLElement>(null)
  const handleRef = useForkRef(childRef, ref)

  useEffect(() => {
    if (open) {
      // Popperjs probably always start the element at the top of the screen.
      // So if I try to focus after it position the element in the right place
      // the scroll will go to the top of the page. That's why I have to use
      // the requestAnimationFrame
      requestAnimationFrame(() => {
        // And we need two because of IE11
        requestAnimationFrame(() => {
          childRef.current?.focus()
        })
      })
    }
  }, [open])

  return <>{React.cloneElement(children, { ref: handleRef })}</>
})

export default TrapFocus
