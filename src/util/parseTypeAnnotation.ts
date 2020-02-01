import { JSCodeshift } from 'jscodeshift'
import { FlowTypeKind, TSTypeKind } from 'ast-types/gen/kinds'

/**
 * @prettier
 * @flow
 */

export default function parseTypeAnnotation(
  j: JSCodeshift,
  typeAnnotation: string
): FlowTypeKind | TSTypeKind {
  const parsed = j.template.statement([`type foo = ${typeAnnotation}`])
  switch (parsed.type) {
    case 'TypeAlias':
      return parsed.right
    case 'TSTypeAliasDeclaration':
      return parsed.typeAnnotation
  }
  throw new Error('unexpected error')
}
