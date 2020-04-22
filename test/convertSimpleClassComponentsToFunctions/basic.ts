export const file = 'test.js'
export const parser = 'babylon'

export const options = {}

export const input = `
import * as React from 'react'
export default class Foo extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
  }
  static contextTypes = {
    temp: PropTypes.string,
  }
  static defaultProps = {
    title: 'Title',
  }
  render() {
    return <div>{this.props.title} {this.context.temp}</div>
  }
}
`

export const expected = `
import * as React from 'react'
export default function Foo(props, context) {
  return <div>{props.title} {context.temp}</div>
}
Foo.propTypes = {
  title: PropTypes.string.isRequired,
}
Foo.defaultProps = {
  title: 'Title',
}
Foo.contextTypes = {
  temp: PropTypes.string,
}
`
