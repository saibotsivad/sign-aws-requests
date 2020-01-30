const formatHeaders = headers => (headers || [])
	.reduce((map, [ key, value ]) => {
		if (Array.isArray(map[key])) {
			map[key].push(value)
		} else if (map[key]) {
			map[key] = [ map[key], value ]
		} else {
			map[key] = value
		}
		return map
	}, {})

const exampleStringToSign = `AWS4-HMAC-SHA256
20150830T123600Z
20150830/us-east-1/iam/aws4_request
f536975d06c0309214f805bb90ccff089219ecd68b2577efef23edd43b7e1a59`

const exampleCanonicalRequest = `GET
/
Action=ListUsers&Version=2010-05-08
content-type:application/x-www-form-urlencoded; charset=utf-8
host:iam.amazonaws.com
x-amz-date:20150830T123600Z

content-type;host;x-amz-date
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

const exampleConfig = {
	service: 'iam',
	region: 'us-east-1',
	accessKeyId: 'AKIDEXAMPLE',
	secretAccessKey: 'wJalrXUtnFEMI/K7MDENG+bPxRfiCYEXAMPLEKEY'
}

const exampleRequest = {
	method: 'GET',
	url: 'https://iam.amazonaws.com/?Action=ListUsers&Version=2010-05-08',
	headers: {
		Host: 'iam.amazonaws.com',
		'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
		'X-Amz-Date': '20150830T123600Z'
	}
}

export {
	formatHeaders,
	exampleStringToSign,
	exampleCanonicalRequest,
	exampleConfig,
	exampleRequest
}
