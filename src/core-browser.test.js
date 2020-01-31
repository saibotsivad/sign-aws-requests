import * as helpers from './helpers-browser.js'
import test from './core.test.js'

try {
	test(helpers)
} catch (e) {
	console.error(e)
}