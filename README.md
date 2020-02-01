# react-codemorphs

[![CircleCI](https://circleci.com/gh/codemodsquad/react-codemorphs.svg?style=svg)](https://circleci.com/gh/codemodsquad/react-codemorphs)
[![Coverage Status](https://codecov.io/gh/codemodsquad/react-codemorphs/branch/master/graph/badge.svg)](https://codecov.io/gh/codemodsquad/react-codemorphs)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![npm version](https://badge.fury.io/js/react-codemorphs.svg)](https://badge.fury.io/js/react-codemorphs)

codemods for everyday work with React

These codemods are intended to be called from IDE extensions, calling them
from the `jscodeshift` CLI wouldn't be worth the effort.

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
jscodeshift -t path/to/react-codemorphs/wrapWithJSXElement.js \
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
