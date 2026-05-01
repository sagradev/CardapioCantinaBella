import { addItem, openCart } from "../../stores/cart";
import type { Produto } from "../../types";

interface Props {
  produto: Produto;
}

const PLACEHOLDER_EMOJIS: Record<string, string> = {
  Entradas: "🧀",
  Massas: "🍝",
  Saladas: "🥗",
  Bebidas: "🥤",
  Sobremesas: "🍰",
};

export default function ProductCard({ produto }: Props) {
  const emoji = PLACEHOLDER_EMOJIS[produto.categoriaNome] ?? "🍽️";

  function handleAdd() {
    addItem(produto);
    openCart();
  }

  return (
    <div className="bg-white border border-stone-100 rounded-2xl overflow-hidden hover:border-stone-200 transition-all group">
      {/* Imagem / placeholder */}
      <div className="relative h-32 bg-stone-50 flex items-center justify-center text-4xl">
        {produto.imagemUrl ? (
          <img
            src={produto.imagemUrl}
            alt={produto.nome}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{emoji}</span>
        )}

        {produto.destaque && (
          <span className="absolute top-2 left-2 text-xs font-medium bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full">
            Destaque
          </span>
        )}

        {!produto.disponivel && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-xs font-medium text-stone-400 bg-white px-3 py-1 rounded-full border border-stone-200">
              Indisponível
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-sm font-medium text-stone-800 leading-snug mb-1">
          {produto.nome}
        </p>
        {produto.descricao && (
          <p className="text-xs text-stone-400 leading-relaxed mb-3 line-clamp-2">
            {produto.descricao}
          </p>
        )}

        <div className="flex items-center justify-between">
          {/* Preço exibido é apenas visual — backend recalcula no pedido */}
          <span className="font-semibold text-stone-800 text-sm">
            {produto.preco.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </span>

          <button
            onClick={handleAdd}
            disabled={!produto.disponivel}
            aria-label={`Adicionar ${produto.nome} ao carrinho`}
            className="w-8 h-8 rounded-lg bg-stone-900 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-700 transition-colors"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M7 2v10M2 7h10"
                stroke="#fef3c7"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
