/* eslint-disable @typescript-eslint/no-explicit-any */

import { Collection } from 'jscodeshift/src/Collection'
import { ASTPath } from 'jscodeshift'

export default function groupByParent(
  collection: Collection<any>
): ASTPath<any>[][] {
  const groups: Map<ASTPath<any>, ASTPath<any>[]> = new Map()
  collection.forEach((path: ASTPath<any>): void => {
    let group = groups.get(path.parent)
    if (!group) {
      group = []
      groups.set(path.parent, group)
    }
    group.push(path)
  })
  return [...groups.values()]
}
