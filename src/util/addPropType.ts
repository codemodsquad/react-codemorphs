import j from 'jscodeshift'
import { PropsTypePath } from './getPropsType'
import { FlowTypeKind, TSTypeKind } from 'ast-types/gen/kinds'

export default function addPropType(
  path: PropsTypePath,
  name: string,
  type: FlowTypeKind | TSTypeKind
): void {
  const { node } = path
  switch (node.type) {
    case 'TypeAlias': {
      addPropType(path.get('right'), name, type)
      break
    }
    case 'ObjectTypeAnnotation': {
      const propType = j.objectTypeProperty(
        j.identifier(name),
        type as any,
        false
      )
      propType.variance = j.variance('plus')
      node.properties.push(propType)
      break
    }
    case 'InterfaceDeclaration': {
      node.body.properties.push(
        j.objectTypeProperty(j.identifier(name), type as any, false)
      )
      break
    }
    case 'TSTypeAliasDeclaration': {
      addPropType(path.get('typeAnnotation'), name, type)
      break
    }
    case 'TSTypeLiteral': {
      node.members.push(
        j.tsPropertySignature(
          j.identifier(name),
          j.tsTypeAnnotation(type as any)
        )
      )
      break
    }
    case 'TSInterfaceDeclaration': {
      node.body.body.push(
        j.tsPropertySignature(
          j.identifier(name),
          j.tsTypeAnnotation(type as any)
        )
      )
      break
    }
  }
}
