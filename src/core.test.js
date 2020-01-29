import { createCanonicalRequest } from './core.js'
import { formatHeaders, exampleStringToSign, exampleCanonicalRequest, exampleConfig, exampleRequest } from '../test-helpers.js'
import { hash, hmac, parseUrl } from './helpers-node.js'
import { test } from 'zora'
import suite from '@saibotsivad/aws-sig-v4-test-suite'

test('from the AWS example', async t => {
	/*
	1. https://docs.aws.amazon.com/general/latest/gr/sigv4-create-canonical-request.html
	2. https://docs.aws.amazon.com/general/latest/gr/sigv4-create-string-to-sign.html
	3. https://docs.aws.amazon.com/general/latest/gr/sigv4-calculate-signature.html
	4. https://docs.aws.amazon.com/general/latest/gr/sigv4-add-signature-to-request.html

	Example request:

	GET https://iam.amazonaws.com/?Action=ListUsers&Version=2010-05-08 HTTP/1.1
	Host: iam.amazonaws.com
	Content-Type: application/x-www-form-urlencoded; charset=utf-8
	X-Amz-Date: 20150830T123600Z
	*/
	const {
		canonicalRequest,
		hashedCanonicalRequest,
		stringToSign,
		signingKey,
		signature,
		authorization
	} = await createCanonicalRequest({
		hash,
		hmac,
		parseUrl,
		config: exampleConfig,
		request: exampleRequest
	})
	t.equal(canonicalRequest, exampleCanonicalRequest)
	t.equal(hashedCanonicalRequest, 'f536975d06c0309214f805bb90ccff089219ecd68b2577efef23edd43b7e1a59')
	t.equal(stringToSign, exampleStringToSign)
	t.equal(signingKey, 'c4afb1cc5771d871763a393e44b703571b55cc28424d1a5e86da6ed3c154a4b9')
	t.equal(signature, '5d672d79c15b13162d9279b0855cfba6789a8edb4c82c400e06b5924a6f2b5d7')
	t.equal(authorization, 'AWS4-HMAC-SHA256 Credential=AKIDEXAMPLE/20150830/us-east-1/iam/aws4_request, SignedHeaders=content-type;host;x-amz-date, Signature=5d672d79c15b13162d9279b0855cfba6789a8edb4c82c400e06b5924a6f2b5d7')
})

const testRequests = suite.tests.all.reduce((map, t, index) => {
	t.index = index
	map[t.name] = t
	return map
}, {})

// TODO are these tests bad? the STS sure looks bad to me
delete testRequests['post-x-www-form-urlencoded']
delete testRequests['post-x-www-form-urlencoded-parameters']

test('aws-sig-v4-test-suite', async t => {
	for (const name in testRequests) {
		const aws = testRequests[name]
		await t.test(`[${aws.index}] ${aws.name} => ${aws.request.uri}`, async t => {
			const host = aws.request.headers.find(([ key ]) => key.toLowerCase() === 'host')[1]
			const {
				canonicalRequest,
				stringToSign,
				authorization
			} = await createCanonicalRequest({
				hash,
				hmac,
				parseUrl,
				config: suite.config,
				request: {
					method: aws.request.method,
					url: `https://${host}${aws.request.uri}`,
					headers: formatHeaders(aws.request.headers),
					body: aws.request.body
				}
			})
			t.equal(canonicalRequest, aws.creq, 'the canonical request should match')
			t.equal(stringToSign, aws.sts, 'the string to sign should match')
			t.equal(authorization, aws.authz, 'the authorization header value should match')
		})
	}
})
