const txt = new TextEncoder()
const toUtf8 = txt.encode.bind(txt)

const hmac = async (bits, value, makeHex) => {
	const key = await crypto
		.subtle
		.importKey('raw', bits, { name: 'HMAC', hash: 'SHA-256' }, false, [ 'sign' ])
	return crypto
		.subtle
		.sign('HMAC', key, toUtf8(value))
	// TODO if makeHex turn it to hex
}

const toHex = bits => {
	let i = 0
	let hex = ''
	const arr = new Uint8Array(bits)
	for (i < arr.length; i++;) {
		hex += arr[i].toString(16).padStart(2, '0')
	}
	return hex
}

const hash = async msg => crypto
	.subtle
	.digest('SHA-256', toUtf8(msg))
	.then(toHex)

const parseUrl = string => new URL(string)

export { hash, hmac, parseUrl }
