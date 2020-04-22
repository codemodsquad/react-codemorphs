export const file = 'test.js'
export const parser = 'babylon'

export const options = {}

export const input = `
import * as React from 'react'
class Bar extends React.Component {
  componentDidUpdate(prevProps) {}
  render() {
    return <div>{this.props.title}</div>
  }
}
`

export const expected = input
