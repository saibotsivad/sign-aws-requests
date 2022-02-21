const textEnc = new TextEncoder('utf-8')
const encode = textEnc.encode.bind(textEnc)

const hmacToHex = buffer => Array
	.prototype
	.map
	.call(
		new Uint8Array(buffer),
		x => x.toString(16).padStart(2, '0'),
	)
	.join('')

const hmac = async (bits, value, makeHex) => {
	const key = await crypto
		.subtle
		.importKey('raw', bits, { name: 'HMAC', hash: 'SHA-256' }, false, [ 'sign' ])
	const result = await crypto
		.subtle
		.sign('HMAC', key, encode(value))
	return makeHex
		? hmacToHex(result)
		: result
}

const hmacSignature = async ({ secretAccessKey, signingValues, stringToSign }) => {
	let signingKey = encode(`AWS4${secretAccessKey}`)
	for (const value of signingValues) {
		signingKey = await hmac(signingKey, value)
	}

	const signature = await hmac(signingKey, stringToSign, true)
	signingKey = hmacToHex(signingKey)

	return { signature, signingKey }
}

const hash = async msg => crypto
	.subtle
	.digest('SHA-256', encode(msg))
	.then(hmacToHex)

const parseUrl = string => new URL(string)

export { hash, parseUrl, hmacSignature }
