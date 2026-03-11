import React, { useMemo, useState } from 'react';
import eventsIndex from '../../data/events-index.json';
import type { EventEntry } from './types';
import EventCard from './EventCard';
import styles from './EventsExplorer.module.css';

const events = eventsIndex as EventEntry[];

const categories = Array.from(new Set(events.map((e) => e.category))).sort();

export default function EventsExplorer() {
  const [query,    setQuery]    = useState('');
  const [category, setCategory] = useState('');

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return events.filter((e) => {
      if (category && e.category !== category) return false;
      if (!q) return true;
      return (
        e.name.toLowerCase().includes(q) ||
        e.eventType?.toLowerCase().includes(q) ||
        e.fields.some((f) => f.toLowerCase().includes(q))
      );
    });
  }, [query, category]);

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
              query={query}
            />
          ))}
        </div>
      )}
    </div>
  );
}
