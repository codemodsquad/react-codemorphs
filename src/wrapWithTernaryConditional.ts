import { ASTPath, Node, FileInfo, API, Options } from 'jscodeshift'
import pathsInRange from 'jscodeshift-paths-in-range'

import groupByParent from './util/groupByParent'

type Filter = (
  path: ASTPath<Node>,
  index: number,
  paths: Array<ASTPath<Node>>
) => boolean

module.exports = function wrapWithTernaryConditional(
  fileInfo: FileInfo,
  api: API,
  options: Options
): string | null | undefined | void {
  const j = api.jscodeshift
  const { expression } = j.template

  const root = j(fileInfo.source)

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

  const elements = root
    .find(j.Node)
    .filter(
      path =>
        path.node.type !== 'JSXOpeningElement' &&
        path.node.type !== 'JSXClosingElement' &&
        (path.node.type === 'JSXElement' ||
          (path.parent && path.parent.node.type === 'JSXElement'))
    )
    .filter(filter)

  const fragment = j.jsxMemberExpression(
    j.jsxIdentifier('React'),
    j.jsxIdentifier('Fragment')
  )

  for (const group of groupByParent(elements)) {
    const singleNode =
      group.length > 1
        ? j.jsxElement(
            j.jsxOpeningElement(fragment),
            j.jsxClosingElement(fragment),
            group.map(path => path.node)
          )
        : group[0].node
    const parentType = group[0].parent?.node?.type
    j(group[0]).replaceWith(
      parentType === 'JSXElement'
        ? j.jsxExpressionContainer(expression`true ? ${singleNode} : null`)
        : expression`true ? ${singleNode} : <React.Fragment />`
    )
    for (let i = 1, end = group.length; i < end; i++) {
      j(group[i]).remove()
    }
  }

  return root.toSource()
}
