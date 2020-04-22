export const file = 'test.js'
export const parser = 'babylon'

export const options = {}

export const input = `
import * as React from 'react'
export default class Foo extends React.Component<Props> {
  static propTypes = {
    title: PropTypes.string.isRequired,
  }
  render(): React.Node | null {
    return <div>{this.props.title}</div>
  }
}
`

export const expected = `
import * as React from 'react'
export default function Foo(props: Props): React.Node | null {
  return <div>{props.title}</div>
}
Foo.propTypes = {
  title: PropTypes.string.isRequired,
}
`
