export const input = `
const Comp = () => (
  <div>
    This is/* selectionStart */ a test
  /* selectionEnd */</div>
)
`

export const options = {
  name: 'Test',
}

export const expected = `
const Comp = () => (
  <div>
    This is<Test>a test</Test>
  </div>
)
`
