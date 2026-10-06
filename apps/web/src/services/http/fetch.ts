import { HttpClient } from './http-client';

export class FetchClient implements HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(url: string, config?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      ...config,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(errorData);
    }

    const hasBody =
      response.status !== 204 &&
      response.headers.get('content-length') !== '0' &&
      response.headers.get('content-type')?.includes('application/json');

    return (hasBody ? response.json() : undefined) as Promise<T>;
  }

  async post(url: string, data: unknown): Promise<Response> {
    return this.request(`${this.baseUrl}/${url}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}
