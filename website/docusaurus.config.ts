import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'React Native Places Autocomplete',
  tagline: 'Location autocomplete for React Native',
  favicon: 'img/favicon.ico',
  future: {
    v4: true,
  },
  url: 'https://julekgwa.github.io',
  baseUrl: '/react-native-places-autocomplete',
  organizationName: 'julekgwa',
  projectName: 'react-native-places-autocomplete',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.js',
          editUrl:
            'https://github.com/julekgwa/react-native-places-autocomplete',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    navbar: {
      title: 'Places Autocomplete',
      logo: { alt: 'Logo', src: 'img/logo.png' },
      items: [
        { type: 'doc', docId: 'intro', position: 'left', label: 'Docs' },
        {
          href: 'https://github.com/julekgwa/react-native-places-autocomplete',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [{ label: 'Intro', to: '/docs/intro' }],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/julekgwa/react-native-places-autocomplete',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} julekgwa. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
