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
            'https://github.com/julekgwa/react-native-places-autocomplete/tree/main/website/',
          // Allow docs to override metadata
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
        },
        gtag: {
          trackingID: 'G-DGRGT4ZTG7',
          anonymizeIP: true,
        },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    // Add structured data for better SEO
    metadata: [
      {
        name: 'description',
        content:
          'React Native Places Autocomplete provides location search and autocomplete for React Native apps, supporting multiple providers and easy integration.',
      },
      {
        name: 'keywords',
        content:
          'react-native, autocomplete, location, places, search, geocoding, mapbox, google places, openstreetmap, geoapify, locationiq, here maps, tomtom',
      },
      { name: 'author', content: 'julekgwa' },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: 'React Native Places Autocomplete' },
      {
        property: 'og:description',
        content:
          'Location autocomplete for React Native apps with support for 8+ providers including Google, Mapbox, and OpenStreetMap.',
      },
      {
        property: 'og:image',
        content:
          'https://julekgwa.github.io/react-native-places-autocomplete/img/providers.png',
      },
      {
        property: 'og:url',
        content: 'https://julekgwa.github.io/react-native-places-autocomplete',
      },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'React Native Places Autocomplete' },
      {
        name: 'twitter:description',
        content:
          'Location autocomplete for React Native apps with support for 8+ providers.',
      },
      {
        name: 'twitter:image',
        content:
          'https://julekgwa.github.io/react-native-places-autocomplete/img/providers.png',
      },
    ],
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
  headTags: [
    // Preconnect to external domains for better performance
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'anonymous',
      },
    },
    // JSON-LD structured data for better search engine understanding
    {
      tagName: 'script',
      attributes: {
        type: 'application/ld+json',
      },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org/',
        '@type': 'SoftwareApplication',
        'name': 'React Native Places Autocomplete',
        'description':
          'A provider-agnostic location autocomplete component for React Native with support for multiple providers including Google Places, Mapbox, and OpenStreetMap.',
        'applicationCategory': 'DeveloperApplication',
        'operatingSystem': 'React Native, iOS, Android',
        'url': 'https://julekgwa.github.io/react-native-places-autocomplete',
        'author': {
          '@type': 'Person',
          'name': 'julekgwa',
          'url': 'https://github.com/julekgwa',
        },
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'USD',
        },
        'codeRepository':
          'https://github.com/julekgwa/react-native-places-autocomplete',
        'programmingLanguage': 'TypeScript',
        'runtimePlatform': 'React Native',
      }),
    },
  ],
};

export default config;
