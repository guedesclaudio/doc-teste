import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Heading from '@theme/Heading';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import type { ReactNode } from 'react';

import styles from './index.module.css';

const FEATURES = [
  {
    title: 'Arquitetura Modular de Regras',
    icon: '🗂️',
    description:
      'As regras são organizadas em arquivos JSON separados por grupo. Adicione um novo arquivo para estender o sistema — sem alterações no código.',
  },
  {
    title: 'Validação Orientada a Eventos',
    icon: '⚡',
    description:
      'Cada evento do ciclo de vida animal (registro, atualização, exclusão) é validado contra o conjunto de regras relevante antes de ser persistido.',
  },
  {
    title: 'Códigos de Erro Estruturados',
    icon: '🔍',
    description:
      'Cada violação retorna um código de erro único (ex: AN009) e uma mensagem legível, facilitando o diagnóstico por desenvolvedores e suporte.',
  },
  {
    title: 'Ciente de Espécie e Estágio',
    icon: '🐷',
    description:
      'As regras são escopadas para espécies específicas (porca, leitoa, varrão) e estágios reprodutivos (gestação, lactação, vazia) para controle preciso.',
  },
  {
    title: 'Explorador Interativo de Regras',
    icon: '🗺️',
    description:
      'Navegue, pesquise e filtre todas as regras de validação neste portal. Ideal para desenvolvedores e equipes de suporte.',
  },
];

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/docs/intro">
            Começar
          </Link>
          <Link
            className="button button--outline button--secondary button--lg"
            to="/rules"
            style={{ marginLeft: '1rem' }}
          >
            Explorador de Regras
          </Link>
        </div>
      </div>
    </header>
  );
}

function Feature({ title, icon, description }: { title: string; icon: string; description: string }) {
  return (
    <div className="col col--4" style={{ marginBottom: '2rem' }}>
      <div className="card padding--md" style={{ height: '100%' }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
        <Heading as="h3" style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
          {title}
        </Heading>
        <p style={{ fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)', margin: 0 }}>
          {description}
        </p>
      </div>
    </div>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} — Agriness`}
      description="sds-lib — Motor de validação de regras de negócio para gestão pecuária. Por Agriness."
    >
      <HomepageHeader />
      <main>
        <section style={{ padding: '3rem 0' }}>
          <div className="container">
            <div className="row">
              {FEATURES.map((f) => (
                <Feature key={f.title} {...f} />
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '2rem', padding: '2rem', background: 'var(--ifm-color-emphasis-100)', borderRadius: '0.75rem' }}>
              <Heading as="h2" style={{ marginBottom: '0.5rem' }}>
                Pronto para explorar as regras?
              </Heading>
              <p style={{ color: 'var(--ifm-color-emphasis-700)', marginBottom: '1.25rem' }}>
                Use o Explorador de Regras para navegar por todas as validações com busca avançada e filtros.
              </p>
              <Link className="button button--primary button--lg" to="/rules">
                Abrir Explorador de Regras
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
