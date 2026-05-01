import { atom, computed } from "nanostores";
import type { ItemCarrinho, Produto } from "../types";

// ─── Atoms ────────────────────────────────────────────────────────────────────

export const cartItems = atom<ItemCarrinho[]>([]);

export const cartOpen = atom<boolean>(false);

// ─── Derived ──────────────────────────────────────────────────────────────────

/**
 * Total exibido no frontend é apenas VISUAL para UX.
 * O backend recalcula o total real no momento do pedido
 * usando os preços atuais do banco de dados.
 */
export const cartTotal = computed(cartItems, (items) =>
  items.reduce((acc, item) => acc + item.produto.preco * item.quantidade, 0)
);

export const cartCount = computed(cartItems, (items) =>
  items.reduce((acc, item) => acc + item.quantidade, 0)
);

// ─── Actions ──────────────────────────────────────────────────────────────────

export function addItem(produto: Produto, quantidade = 1, observacao?: string) {
  const current = cartItems.get();
  const idx = current.findIndex((i) => i.produto.id === produto.id);

  if (idx >= 0) {
    const updated = [...current];
    updated[idx] = { ...updated[idx], quantidade: updated[idx].quantidade + quantidade };
    cartItems.set(updated);
  } else {
    cartItems.set([...current, { produto, quantidade, observacao }]);
  }
}

export function removeItem(produtoId: string) {
  cartItems.set(cartItems.get().filter((i) => i.produto.id !== produtoId));
}

export function updateQty(produtoId: string, quantidade: number) {
  if (quantidade <= 0) {
    removeItem(produtoId);
    return;
  }
  cartItems.set(
    cartItems.get().map((i) =>
      i.produto.id === produtoId ? { ...i, quantidade } : i
    )
  );
}

export function updateObs(produtoId: string, observacao: string) {
  cartItems.set(
    cartItems.get().map((i) =>
      i.produto.id === produtoId ? { ...i, observacao } : i
    )
  );
}

export function clearCart() {
  cartItems.set([]);
}

export function openCart() {
  cartOpen.set(true);
}

export function closeCart() {
  cartOpen.set(false);
}

// ─── Persistência no localStorage ────────────────────────────────────────────

// Restaura carrinho ao recarregar a página
if (typeof window !== "undefined") {
  try {
    const saved = localStorage.getItem("cantina_cart");
    if (saved) cartItems.set(JSON.parse(saved));
  } catch {}

  cartItems.subscribe((items) => {
    try {
      localStorage.setItem("cantina_cart", JSON.stringify(items));
    } catch {}
  });
}
