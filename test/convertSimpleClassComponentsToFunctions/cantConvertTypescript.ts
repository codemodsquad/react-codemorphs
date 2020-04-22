export const file = 'test.js'
export const parser = 'babylon'

export const options = {}

export const input = `
import * as React from 'react'
class Foo extends React.Component<Props, State> {
  render(): React.ReactNode | null {
    return <div>{this.props.title}</div>
  }
}
class Bar extends React.Component<Props> {
  componentDidUpdate(prevProps: Props) {}
  render(): React.ReactNode | null {
    return <div>{this.props.title}</div>
  }
}
`

export const expected = input
