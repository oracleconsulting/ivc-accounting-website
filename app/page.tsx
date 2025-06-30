import Hero from '@/components/home/Hero'
import JamesStory from '@/components/about/JamesStory'
import ServicesGrid from '@/components/services/ServicesGrid'
import FAQSection from '@/components/shared/FAQSection'
import ContactSection from '@/components/shared/ContactSection'

export default function IVCHomePage() {
  return (
    <>
      <Hero />
      <JamesStory />
      <ServicesGrid />
      <FAQSection />
      <ContactSection />
    </>
  )
} 