import { createCanonicalRequest } from './core.js'
import { hash, parseUrl, hmacSignature } from './helpers-browser.js'

const createAwsSigner = ({ config }) => async (request, options) => createCanonicalRequest({
	date: options && options.date,
	hash,
	parseUrl,
	hmacSignature,
	config,
	request
}).then(({ authorization }) => ({ authorization }))

export { createAwsSigner }
