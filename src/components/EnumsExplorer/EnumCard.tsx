import React, { memo, useState } from 'react';
import type { EnumEntry } from './types';
import EnumModal from './EnumModal';
import styles from './EnumsExplorer.module.css';

interface EnumCardProps {
  entry: EnumEntry;
  query: string;
}

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className={styles.highlight}>{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

const MAX_VALUES_VISIBLE = 6;

const EnumCard = memo(function EnumCard({ entry, query }: EnumCardProps) {
  const [open, setOpen] = useState(false);

  const visibleValues = entry.values.slice(0, MAX_VALUES_VISIBLE);
  const hiddenCount   = entry.values.length - visibleValues.length;

  return (
    <>
      <div
        className={styles.card}
        onClick={() => setOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setOpen(true)}
      >
        {/* Header: category + enum identifier */}
        <div className={styles.cardHeader}>
          <span className={styles.categoryBadge}>{entry.category}</span>
          {entry.enum && (
            <code className={styles.enumChip}>
              <Highlight text={entry.enum} query={query} />
            </code>
          )}
        </div>

        {/* Enum name */}
        <h3 className={styles.enumName}>
          <Highlight text={entry.name} query={query} />
        </h3>

        {/* Values preview */}
        {visibleValues.length > 0 && (
          <div className={styles.valuesSection}>
            <span className={styles.metaLabel}>Valores — {entry.values.length} total</span>
            <div className={styles.valuePreview}>
              {visibleValues.map((v) => (
                <code key={v} className={styles.valueChip}>
                  <Highlight text={v} query={query} />
                </code>
              ))}
              {hiddenCount > 0 && (
                <span className={styles.moreChip}>+{hiddenCount}</span>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className={styles.cardFooter}>
          <span className={styles.detailsHint}>Ver todos os valores →</span>
        </div>
      </div>

      {open && <EnumModal entry={entry} onClose={() => setOpen(false)} />}
    </>
  );
});

export default EnumCard;
