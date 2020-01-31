# sign-aws-requests

Sign requests to AWS with their [Version 4 Signature](https://docs.aws.amazon.com/general/latest/gr/sigv4_signing.html) algorithm.

Instead of importing the enormously huge [aws-sdk](https://www.npmjs.com/package/aws-sdk) (currently 46.4MB unpacked) you could use this as the basis for some much lighter tooling.

This library exports a NodeJS and browser compatible version, your bundler should handle picking which one but you can select manually:

* Browser, ES import/export - `dist/sign-aws-requests-browser.mjs`
* Browser, CommonJS - `dist/sign-aws-requests-browser.js`
* NodeJS, ES import/export - `dist/sign-aws-requests.mjs`
* NodeJS, CommonJS - `dist/sign-aws-requests.js`

AWS provides a [full test suite](https://docs.aws.amazon.com/general/latest/gr/signature-v4-test-suite.html) for the Version 4 Signature, and this library passes all tests except the invalid ones noted [here](https://github.com/saibotsivad/aws-sig-v4-test-suite/#notes-on-bad-tests).

## install

The normal way:

```bash
npm install --save sign-aws-requests
```

## normal use

Create a signer:

```js
import { createAwsSigner } from 'sign-aws-requests'

const sign = createAwsSigner({
	config: {
		service: 'dynamodb',
		region: 'us-east-1',
		secretAccessKey: 'AKIDEXAMPLE',
		accessKeyId: 'wJalrXUtnFEMI/K7MDENG+bPxRfiCYEXAMPLEKEY'
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
};
```

Sign that request, generating the `Authorization` header, which you then add to the request headers:

```js
const { authorization } = await sign(request)
request.headers.Authorization = authorization
```

## api

### initialize `function(Object) => function`

The initialize function returns a new instance configured to sign requests to a particular service. It takes an object with the following **required** options:

* `config: Object` - The AWS specific configuration properties.
* `config.service: String` - The name of the AWS service, e.g. `dynamodb`.
* `config.region: String` - The AWS region, e.g. `us-east-1`.
* `config.accessKeyId: String` - The IAM access key id.
* `config.secretAccessKey: String` - The IAM access key secret.

The returned property is the function used to sign requests.

### sign `function(Object) => Object`

The signing function takes an HTTP request object with the following **required** properties:

* `url: String` - The fully qualified URI, e.g. protocol, domain, path, and all query parameters.
* `method: String` - The HTTP method.
* `headers: Object` - The request headers. Note that this is a normal key to string value map, but if there are multiple values for the same header key, the value must be an array of strings.
* `body: String` *[optional]* - The string value of the body.

The output of the signing function is an object containing the following properties:

* `authorization: String` - The value which you would place in the header.

## license

The test files originated from AWS, but were given with an Apache 2.0 license.

This test suite, all other generated code, documentation, and assets, are released under the [Very Open License](http://veryopenlicense.com)
