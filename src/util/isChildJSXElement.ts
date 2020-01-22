import { ASTPath } from 'jscodeshift'

export default function isChildJSXElement(path: ASTPath<any>): boolean {
  return (
    path.parent?.node?.type === 'JSXElement' &&
    path.parent.node.children.indexOf(path.node) >= 0
  )
}
