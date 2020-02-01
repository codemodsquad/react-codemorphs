import { ASTPath, Node, FileInfo, API, Options } from 'jscodeshift'
import pathsInRange from 'jscodeshift-paths-in-range'
import getReactComponent from './util/getReactComponent'
import getPropsType from './util/getPropsType'
import addPropType from './util/addPropType'
import parseTypeAnnotation from './util/parseTypeAnnotation'

type Filter = (
  path: ASTPath<Node>,
  index: number,
  paths: Array<ASTPath<Node>>
) => boolean

module.exports = function addProp(
  fileInfo: FileInfo,
  api: API,
  options: Options
): string | null | undefined | void {
  const j = api.jscodeshift
  const { statement } = j.template

  const root = j(fileInfo.source)

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

  const typeAnnotation = parseTypeAnnotation(j, options.typeAnnotation || 'any')

  const identifier = root.find(j.Identifier).filter(filter)

  if (!identifier.size()) {
    throw new Error('an identifier must be selected or under the cursor')
  }
  const name = identifier.at(0).nodes()[0].name

  const component = getReactComponent(root, filter)
  const propsType = getPropsType(component)
  if (propsType) addPropType(propsType, name, typeAnnotation)

  if (component.node.type === 'ClassDeclaration') {
    const blockStatement = identifier.closest(j.BlockStatement)
    const [declarator] = blockStatement
      .find(j.VariableDeclarator, {
        init: {
          type: 'MemberExpression',
          object: { type: 'ThisExpression' },
          property: { type: 'Identifier', name: 'props' },
        },
      })
      .at(0)
      .nodes()
    if (declarator && declarator.id.type === 'ObjectPattern') {
      const property = j.objectProperty(j.identifier(name), j.identifier(name))
      property.shorthand = true
      declarator.id.properties.push(property)
    } else if (blockStatement.size()) {
      blockStatement
        .nodes()[0]
        .body.unshift(statement([`const {${name}} = this.props`]))
    }
  } else {
    if (!component.node.params.length) {
      component.node.params.push(j.objectPattern([]))
    }
    const props = component.node.params[0]
    if (props.type === 'Identifier') {
      const { body } = component.node
      if (body.type === 'BlockStatement') {
        const [declarator] = j([component.get('body')])
          .find(j.VariableDeclarator, {
            init: {
              type: 'Identifier',
              name: props.name,
            },
          })
          .at(0)
          .nodes()
        if (declarator && declarator.id.type === 'ObjectPattern') {
          const property = j.objectProperty(
            j.identifier(name),
            j.identifier(name)
          )
          property.shorthand = true
          declarator.id.properties.push(property)
        } else {
          body.body.unshift(statement([`const {${name}} = ${props.name}`]))
        }
      } else {
        identifier.replaceWith(() =>
          j.memberExpression(j.identifier(props.name), j.identifier(name))
        )
      }
    } else if (props.type === 'ObjectPattern') {
      const property = j.objectProperty(j.identifier(name), j.identifier(name))
      property.shorthand = true
      props.properties.push(property)
    }
  }

  return root.toSource()
}
