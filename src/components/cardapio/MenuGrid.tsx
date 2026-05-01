import { useState, useMemo } from "react";
import type { Categoria, Produto } from "../../types";
import CategoryFilter from "./CategoryFilter";
import ProductCard from "./ProductCard";

interface Props {
  categorias: Categoria[];
  produtos: Produto[];
}

export default function MenuGrid({ categorias, produtos }: Props) {
  const [categoriaAtiva, setCategoriaAtiva] = useState<string | null>(null);
  const [busca, setBusca] = useState("");

  const produtosFiltrados = useMemo(() => {
    return produtos.filter((p) => {
      const matchCategoria = !categoriaAtiva || p.categoriaId === categoriaAtiva;
      const matchBusca =
        !busca ||
        p.nome.toLowerCase().includes(busca.toLowerCase()) ||
        p.descricao?.toLowerCase().includes(busca.toLowerCase());
      return matchCategoria && matchBusca;
    });
  }, [categoriaAtiva, busca, produtos]);

  // Agrupar por categoria para exibir seções
  const secoes = useMemo(() => {
    const mapa = new Map<string, { categoria: Categoria; produtos: Produto[] }>();

    categorias
      .slice()
      .sort((a, b) => a.ordem - b.ordem)
      .forEach((cat) => {
        const itens = produtosFiltrados.filter((p) => p.categoriaId === cat.id);
        if (itens.length > 0) {
          mapa.set(cat.id, { categoria: cat, produtos: itens });
        }
      });

    return [...mapa.values()];
  }, [categorias, produtosFiltrados]);

  return (
    <div>
      {/* Busca */}
      <div className="relative mb-4">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4" />
          <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar prato ou bebida..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:border-stone-400"
        />
      </div>

      {/* Filtro de categorias */}
      <div className="mb-6">
        <CategoryFilter categorias={categorias} onFilter={setCategoriaAtiva} />
      </div>

      {/* Sem resultados */}
      {secoes.length === 0 && (
        <div className="text-center py-16 text-stone-400">
          <p className="text-3xl mb-2">🍽️</p>
          <p className="text-sm">Nenhum produto encontrado.</p>
        </div>
      )}

      {/* Seções por categoria */}
      {secoes.map(({ categoria, produtos: itens }) => (
        <section key={categoria.id} className="mb-8">
          <div className="mb-4">
            <h2 className="font-serif text-xl text-stone-800">{categoria.nome}</h2>
            {categoria.descricao && (
              <p className="text-xs text-stone-400 mt-0.5">{categoria.descricao}</p>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {itens.map((produto) => (
              <ProductCard key={produto.id} produto={produto} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
