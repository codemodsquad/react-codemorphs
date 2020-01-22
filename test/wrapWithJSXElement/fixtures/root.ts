export const input = `
const Comp = () => (
  <div /* selectionStart *//* selectionEnd */>
    {foo}
    {bar}
    <span />
    {baz}
  </div>
)
`

export const options = {
  name: 'Test',
}

export const expected = `
const Comp = () => (
  <Test>
    <div>
      {foo}
      {bar}
      <span />
      {baz}
    </div>
  </Test>
)
`
