export const file = 'test.tsx'
export const parser = 'tsx'

export const options = {}

export const input = `
import * as React from 'react'
import PropTypes from 'prop-types'
export default class Foo extends React.Component<Props> {
  static propTypes = {
    title: PropTypes.string.isRequired,
  }
  render(): React.ReactNode | null {
    return <div>{this.props.title}</div>
  }
}
`

export const expected = `
import * as React from 'react'
import PropTypes from 'prop-types'
export default function Foo(props: Props): React.ReactNode | null {
  return <div>{props.title}</div>
}
Foo.propTypes = {
  title: PropTypes.string.isRequired,
}
`
