import classnames from 'classnames'
import React from 'react'

import styles from './styles.css'
import { usePopoverState } from './components/PopoverContext'

interface Props {
  children: React.ReactNode
}

export default function Popover(props: Props) {
  const { children } = props
  const { open } = usePopoverState()

  if (!open) {
    return null
  }

  const classes = classnames(
    styles.popoverContainer,
    'absolute left-0 outline-0 pa3 bg-base br bl bb b--muted-4 br2 br--bottom w-100'
  )

  return <div className={classes}>{children}</div>
}
