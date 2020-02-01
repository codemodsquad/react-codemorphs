export const input = `
const Comp = () => (
  <div>
    /* selectionStart */
    {foo}
    {bar}
    <span />
    /* selectionEnd */
    {baz}
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
      {foo}
      {bar}
      <span />
    </Test>
    {baz}
  </div>
)
`
