import { createCanonicalRequest } from './core.js'
import { hash, parseUrl, hmacSignature } from './helpers-node.js'

const createAwsSigner = ({ config }) => async (request, options) => createCanonicalRequest({
	date: options && options.date,
	formencode: options && options.formencode,
	hash,
	hmacSignature,
	parseUrl,
	config,
	request,
}).then(({ authorization, bodyString }) => ({ authorization, bodyString }))

export { createAwsSigner }
