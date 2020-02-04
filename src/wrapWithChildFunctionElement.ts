/* eslint-disable @typescript-eslint/no-explicit-any */

import { ASTPath, FileInfo, API, Options } from 'jscodeshift'
import hasFlowAnnotation from './util/hasFlowAnnotation'
import { getFilter } from './util/Filter'

module.exports = function wrapWithChildFunctionElement(
  fileInfo: FileInfo,
  api: API,
  options: Options
): string | null | undefined | void {
  if (!options.name || typeof options.name !== 'string') {
    throw new Error('options.name must be a non-empty string')
  }

  const j = api.jscodeshift

  const root = j(fileInfo.source)
  const { expression } = j.template
  const filter = getFilter(options)

  const element = root
    .find(j.JSXElement)
    .filter(filter)
    .at(0)
  const name = j.jsxIdentifier(options.name)
  const open = j.jsxOpeningElement(name)
  const close = j.jsxClosingElement(name)

  const isTypeScript = /\.tsx?/.test(fileInfo.path)
  const isFlow = hasFlowAnnotation(root)

  if (isFlow) {
    element.replaceWith((path: ASTPath<any>) =>
      j.jsxElement(open, close, [
        j.jsxExpressionContainer(expression`(): React.Node => (${path.node})`),
      ])
    )
  } else if (isTypeScript) {
    element.replaceWith((path: ASTPath<any>) =>
      j.jsxElement(open, close, [
        j.jsxExpressionContainer(
          expression`(): React.ReactNode => (${path.node})`
        ),
      ])
    )
  } else {
    element.replaceWith((path: ASTPath<any>) =>
      j.jsxElement(open, close, [
        j.jsxExpressionContainer(expression`() => (${path.node})`),
      ])
    )
  }

  return root.toSource()
}
