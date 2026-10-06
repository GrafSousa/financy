import { CreateAccountRequest } from '@financy/contracts';

import { HttpClient } from '../http-client';

export interface AccountApi {
  create(request: CreateAccountRequest): Promise<Response>;
}

export class AccountServiceImpl implements AccountApi {
  private readonly url = 'accounts';

  constructor(private httpClient: HttpClient) {}

  create(request: CreateAccountRequest): Promise<Response> {
    return this.httpClient.post(this.url, request);
  }
}

let instance: AccountApi;

export function getAccountServiceInstance(httpClient: HttpClient) {
  if (!instance) {
    instance = new AccountServiceImpl(httpClient);
  }

  return instance;
}
