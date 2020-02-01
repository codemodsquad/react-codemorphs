import { ASTPath, Node } from 'jscodeshift'

export type Filter = (
  path: ASTPath<Node>,
  index: number,
  paths: Array<ASTPath<Node>>
) => boolean
