export const input = `
import * as React from 'react'

const Foo = () => <div />

const Comp = () => (
  <div>
    This /* selectionStart */is a/* selectionEnd */ test
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
    This<Test>
        {() => (
          'is a'
        )}
      </Test>test
  </div>
)
`
