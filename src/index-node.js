import { createCanonicalRequest } from './core.js'
import { hash, hmac, parseUrl } from './helpers-node.js'

const signAwsRequest = ({ config }) => (request, options) => createCanonicalRequest({
	date: options && options.date,
	hmac,
	hash,
	parseUrl,
	config,
	request
})

export { signAwsRequest }
