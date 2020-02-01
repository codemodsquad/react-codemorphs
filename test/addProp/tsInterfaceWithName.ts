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
export const options = {
  typeAnnotation: 'number',
}

export const expected = `
import * as React from 'react'

interface Props { text: number }

const Foo = (props: Props) => (
  <div>{props.text}</div>
)
`
