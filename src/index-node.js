import { createCanonicalRequest } from './core.js'
import { hash, parseUrl, hmacSignature } from './helpers-node.js'

const signAwsRequest = ({ config }) => (request, options) => createCanonicalRequest({
	date: options && options.date,
	hash,
	hmacSignature,
	parseUrl,
	config,
	request
})

export { signAwsRequest }
