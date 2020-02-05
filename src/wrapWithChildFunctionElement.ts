/* eslint-disable @typescript-eslint/no-explicit-any */

import { FileInfo, API, Options } from 'jscodeshift'
import hasFlowAnnotation from './util/hasFlowAnnotation'
import groupSelections from './util/groupSelections'
import getExpression from './util/getExpression'

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

  const name = j.jsxIdentifier(options.name)
  const open = j.jsxOpeningElement(name)
  const close = j.jsxClosingElement(name)

  const isTypeScript = /\.tsx?/.test(fileInfo.path)
  const isFlow = hasFlowAnnotation(root)

  for (const group of groupSelections(root, options)) {
    const node = getExpression(group.node)

    if (isFlow) {
      group.replace(
        j.jsxElement(open, close, [
          j.jsxExpressionContainer(expression`(): React.Node => (${node})`),
        ])
      )
    } else if (isTypeScript) {
      group.replace(
        j.jsxElement(open, close, [
          j.jsxExpressionContainer(
            expression`(): React.ReactNode => (${node})`
          ),
        ])
      )
    } else {
      group.replace(
        j.jsxElement(open, close, [
          j.jsxExpressionContainer(expression`() => (${node})`),
        ])
      )
    }
  }

  return root.toSource()
}
