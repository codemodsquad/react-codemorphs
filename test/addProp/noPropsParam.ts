export const input = `
import * as React from 'react'

const Foo = () => {
  return <div>{te/* selectionStart *//* selectionEnd */xt}</div>
}
`

export const file = 'test.js'
export const parser = 'babylon'

export const expected = `
import * as React from 'react'

const Foo = ({text}) => {
  return <div>{text}</div>
}
`
