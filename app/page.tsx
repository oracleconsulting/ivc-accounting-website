import { Metadata } from 'next';
import { Hero } from '@/components/home/Hero';
import JamesStory from '@/components/home/JamesStory';
import ServicesGrid from '@/components/services/ServicesGrid';
import TrustIndicators from '@/components/home/TrustIndicators';
import FAQSection from '@/components/shared/FAQSection';
import ContactForm from '@/components/shared/ContactForm';
import ContactSection from '@/components/shared/ContactSection'

export const metadata: Metadata = {
  // ... existing code ...
};

export default function IVCHomePage() {
  return (
    <>
      <Hero />
      <JamesStory />
      <ServicesGrid />
      <TrustIndicators />
      <FAQSection />
      <ContactForm />
      <ContactSection />
    </>
  )
} 