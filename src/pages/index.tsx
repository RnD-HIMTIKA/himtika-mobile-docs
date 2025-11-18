import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        {/* Ganti dengan logo Anda jika mau */}
        {/* <img src="/img/himfo_logo.png" alt="HIMFO Logo" width="150" /> */}
        
        <Heading as="h1" className="hero__title">
          Dokumentasi Proyek HIMFO
        </Heading>
        <p className="hero__subtitle">Panduan Lengkap Serah Terima Proyek untuk Developer HIMTIKA Berikutnya.</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/introduction"> {/* Arahkan ke pengenalan kita */}
            Mulai Baca Dokumentasi 🚀
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Selamat Datang di Dokumentasi HIMFO`}
      description="Panduan Lengkap Serah Terima Proyek HIMFO">
      <HomepageHeader />
      {/* Kita hapus <main> dan <HomepageFeatures /> */}
    </Layout>
  );
}
