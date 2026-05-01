import { useStore } from "@nanostores/react";
import { useState } from "react";
import {
  cartItems,
  cartOpen,
  cartTotal,
  cartCount,
  removeItem,
  updateQty,
  updateObs,
  clearCart,
  closeCart,
} from "../../stores/cart";
import { criarPedido } from "../../lib/api";
import type { CriarPedidoRequest } from "../../types";

interface Props {
  mesaId: string;
  mesaNumero: number;
}

export default function CartDrawer({ mesaId, mesaNumero }: Props) {
  const items = useStore(cartItems);
  const open = useStore(cartOpen);
  const total = useStore(cartTotal);
  const count = useStore(cartCount);

  const [observacaoGeral, setObservacaoGeral] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [pedidoId, setPedidoId] = useState<string | null>(null);

  async function handleFinalizar() {
    if (items.length === 0) return;
    setLoading(true);
    setErro(null);

    /**
     * IMPORTANTE: enviamos apenas produtoId + quantidade.
     * NÃO enviamos preço — o backend busca o preço real do banco.
     * Qualquer tentativa de manipular preço pelo frontend é ignorada.
     */
    const body: CriarPedidoRequest = {
      mesaId,
      observacao: observacaoGeral.trim() || undefined,
      itens: items.map((i) => ({
        produtoId: i.produto.id,
        quantidade: i.quantidade,
        observacao: i.observacao?.trim() || undefined,
      })),
    };

    try {
      const pedido = await criarPedido(body);
      setPedidoId(pedido.id);
      clearCart();
    } catch (e: any) {
      setErro(e.message ?? "Erro ao enviar pedido. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  // ── Pedido enviado com sucesso ──────────────────────────────────────────────
  if (pedidoId) {
    return (
      <>
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={closeCart}
          aria-hidden="true"
        />
        <aside
          role="dialog"
          aria-label="Pedido confirmado"
          className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 shadow-xl flex flex-col items-center justify-center gap-4 p-8 text-center"
        >
          <span className="text-5xl">✅</span>
          <h2 className="font-serif text-xl text-stone-800">Pedido enviado!</h2>
          <p className="text-sm text-stone-500">
            Acompanhe o status do seu pedido em tempo real.
          </p>
          <a
            href={`/pedido/${pedidoId}`}
            className="w-full py-3 bg-stone-900 text-amber-100 text-sm font-medium rounded-xl text-center"
          >
            Acompanhar pedido
          </a>
          <button
            onClick={() => {
              setPedidoId(null);
              closeCart();
            }}
            className="text-sm text-stone-400 underline underline-offset-2"
          >
            Fazer novo pedido
          </button>
        </aside>
      </>
    );
  }

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={closeCart}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside
        role="dialog"
        aria-label="Carrinho de compras"
        className={`fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 shadow-xl flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-100">
          <div>
            <h2 className="font-serif text-lg text-stone-800">Seu pedido</h2>
            <p className="text-xs text-stone-400">Mesa {mesaNumero}</p>
          </div>
          <button
            onClick={closeCart}
            aria-label="Fechar carrinho"
            className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Itens */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-12 text-stone-400">
              <p className="text-3xl mb-2">🛒</p>
              <p className="text-sm">Carrinho vazio.</p>
            </div>
          ) : (
            <>
              {items.map((item) => (
                <div
                  key={item.produto.id}
                  className="bg-stone-50 rounded-xl p-3 space-y-2"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-800 leading-snug">
                        {item.produto.nome}
                      </p>
                      {/* Preço visual — backend confirma o real */}
                      <p className="text-xs text-stone-400 mt-0.5">
                        {item.produto.preco.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}{" "}
                        un.
                      </p>
                    </div>

                    {/* Controle de quantidade */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => updateQty(item.produto.id, item.quantidade - 1)}
                        aria-label="Diminuir quantidade"
                        className="w-6 h-6 rounded-md bg-white border border-stone-200 text-stone-600 flex items-center justify-center text-sm font-medium hover:border-stone-400 transition-colors"
                      >
                        −
                      </button>
                      <span className="text-sm font-medium text-stone-700 w-5 text-center">
                        {item.quantidade}
                      </span>
                      <button
                        onClick={() => updateQty(item.produto.id, item.quantidade + 1)}
                        aria-label="Aumentar quantidade"
                        className="w-6 h-6 rounded-md bg-white border border-stone-200 text-stone-600 flex items-center justify-center text-sm font-medium hover:border-stone-400 transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.produto.id)}
                      aria-label={`Remover ${item.produto.nome}`}
                      className="text-stone-300 hover:text-red-400 transition-colors flex-shrink-0"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>

                  {/* Observação por item */}
                  <input
                    type="text"
                    value={item.observacao ?? ""}
                    onChange={(e) => updateObs(item.produto.id, e.target.value)}
                    placeholder="Observação (ex: sem cebola)"
                    maxLength={200}
                    className="w-full text-xs text-stone-600 bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 placeholder:text-stone-300 focus:outline-none focus:border-stone-400"
                  />
                </div>
              ))}

              {/* Observação geral */}
              <div>
                <label className="text-xs font-medium text-stone-500 block mb-1.5">
                  Observação geral
                </label>
                <textarea
                  value={observacaoGeral}
                  onChange={(e) => setObservacaoGeral(e.target.value)}
                  placeholder="Alguma observação para o pedido todo?"
                  maxLength={400}
                  rows={2}
                  className="w-full text-xs text-stone-600 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 placeholder:text-stone-300 focus:outline-none focus:border-stone-400 resize-none"
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-stone-100 space-y-3">
            {erro && (
              <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {erro}
              </p>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm text-stone-500">
                {count} {count === 1 ? "item" : "itens"}
              </span>
              {/* Total visual — backend confirma o valor real */}
              <span className="font-serif text-lg text-stone-800">
                {total.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>

            <button
              onClick={handleFinalizar}
              disabled={loading}
              className="w-full py-3 bg-stone-900 text-amber-100 text-sm font-medium rounded-xl disabled:opacity-60 disabled:cursor-not-allowed hover:bg-stone-700 transition-colors"
            >
              {loading ? "Enviando pedido..." : "Confirmar pedido"}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
