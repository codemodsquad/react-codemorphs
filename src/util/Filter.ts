import { ASTPath, Node, Options } from 'jscodeshift'
import pathsInRange from 'jscodeshift-paths-in-range'

export type Filter = (
  path: ASTPath<Node>,
  index: number,
  paths: Array<ASTPath<Node>>
) => boolean

export function getSelectionRange(options: Options): [number, number] | null {
  // istanbul ignore else
  if (options.selectionStart) {
    const selectionStart = parseInt(options.selectionStart)
    const selectionEnd = options.selectionEnd
      ? parseInt(options.selectionEnd)
      : selectionStart
    return [selectionStart, selectionEnd]
  } else {
    return null
  }
}

export function getFilter(options: Options): Filter {
  const range = getSelectionRange(options)
  return range ? pathsInRange(range[0], range[1]) : (): boolean => true
}
