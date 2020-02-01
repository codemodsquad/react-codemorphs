export const input = `
import * as React from 'react'

const Foo = () => {
  // position
  return <div>{text}</div>
}
`

export const file = 'test.js'
export const parser = 'babylon'

export const expectedError = `an identifier must be selected or under the cursor`
