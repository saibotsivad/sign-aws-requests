export interface Configuration {
    service: string;
    region: string;
    secretAccessKey: string;
    accessKeyId: string;
}

export type AwsRequestMethod = 'GET'
    | 'PATCH'
    | 'POST'
    | 'PUT'

export interface AwsRequest {
    method?: AwsRequestMethod,
    url: URL | string,
    body?: string,
    headers: Object
}

export interface AwsRequestOptions {
    date?: Date
}

export interface SignedHeaders {
    authorization: string
}

export declare function createAwsSigner
    ({ config: Configuration }): (request: AwsRequest, options?: AwsRequestOptions)
    => Promise<SignedHeaders>
