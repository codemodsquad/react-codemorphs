/* eslint-disable @typescript-eslint/no-var-requires */

import { describe } from 'mocha'
import * as path from 'path'
import testFixtures from '../testFixtures'
const wrapWithJSXElement = require('../../src/wrapWithJSXElement')

describe(`wrapWithJSXElement`, function() {
  testFixtures({
    glob: path.join(__dirname, 'fixtures', '*.ts'),
    transform: wrapWithJSXElement,
    defaultParser: 'tsx',
  })
})
