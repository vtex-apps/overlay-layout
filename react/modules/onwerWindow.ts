import ownerDocument from './ownerDocument'

type NodeType = HTMLElement | Document | null | undefined
export default function ownerWindow(node: NodeType) {
  const doc = ownerDocument(node as HTMLElement)
  return doc.defaultView || window
}
