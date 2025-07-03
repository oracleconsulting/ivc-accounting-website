// app/page.tsx
import { Metadata } from 'next';
import Hero from '@/components/home/Hero';
import JamesStory from '@/components/home/JamesStory';
import ServicesGrid from '@/components/home/ServicesGrid';
import FAQSection from '@/components/home/FAQSection';
import ContactSection from '@/components/home/ContactSection';
import TrustIndicators from '@/components/home/TrustIndicators';

export const metadata: Metadata = {
  title: 'IVC Accounting - Other Accountants File. We Fight.',
  description: 'Personal UK accounting services with a 50-client limit. Founded by James Howard after his PE exit, choosing values over valuations to fight for business owners.',
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