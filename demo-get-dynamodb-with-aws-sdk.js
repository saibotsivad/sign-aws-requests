import secrets from './secrets.js'
const AWS = require('aws-sdk')

const dynamodb = new AWS.DynamoDB({
	region: secrets.region,
	credentials: {
		accessKeyId: secrets.accessKeyId,
		secretAccessKey: secrets.secretAccessKey
	}
})

const query = {
	TableName: 'demo-sign-aws-requests',
	Key: {
		DemoPrimaryKey: {
			S: 'DEMO'
		},
		DemoSortKey: {
			S: '123'
		}
	}
}

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

dynamodb.getItem(query, (error, data) => {
	if (error) {
		console.error('------------- oh no!')
		console.log(JSON.stringify(error, undefined, 2))
	} else {
		console.log(JSON.stringify(data, undefined, 2))
		const equals = expected === JSON.stringify(data)
		console.log(equals ? 'the results are correct' : 'the results do not match expectations')
	}
})
