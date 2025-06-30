import Hero from '@/components/ivc/home/Hero'
import JamesStory from '@/components/ivc/about/JamesStory'
import ServicesGrid from '@/components/ivc/services/ServicesGrid'
import FAQSection from '@/components/ivc/shared/FAQSection'
import ContactSection from '@/components/ivc/shared/ContactSection'

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