import { AuthenticateUserRequest } from '@financy/contracts';
import { HttpClient } from '../http-client';

export interface AuthApi {
  createSession: (data: AuthenticateUserRequest) => Promise<Response>;
}

export class AuthApiImpl implements AuthApi {
  url = 'sessions';

  constructor(private readonly httpClient: HttpClient) {}

  async createSession(data: AuthenticateUserRequest): Promise<Response> {
    return this.httpClient.post(this.url, data);
  }
}

let instance: AuthApi;

export function getAuthApiInstance(httpClient: HttpClient) {
  if (!instance) {
    instance = new AuthApiImpl(httpClient);
  }

  return instance;
}
