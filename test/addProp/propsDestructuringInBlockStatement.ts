export const input = `
import * as React from 'react'

const Foo = (props) => {
  const {foo} = props
  return <div>{te/* selectionStart *//* selectionEnd */xt}</div>
}
`

export const file = 'test.js'
export const parser = 'babylon'

export const expected = `
import * as React from 'react'

const Foo = (props) => {
  const {foo, text} = props
  return <div>{text}</div>
}
`
