export const input = `
import * as React from 'react'

interface Props {
}

const Foo = (props: Props) => (
  <div>{te/* selectionStart *//* selectionEnd */xt}</div>
)
`

export const file = 'test.tsx'
export const parser = 'tsx'

export const expected = `
import * as React from 'react'

interface Props { text: any }

const Foo = (props: Props) => (
  <div>{props.text}</div>
)
`
