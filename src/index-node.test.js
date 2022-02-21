import { exampleConfig, exampleRequest } from '../test-helpers.js'
import { createAwsSigner } from './index-node.js'
import { test } from 'zora'

test('from the AWS example', async t => {
	const sign = createAwsSigner({
		config: exampleConfig,
	})
	const { authorization } = await sign(exampleRequest)
	t.equal(authorization, 'AWS4-HMAC-SHA256 Credential=AKIDEXAMPLE/20150830/us-east-1/iam/aws4_request, SignedHeaders=content-type;host;x-amz-date, Signature=5d672d79c15b13162d9279b0855cfba6789a8edb4c82c400e06b5924a6f2b5d7')
})
