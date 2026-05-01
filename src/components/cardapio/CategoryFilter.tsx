import { useState } from "react";
import type { Categoria } from "../../types";

interface Props {
  categorias: Categoria[];
  onFilter: (categoriaId: string | null) => void;
}

export default function CategoryFilter({ categorias, onFilter }: Props) {
  const [active, setActive] = useState<string | null>(null);

  function handleClick(id: string | null) {
    setActive(id);
    onFilter(id);
  }

  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => handleClick(null)}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
          active === null
            ? "bg-stone-900 text-amber-100 border-stone-900"
            : "bg-white text-stone-500 border-stone-200 hover:border-stone-300 hover:text-stone-700"
        }`}
      >
        Todos
      </button>

      {categorias.map((cat) => (
        <button
          key={cat.id}
          onClick={() => handleClick(cat.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
            active === cat.id
              ? "bg-stone-900 text-amber-100 border-stone-900"
              : "bg-white text-stone-500 border-stone-200 hover:border-stone-300 hover:text-stone-700"
          }`}
        >
          {cat.nome}
        </button>
      ))}
    </div>
  );
}
