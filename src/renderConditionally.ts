import { FileInfo, API, Options } from 'jscodeshift'
import groupByParent from './util/groupByParent'
import { getFilter } from './util/Filter'

module.exports = function renderConditionally(
  fileInfo: FileInfo,
  api: API,
  options: Options
): string | null | undefined | void {
  const j = api.jscodeshift
  const { expression } = j.template

  const root = j(fileInfo.source)
  const filter = getFilter(options)

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
        ? j.jsxExpressionContainer(expression`true && ${singleNode}`)
        : expression`true ? ${singleNode} : <React.Fragment />`
    )
    for (let i = 1, end = group.length; i < end; i++) {
      j(group[i]).remove()
    }
  }

  return root.toSource()
}
