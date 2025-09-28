import { useState, useCallback } from 'react';

interface ApiOptions {
  baseUrl?: string;
  headers?: HeadersInit;
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: HeadersInit;
  body?: any;
}

interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

export function useApi(options: ApiOptions = {}) {
  const { baseUrl = '/api', headers = {} } = options;
  const [loading, setLoading] = useState<boolean>(false);

  const request = useCallback(
    async <T>(
      endpoint: string,
      { method = 'GET', headers: requestHeaders = {}, body }: RequestOptions = {}
    ): Promise<ApiResponse<T>> => {
      setLoading(true);
      
      const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;
      
      try {
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...headers,
            ...requestHeaders,
          },
          body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        let data: T;
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          data = await response.text() as unknown as T;
        }

        setLoading(false);
        return { data, error: null, loading: false };
      } catch (error) {
        setLoading(false);
        return {
          data: null,
          error: error instanceof Error ? error : new Error(String(error)),
          loading: false,
        };
      }
    },
    [baseUrl, headers]
  );

  const get = useCallback(
    <T>(endpoint: string, options: Omit<RequestOptions, 'method' | 'body'> = {}) => {
      return request<T>(endpoint, { ...options, method: 'GET' });
    },
    [request]
  );

  const post = useCallback(
    <T>(endpoint: string, body: any, options: Omit<RequestOptions, 'method'> = {}) => {
      return request<T>(endpoint, { ...options, method: 'POST', body });
    },
    [request]
  );

  const put = useCallback(
    <T>(endpoint: string, body: any, options: Omit<RequestOptions, 'method'> = {}) => {
      return request<T>(endpoint, { ...options, method: 'PUT', body });
    },
    [request]
  );

  const patch = useCallback(
    <T>(endpoint: string, body: any, options: Omit<RequestOptions, 'method'> = {}) => {
      return request<T>(endpoint, { ...options, method: 'PATCH', body });
    },
    [request]
  );

  const del = useCallback(
    <T>(endpoint: string, options: Omit<RequestOptions, 'method'> = {}) => {
      return request<T>(endpoint, { ...options, method: 'DELETE' });
    },
    [request]
  );

  return {
    request,
    get,
    post,
    put,
    patch,
    delete: del,
    loading,
  };
}

export default useApi;