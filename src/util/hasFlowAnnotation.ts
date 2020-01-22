/* eslint-disable @typescript-eslint/no-explicit-any */
import j, { ASTPath, Comment } from 'jscodeshift'
import Collection from 'jscodeshift/src/Collection'

export default function hasFlowAnnotation(
  root: Collection.Collection<any>
): boolean {
  return root
    .find(j.Comment)
    .some((path: ASTPath<any>) =>
      path.node.comments.some((comment: Comment) =>
        /@flow\s*$/m.test(comment.value)
      )
    )
}
