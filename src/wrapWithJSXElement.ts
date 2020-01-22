import { ASTPath, Node, FileInfo, API, Options } from 'jscodeshift'
import pathsInRange from 'jscodeshift-paths-in-range'
import groupByParent from './util/groupByParent'

type Filter = (
  path: ASTPath<Node>,
  index: number,
  paths: Array<ASTPath<Node>>
) => boolean

module.exports = function addStyles(
  fileInfo: FileInfo,
  api: API,
  options: Options
): string | null | undefined | void {
  const j = api.jscodeshift

  const { statement } = j.template
  const root = j(fileInfo.source)

  const { name } = options
  if (!name || typeof name !== 'string') {
    throw new Error('options.name must be a non-empty string')
  }

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

  for (const group of groupByParent(elements)) {
    j(group[0]).replaceWith(
      j.jsxElement(
        j.jsxOpeningElement(j.jsxIdentifier(name)),
        j.jsxClosingElement(j.jsxIdentifier(name)),
        group.map(path => path.node)
      )
    )
    for (let i = 1, end = group.length; i < end; i++) {
      j(group[i]).remove()
    }
  }

  return root.toSource()
}
