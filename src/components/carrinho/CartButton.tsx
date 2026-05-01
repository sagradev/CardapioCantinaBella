import { useStore } from "@nanostores/react";
import { cartCount, openCart } from "../../stores/cart";

export default function CartButton() {
  const count = useStore(cartCount);

  if (count === 0) return null;

  return (
    <button
      onClick={openCart}
      aria-label={`Abrir carrinho — ${count} ${count === 1 ? "item" : "itens"}`}
      className="fixed bottom-6 right-6 z-30 flex items-center gap-3 bg-stone-900 text-amber-100 px-5 py-3.5 rounded-2xl shadow-xl hover:bg-stone-700 transition-all"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path
          d="M2 2h1.5l2.5 9h8l2-6H5.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="8" cy="14.5" r="1" fill="currentColor" />
        <circle cx="13" cy="14.5" r="1" fill="currentColor" />
      </svg>
      <span className="text-sm font-medium">Ver pedido</span>
      <span className="bg-amber-500 text-white text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center">
        {count}
      </span>
    </button>
  );
}
