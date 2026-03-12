import React, { useEffect, useState } from 'react';
import CodeBlock from '@theme/CodeBlock';
import type { EventEntry } from './types';
import styles from './EventsExplorer.module.css';

interface EventModalProps {
  event: EventEntry;
  onClose: () => void;
}

type Tab = 'schema' | 'example' | 'curl';

// ── Convert Python dict literal → JSON string ──────────────────────────────
// Handles True/False/None and enum values like EventType.ANIMAL_REGISTER
function pythonToJson(code: string): string {
  return code
    .replace(/\bTrue\b/g, 'true')
    .replace(/\bFalse\b/g, 'false')
    .replace(/\bNone\b/g, 'null')
    // Enum values: CapitalizedClass.UPPER_VALUE → "upper_value"
    .replace(/\b[A-Z][a-zA-Z]*\.[A-Z][A-Z0-9_]*\b/g, (match) =>
      `"${match.split('.')[1].toLowerCase()}"`,
    );
}

function buildCurl(event: EventEntry): string {
  const json = event.example
    ? pythonToJson(event.example)
        .replace(/^[ \t]*"created_at"\s*:.*\n?/gm, '')
        .replace(/,(\s*[}\]])/g, '$1')
        .replace(/'/g, "'\\''")
    : '{}';
  return `curl --request POST \\
  --url https://sds-backend.agriness-qa.com/api/events \\
  --header 'Content-Type: application/json' \\
  --header 'apiKey: sua-api-key' \\
  --data '${json}'`;
}

export default function EventModal({ event, onClose }: EventModalProps) {
  const [tab, setTab] = useState<Tab>(event.schema ? 'schema' : 'example');

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
            <span className={styles.categoryBadge}>{event.category}</span>
            {event.eventType && (
              <code className={styles.eventTypeChip}>{event.eventType}</code>
            )}
          </div>
          <h2 className={styles.modalTitle}>{event.name}</h2>
          <button className={styles.modalClose} onClick={onClose} aria-label="Fechar">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2l12 12M14 2 2 14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* ── Tabs ───────────────────────────────────────────── */}
        <div className={styles.modalTabs}>
          {event.schema && (
            <button
              className={`${styles.modalTab} ${tab === 'schema' ? styles.modalTabActive : ''}`}
              onClick={() => setTab('schema')}
            >
              Schema
            </button>
          )}
          {event.example && (
            <button
              className={`${styles.modalTab} ${tab === 'example' ? styles.modalTabActive : ''}`}
              onClick={() => setTab('example')}
            >
              Exemplo
            </button>
          )}
          {event.example && (
            <button
              className={`${styles.modalTab} ${tab === 'curl' ? styles.modalTabActive : ''}`}
              onClick={() => setTab('curl')}
            >
              cURL
            </button>
          )}
        </div>

        {/* ── Body ───────────────────────────────────────────── */}
        <div className={styles.modalBody}>
          {tab === 'schema' && event.schema && (
            <CodeBlock language="python">{event.schema}</CodeBlock>
          )}
          {tab === 'example' && event.example && (
            <CodeBlock language="python">{event.example}</CodeBlock>
          )}
          {tab === 'curl' && event.example && (
            <CodeBlock language="bash">{buildCurl(event)}</CodeBlock>
          )}
        </div>

        {/* ── Footer ─────────────────────────────────────────── */}
        <div className={styles.modalFooter}>
          <a
            href={event.link}
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
