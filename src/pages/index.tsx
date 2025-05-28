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
    <header >
        <Heading as="h1" className="hero__title" style={{textAlign: 'center', padding: '20px'}}>
    {siteConfig.title}
  </Heading>
      <div className="container" style={{display: 'flex'}}>
      <div
  className="container"
  style={{
    width: '50%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }}
>

  <p className="hero__subtitle" style={{textAlign: 'center', fontSize: '32px', margin: '20px', padding: '20px', border: '1px solid #000', borderRadius: '10px', backgroundColor: '#f0f0f0'}}>"Bots that help make Websites to take over the entire North Shore area!"</p>
  <div className={styles.buttons}>
    <Link
      className="button button--secondary button--lg"
      style={{border: '1px solid #000'}}
      to="/docs"
    >
      Docs
    </Link>
  </div>
</div>
      <div className="container" style={{width: '50%'}}>
          <img src="/img/dufenshmirtz.webp" alt="Websitenator Logo" />
        </div>
      </div>
      
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
    </Layout>
  );
}
