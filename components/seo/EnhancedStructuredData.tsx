export function LocalBusinessSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AccountingService",
          "@id": "https://ivcaccounting.co.uk/#organization",
          "name": "IVC Accounting",
          "alternateName": "IVC",
          "url": "https://ivcaccounting.co.uk",
          "logo": "https://ivcaccounting.co.uk/images/ivc-logo.png",
          "image": [
            "https://ivcaccounting.co.uk/images/office-1x1.jpg",
            "https://ivcaccounting.co.uk/images/office-4x3.jpg",
            "https://ivcaccounting.co.uk/images/office-16x9.jpg"
          ],
          "description": "Personal UK accounting services with a 50-client limit. Other accountants file. We fight.",
          "slogan": "Other Accountants File. We Fight.",
          "foundingDate": "2021",
          "founder": {
            "@type": "Person",
            "name": "James Howard",
            "jobTitle": "Founder & CPA",
            "image": "https://ivcaccounting.co.uk/images/james-howard.jpg"
          },
          "areaServed": {
            "@type": "Country",
            "name": "United Kingdom"
          },
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Accounting Services",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Essential Fighter",
                  "description": "Complete compliance and strategic advisory",
                  "price": "500",
                  "priceCurrency": "GBP"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Growth Warrior",
                  "description": "Enhanced strategic support and forecasting",
                  "price": "750",
                  "priceCurrency": "GBP"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Scale Champion",
                  "description": "Comprehensive business support and board attendance",
                  "price": "1250",
                  "priceCurrency": "GBP"
                }
              }
            ]
          },
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "GB",
            "addressRegion": "England"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "Sales",
            "telephone": "+44-xxx-xxx-xxxx",
            "email": "james@ivcaccounting.co.uk",
            "availableLanguage": "English"
          },
          "sameAs": [
            "https://www.linkedin.com/company/ivc-accounting",
            "https://twitter.com/ivcaccounting"
          ],
          "knowsAbout": [
            "UK Tax Law",
            "Business Strategy",
            "Financial Planning",
            "HMRC Compliance",
            "Small Business Accounting"
          ],
          "hasCredential": {
            "@type": "EducationalOccupationalCredential",
            "credentialCategory": "Professional Certification",
            "name": "Chartered Certified Accountant",
            "issuedBy": {
              "@type": "Organization",
              "name": "ACCA"
            }
          }
        })
      }}
    />
  )
}

export function FAQSchema({ faqs }: { faqs: Array<{question: string, answer: string}> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        })
      }}
    />
  )
}

export function ServiceSchema({ service }: { 
  service: {
    name: string;
    description: string;
    price: number;
    features: string[];
  }
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "name": service.name,
          "description": service.description,
          "provider": {
            "@type": "Organization",
            "name": "IVC Accounting"
          },
          "offers": {
            "@type": "Offer",
            "price": service.price,
            "priceCurrency": "GBP",
            "priceSpecification": {
              "@type": "UnitPriceSpecification",
              "price": service.price,
              "priceCurrency": "GBP",
              "billingIncrement": "P1M"
            }
          },
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "itemListElement": service.features.map(feature => ({
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": feature
              }
            }))
          }
        })
      }}
    />
  )
} 