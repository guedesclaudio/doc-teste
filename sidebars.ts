import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Introdução',
    },
    {
      type: 'doc',
      id: 'installation',
      label: 'Instalação',
    },
    {
      type: 'doc',
      id: 'faq',
      label: 'FAQ',
    },
    {
      type: 'doc',
      id: 'releases',
      label: 'Releases',
    },
    {
      type: 'doc',
      id: 'debug',
      label: 'Manual de Debug',
    },
    {
      type: 'link',
      label: 'Explorador de Regras',
      href: '/sds-lib/rules',
    },
  ],
};

export default sidebars;
