export interface Configuration {
	service: string;
	region: string;
	secretAccessKey: string;
	accessKeyId: string;
}

export type AwsRequestMethod = 'GET' | 'PATCH' | 'POST' | 'PUT'

export interface AwsRequest {
	method?: AwsRequestMethod,
	url: URL | string,
	body?: string,
	headers: {
		[key: string]: string
	}
}

export interface AwsRequestOptions {
	date?: Date,
	formencode?: boolean
}

export interface SignedRequest {
	authorization: string,
	bodyString: string | undefined
}

export declare function createAwsSigner
	({ config: Configuration }): (request: AwsRequest, options?: AwsRequestOptions)
	=> Promise<SignedRequest>
