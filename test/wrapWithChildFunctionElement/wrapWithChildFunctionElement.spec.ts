/* eslint-disable @typescript-eslint/no-var-requires */

import { describe } from 'mocha'
import * as path from 'path'
import testFixtures from '../testFixtures'
const wrapWithChildFunctionElement = require('../../src/wrapWithChildFunctionElement')

describe(`wrapWithChildFunctionElement`, function() {
  testFixtures({
    glob: path.join(__dirname, 'fixtures', '*.ts'),
    transform: wrapWithChildFunctionElement,
  })
})
