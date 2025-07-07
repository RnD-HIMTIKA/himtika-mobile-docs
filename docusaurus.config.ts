import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'HIMTIKA Mobile Docs',
  tagline: 'Dokumentasi Fitur dan API Internal',
  favicon: 'img/favicon.ico',

  // ✅ Ganti sesuai domain kamu (nanti setelah deploy ke Vercel misalnya)
  url: 'https://himtika-mobile-docs.vercel.app',
  baseUrl: '/',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  organizationName: 'himtika',
  projectName: 'himtika-mobile-docs',

  i18n: {
    defaultLocale: 'id',
    locales: ['id'],
  },

  future: {
    v4: true, // Persiapan untuk Docusaurus v4
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.ts'),
          editUrl: 'https://github.com/himtika/himtika-mobile-docs/edit/main/',
          routeBasePath: 'docs', // Semua dokumentasi diakses lewat /docs
        },
        blog: {
          showReadingTime: true,
          routeBasePath: 'blog',
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl: 'https://github.com/himtika/himtika-mobile-docs/edit/main/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/himtika-banner.png', // ✅ Ganti dengan gambar banner milikmu
    navbar: {
      title: 'HIMTIKA Docs',
      logo: {
        alt: 'HIMTIKA Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          to: '/blog',
          label: 'Blog',
          position: 'left',
        },
        {
          href: 'https://github.com/himtika/himtika-mobile-docs',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Dokumentasi',
          items: [
            {
              label: 'User Roles',
              to: '/docs/roles/overview',
            },
          ],
        },
        {
          title: 'Tim',
          items: [
            {
              label: 'RnD HIMTIKA',
              href: 'https://himtika-unsika.com/',
            },
          ],
        },
        {
          title: 'Lainnya',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/himtika/himtika-mobile-docs',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} HIMTIKA Unsika. Dibangun dengan Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;