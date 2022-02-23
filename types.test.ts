// This is just a manual test of the TypeScript types file. All I do
// right now is pull it up in WebStorm and make sure it doesn't have
// red wiggly lines.

import * as signer from './types'

const config: signer.Configuration = {
	service: 'f',
	region: 'f',
	secretAccessKey: 'f',
	accessKeyId: 'f',
}

// creating a signer requires the config object
const sign = signer.createAwsSigner({ config })

// does not require additional options
const request1: signer.AwsRequest = {
	url: new URL('https://site.com/foo'),
	method: 'POST',
	headers: {
		foo: 'bar',
	},
}
const out1 = sign(request1)
console.log(out1)

// the options don't require anything
const request2: signer.AwsRequest = {
	url: 'https://site.com/foo',
	headers: {},
}
const options2: signer.AwsRequestOptions = {}
const out2 = sign(request2, options2)
console.log(out2)

// if date is set it needs to be a native date
const request3: signer.AwsRequest = {
	url: 'https://site.com/foo',
	headers: {},
}
const options3: signer.AwsRequestOptions = {
	date: new Date(),
}
const out3 = sign(request3, options3)
console.log(out3)
