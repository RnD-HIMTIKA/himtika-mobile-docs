import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'HIMTIKA Mobile Docs',
  tagline: 'Dokumentasi Fitur dan API Internal',
  favicon: 'img/himfo_logo2.svg',

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
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          // GANTI INI
          sidebarPath: require.resolve('./sidebars.js'), // Arahkan ke file sidebar baru kita
          // Ganti juga 'Edit this page' URL jika Anda mau
          editUrl: 'https://github.com/HIMTIKA-UNSIKA/himfo-docusaurus/edit/main/',
        },
        blog: {
          // Hapus blog jika tidak perlu
          showReadingTime: false,
          editUrl: 'https://github.com/HIMTIKA-UNSIKA/himfo-docusaurus/edit/main/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig: {
    image: 'img/himtika-banner.png',
    navbar: {
        title: 'Dokumentasi HIMFO',
        logo: {
          alt: 'HIMFO Logo',
          src: 'img/himfo_logo2.svg',
        },
        items: [
          {
            type: 'docSidebar',
            // PERBAIKAN DI SINI: Ganti 'tutorialSidebar' menjadi 'docs'
            sidebarId: 'docs', 
            position: 'left',
            label: 'Dokumentasi',
          },
          // HAPUS LINK BLOG JIKA TIDAK PERLU
          // {to: '/blog', label: 'Blog', position: 'left'}, 
          {
            href: 'https://github.com/RnD-HIMTIKA/himtika-mobile-information',
            label: 'GitHub Proyek',
            position: 'right',
          },
        ],
      },

      // GANTI BAGIAN FOOTER
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Dokumentasi',
            items: [
              {
                label: 'Pengenalan',
                to: '/docs/introduction',
              },
              {
                label: 'Panduan Memulai',
                to: '/docs/getting-started/installation',
              },
            ],
          },
          {
            title: 'Komunitas',
            items: [
              {
                label: 'Instagram HIMTIKA',
                href: 'https://www.instagram.com/himtika_unsika/',
              },
              {
                label: 'Website HIMTIKA',
                href: 'https://himtika.cs.unsika.ac.id',
              },
            ],
          },
          {
            title: 'Proyek',
            items: [
              {
                label: 'GitHub (HIMFO)',
                href: 'https://github.com/RnD-HIMTIKA/himtika-mobile-information',
              },
              {
                label: 'GitHub (HIMFO docs)',
                href: 'https://github.com/RnD-HIMTIKA/himtika-mobile-docs',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} HIMTIKA UNSIKA. Dibangun dengan Docusaurus.`,
      },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;