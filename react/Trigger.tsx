import React from 'react'
import classnames from 'classnames'
import { useCssHandles } from 'vtex.css-handles'
import {
  useResponsiveValue,
  MaybeResponsiveInput,
} from 'vtex.responsive-values'

import BaseTrigger from './BaseTrigger'

const CSS_HANDLES = ['trigger'] as const

export type TriggerMode = 'click' | 'hover'

interface Props {
  children: React.ReactNode
  trigger: MaybeResponsiveInput<TriggerMode>
}

export default function Trigger(props: Props) {
  const { children, trigger: triggerProp = 'click' } = props
  const handles = useCssHandles(CSS_HANDLES)
  const trigger = useResponsiveValue(triggerProp)
  const role = trigger === 'click' ? 'button' : undefined
  const containerClasses = classnames(
    handles.trigger,
    'outline-0 bg-transparent bn pa0 dib',
    {
      pointer: trigger === 'click',
    }
  )

  return (
    <BaseTrigger trigger={trigger}>
      <div role={role} tabIndex={0} className={containerClasses}>
        {children}
      </div>
    </BaseTrigger>
  )
}
