export const file = 'test.tsx'
export const parser = 'tsx'

export const options = {}

export const input = `
import * as React from 'react'
export default class Foo extends React.Component<Props> {
  render(): React.ReactNode | null {
    return <div>{this.props.title}</div>
  }
}
`

export const expected = `
import * as React from 'react'
export default function Foo(props: Props): React.ReactNode | null {
  return <div>{props.title}</div>
}
`
