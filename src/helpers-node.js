import { createHash, createHmac } from 'crypto'
import { URL } from 'url'

const hmac = async (key, data, makeHex) => createHmac('sha256', key)
	.update(Buffer.from(data))
	.digest(makeHex ? 'hex' : undefined)

const hash = async message => createHash('sha256')
	.update(message)
	.digest('hex')

const parseUrl = string => new URL(string)

export { hash, hmac, parseUrl }
