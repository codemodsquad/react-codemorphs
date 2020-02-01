export const input = `
// @flow
import * as React from 'react'

type Props = {
}

const Foo = (props: Props) => (
  <div>{te/* selectionStart *//* selectionEnd */xt}</div>
)
`

export const file = 'test.js'
export const parser = 'babylon'

export const expected = `
// @flow
import * as React from 'react'

type Props = { +text: any }

const Foo = (props: Props) => (
  <div>{props.text}</div>
)
`
