import j, { ASTPath } from 'jscodeshift'
import { Collection } from 'jscodeshift/src/Collection'
import { Filter } from './Filter'
import {
  ArrowFunctionExpression,
  FunctionExpression,
  FunctionDeclaration,
  ClassDeclaration,
} from 'jscodeshift'
import isReactComponentClass from './isReactComponentClass'

export default function getReactComponent(
  root: Collection<any>,
  filter: Filter
):
  | ASTPath<ArrowFunctionExpression>
  | ASTPath<FunctionExpression>
  | ASTPath<FunctionDeclaration>
  | ASTPath<ClassDeclaration> {
  const arrowFunction = root
    .find(j.ArrowFunctionExpression)
    .filter(filter)
    .at(0)
  if (arrowFunction.size()) return arrowFunction.paths()[0]
  const functionExpression = root
    .find(j.FunctionExpression)
    .filter(filter)
    .at(0)
  if (functionExpression.size()) return functionExpression.paths()[0]
  const functionDeclaration = root
    .find(j.FunctionDeclaration)
    .filter(filter)
    .at(0)
  if (functionDeclaration.size()) return functionDeclaration.paths()[0]
  const classDeclaration = root
    .find(j.ClassDeclaration)
    .filter(isReactComponentClass)
    .filter(filter)
    .at(0)
  if (classDeclaration.size()) return classDeclaration.paths()[0]

  throw new Error(`failed to find a React component to operate on.
try positioning the cursor inside a component.`)
}
