import React, { useEffect } from 'react';
import type { EnumEntry } from './types';
import styles from './EnumsExplorer.module.css';

interface EnumModalProps {
  entry:   EnumEntry;
  onClose: () => void;
}

export default function EnumModal({ entry, onClose }: EnumModalProps) {
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
            <span className={styles.categoryBadge}>{entry.category}</span>
            {entry.enum && (
              <code className={styles.enumChip}>{entry.enum}</code>
            )}
          </div>
          <h2 className={styles.modalTitle}>{entry.name}</h2>
          <button className={styles.modalClose} onClick={onClose} aria-label="Fechar">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2l12 12M14 2 2 14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* ── Body: grouped values ────────────────────────────── */}
        <div className={styles.modalBody}>
          {entry.groups.map((group, idx) => (
            <div key={idx} className={styles.group}>
              {group.label && (
                <h4 className={styles.groupLabel}>{group.label}</h4>
              )}
              <div className={styles.groupValues}>
                {group.values.map((v) => (
                  <code key={v} className={styles.modalValueChip}>{v}</code>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Footer ─────────────────────────────────────────── */}
        <div className={styles.modalFooter}>
          <a
            href={entry.link}
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
