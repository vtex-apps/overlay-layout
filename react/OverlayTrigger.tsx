import React from 'react'
import classnames from 'classnames'
import {
  useResponsiveValue,
  MaybeResponsiveInput,
} from 'vtex.responsive-values'

import BaseTrigger from './BaseTrigger'

export type TriggerMode = 'click' | 'hover' | 'none'

interface Props {
  children: React.ReactElement
  backdrop?: 'visible' | 'none'
  trigger: MaybeResponsiveInput<TriggerMode>
}

export default function OverlayTrigger(props: Props) {
  const { children, trigger: triggerProp = 'click' } = props
  const trigger = useResponsiveValue(triggerProp)
  const role = trigger === 'click' ? 'button' : undefined
  const containerClasses = classnames(
    'outline-0 bg-transparent bn pa0 dib bg-red',
    {
      pointer: trigger === 'click',
    }
  )

  return (
    <BaseTrigger
      role={role}
      tabIndex={0}
      style={{ zIndex: 2000 }}
      trigger={trigger}
      className={containerClasses}
    >
      {children}
    </BaseTrigger>
  )
}
