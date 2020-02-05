import React, { useEffect, useRef } from 'react'

interface Props {
  children: React.ReactElement
  open: boolean
}

export default function TrapFocus(props: Props) {
  const { children, open } = props
  const childRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (open && childRef.current) {
      childRef.current.focus()
    }
  }, [open])

  return <>{React.cloneElement(children, { ref: childRef })}</>
}
