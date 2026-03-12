import React, { useDeferredValue, useMemo, useState } from 'react';
import enumsIndex from '../../data/enums-index.json';
import type { EnumEntry } from './types';
import EnumCard from './EnumCard';
import styles from './EnumsExplorer.module.css';

const enums = enumsIndex as EnumEntry[];

// Pre-compute lowercase search fields once at module load
const enumsSearchable = enums.map((e) => ({
  ...e,
  _name:   e.name.toLowerCase(),
  _enum:   e.enum?.toLowerCase() ?? '',
  _values: e.values.map((v) => v.toLowerCase()),
}));

const categories = Array.from(new Set(enums.map((e) => e.category))).sort();

export default function EnumsExplorer() {
  const [query,    setQuery]    = useState('');
  const [category, setCategory] = useState('');

  const deferredQuery    = useDeferredValue(query);
  const deferredCategory = useDeferredValue(category);

  const filtered = useMemo(() => {
    const q = deferredQuery.toLowerCase().trim();
    return enumsSearchable.filter((e) => {
      if (deferredCategory && e.category !== deferredCategory) return false;
      if (!q) return true;
      return (
        e._name.includes(q) ||
        e._enum.includes(q) ||
        e._values.some((v) => v.includes(q))
      );
    });
  }, [deferredQuery, deferredCategory]);

  return (
    <div className={styles.explorer}>
      {/* ── Filter bar ──────────────────────────────────────────── */}
      <div className={styles.filterBar}>
        <input
          type="search"
          className={styles.searchInput}
          placeholder="Buscar por nome do enum ou valor (ex: BROILER, animal_type)…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Buscar enums"
        />

        <select
          className={styles.select}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filtrar por categoria"
        >
          <option value="">Todas as categorias</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* ── Count ────────────────────────────────────────────────── */}
      <p className={styles.resultsCount}>
        Exibindo <strong>{filtered.length}</strong> de <strong>{enums.length}</strong> enums
      </p>

      {/* ── Grid ─────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className={styles.emptyState}>
          <h3>Nenhum enum encontrado</h3>
          <p>Tente ajustar a busca ou o filtro de categoria.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map((e) => (
            <EnumCard
              key={`${e.category}-${e.enum}`}
              entry={e}
              query={deferredQuery}
            />
          ))}
        </div>
      )}
    </div>
  );
}
