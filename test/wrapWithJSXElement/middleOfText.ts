export const input = `
const Comp = () => (
  <div>
    This /* selectionStart */is a/* selectionEnd */ test
  </div>
)
`

export const options = {
  name: 'Test',
}

export const expected = `
const Comp = () => (
  <div>
    This<Test>is a</Test>test
  </div>
)
`
