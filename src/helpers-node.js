import { createHash, createHmac } from 'crypto'
import { URL } from 'url'

const hmac = async (key, data, makeHex) => createHmac('sha256', key)
	.update(Buffer.from(data))
	.digest(makeHex ? 'hex' : undefined)

const hmacSignature = async ({ secretAccessKey, signingValues, stringToSign }) => {
	let signingKey = `AWS4${secretAccessKey}`
	for (const value of signingValues) {
		signingKey = await hmac(signingKey, value)
	}

	const signature = await hmac(signingKey, stringToSign, true)
	signingKey = signingKey.toString('hex')

	return { signature, signingKey }
}

const hash = async message => createHash('sha256')
	.update(message)
	.digest('hex')

const parseUrl = string => new URL(string)

export { hash, parseUrl, hmacSignature }
