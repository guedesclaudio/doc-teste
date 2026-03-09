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
  title: 'sds-lib',
  tagline: 'Motor de validação de regras de negócio para gestão pecuária — por Agriness',
  favicon: 'img/favicon.ico',

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

  plugins: [tailwindPlugin],

  presets: [
    [
      'classic',
      {
        docs: {
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
      id: 'agriness_team',
      content: '🐷 sds-lib — Motor de validação para eventos de animais | <strong>Agriness</strong>',
      backgroundColor: '#1a3a7a',
      textColor: '#e8eeff',
      isCloseable: true,
    },
    navbar: {
      title: 'sds-lib',
      logo: {
        alt: 'Agriness Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Documentação',
        },
        {
          to: '/rules',
          label: 'Explorador de Regras',
          position: 'left',
        },
        {
          to: '/docs/releases',
          label: 'Releases',
          position: 'left',
        },
        {
          href: 'https://github.com/agriness/sds-lib',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentação',
          items: [
            { label: 'Introdução', to: '/docs/intro' },
            { label: 'Instalação', to: '/docs/installation' },
            { label: 'FAQ', to: '/docs/faq' },
            { label: 'Releases', to: '/docs/releases' },
          ],
        },
        {
          title: 'Regras',
          items: [
            { label: 'Explorador de Regras', to: '/rules' },
          ],
        },
        {
          title: 'Agriness',
          items: [
            { label: 'GitHub', href: 'https://github.com/agriness-team/sds-lib' },
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
