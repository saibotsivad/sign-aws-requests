import { createAwsSigner } from './src/index-node.js'
import got from 'got'
import secrets from './secrets.js'

const sign = createAwsSigner({
	config: {
		service: 'dynamodb',
		region: secrets.region,
		secretAccessKey: secrets.secretAccessKey,
		accessKeyId: secrets.accessKeyId
	}
})

const request = {
	url: 'https://dynamodb.us-east-1.amazonaws.com',
	method: 'POST',
	headers: {
		'content-type': 'application/x-amz-json-1.0',
		'X-Amz-Target': 'DynamoDB_20120810.GetItem',
		Host: 'dynamodb.us-east-1.amazonaws.com'
	},
	body: JSON.stringify({
		TableName: 'demo-sign-aws-requests',
		Key: {
			DemoPrimaryKey: {
				S: 'DEMO'
			},
			DemoSortKey: {
				S: '123'
			}
		}
	})
}

// The 'got' module lets us inject the request signing
// functionality inside a hook:
const awsClient = got.extend({
	hooks: {
		beforeRequest: [
			async options => {
				const { authorization } = await sign(options)
				options.headers.Authorization = authorization
			}
		]
	}
})

const expected = JSON.stringify({
	Item: {
		Foo: {
			S: 'bar'
		},
		DemoPrimaryKey: {
			S: 'DEMO'
		},
		DemoSortKey: {
			S: '123'
		}
	}
})

awsClient(request)
	.then(response => {
		console.log(JSON.stringify(JSON.parse(response.body), undefined, 2))
		const equals = expected === response.body
		console.log(equals ? 'the results are correct' : 'the results do not match expectations')
	})
	.catch(response => {
		console.error('------------- oh no!')
		console.error(response)
	})
