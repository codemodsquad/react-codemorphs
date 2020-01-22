export const input = `
import * as React from 'react'

const Foo = () => <div />

const Comp = () => (
  <div>
    <Foo /* selectionStart *//* selectionEnd *//>
  </div>
)
`

export const file = 'test.tsx'
export const parser = 'tsx'

export const options = {
  name: 'Test',
}

export const expected = `
import * as React from 'react'

const Foo = () => <div />

const Comp = () => (
  <div>
    <Test>
      {(): React.ReactNode => (
        <Foo />
      )}
    </Test>
  </div>
)
`
