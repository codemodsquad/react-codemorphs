export const input = `
const Comp = () => (
  <div>/* selectionStart */
    This is/* selectionEnd */ a test
  </div>
)
`

export const options = {
  name: 'Test',
}

export const expected = `
const Comp = () => (
  <div>
    <Test>
      This is
    </Test>a test
  </div>
)
`
