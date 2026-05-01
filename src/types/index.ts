export interface Categoria {
  id: string;
  nome: string;
  descricao?: string;
  ordem: number;
}

export interface Produto {
  id: string;
  categoriaId: string;
  categoriaNome: string;
  nome: string;
  descricao?: string;
  preco: number;
  imagemUrl?: string;
  disponivel: boolean;
  destaque: boolean;
}

export interface ItemCarrinho {
  produto: Produto;
  quantidade: number;
  observacao?: string;
}

// DTO que vai para o backend — nunca confiar no preço do frontend,
// o backend recalcula o total com o preço real do banco.
export interface CriarPedidoRequest {
  mesaId: string;
  observacao?: string;
  itens: {
    produtoId: string;
    quantidade: number;
    observacao?: string;
  }[];
}

export interface PedidoResponse {
  id: string;
  mesaNumero: number;
  status: "RECEBIDO" | "EM_PREPARO" | "PRONTO" | "ENTREGUE" | "CANCELADO";
  total: number;
  itens: {
    produtoNome: string;
    quantidade: number;
    precoUnitario: number;
    observacao?: string;
  }[];
  criadoEm: string;
}

export interface MesaResponse {
  id: string;
  numero: number;
  ativa: boolean;
}
