import { readFileSync, writeFileSync } from 'node:fs'

const suite = readFileSync('./node_modules/@saibotsivad/aws-sig-v4-test-suite/index.json', 'utf8')

writeFileSync('./built-test-suite.js', `export const suite = ${suite}`, 'utf8')
