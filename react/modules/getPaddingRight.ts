export default function getPaddingRight(node: HTMLElement) {
  return parseInt(window.getComputedStyle(node).paddingRight, 10) || 0
}
