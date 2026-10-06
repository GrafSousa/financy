export interface HttpClient {
  post(url: string, data?: unknown, init?: RequestInit): Promise<Response>;
}
