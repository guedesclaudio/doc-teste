import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Heading from '@theme/Heading';
import Layout from '@theme/Layout';
import type { ReactNode } from 'react';

import styles from './index.module.css';

const SYSTEMS = [
  {
    name: 'sds-lib',
    description: 'Motor de validação de regras de negócio para eventos de gestão animal. Garante integridade dos dados em todo o ciclo de vida pecuário.',
    to: '/sds-lib/intro',
    status: 'stable' as const,
  },
  {
    name: 'sds-backend',
    description: 'API principal da plataforma SDS. Responsável pela orquestração dos serviços e pela persistência dos dados.',
    to: '/sds-backend/intro',
    status: 'wip' as const,
  },
  {
    name: 'sds-monitor',
    description: 'Serviço de monitoramento e observabilidade. Acompanha métricas, logs e a saúde dos sistemas em produção.',
    to: '/sds-monitor/intro',
    status: 'wip' as const,
  },
  {
    name: 'sds-webhook',
    description: 'Sistema de webhooks para disparo e gerenciamento de notificações de eventos para integrações externas.',
    to: '/sds-webhook/intro',
    status: 'wip' as const,
  },
  {
    name: 'sds-entity-sync',
    description: 'Serviço de sincronização de entidades. Mantém a consistência de dados entre os sistemas acoplados da plataforma.',
    to: '/sds-entity-sync/intro',
    status: 'wip' as const,
  },
];

const STATUS_LABEL: Record<'stable' | 'wip', string> = {
  stable: 'Disponível',
  wip: 'Em construção',
};

const STATUS_COLOR: Record<'stable' | 'wip', string> = {
  stable: '#16a34a',
  wip: '#b45309',
};

const STATUS_BG: Record<'stable' | 'wip', string> = {
  stable: '#dcfce7',
  wip: '#fef3c7',
};

function SystemCard({ name, description, to, status }: (typeof SYSTEMS)[number]) {
  return (
    <div className={styles.cardWrapper}>
      <Link to={to} className={styles.cardLink}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardName}>{name}</span>
            <span
              className={styles.badge}
              style={{ color: STATUS_COLOR[status], background: STATUS_BG[status] }}
            >
              {STATUS_LABEL[status]}
            </span>
          </div>
          <p className={styles.cardDescription}>{description}</p>
          <span className={styles.cardAction}>Ver documentação →</span>
        </div>
      </Link>
    </div>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Documentação central da plataforma SDS — Agriness"
    >
      <header className={styles.heroBanner}>
        <div className="container">
          <Heading as="h1" className={styles.heroTitle}>
            SDS Platform
          </Heading>
          <p className={styles.heroSubtitle}>
            Documentação central da plataforma SDS.<br />
            Selecione um sistema para começar.
          </p>
        </div>
      </header>

      <main>
        <section className={styles.cardsSection}>
          <div className="container">
            <div className={styles.cardsGrid}>
              {SYSTEMS.map((s) => (
                <SystemCard key={s.name} {...s} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
