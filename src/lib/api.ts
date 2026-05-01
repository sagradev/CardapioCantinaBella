import type {
  Categoria,
  Produto,
  CriarPedidoRequest,
  PedidoResponse,
  MesaResponse,
} from "../types";

const BASE_URL = import.meta.env.API_URL ?? "http://localhost:8080";

// ─── Utilitário interno ───────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`API ${res.status} em ${path}: ${body}`);
  }

  // 204 No Content — sem body
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

// ─── Categorias ───────────────────────────────────────────────────────────────

export async function getCategorias(): Promise<Categoria[]> {
  return request<Categoria[]>("/api/categorias");
}

// ─── Produtos ─────────────────────────────────────────────────────────────────

export async function getProdutos(categoriaId?: string): Promise<Produto[]> {
  const qs = categoriaId ? `?categoriaId=${categoriaId}` : "";
  return request<Produto[]>(`/api/produtos${qs}`);
}

// ─── Mesas ────────────────────────────────────────────────────────────────────

export async function getMesaPorToken(token: string): Promise<MesaResponse> {
  return request<MesaResponse>(`/api/mesas/token/${token}`);
}

// ─── Pedidos ──────────────────────────────────────────────────────────────────

/**
 * Cria um novo pedido.
 *
 * IMPORTANTE: enviamos apenas produtoId + quantidade.
 * Preço, total e disponibilidade são calculados pelo backend
 * com os valores reais do banco — nunca confiar no frontend.
 */
export async function criarPedido(
  body: CriarPedidoRequest
): Promise<PedidoResponse> {
  return request<PedidoResponse>("/api/pedidos", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function getPedido(id: string): Promise<PedidoResponse> {
  return request<PedidoResponse>(`/api/pedidos/${id}`);
}
