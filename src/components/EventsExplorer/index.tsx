import React, { useDeferredValue, useMemo, useState } from 'react';
import eventsIndex from '../../data/events-index.json';
import type { EventEntry } from './types';
import EventCard from './EventCard';
import styles from './EventsExplorer.module.css';

const events = eventsIndex as EventEntry[];

// Pre-compute lowercase search fields once at module load — never repeated per keystroke
const eventsSearchable = events.map((e) => ({
  ...e,
  _name:      e.name.toLowerCase(),
  _eventType: e.eventType?.toLowerCase() ?? '',
  _fields:    e.fields.map((f) => f.toLowerCase()),
}));

const categories = Array.from(new Set(events.map((e) => e.category))).sort();

export default function EventsExplorer() {
  const [query,    setQuery]    = useState('');
  const [category, setCategory] = useState('');

  // Defers heavy filtering so the input stays responsive even with many items
  const deferredQuery    = useDeferredValue(query);
  const deferredCategory = useDeferredValue(category);

  const filtered = useMemo(() => {
    const q = deferredQuery.toLowerCase().trim();
    return eventsSearchable.filter((e) => {
      if (deferredCategory && e.category !== deferredCategory) return false;
      if (!q) return true;
      return (
        e._name.includes(q) ||
        e._eventType.includes(q) ||
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
          placeholder="Buscar por nome do evento ou campo (ex: farm_uuid)…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Buscar eventos"
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
        Exibindo <strong>{filtered.length}</strong> de <strong>{events.length}</strong> eventos
      </p>

      {/* ── Grid ─────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className={styles.emptyState}>
          <h3>Nenhum evento encontrado</h3>
          <p>Tente ajustar a busca ou o filtro de categoria.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map((e) => (
            <EventCard
              key={`${e.category}-${e.rawTitle}`}
              event={e}
              query={deferredQuery}
            />
          ))}
        </div>
      )}
    </div>
  );
}
