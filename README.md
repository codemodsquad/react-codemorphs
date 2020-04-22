# react-codemorphs

[![CircleCI](https://circleci.com/gh/codemodsquad/react-codemorphs.svg?style=svg)](https://circleci.com/gh/codemodsquad/react-codemorphs)
[![Coverage Status](https://codecov.io/gh/codemodsquad/react-codemorphs/branch/master/graph/badge.svg)](https://codecov.io/gh/codemodsquad/react-codemorphs)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![npm version](https://badge.fury.io/js/react-codemorphs.svg)](https://badge.fury.io/js/react-codemorphs)

Codemods for everyday work with React. All support
Flow, TypeScript, and plain JS.

Most of these codemods (except for `convertSimpleClassComponentsToFunctions`) are intended to be called from IDE extensions, calling them
from the `jscodeshift` CLI wouldn't be worth the effort.

# Table of Contents

<!-- toc -->

- [`wrapWithJSXElement`](#wrapwithjsxelement)
- [`wrapWithChildFunctionElement`](#wrapwithchildfunctionelement)
- [`addProp`](#addprop)
- [`renderConditionally`](#renderconditionally)
- [`wrapWithTernaryConditional`](#wrapwithternaryconditional)
- [`convertSimpleClassComponentsToFunctions`](#convertsimpleclasscomponentstofunctions)

<!-- tocstop -->

# `wrapWithJSXElement`

A codemod that wraps selected JSX elements inside a parent JSX element.
This is intended to be called from IDE extensions, it's too cumbersome to call
from the JSCodeshift CLI.

## Special Options

### `selectionStart` (`number`, **required**)

The start of the selection in the source code. This is used for determining which JSX elements to wrap.

### `selectionEnd` (`number`, **required**)

The end of the selection in the source code. This is used for determining which JSX elements to wrap.

### `name` (`string`, **required**)

The name of the JSX element to wrap with.

## Example

### Before

```tsx
const Foo = () => (
  <div>
    {foo}
    {bar}
    <span />
    {baz}
  </div>
)
```

### Transform

```
jscodeshift -t path/to/react-codemorphs/wrapWithJSXElement.js \
  --selectionStart=<before {foo}> \
  --selectionEnd=<before {baz}> \
  --name=Test
  Foo.ts
```

### After (with formatting)

```tsx
const Foo = () => (
  <div>
    <Test>
      {foo}
      {bar}
      <span />
    </Test>
    {baz}
  </div>
)
```

# `wrapWithChildFunctionElement`

A codemod that wraps a selected JSX element inside a parent JSX element with a child function.

## Special Options

### `selectionStart` (`number`, **required**)

The start of the selection in the source code. This is used for determining which JSX element to wrap.

### `selectionEnd` (`number`, **required**)

The end of the selection in the source code. This is used for determining which JSX element to wrap.

### `name` (`string`, **required**)

The name of the JSX element to wrap with.

## Example

### Before

```tsx
const Foo = () => (
  <div>
    <Bar />
  </div>
)
```

### Transform

```
jscodeshift -t path/to/react-codemorphs/wrapWithChildFunctionElement.js \
  --selectionStart=<in the middle of Bar> \
  --selectionEnd=<in the middle of Bar> \
  --name=Test
  Foo.ts
```

### After (with formatting)

```tsx
const Foo = () => (
  <div>
    <Test>{(): React.ReactNode => <Bar />}</Test>
  </div>
)
```

# `addProp`

A codemod that adds the identifier under the cursor as a prop to the surrounding component.
Adds a prop type declaration if possible, and binds the identifier via destructuring on `props`
or replaces it with a reference to `props`/`this.props`.

## Special Options

### `selectionStart` (`number`, **required**)

The start of the selection in the source code. This is used for determining which property to add.

### `selectionEnd` (`number`, **required**)

The end of the selection in the source code. This is used for determining which property to add.

### `typeAnnotation` (`string`, **optional**)

The Flow or TypeScript type annotation to use for the property type declaration.

## Example

### Before

Cursor is positioned in the middle of `text` below:

```tsx
import * as React from 'react'

interface Props {}

const Foo = (props: Props) => <div>{text}</div>
```

### Transform

```
jscodeshift -t path/to/react-codemorphs/addProp.js \
  --selectionStart=<in the middle of text> \
  --selectionEnd=<in the middle of text> \
  --typeAnnotation=string
  Foo.ts
```

### After (with formatting)

```tsx
import * as React from 'react'

interface Props {
  text: string
}

const Foo = (props: Props) => <div>{props.text}</div>
```

# `renderConditionally`

Wraps the selected JSX in `{true && ...}`. If
there are multiple siblings selected, wraps in `{true && <React.Fragment>...</React.Fragment>}`.

If you want to wrap in a ternary conditional like Glean's
"Render Conditionally" refactor, see `wrapWithTernaryConditional`.

## Special Options

### `selectionStart` (`number`, **required**)

The start of the selection in the source code. This is used for determining which JSX elements to wrap.

### `selectionEnd` (`number`, **required**)

The end of the selection in the source code. This is used for determining which JSX elements to wrap.

## Example

### Before

```tsx
const Foo = () => (
  <div>
    {foo} bar
    <span />
    {baz}
  </div>
)
```

### Transform

```
jscodeshift -t path/to/react-codemorphs/renderConditionally.js \
  --selectionStart=<before {foo}> \
  --selectionEnd=<before {baz}> \
  Foo.ts
```

### After (with formatting)

```tsx
const Foo = () => (
  <div>
    {true && (
      <React.Fragment>
        {foo} bar
        <span />
      </React.Fragment>
    )}
    {baz}
  </div>
)
```

# `wrapWithTernaryConditional`

Wraps the selected JSX in `{true ? ... : null}`. If
there are multiple siblings selected, wraps in `{true ? <React.Fragment>...</React.Fragment> : null}`.

## Special Options

### `selectionStart` (`number`, **required**)

The start of the selection in the source code. This is used for determining which JSX elements to wrap.

### `selectionEnd` (`number`, **required**)

The end of the selection in the source code. This is used for determining which JSX elements to wrap.

## Example

### Before

```tsx
const Foo = () => (
  <div>
    {foo} bar
    <span />
    {baz}
  </div>
)
```

### Transform

```
jscodeshift -t path/to/react-codemorphs/wrapWithTernaryConditional.js \
  --selectionStart=<before {foo}> \
  --selectionEnd=<before {baz}> \
  Foo.ts
```

### After (with formatting)

```tsx
const Foo = () => (
  <div>
    {true ? (
      <React.Fragment>
        {foo} bar
        <span />
      </React.Fragment>
    ) : null}
    {baz}
  </div>
)
```

# `convertSimpleClassComponentsToFunctions`

Converts `React.Component` subclasses with only a `render` method (no lifecycle methods, constructors, or class properties other than `propTypes`, `contextTypes`, `defaultProps`, and no `state` type parameter) into functional components.

## Example

### Before

```ts
import * as React from 'react'
import PropTypes from 'prop-types'
export default class Foo extends React.Component<Props> {
  static propTypes = {
    title: PropTypes.string.isRequired,
  }
  render(): React.ReactNode | null {
    return <div>{this.props.title}</div>
  }
}
```

### Command

```
jscodeshift -t path/to/react-codemorphs/convertSimpleClassComponentsToFunctions.js <file>
```

### After

```ts
import * as React from 'react'
import PropTypes from 'prop-types'
export default function Foo(props: Props): React.ReactNode | null {
  return <div>{props.title}</div>
}
Foo.propTypes = {
  title: PropTypes.string.isRequired,
}
```
