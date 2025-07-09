import { env } from '@main/config';

export interface ApiProps {
  route: unknown;
  body?: unknown;
  method?: 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT';
  queryParams?: unknown;
  append?: string;
  isVideo?: boolean;
}

const baseUrl = `https://api.themoviedb.org/3`;

export const api = {
  delete: <T>(params: Omit<ApiProps, 'body' | 'method'>): Promise<T> =>
    fetchApi({ ...params, method: 'DELETE' }),
  get: <T>(params: Omit<ApiProps, 'body' | 'method'>): Promise<T> =>
    fetchApi({ ...params, method: 'GET' }),
  patch: <T>(params: Omit<ApiProps, 'method'>): Promise<T> =>
    fetchApi({ ...params, method: 'PATCH' }),
  post: <T>(params: Omit<ApiProps, 'method'>): Promise<T> =>
    fetchApi({ ...params, method: 'POST' }),
  put: <T>(params: Omit<ApiProps, 'method'>): Promise<T> => fetchApi({ ...params, method: 'PUT' })
};

const fetchApi = async <T>(params: ApiProps): Promise<T> => {
  const token = env.TMDB_TOKEN;
  const lang = 'language=pt-BR';
  const region = 'region=BR';

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json;charset=UTF-8'
  };

  const append = params.append ? `&append_to_response=${params.append}` : '';
  const language = params.isVideo ? `?language=en-US` : `?${lang}&${region}`;

  const queryParams = params.queryParams
    ? `${language}${append}&${new URLSearchParams(params.queryParams as URLSearchParams)}`
    : `${language}${append}`;

  const response = await fetch(`${baseUrl}${params.route}${queryParams}`, {
    body: JSON.stringify(params.body),
    headers,
    method: params.method
  });

  const data = await response.json();

  if (response.ok) return data as T;

  return null as T;
};
