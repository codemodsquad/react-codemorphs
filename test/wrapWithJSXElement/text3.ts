export const input = `
const Comp = () => (
  <div>/* selectionStart */
    This is a
    <button>
      Test
    </button>
    blah 
    /* selectionEnd */
    baz
    <span />
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
      This is a<button>Test</button>blah
    </Test>
    baz
    <span />
  </div>
)
`
