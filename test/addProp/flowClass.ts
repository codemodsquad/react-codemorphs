export const input = `
// @flow
import * as React from 'react'

type Props = {
}

class Foo extends React.Component<Props> {
  render(): React.Node {
    return <div>{te/* selectionStart *//* selectionEnd */xt}</div>
  }
}
`

export const file = 'test.js'
export const parser = 'babylon'

export const expected = `
// @flow
import * as React from 'react'

type Props = { +text: any }

class Foo extends React.Component<Props> {
  render(): React.Node {
    const {text} = this.props
    return <div>{text}</div>
  }
}
`
