import j from 'jscodeshift'
import { ASTNode } from 'ast-types/gen/nodes'

export default function getExpression(node: ASTNode): ASTNode {
  if (node.type === 'JSXText') return j.stringLiteral(node.value)
  if (node.type === 'JSXExpressionContainer') return node.expression
  return node
}
