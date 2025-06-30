export const OrganizationSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AccountingService",
    "@id": "https://ivcaccounting.co.uk/#organization",
    "name": "IVC Accounting",
    "alternateName": "IVC Accounting Ltd",
    "url": "https://ivcaccounting.co.uk",
    "logo": "https://ivcaccounting.co.uk/images/IVC-logo-white.svg",
    "description": "Personal accounting services with a 50-client limit. We fight for business owners, not just file paperwork.",
    "founder": {
      "@type": "Person",
      "name": "James Howard",
      "jobTitle": "Founder & Strategic Advisor",
      "description": "15+ years experience, survived 3 PE acquisitions"
    },
    "areaServed": {
      "@type": "Country",
      "name": "United Kingdom"
    },
    "slogan": "Other Accountants File. We Fight.",
    "knowsAbout": [
      "UK Tax Compliance",
      "Business Advisory",
      "Private Equity Transitions",
      "Strategic Financial Planning",
      "Cloud Accounting"
    ],
    "sameAs": [
      "https://www.linkedin.com/company/ivc-accounting",
      "https://twitter.com/ivcaccounting"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+44-XXX-XXXX",
      "contactType": "customer service",
      "email": "james@ivcaccounting.co.uk",
      "availableLanguage": "English"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export const ServiceSchema = ({ service }: { service: any }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": service.name,
    "provider": {
      "@id": "https://ivcaccounting.co.uk/#organization"
    },
    "description": service.description,
    "areaServed": "United Kingdom",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": service.name,
      "itemListElement": service.features.map((feature: string, index: number) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": feature
        },
        "position": index + 1
      }))
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export const FAQSchema = ({ faqs }: { faqs: any[] }) => {
  const schema = {
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
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export const BreadcrumbSchema = ({ items }: { items: Array<{ name: string; url: string }> }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}; 