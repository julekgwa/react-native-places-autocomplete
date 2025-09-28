module.exports = {
  title: 'React Native Places Autocomplete',
  tagline: 'Location autocomplete for React Native',
  url: 'https://julekgwa.github.io',
  baseUrl: '/react-native-places-autocomplete/',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'julekgwa',
  projectName: 'react-native-places-autocomplete',
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/julekgwa/react-native-places-autocomplete',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  themeConfig: {
    navbar: {
      title: 'Places Autocomplete',
      logo: { alt: 'Logo', src: '/img/logo.png' },
      items: [
        { type: 'doc', docId: 'intro', position: 'left', label: 'Docs' },
        {
          href: 'https://github.com/julekgwa/react-native-places-autocomplete',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
  },
};
