// app/page.tsx
import { Metadata } from 'next';
import Hero from '@/components/home/Hero';
import JamesStory from '@/components/home/JamesStory';
import ServicesGrid from '@/components/home/ServicesGrid';
import FAQSection from '@/components/home/FAQSection';
import ContactSection from '@/components/home/ContactSection';
import TrustIndicators from '@/components/home/TrustIndicators';
import { NewsletterSignup } from '@/components/NewsletterSignup';

export const metadata: Metadata = {
  title: 'IVC Accounting - Other Accountants File. We Fight. | Chartered Accountants Halstead Essex',
  description: 'Chartered accountants in Halstead, Essex with a 50-client limit. Direct access to James Howard. We fight for every tax saving while others just file paperwork.',
  keywords: 'chartered accountants halstead, accountant essex, halstead accountant, essex business accountant, james howard cpa, personal accountant essex',
  openGraph: {
    title: 'IVC Accounting - Other Accountants File. We Fight.',
    description: 'Chartered accountants in Halstead, Essex with a 50-client limit. Direct access to James Howard. We fight for every tax saving while others just file paperwork.',
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
      {/* Newsletter Section */}
      <section className="py-16 bg-[#f5f1e8]">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Join Our Newsletter
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Get weekly tax tips, accounting insights, and updates that help Essex businesses thrive. 
              We fight for your financial success!
            </p>
            <NewsletterSignup variant="inline" />
          </div>
        </div>
      </section>
    </>
  );
}