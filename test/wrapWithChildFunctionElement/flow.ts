export const input = `
// @flow
import * as React from 'react'

const Foo = () => <div />

const Comp = () => (
  <div>
    <Foo /* selectionStart *//* selectionEnd *//>
  </div>
)
`

export const file = 'test.js'
export const parser = 'babylon'

export const options = {
  name: 'Test',
}

export const expected = `
// @flow
import * as React from 'react'

const Foo = () => <div />

const Comp = () => (
  <div>
    <Test>
      {(): React.Node => (
        <Foo />
      )}
    </Test>
  </div>
)
`
