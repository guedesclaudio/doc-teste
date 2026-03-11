import React, { useEffect } from 'react';
import CodeBlock from '@theme/CodeBlock';
import type { EventEntry } from './types';
import styles from './EventsExplorer.module.css';

interface EventModalProps {
  event: EventEntry;
  onClose: () => void;
}

export default function EventModal({ event, onClose }: EventModalProps) {
  // Close on Escape key
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
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalTitleRow}>
            <span className={styles.categoryBadge}>{event.category}</span>
            <h2 className={styles.modalTitle}>{event.name}</h2>
          </div>
          <button className={styles.modalClose} onClick={onClose} aria-label="Fechar">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 2l14 14M16 2 2 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className={styles.modalBody}>
          {/* Schema */}
          {event.schema && (
            <section className={styles.modalSection}>
              <h3 className={styles.modalSectionTitle}>Schema</h3>
              <CodeBlock language="python">{event.schema}</CodeBlock>
            </section>
          )}

          {/* Example */}
          {event.example && (
            <section className={styles.modalSection}>
              <h3 className={styles.modalSectionTitle}>Exemplo</h3>
              <CodeBlock language="python">{event.example}</CodeBlock>
            </section>
          )}

          {/* Fields list */}
          {event.fields.length > 0 && (
            <section className={styles.modalSection}>
              <h3 className={styles.modalSectionTitle}>Campos indexados</h3>
              <div className={styles.fields}>
                {event.fields.map((f) => (
                  <code key={f} className={styles.fieldChip}>{f}</code>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <a
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.docLink}
          >
            Ver no GitHub
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 2h8v8M10 2 2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </a>
          <button className={styles.modalCloseBtn} onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
}
