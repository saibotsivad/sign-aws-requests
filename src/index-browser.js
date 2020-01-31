import { createCanonicalRequest } from './core.js'
import { hash, parseUrl, hmacSignature } from './helpers-browser.js'

const signAwsRequest = ({ config }) => (request, options) => createCanonicalRequest({
	date: options && options.date,
	hash,
	parseUrl,
	hmacSignature,
	config,
	request
})

export { signAwsRequest }
