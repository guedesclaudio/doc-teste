import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';

async function tailwindPlugin() {
  return {
    name: 'docusaurus-tailwindcss',
    configurePostCss(postcssOptions: { plugins: unknown[] }) {
      postcssOptions.plugins.push(require('tailwindcss'));
      postcssOptions.plugins.push(require('autoprefixer'));
      return postcssOptions;
    },
  };
}

const config: Config = {
  title: 'SDS Docs',
  tagline: 'Documentação central da plataforma SDS — Agriness',
  favicon: 'img/logo.svg',

  future: {
    v4: true,
  },

  url: 'https://guedesclaudio.github.io',
  baseUrl: '/doc-teste/',

  organizationName: 'guedesclaudio',
  projectName: 'doc-teste',
  trailingSlash: false,

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR'],
  },

  plugins: [
    tailwindPlugin,
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'sds-backend',
        path: 'docs/sds-backend',
        routeBasePath: 'sds-backend',
        sidebarPath: './sidebars.sds-backend.ts',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'sds-monitor',
        path: 'docs/sds-monitor',
        routeBasePath: 'sds-monitor',
        sidebarPath: './sidebars.sds-monitor.ts',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'sds-webhook',
        path: 'docs/sds-webhook',
        routeBasePath: 'sds-webhook',
        sidebarPath: './sidebars.sds-webhook.ts',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'sds-entity-sync',
        path: 'docs/sds-entity-sync',
        routeBasePath: 'sds-entity-sync',
        sidebarPath: './sidebars.sds-entity-sync.ts',
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          id: 'sds-lib',
          path: 'docs/sds-lib',
          routeBasePath: 'sds-lib',
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/agriness/sds-lib/tree/main/docs/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/sds-lib-social-card.jpg',
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    announcementBar: {
      id: 'sds_platform',
      content: '📚 SDS Docs — Documentação central da plataforma SDS | <strong>Agriness</strong>',
      backgroundColor: '#1a3a7a',
      textColor: '#e8eeff',
      isCloseable: true,
    },
    navbar: {
      title: 'SDS Docs',
      logo: {
        alt: 'Agriness Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'dropdown',
          label: 'Sistemas',
          position: 'left',
          items: [
            { label: 'sds-lib', to: '/sds-lib/intro' },
            { label: 'sds-backend', to: '/sds-backend/intro' },
            { label: 'sds-monitor', to: '/sds-monitor/intro' },
            { label: 'sds-webhook', to: '/sds-webhook/intro' },
            { label: 'sds-entity-sync', to: '/sds-entity-sync/intro' },
          ],
        },
        {
          href: 'https://github.com/agriness',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Sistemas',
          items: [
            { label: 'sds-lib', to: '/sds-lib/intro' },
            { label: 'sds-backend', to: '/sds-backend/intro' },
            { label: 'sds-monitor', to: '/sds-monitor/intro' },
            { label: 'sds-webhook', to: '/sds-webhook/intro' },
            { label: 'sds-entity-sync', to: '/sds-entity-sync/intro' },
          ],
        },
        {
          title: 'sds-lib',
          items: [
            { label: 'Introdução', to: '/sds-lib/intro' },
            { label: 'Instalação', to: '/sds-lib/installation' },
            { label: 'FAQ', to: '/sds-lib/faq' },
            { label: 'Explorador de Regras', to: '/sds-lib/rules' },
          ],
        },
        {
          title: 'Agriness',
          items: [
            { label: 'GitHub', href: 'https://github.com/agriness' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Agriness. Platfarmers.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'typescript'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
