import React, { useState, useMemo } from 'react';
import { ruleGroups } from '../../data/rules';
import type { FlatRule, EventType } from './types';
import RuleCard, { getEventTypes } from './RuleCard';
import styles from './RulesExplorer.module.css';

const EVENT_TYPE_OPTIONS: EventType[] = ['Register', 'Update', 'Deletion'];

const EVENT_TYPE_LABELS_PT: Record<EventType, string> = {
  Register: 'Registro',
  Update: 'Atualização',
  Deletion: 'Exclusão',
};

interface RulesExplorerProps {
  /** Pré-seleciona um grupo via prop */
  defaultGroup?: string;
}

export default function RulesExplorer({ defaultGroup = '' }: RulesExplorerProps) {
  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(defaultGroup);
  const [activeEventTypes, setActiveEventTypes] = useState<Set<EventType>>(new Set());

  // Consolida todas as regras de todos os grupos em uma lista única com metadados do grupo
  const allRules = useMemo<FlatRule[]>(() =>
    ruleGroups.flatMap(({ group, label, rules }) =>
      rules.map((rule) => ({ ...rule, group, groupLabel: label }))
    ),
    []
  );

  const toggleEventType = (type: EventType) => {
    setActiveEventTypes((prev) => {
      const next = new Set(prev);
      next.has(type) ? next.delete(type) : next.add(type);
      return next;
    });
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return allRules.filter((rule) => {
      if (selectedGroup && rule.group !== selectedGroup) return false;

      if (activeEventTypes.size > 0) {
        const ruleEventTypes = getEventTypes(rule.event);
        if (!ruleEventTypes.some((t) => activeEventTypes.has(t))) return false;
      }

      if (q) {
        const haystack = `${rule.error} ${rule.description} ${rule.event.join(' ')}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });
  }, [allRules, search, selectedGroup, activeEventTypes]);

  return (
    <div className={styles.explorer}>
      {/* ── Filter Bar ─────────────────────────────────────── */}
      <div className={styles.filterBar}>
        <input
          type="search"
          className={styles.searchInput}
          placeholder="Buscar por código de erro ou descrição…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Buscar regras"
        />

        <select
          className={styles.select}
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          aria-label="Filtrar por grupo"
        >
          <option value="">Todos os Grupos</option>
          {ruleGroups.map(({ group, label }) => (
            <option key={group} value={group}>{label}</option>
          ))}
        </select>

        <div className={styles.eventFilters} role="group" aria-label="Filtrar por tipo de evento">
          {EVENT_TYPE_OPTIONS.map((type) => (
            <button
              key={type}
              onClick={() => toggleEventType(type)}
              className={`${styles.eventFilterBtn} ${activeEventTypes.has(type) ? styles.eventFilterBtnActive : ''}`}
              aria-pressed={activeEventTypes.has(type)}
            >
              {EVENT_TYPE_LABELS_PT[type]}
            </button>
          ))}
        </div>
      </div>

      {/* ── Results Count ───────────────────────────────────── */}
      <p className={styles.resultsCount}>
        Exibindo <strong>{filtered.length}</strong> de <strong>{allRules.length}</strong> regras
      </p>

      {/* ── Grid ────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className={styles.emptyState}>
          <h3>Nenhuma regra encontrada</h3>
          <p>Tente ajustar sua busca ou os filtros selecionados.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map((rule) => (
            <RuleCard key={`${rule.group}-${rule.error}`} rule={rule} />
          ))}
        </div>
      )}
    </div>
  );
}
