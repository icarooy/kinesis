import { supabase } from '../../lib/supabase';

/**
 * Formato de erro retornado pela Kinesis API (Spring Boot).
 * É lançado como objeto pela função `api()` em qualquer falha.
 */
export interface ApiError {
  status: number;
  message: string;
  fieldErrors?: Record<string, string>;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Função base para todas as chamadas à Kinesis API.
 *
 * - Obtém o token (access_token JWT) da sessão atual do Supabase.
 * - Lança `ApiError` 401 'Usuário não autenticado' se não houver sessão.
 * - Injeta `Authorization: Bearer {token}` em toda requisição.
 * - Usa `VITE_API_BASE_URL` como base.
 * - Trata respostas 204 (sem body), retornando `undefined`.
 * - Em erro (`!response.ok`), lança o `ApiError` retornado pela API.
 */
export async function api<T = unknown>(
  method: HttpMethod,
  path: string,
  body?: unknown,
): Promise<T> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (!token) {
    throw { status: 401, message: 'Usuário não autenticado' } satisfies ApiError;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // 204 No Content — não há corpo para parsear
  if (response.status === 204) {
    return undefined as T;
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw {
      status: response.status,
      message: payload?.message ?? 'Erro na requisição',
      fieldErrors: payload?.fieldErrors,
    } satisfies ApiError;
  }

  return payload as T;
}
