import React, { useEffect, useState } from 'react';
import CodeBlock from '@theme/CodeBlock';
import type { EntityEntry } from './types';
import styles from './EntitiesExplorer.module.css';

interface EntityModalProps {
  entity:  EntityEntry;
  onClose: () => void;
}

type Tab = 'schema' | 'example';

export default function EntityModal({ entity, onClose }: EntityModalProps) {
  const [tab, setTab] = useState<Tab>(entity.schema ? 'schema' : 'example');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className={styles.modalOverlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>

        {/* ── Header ─────────────────────────────────────────── */}
        <div className={styles.modalHeader}>
          <div className={styles.modalMeta}>
            <span className={styles.categoryBadge}>{entity.category}</span>
            {entity.entity && (
              <code className={styles.entityChip}>{entity.entity}</code>
            )}
          </div>
          <h2 className={styles.modalTitle}>{entity.name}</h2>
          <button className={styles.modalClose} onClick={onClose} aria-label="Fechar">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2l12 12M14 2 2 14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* ── Tabs ───────────────────────────────────────────── */}
        <div className={styles.modalTabs}>
          {entity.schema && (
            <button
              className={`${styles.modalTab} ${tab === 'schema' ? styles.modalTabActive : ''}`}
              onClick={() => setTab('schema')}
            >
              Schema
            </button>
          )}
          {entity.example && (
            <button
              className={`${styles.modalTab} ${tab === 'example' ? styles.modalTabActive : ''}`}
              onClick={() => setTab('example')}
            >
              Exemplo
            </button>
          )}
        </div>

        {/* ── Body ───────────────────────────────────────────── */}
        <div className={styles.modalBody}>
          {tab === 'schema' && entity.schema && (
            <CodeBlock language="python">{entity.schema}</CodeBlock>
          )}
          {tab === 'example' && entity.example && (
            <CodeBlock language="python">{entity.example}</CodeBlock>
          )}
        </div>

        {/* ── Footer ─────────────────────────────────────────── */}
        <div className={styles.modalFooter}>
          <a
            href={entity.link}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.docLink}
          >
            Ver no GitHub
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 2h8v8M10 2 2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </a>
          <button className={styles.modalCloseBtn} onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
}
