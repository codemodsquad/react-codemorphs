import { FileInfo, API, Options } from 'jscodeshift'
import groupSelections from './util/groupSelections'
import isReactFragment from './util/isReactFragment'

module.exports = function addStyles(
  fileInfo: FileInfo,
  api: API,
  options: Options
): string | null | undefined | void {
  const j = api.jscodeshift

  const root = j(fileInfo.source)

  const { name } = options
  if (!name || typeof name !== 'string') {
    throw new Error('options.name must be a non-empty string')
  }

  for (const group of groupSelections(root, options)) {
    const { node } = group
    group.replace(
      j.jsxElement(
        j.jsxOpeningElement(j.jsxIdentifier(name)),
        j.jsxClosingElement(j.jsxIdentifier(name)),
        node.type === 'JSXFragment' || isReactFragment(node)
          ? node.children
          : [node]
      )
    )
  }

  return root.toSource()
}
