import { FileInfo, API, Options } from 'jscodeshift'
import groupSelections from './util/groupSelections'
import getExpression from './util/getExpression'

module.exports = function renderConditionally(
  fileInfo: FileInfo,
  api: API,
  options: Options
): string | null | undefined | void {
  const j = api.jscodeshift
  const { expression } = j.template

  const root = j(fileInfo.source)

  for (const group of groupSelections(root, options)) {
    const node = getExpression(group.node)
    const parentType = group.parent?.node?.type

    group.replace(
      parentType === 'JSXElement'
        ? j.jsxExpressionContainer(expression`true && ${node}`)
        : expression`true ? ${node} : <React.Fragment />`
    )
  }

  return root.toSource()
}
