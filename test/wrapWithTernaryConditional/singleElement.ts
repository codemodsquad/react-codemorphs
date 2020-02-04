export const file = 'test.js'
export const parser = 'babylon'

export const options = {}

export const input = `
import * as React from 'react'

const Foo = () => (
  <div>
    /* selectionStart */<div />/* selectionEnd */
  </div>
)
`

export const expected = `
import * as React from 'react'

const Foo = () => (
  <div>
    {true ? <div /> : null}
  </div>
)
`
