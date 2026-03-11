import React, { useDeferredValue, useMemo, useState } from 'react';
import entitiesIndex from '../../data/entities-index.json';
import type { EntityEntry } from './types';
import EntityCard from './EntityCard';
import styles from './EntitiesExplorer.module.css';

const entities = entitiesIndex as EntityEntry[];

// Pre-compute lowercase search fields once at module load — never repeated per keystroke
const entitiesSearchable = entities.map((e) => ({
  ...e,
  _name:   e.name.toLowerCase(),
  _entity: e.entity?.toLowerCase() ?? '',
  _fields: e.fields.map((f) => f.toLowerCase()),
}));

const categories = Array.from(new Set(entities.map((e) => e.category))).sort();

export default function EntitiesExplorer() {
  const [query,    setQuery]    = useState('');
  const [category, setCategory] = useState('');

  // Defers heavy filtering so the input stays responsive even with many items
  const deferredQuery    = useDeferredValue(query);
  const deferredCategory = useDeferredValue(category);

  const filtered = useMemo(() => {
    const q = deferredQuery.toLowerCase().trim();
    return entitiesSearchable.filter((e) => {
      if (deferredCategory && e.category !== deferredCategory) return false;
      if (!q) return true;
      return (
        e._name.includes(q) ||
        e._entity.includes(q) ||
        e._fields.some((f) => f.includes(q))
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
          placeholder="Buscar por nome da entidade ou campo de inferência (ex: farm_uuid)…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Buscar entidades"
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
        Exibindo <strong>{filtered.length}</strong> de <strong>{entities.length}</strong> entidades
      </p>

      {/* ── Grid ─────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className={styles.emptyState}>
          <h3>Nenhuma entidade encontrada</h3>
          <p>Tente ajustar a busca ou o filtro de categoria.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map((e) => (
            <EntityCard
              key={`${e.category}-${e.entity}`}
              entity={e}
              query={deferredQuery}
            />
          ))}
        </div>
      )}
    </div>
  );
}
