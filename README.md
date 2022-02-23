# sign-aws-requests

Sign requests to AWS with their [Version 4 Signature](https://docs.aws.amazon.com/general/latest/gr/sigv4_signing.html) algorithm.

Instead of importing the enormously huge [aws-sdk](https://www.npmjs.com/package/aws-sdk) (currently 46.4MB unpacked) you could use this as the basis for some much lighter tooling.

## Compatibility

AWS provides a [full test suite](https://docs.aws.amazon.com/general/latest/gr/signature-v4-test-suite.html) for the Version 4 Signature, and this library passes all tests except the invalid ones noted [here](https://github.com/saibotsivad/aws-sig-v4-test-suite/#notes-on-bad-tests).

## Install

The normal way:

```bash
npm install --save sign-aws-requests
```

Then require or import:

```js
const { createAwsSigner } = require('sign-aws-requests')
// or
import { createAwsSigner } from 'sign-aws-requests'
```

This library exports a NodeJS and browser compatible version, your bundler should handle picking which one, but you can select manually:

* Browser, ES import/export - `dist/sign-aws-requests-browser.js`
* Browser, CommonJS - `dist/sign-aws-requests-browser.cjs`
* NodeJS, ES import/export - `dist/sign-aws-requests.js`
* NodeJS, CommonJS - `dist/sign-aws-requests.cjs`

## Normal Use

Create a signer:

```js
import { createAwsSigner } from 'sign-aws-requests'

const sign = createAwsSigner({
	config: {
		service: 'dynamodb',
		region: 'us-east-1',
		accessKeyId: 'AKIDEXAMPLE',
		secretAccessKey: 'wJalrXUtnFEMI/K7MDENG+bPxRfiCYEXAMPLEKEY',
	}
});
```

Create a request:

```js
const request = {
	url: 'https://dynamodb.us-east-1.amazonaws.com',
	method: 'POST',
	headers: {
		'content-type': 'application/x-amz-json-1.0',
		'X-Amz-Target': 'DynamoDB_20120810.GetItem',
		'Host': 'dynamodb.us-east-1.amazonaws.com'
	},
	body: {
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
};
```

Sign that request, generating the `Authorization` header, which you then add to the request headers:

```js
const { authorization, bodyString } = await sign(request)
request.headers.Authorization = authorization
request.body = bodyString
```

> Note: if you pass in `body` as a string, you won't be able to use the Form URL Encoding described below, but everything else will work fine.

### Form URL Encoding

Some AWS endpoints (for example the SQS API) require the body of the request to be form URL encoded.

If you pass in `body` as an object and set the option `formencode` to `true`, the `bodyString` output will be correctly encoded.

For example:

```js
const request = {
	url: 'https://sqs.us-east-1.amazonaws.com',
	method: 'POST',
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Host': 'sqs.us-east-1.amazonaws.com',
	},
	body: {
		Action: 'SendMessage',
		MessageBody: '{"hello":"world"}',
	}
}
const { authorization, bodyString } = await sign(request, { formencode: true })
request.headers.Authorization = authorization
request.body = bodyString
console.log(bodyString) // => 'Action=SendMessage&MessageBody=%7B%22hello%22%3A%22world%22%7D&Version=2012-11-05'
```

> Note: Be sure to set the `Content-Type` header to `application/x-www-form-urlencoded` or AWS might not like your request!

## API

### `initialize: function(Object) => function`

The initialize function returns a new instance configured to sign requests to a particular service. It takes an object with the following **required** options:

* `config: Object` - The AWS specific configuration properties.
* `config.service: String` - The name of the AWS service, e.g. `dynamodb`.
* `config.region: String` - The AWS region, e.g. `us-east-1`.
* `config.accessKeyId: String` - The IAM access key id.
* `config.secretAccessKey: String` - The IAM access key secret.

The returned property is the function used to sign requests.

### `sign: function(request: Object, options?: Object) => Object`

The signing function takes an HTTP request object with the following **required** properties:

* `url: String` - The fully qualified URI, e.g. protocol, domain, path, and all query parameters.
* `method: String` - The HTTP method.
* `headers: Object` - The request headers. Note that this is a normal key to string value map, but if there are multiple values for the same header key, the value must be an array of strings.
* `body: String` *[optional]* - The string value of the body.

The options object takes the following options properties:

* `formencode: Boolean` - Whether to convert the `body` to the Form URL Encoded version. (Default: `false`)

The output of the signing function is an object containing the following properties:

* `authorization: String` - The value which you would place in the header.
* `bodyString: String` - The original string or undefined, if those were passed in as `body`, or the stringified body. In the case of Form URL Encoded, it will be the encoded object string, and in other cases it will simply be passed through `JSON.stringify`.

## License

The test files originated from AWS, but were given with an Apache 2.0 license.

This test suite, all other generated code, documentation, and assets, are released under the [Very Open License](http://veryopenlicense.com)
