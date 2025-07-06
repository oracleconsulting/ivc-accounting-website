// app/page.tsx
import { Metadata } from 'next';
import Hero from '@/components/home/Hero';
import JamesStory from '@/components/home/JamesStory';
import ServicesGrid from '@/components/home/ServicesGrid';
import FAQSection from '@/components/home/FAQSection';
import ContactSection from '@/components/home/ContactSection';
import TrustIndicators from '@/components/home/TrustIndicators';

export const metadata: Metadata = {
  title: 'IVC Accounting Halstead, Essex | Chartered Accountants | We Fight',
  description: 'Chartered accountants in Halstead, Essex. Direct access to James Howard CPA. 50-client limit ensures personal service. Fixed fees from £500/month. We fight for every tax saving.',
  keywords: 'chartered accountants halstead, accountant essex, halstead accountant, essex business accountant, james howard cpa, personal accountant essex',
  openGraph: {
    title: 'IVC Accounting - Chartered Accountants in Halstead, Essex',
    description: 'Other accountants file. We fight. Personal service from James Howard CPA with only 50 clients.',
    images: ['/images/og-ivc-halstead-accountants.jpg'],
  }
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <JamesStory />
      <ServicesGrid />
      <FAQSection />
      <ContactSection />
    </>
  );
}