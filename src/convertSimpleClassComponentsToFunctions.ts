import {
  ASTPath,
  FileInfo,
  API,
  ClassDeclaration,
  ClassMethod,
  ClassProperty,
} from 'jscodeshift'
import findImports from 'jscodeshift-find-imports'

module.exports = function convertSimpleClassComponentsToFunctions(
  fileInfo: FileInfo,
  api: API
): string | null | undefined | void {
  const j = api.jscodeshift

  const root = j(fileInfo.source)
  const { Component } = findImports(
    root,
    j.template.statement`import { Component } from 'react'`
  )
  root
    .find(j.ClassDeclaration, {
      superClass:
        Component.type === 'Identifier'
          ? { type: 'Identifier', name: Component.name }
          : Component.type === 'MemberExpression'
          ? {
              type: 'MemberExpression',
              object: {
                type: 'Identifier',
                name: (Component.object as any).name,
              },
              property: {
                type: 'Identifier',
                name: (Component.property as any).name,
              },
            }
          : null,
    })
    .forEach((path: ASTPath<ClassDeclaration>) => {
      const { id, superTypeParameters, body } = path.node
      const superTypeParams = superTypeParameters?.params || []
      const renderMethodColl = j([path]).find(j.ClassMethod, {
        key: { type: 'Identifier', name: 'render' },
      })
      const renderMethod: ClassMethod | void = renderMethodColl.nodes()[0]
      const contextTypesColl = j([path]).find(j.ClassProperty, {
        static: true,
        key: { type: 'Identifier', name: 'contextTypes' },
      })
      const contextTypes: ClassProperty | void = contextTypesColl.nodes()[0]
      const propTypesColl = j([path]).find(j.ClassProperty, {
        static: true,
        key: { type: 'Identifier', name: 'propTypes' },
      })
      const propTypes: ClassProperty | void = propTypesColl.nodes()[0]
      const defaultPropsColl = j([path]).find(j.ClassProperty, {
        static: true,
        key: { type: 'Identifier', name: 'defaultProps' },
      })
      const defaultProps: ClassProperty | void = defaultPropsColl.nodes()[0]

      if (
        !id ||
        !renderMethod ||
        superTypeParams.length > 1 ||
        body.body.find(
          node =>
            node !== renderMethod &&
            node !== propTypes &&
            node !== contextTypes &&
            node !== defaultProps
        )
      )
        return

      j([path])
        .find(j.MemberExpression, {
          object: { type: 'ThisExpression' },
          property: { type: 'Identifier', name: 'props' },
        })
        .replaceWith(() => j.identifier('props'))
      j([path])
        .find(j.MemberExpression, {
          object: { type: 'ThisExpression' },
          property: { type: 'Identifier', name: 'context' },
        })
        .replaceWith(() => j.identifier('context'))
      const propsParam = j.identifier('props')
      if (superTypeParams[0]) {
        propsParam.typeAnnotation =
          (superTypeParameters as any).type === 'TSTypeParameterInstantiation'
            ? j.tsTypeAnnotation(superTypeParams[0] as any)
            : j.typeAnnotation(superTypeParams[0] as any)
      }
      const params = [propsParam]
      if (contextTypes) {
        params.push(j.identifier('context'))
      }
      const func = j.functionDeclaration(id, params, renderMethod.body)
      func.returnType = renderMethod.returnType
      const [replaced] = path.replace(func)
      if (contextTypes) {
        j([replaced])
          .closest(j.Statement)
          .insertAfter(
            j.template.statement`${id}.contextTypes = ${contextTypes.value}\n`
          )
      }
      if (defaultProps) {
        j([replaced])
          .closest(j.Statement)
          .insertAfter(
            j.template.statement`${id}.defaultProps = ${defaultProps.value}\n`
          )
      }
      if (propTypes) {
        j([replaced])
          .closest(j.Statement)
          .insertAfter(
            j.template.statement`${id}.propTypes = ${propTypes.value}\n`
          )
      }
    })

  return root.toSource()
}
