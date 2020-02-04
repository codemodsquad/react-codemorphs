import { ASTPath, Node, Options } from 'jscodeshift'
import pathsInRange from 'jscodeshift-paths-in-range'

export type Filter = (
  path: ASTPath<Node>,
  index: number,
  paths: Array<ASTPath<Node>>
) => boolean

export function getFilter(options: Options): Filter {
  // istanbul ignore else
  if (options.selectionStart) {
    const selectionStart = parseInt(options.selectionStart)
    const selectionEnd = options.selectionEnd
      ? parseInt(options.selectionEnd)
      : selectionStart
    return pathsInRange(selectionStart, selectionEnd)
  } else {
    return (): boolean => true
  }
}
