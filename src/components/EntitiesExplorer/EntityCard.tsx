import React, { memo, useState } from 'react';
import type { EntityEntry } from './types';
import EntityModal from './EntityModal';
import styles from './EntitiesExplorer.module.css';

interface EntityCardProps {
  entity: EntityEntry;
  query:  string;
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

const MAX_FIELDS_VISIBLE = 5;

const EntityCard = memo(function EntityCard({ entity, query }: EntityCardProps) {
  const [open, setOpen] = useState(false);

  const visibleFields = entity.fields.slice(0, MAX_FIELDS_VISIBLE);
  const hiddenCount   = entity.fields.length - visibleFields.length;

  return (
    <>
      <div
        className={styles.card}
        onClick={() => setOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setOpen(true)}
      >
        {/* Header: category + entity identifier */}
        <div className={styles.cardHeader}>
          <span className={styles.categoryBadge}>{entity.category}</span>
          {entity.entity && (
            <code className={styles.entityChip}>
              <Highlight text={entity.entity} query={query} />
            </code>
          )}
        </div>

        {/* Entity name */}
        <h3 className={styles.entityName}>
          <Highlight text={entity.name} query={query} />
        </h3>

        {/* Fields */}
        {visibleFields.length > 0 && (
          <div className={styles.fieldsSection}>
            <span className={styles.metaLabel}>Campos</span>
            <div className={styles.fields}>
              {visibleFields.map((f) => (
                <code key={f} className={styles.fieldChip}>
                  <Highlight text={f} query={query} />
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
          <span className={styles.detailsHint}>Ver inferências e exemplo →</span>
        </div>
      </div>

      {open && <EntityModal entity={entity} onClose={() => setOpen(false)} />}
    </>
  );
});

export default EntityCard;
