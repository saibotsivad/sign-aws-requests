import { createCanonicalRequest } from './core.js'
import { hash, parseUrl, hmacSignature } from './helpers-node.js'

const createAwsSigner = ({ config }) => async (request, options) => createCanonicalRequest({
	date: options && options.date,
	hash,
	hmacSignature,
	parseUrl,
	config,
	request
}).then(({ authorization }) => ({ authorization }))

export { createAwsSigner }
