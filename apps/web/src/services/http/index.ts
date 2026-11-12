import { env } from '@/env';

import { FetchClient } from './fetch';
import { AuthApi, getAuthApiInstance } from './auth';
import { AccountApi, getAccountServiceInstance } from './accounts';
import { CategoryApi, getCategoryApiInstance } from './category';

const fetchClient = new FetchClient(env.NEXT_PUBLIC_API_URL);

export interface Apis {
  accountApi: AccountApi;
  authApi: AuthApi;
  categoryApi: CategoryApi;
}

let instance: Apis;

export function getApiInstance() {
  if (!instance) {
    instance = {
      accountApi: getAccountServiceInstance(fetchClient),
      authApi: getAuthApiInstance(fetchClient),
      categoryApi: getCategoryApiInstance(fetchClient),
    };
  }

  return instance;
}
