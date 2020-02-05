export const input = `
import * as React from 'react'

const Foo = () => <div />

const Comp = () => (
  <div>
    {fo/* selectionStart *//* selectionEnd */o}
  </div>
)
`

export const file = 'test.js'
export const parser = 'babylon'

export const options = {
  name: 'Test',
}

export const expected = `
import * as React from 'react'

const Foo = () => <div />

const Comp = () => (
  <div>
    <Test>
      {() => foo}
    </Test>
  </div>
)
`
