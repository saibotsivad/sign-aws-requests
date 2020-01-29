const ALGORITHM = 'AWS4-HMAC-SHA256'

// https://github.com/aws/aws-sdk-js/blob/cc29728c1c4178969ebabe3bbe6b6f3159436394/lib/signers/v4.js#L190-L198
const DO_NOT_SIGN = [
	// 'authorization',
	// // 'content-type',
	// // 'content-length',
	// 'expect',
	// 'presigned-expires',
	// 'user-agent',
	// 'x-amzn-trace-id'
]

const formatHeaderValue = header => {
	if (typeof header === 'string') {
		return header.trim().replace(/ +/g, ' ')
	} else if (Array.isArray(header)) {
		return header.map(formatHeaderValue).join(',')
	}
	return ''
}

// https://docs.aws.amazon.com/general/latest/gr/sigv4-create-canonical-request.html
// > Each path segment must be URI-encoded twice (except for Amazon S3 which
// > only gets URI-encoded once). ... do not normalize URI paths for requests
// > to Amazon S3.
const getCanonicalUri = (path, isS3) => {
	const uriPath = (path || '/')
	return isS3
		? encodeURI(uriPath)
		: encodeURI(encodeURI(uriPath.replace(/\/+/g, '/')))
}

// Sort by parameter name. Assumes query parameters are already encoded correctly.
// https://docs.aws.amazon.com/general/latest/gr/sigv4-create-canonical-request.html
const getCanonicalQuery = query => (query || '')
	.split('&')
	.sort()
	.join('&')

const getCanonicalHeaderValues = (headerKeys, headers) => headerKeys
	.map(key => `${key.toLowerCase().trim()}:${formatHeaderValue(headers[key])}`)
	.sort()
	.join('\n')
	+ '\n'

const getCanonicalHeaderKeyList = headerKeys => headerKeys
	.map(key => key.toLowerCase())
	.sort()
	.join(';')

const getFormattedDate = date => (date || new Date())
	.toISOString()
	.replace(/[:-]/g, '')
	.replace(/\.\d\d\dZ/, 'Z')

const createCanonicalRequest = async ({
	date,
	hmac,
	hash,
	parseUrl,
	config,
	request // { method, url, body, headers = {} }
}) => {
	const { service, region, secretAccessKey, accessKeyId } = config
	const { search, pathname } = parseUrl(request.url)

	if (date || !request.headers['X-Amz-Date']) {
		request.headers['X-Amz-Date'] = getFormattedDate(date)
	}
	const dateFragment = request.headers['X-Amz-Date'].split('T')[0]

	const signableHeaderKeys = Object
		.keys(request.headers)
		.filter(key => !DO_NOT_SIGN.includes(key.toLowerCase()))

	const canonicalHeaderKeyList = getCanonicalHeaderKeyList(signableHeaderKeys)

	const canonicalRequest = [
		request.method || (request.body ? 'POST' : 'GET'),
		getCanonicalUri(pathname, service === 's3'),
		getCanonicalQuery(search.replace(/^\?/, '')),
		getCanonicalHeaderValues(signableHeaderKeys, request.headers),
		canonicalHeaderKeyList,
		await hash(request.body || '')
	].join('\n')

	const hashedCanonicalRequest = await hash(canonicalRequest)

	const signingValues = [
		dateFragment,
		region,
		service,
		'aws4_request'
	]
	const credentialScope = signingValues.join('/')

	const stringToSign = [
		ALGORITHM,
		request.headers['X-Amz-Date'],
		credentialScope,
		hashedCanonicalRequest
	].join('\n')

	let signingKey = `AWS4${secretAccessKey}`
	let index = 0
	for (const value of signingValues) {
		index++
		signingKey = await hmac(signingKey, value)
	}
	const signature = await hmac(signingKey, stringToSign, true)
	signingKey = signingKey.toString('hex')

	return {
		canonicalRequest,
		hashedCanonicalRequest,
		stringToSign,
		signingKey,
		signature,
		authorization: `${ALGORITHM} Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${canonicalHeaderKeyList}, Signature=${signature}`
	}
}

export { createCanonicalRequest }
