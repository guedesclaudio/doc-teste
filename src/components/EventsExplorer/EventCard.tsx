import React, { useState } from 'react';
import type { EventEntry } from './types';
import EventModal from './EventModal';
import styles from './EventsExplorer.module.css';

interface EventCardProps {
  event: EventEntry;
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

const MAX_FIELDS_VISIBLE = 5;

export default function EventCard({ event, query }: EventCardProps) {
  const [open, setOpen] = useState(false);

  const visibleFields = event.fields.slice(0, MAX_FIELDS_VISIBLE);
  const hiddenCount   = event.fields.length - visibleFields.length;

  return (
    <>
      <div
        className={styles.card}
        onClick={() => setOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setOpen(true)}
      >
        {/* Header: category + eventType */}
        <div className={styles.cardHeader}>
          <span className={styles.categoryBadge}>{event.category}</span>
          {event.eventType && (
            <code className={styles.eventTypeChip}>
              <Highlight text={event.eventType} query={query} />
            </code>
          )}
        </div>

        {/* Event name */}
        <h3 className={styles.eventName}>
          <Highlight text={event.name} query={query} />
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
          <span className={styles.detailsHint}>Ver schema e exemplo →</span>
        </div>
      </div>

      {open && <EventModal event={event} onClose={() => setOpen(false)} />}
    </>
  );
}
