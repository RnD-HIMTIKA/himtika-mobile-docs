// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // Kita definisikan satu sidebar utama
  docs: [
    // Item Tipe 'category' adalah folder yang bisa dibuka/tutup
    // Item Tipe 'doc' adalah link langsung ke file

    // Halaman Pengenalan
    {
      type: 'doc',
      id: 'introduction', // docs/introduction.md
      label: '🚀 Pengenalan',
    },

    // Kategori: Panduan Memulai
    {
      type: 'category',
      label: '🏁 Panduan Memulai',
      link: {
        type: 'generated-index', // Membuat halaman index otomatis
        title: 'Panduan Memulai',
        description: 'Mulai dari sini! Cara instalasi dan menjalankan proyek.',
      },
      items: [
        'getting-started/installation', // docs/getting-started/installation.md
        'getting-started/running-the-project',
        'getting-started/glossary',
      ],
    },

    // Kategori: Fitur Autentikasi
    {
      type: 'category',
      label: '🔐 Fitur: Autentikasi (Auth)',
      link: {
        type: 'generated-index',
        title: 'Autentikasi (Auth)',
      },
      items: [
        'auth/overview',
        'auth/database-schema',
        'auth/backend-logic-rpc',
        'auth/security-rls',
        'auth/architecture-flow',
        'auth/troubleshooting',
      ],
    },

    // Kategori: Fitur Role Management
    {
      type: 'category',
      label: '👑 Fitur: Admin Role',
      link: {
        type: 'generated-index',
        title: 'Manajemen Role (Admin)',
      },
      items: [
        'roles/overview',
        'roles/database-schema',
        'roles/backend-logic-rpc',
        'roles/security-rls',
        'roles/architecture-flow',
        'roles/troubleshooting',
      ],
    },

    // Kategori: Fitur HiAgenda
    // PERBAIKAN DI SINI: Mengubah 'hiagenda' menjadi 'HiAgenda' sesuai folder asli
    {
      type: 'category',
      label: '🗓️ Fitur: HiAgenda (Kalender)',
      link: {
        type: 'generated-index',
        title: 'HiAgenda (Kalender Kolaboratif)',
      },
      items: [
        'HiAgenda/overview',
        'HiAgenda/database-schema',
        'HiAgenda/backend-logic-rpc',
        'HiAgenda/backend-logic-edge',
        'HiAgenda/security-rls',
        'HiAgenda/architecture-flow',
        'HiAgenda/troubleshooting',
      ],
    },

    // Kategori: Fitur HiCode (User)
    {
      type: 'category',
      label: '📚 Fitur: HiCode (User)',
      link: {
        type: 'generated-index',
        title: 'HiCode (Sisi Pengguna)',
      },
      items: [
        'hicode-user/overview',
        'hicode-user/database-schema',
        'hicode-user/backend-logic-rpc',
        'hicode-user/security-rls',
        'hicode-user/architecture-flow',
        'hicode-user/troubleshooting',
      ],
    },

    // Kategori: Fitur HiCode (Admin)
    {
      type: 'category',
      label: '🛠️ Fitur: HiCode (Admin)',
      link: {
        type: 'generated-index',
        title: 'HiCode (Admin Panel)',
      },
      items: [
        'hicode-admin/overview',
        'hicode-admin/database-schema',
        'hicode-admin/backend-logic-rpc',
        'hicode-admin/backend-logic-edge',
        'hicode-admin/security-rls',
        'hicode-admin/architecture-flow',
        'hicode-admin/troubleshooting',
      ],
    },

    // Kategori: Infrastruktur
    {
      type: 'category',
      label: '⚙️ Infrastruktur & Rilis',
      link: {
        type: 'generated-index',
        title: 'Infrastruktur & Rilis',
      },
      items: [
        'infrastructure/deployment',
        'infrastructure/security-secrets',
        'infrastructure/backend-workflow',
        'infrastructure/error-logging',
        'infrastructure/offline-handling',
        'infrastructure/native-fixes',
      ],
    },
  ],
};

module.exports = sidebars;