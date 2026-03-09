import React from 'react';
import type { FlatRule, EventType } from './types';
import styles from './RulesExplorer.module.css';

interface RuleCardProps {
  rule: FlatRule;
}

const EVENT_TYPE_COLORS: Record<EventType, string> = {
  Register: styles.tagRegister,
  Update: styles.tagUpdate,
  Deletion: styles.tagDeletion,
};

const EVENT_TYPE_LABELS: Record<EventType, string> = {
  Register: 'Registro',
  Update: 'Atualização',
  Deletion: 'Exclusão',
};

export function getEventTypes(events: string[]): EventType[] {
  const types = new Set<EventType>();
  events.forEach((e) => {
    if (e.includes('_register')) types.add('Register');
    if (e.includes('_update')) types.add('Update');
    if (e.includes('_deletion')) types.add('Deletion');
  });
  return Array.from(types);
}

export default function RuleCard({ rule }: RuleCardProps) {
  const eventTypes = getEventTypes(rule.event);

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardHeaderLeft}>
          <span className={styles.groupBadge}>{rule.groupLabel}</span>
        </div>
        <span className={styles.errorCode}>{rule.error}</span>
      </div>

      <p className={styles.description}>{rule.description}</p>

      <div className={styles.events}>
        {rule.event.map((e) => (
          <code key={e} className={styles.eventCode}>{e}</code>
        ))}
      </div>

      <div className={styles.metaRow}>
        <div className={styles.tagGroup}>
          <span className={styles.metaLabel}>Evento</span>
          <div className={styles.tags}>
            {eventTypes.map((type) => (
              <span key={type} className={`${styles.tag} ${EVENT_TYPE_COLORS[type]}`}>
                {EVENT_TYPE_LABELS[type]}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.tagGroup}>
          <span className={styles.metaLabel}>Espécies</span>
          <div className={styles.tags}>
            {rule.species.map((s) => (
              <span key={s} className={`${styles.tag} ${styles.tagSpecies}`}>{s}</span>
            ))}
          </div>
        </div>

        <div className={styles.tagGroup}>
          <span className={styles.metaLabel}>Estágios</span>
          <div className={styles.tags}>
            {rule.stages.map((st) => (
              <span key={st} className={`${styles.tag} ${styles.tagStage}`}>{st}</span>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.cardFooter}>
        <span className={styles.metaLabel}>Valida:</span>
        <div className={styles.tags}>
          {rule.validationFields.map((f) => (
            <code key={f} className={styles.fieldTag}>{f}</code>
          ))}
        </div>
      </div>

      {rule.conditions && rule.conditions.length > 0 && (
        <div className={styles.conditions}>
          <span className={styles.metaLabel}>Condições</span>
          <ul className={styles.conditionsList}>
            {rule.conditions.map((c, i) => (
              <li key={i} className={styles.conditionItem}>{c}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
