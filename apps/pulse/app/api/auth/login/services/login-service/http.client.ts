export interface LoginHttpPostConfig {
  headers?: Record<string, string>
  [key: string]: unknown
}

export interface LoginHttpClient {
  post<T>(url: string, data?: unknown, config?: LoginHttpPostConfig): Promise<{ data: T }>
}
