import isOverflowing from './isOverflowing'
import getScrollbarSize from './getScrollbarSize'
import getPaddingRight from './getPaddingRight'

interface RestoreStyle {
  value: string
  el: HTMLElement
  key: string
}

export type RestoreFn = () => void

export default function handleContainerStyle(
  container: HTMLElement
): RestoreFn {
  const restoreStyle: RestoreStyle[] = []

  if (isOverflowing(container)) {
    const scrollbarSize = getScrollbarSize()

    restoreStyle.push({
      value: container.style.paddingRight,
      key: 'padding-right',
      el: container,
    })

    container.style.paddingRight = `${getPaddingRight(container) +
      scrollbarSize}px`
  }

  // https://css-tricks.com/snippets/css/force-vertical-scrollbar/
  const parent = container.parentElement
  const scrollContainer =
    parent?.nodeName === 'HTML' &&
    window.getComputedStyle(parent).overflowY === 'scroll'
      ? parent
      : container
  restoreStyle.push({
    value: scrollContainer.style.overflow,
    key: 'overflow',
    el: scrollContainer,
  })
  scrollContainer.style.overflow = 'hidden'

  const restore = () => {
    restoreStyle.forEach(({ value, el, key }) => {
      if (value) {
        el.style.setProperty(key, value)
      } else {
        el.style.removeProperty(key)
      }
    })
  }

  return restore
}
