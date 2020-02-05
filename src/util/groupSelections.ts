import j from 'jscodeshift'
import { Options, ASTPath } from 'jscodeshift'
import { Collection } from 'jscodeshift/src/Collection'
import { getSelectionRange } from './Filter'
import { pathsIntersectingRange } from 'jscodeshift-paths-in-range'
import groupByParent from './groupByParent'
import groupJSXChildren from './groupJSXChildren'

export default function groupSelections(
  root: Collection<any>,
  options: Options
): ASTPath<any>[] {
  const range = getSelectionRange(options)
  if (!range) {
    throw new Error('selectionStart option is required')
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
    .filter(pathsIntersectingRange(range[0], range[1]))

  return groupByParent(elements).map(group => groupJSXChildren(group, range))
}
