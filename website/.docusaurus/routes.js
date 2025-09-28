import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', '5ff'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '5ba'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', 'a2b'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', 'c3c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '156'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '88c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '000'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', 'c3d'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', '362'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', 'a86'),
            routes: [
              {
                path: '/docs/intro',
                component: ComponentCreator('/docs/intro', 'a6e'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/providers',
                component: ComponentCreator('/docs/providers', 'dfc'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/usage',
                component: ComponentCreator('/docs/usage', '8e1'),
                exact: true,
                sidebar: "docs"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', '2bc'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
