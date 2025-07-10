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
          "alternateName": "IVC Chartered Accountants Halstead",
          "description": "Personal chartered accountants in Halstead, Essex with a 50-client limit",
          "url": "https://ivcaccounting.co.uk",
          "logo": "https://ivcaccounting.co.uk/images/ivc-logo.png",
          "image": [
            "https://ivcaccounting.co.uk/images/james-howard.jpg",
            "https://ivcaccounting.co.uk/images/ivc-logo.png"
          ],
          "founder": {
            "@type": "Person",
            "name": "James Howard",
            "jobTitle": "Chartered Accountant & Founder",
            "alumniOf": "ACCA"
          },
          "foundingDate": "2025",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "[ADD YOUR STREET ADDRESS]",
            "addressLocality": "Halstead",
            "addressRegion": "Essex",
            "postalCode": "[ADD YOUR POSTCODE]",
            "addressCountry": "GB"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 51.9456,
            "longitude": 0.6309
          },
          "telephone": "[ADD YOUR PHONE]",
          "email": "james@ivcaccounting.co.uk",
          "priceRange": "£500-£1250",
          "openingHoursSpecification": [{
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "opens": "09:00",
            "closes": "17:00"
          }],
          "areaServed": [
            {
              "@type": "City",
              "name": "Halstead",
              "@id": "https://www.wikidata.org/wiki/Q1571915"
            },
            {
              "@type": "City", 
              "name": "Braintree",
              "@id": "https://www.wikidata.org/wiki/Q894094"
            },
            {
              "@type": "City",
              "name": "Colchester",
              "@id": "https://www.wikidata.org/wiki/Q184775"
            },
            {
              "@type": "AdministrativeArea",
              "name": "Essex",
              "@id": "https://www.wikidata.org/wiki/Q23240"
            }
          ],
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Accounting Services",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Essential Fighter",
                  "description": "Complete compliance and monthly strategic guidance for Essex businesses",
                  "price": "500.00",
                  "priceCurrency": "GBP"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Growth Warrior",
                  "description": "Enhanced support for scaling Essex companies",
                  "price": "750.00",
                  "priceCurrency": "GBP"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Scale Champion",
                  "description": "Comprehensive business support for established Essex companies",
                  "price": "1250.00",
                  "priceCurrency": "GBP"
                }
              }
            ]
          },
          "slogan": "Other Accountants File. We Fight.",
          "knowsAbout": ["UK Tax Law", "HMRC Compliance", "Small Business Accounting", "VAT Returns", "Payroll", "R&D Tax Credits"],
          "memberOf": {
            "@type": "Organization",
            "name": "ACCA",
            "description": "Association of Chartered Certified Accountants"
          },
          "sameAs": [
            "https://www.linkedin.com/company/ivc-accounting",
            "https://twitter.com/ivcaccounting"
          ]
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