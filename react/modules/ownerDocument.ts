export default function ownerDocument(node: HTMLElement | null | undefined) {
  return (node && node.ownerDocument) || window.document
}
