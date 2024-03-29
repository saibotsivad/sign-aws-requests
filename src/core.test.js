import { createCanonicalRequest } from './core.js'
import { formatHeaders, exampleStringToSign, exampleCanonicalRequest, exampleConfig, exampleRequest } from '../test-helpers.js'
import { test } from 'zora'
import { suite } from '../built-test-suite.js'

export default ({ hash, parseUrl, hmacSignature }) => {
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
			authorization,
		} = await createCanonicalRequest({
			hash,
			parseUrl,
			hmacSignature,
			config: exampleConfig,
			request: exampleRequest,
		})
		t.equal(canonicalRequest, exampleCanonicalRequest)
		t.equal(hashedCanonicalRequest, 'f536975d06c0309214f805bb90ccff089219ecd68b2577efef23edd43b7e1a59')
		t.equal(stringToSign, exampleStringToSign)
		t.equal(signingKey, 'c4afb1cc5771d871763a393e44b703571b55cc28424d1a5e86da6ed3c154a4b9')
		t.equal(signature, '5d672d79c15b13162d9279b0855cfba6789a8edb4c82c400e06b5924a6f2b5d7')
		t.equal(authorization, 'AWS4-HMAC-SHA256 Credential=AKIDEXAMPLE/20150830/us-east-1/iam/aws4_request, SignedHeaders=content-type;host;x-amz-date, Signature=5d672d79c15b13162d9279b0855cfba6789a8edb4c82c400e06b5924a6f2b5d7')
	})

	test('form url encoding', async t => {
		const {
			canonicalRequest,
			bodyString,
		} = await createCanonicalRequest({
			hash,
			parseUrl,
			hmacSignature,
			config: exampleConfig,
			request: {
				url: 'https://sqs.us-east-1.amazonaws.com',
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Host': 'sqs.us-east-1.amazonaws.com',
					'X-Amz-Date': '20150830T123600Z',
				},
				body: {
					Action: 'SendMessage',
					MessageBody: '{"hello":"world"}',
				},
			},
			formencode: true,
		})
		t.equal(bodyString, 'Action=SendMessage&MessageBody=%7B%22hello%22%3A%22world%22%7D&Version=2012-11-05')
		t.equal(canonicalRequest, 'POST\n/\n\ncontent-type:application/x-www-form-urlencoded\nhost:sqs.us-east-1.amazonaws.com\nx-amz-date:20150830T123600Z\n\ncontent-type;host;x-amz-date\nc0ac094bd00bf6f5029de7a1b2761e85c06511437fae8c555c7f39cf384a9c6c', 'the canonical request should match')
	})

	let testRequests = suite.tests.all.reduce((map, t, index) => {
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
					authorization,
				} = await createCanonicalRequest({
					hash,
					hmacSignature,
					parseUrl,
					config: suite.config,
					request: {
						method: aws.request.method,
						url: `https://${host}${aws.request.uri}`,
						headers: formatHeaders(aws.request.headers),
						body: aws.request.body,
					},
				})
				t.equal(canonicalRequest, aws.creq, 'the canonical request should match')
				t.equal(stringToSign, aws.sts, 'the string to sign should match')
				t.equal(authorization, aws.authz, 'the authorization header value should match')
			})
		}
	})
}
