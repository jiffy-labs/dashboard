export interface RequestParams {
  nonce?: string;
  sender?: string;
  callData?: string;
}

export interface RequestData {
  id: number;
  method: string;
  params: RequestParams[];
}

export interface ResponseData {
  jsonrpc: string;
  id: number;
  result: any;
}

export interface ApiKey {
  api_key: string;
  name: string;
  created_at: string;
  email_id: string;
}


export interface Log {
  id: number;
  chain: string;
  request: string;
  response: string;
  httpCode: number;
  age: string;
  requestName: string;
  responseStatus: string;
}
