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
  stable: '#1a8a3a',
  wip: '#b06000',
};

const STATUS_BG: Record<'stable' | 'wip', string> = {
  stable: '#e6f4ea',
  wip: '#fff4e0',
};

function SystemCard({ name, description, to, status }: (typeof SYSTEMS)[number]) {
  return (
    <div className="col col--6" style={{ marginBottom: '1.5rem' }}>
      <div
        className="card padding--lg"
        style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Heading as="h3" style={{ margin: 0, fontSize: '1.1rem', fontFamily: 'monospace' }}>
            {name}
          </Heading>
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 600,
              padding: '0.2rem 0.55rem',
              borderRadius: '999px',
              color: STATUS_COLOR[status],
              background: STATUS_BG[status],
              letterSpacing: '0.03em',
            }}
          >
            {STATUS_LABEL[status]}
          </span>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)', margin: 0, flexGrow: 1 }}>
          {description}
        </p>
        <Link className="button button--primary button--sm" to={to}>
          Ver documentação →
        </Link>
      </div>
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
        <div className="container" style={{ textAlign: 'center' }}>
          <Heading as="h1" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
            SDS Platform
          </Heading>
          <p style={{ fontSize: '1.15rem', opacity: 0.85, maxWidth: '560px', margin: '0 auto 2rem' }}>
            Documentação central da plataforma SDS.<br />
            Selecione um sistema para começar.
          </p>
        </div>
      </header>

      <main>
        <section style={{ padding: '3rem 0' }}>
          <div className="container">
            <div className="row">
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
