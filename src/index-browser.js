import { createCanonicalRequest } from './core.js'
import { hash, parseUrl, hmacSignature } from './helpers-browser.js'

const createAwsSigner = ({ config }) => async (request, options) => createCanonicalRequest({
	date: options && options.date,
	formencode: options && options.formencode,
	hash,
	parseUrl,
	hmacSignature,
	config,
	request,
}).then(({ authorization, bodyString }) => ({ authorization, bodyString }))

export { createAwsSigner }
