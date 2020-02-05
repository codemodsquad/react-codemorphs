export const input = `
const Comp = () => (
  <div>
    This /* selectionStart */is a
    <button>
      Test
    </button>/* selectionEnd */
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
    This{' '}
    <Test>
      is a
      <button>
        Test
      </button>
    </Test>
    <span />
  </div>
)
`
