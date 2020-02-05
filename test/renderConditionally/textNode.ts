export const file = 'test.js'
export const parser = 'babylon'

export const options = {}

export const input = `
import * as React from 'react'

const Foo = () => (
  <div>
    te/* selectionStart */s/* selectionEnd */t
  </div>
)
`

export const expected = `
import * as React from 'react'

const Foo = () => (
  <div>
    te{true && 's'}t
  </div>
)
`
