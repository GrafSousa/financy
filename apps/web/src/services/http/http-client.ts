export interface HttpClient {
  get<T>(url: string): Promise<T>;
  delete<T>(url: string): Promise<T>;
  post(url: string, data?: unknown, init?: RequestInit): Promise<Response>;
  put(url: string, data?: unknown, init?: RequestInit): Promise<Response>;
}
