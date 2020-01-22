/* eslint-disable @typescript-eslint/no-explicit-any */

import { ASTPath, Node, FileInfo, API, Options } from 'jscodeshift'
import pathsInRange from 'jscodeshift-paths-in-range'
import hasFlowAnnotation from './util/hasFlowAnnotation'

type Filter = (
  path: ASTPath<Node>,
  index: number,
  paths: Array<ASTPath<Node>>
) => boolean

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

  let filter: Filter
  if (options.selectionStart) {
    const selectionStart = parseInt(options.selectionStart)
    const selectionEnd = options.selectionEnd
      ? parseInt(options.selectionEnd)
      : selectionStart
    filter = pathsInRange(selectionStart, selectionEnd)
  } else {
    filter = (): boolean => true
  }

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
