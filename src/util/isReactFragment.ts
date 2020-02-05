import { ASTNode } from 'jscodeshift'

export default function isReactFragment(node: ASTNode): boolean {
  if (node.type !== 'JSXElement') return false
  if (node.openingElement.name.type !== 'JSXMemberExpression') return false
  if (node.openingElement.name.object.type !== 'JSXIdentifier') return false
  if (node.openingElement.name.property.type !== 'JSXIdentifier') return false
  if (node.openingElement.name.object.name !== 'React') return false
  if (node.openingElement.name.property.name !== 'Fragment') return false
  return true
}
