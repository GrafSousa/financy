import { env } from '@/env';
import { AccountApi, getAccountServiceInstance } from './accounts';
import { FetchClient } from './fetch';

const fetchClient = new FetchClient(env.NEXT_PUBLIC_API_URL);

export interface Apis {
  accountApi: AccountApi;
}

let instance: Apis;

export function getApiInstance() {
  if (!instance) {
    instance = {
      accountApi: getAccountServiceInstance(fetchClient),
    };
  }

  return instance;
}
