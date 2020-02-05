import j, { ASTPath } from 'jscodeshift'

export default function groupJSXChildren(
  group: ASTPath<any>[],
  selection: [number, number]
): ASTPath<any> {
  const [start, end] = selection
  if (group.length === 1) {
    const [{ node }] = group
    if (node.type === 'JSXText') {
      const before = node.value.substring(0, start - node.start)
      const selected = node.value.substring(
        start - node.start,
        end - node.start
      )
      const after = node.value.substring(end - node.start)
      node.value = selected
      if (before) {
        group[0].insertBefore(j.jsxText(before))
      }
      if (after) {
        group[0].insertAfter(j.jsxText(after))
      }
      return group[0]
    }
    return group[0]
  }

  const first = group[0].node
  const last = group[group.length - 1].node
  if (first.type === 'JSXText' && start > first.start) {
    const index = start - first.start
    const before = first.value.substring(0, index)
    const selected = first.value.substring(index)
    first.value = selected
    group[0].insertBefore(j.jsxText(before))
  }
  if (last.type === 'JSXText' && end < last.start + last.value.length) {
    const index = end - last.start
    const selected = last.value.substring(0, index)
    const after = last.value.substring(index)
    last.value = selected
    group[0].insertAfter(j.jsxText(after))
  }
  const fragment = j.jsxMemberExpression(
    j.jsxIdentifier('React'),
    j.jsxIdentifier('Fragment')
  )
  const [result] = group[0].replace(
    j.jsxElement(
      j.jsxOpeningElement(fragment),
      j.jsxClosingElement(fragment),
      group.map(path => path.node)
    )
  )
  for (let i = 1; i < group.length; i++) {
    group[i].prune()
  }
  return result
}
