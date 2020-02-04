export const file = 'test.js'
export const parser = 'babylon'

export const options = {}

export const input = `
import * as React from 'react'

const Foo = () => (
  <div>
    /* selectionStart */
    {foo}{' '}bar
    <div className="b" />
    /* selectionEnd */
    <div className="c" />
  </div>
)
`

export const expected = `
import * as React from 'react'

const Foo = () => (
  <div>
    {true &&
      <React.Fragment>
        {foo}{' '}bar
        <div className="b" />
      </React.Fragment>
    }
    <div className="c" />
  </div>
)
`
