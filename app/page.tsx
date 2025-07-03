// app/page.tsx
import { Metadata } from 'next';
import Hero from '@/components/home/Hero';
import ServicesGrid from '@/components/home/ServicesGrid';
import Layout from '@/components/layout/Layout';

export const metadata: Metadata = {
  title: 'IVC Accounting - Other Accountants File. We Fight.',
  description: 'Personal UK accounting services with a 50-client limit. Founded by James Howard after his PE exit, choosing values over valuations to fight for business owners.',
};

export default function Home() {
  return (
    <Layout>
      <Hero />
      <ServicesGrid />
    </Layout>
  );
}