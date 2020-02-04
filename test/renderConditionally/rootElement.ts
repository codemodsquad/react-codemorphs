export const file = 'test.js'
export const parser = 'babylon'

export const options = {}

export const input = `
import * as React from 'react'

const Foo = () => (
  /* selectionStart */
  <div />
  /* selectionEnd */
)
`

export const expected = `
import * as React from 'react'

const Foo = () => (
  true ? <div /> : <React.Fragment />
)
`
