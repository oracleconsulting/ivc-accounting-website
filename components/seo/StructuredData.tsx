import Script from 'next/script';

interface ArticleStructuredDataProps {
  title: string;
  description: string;
  publishedTime: string;
  modifiedTime: string;
  author: {
    name: string;
    url?: string;
  };
  images: string[];
  slug: string;
  keywords?: string[];
}

export function ArticleStructuredData({
  title,
  description,
  publishedTime,
  modifiedTime,
  author,
  images,
  slug,
  keywords = []
}: ArticleStructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ivcaccounting.co.uk';
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    image: images,
    datePublished: publishedTime,
    dateModified: modifiedTime,
    author: {
      '@type': 'Person',
      name: author.name,
      url: author.url || `${baseUrl}/about`
    },
    publisher: {
      '@type': 'Organization',
      name: 'IVC Accounting',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${slug}`
    },
    keywords: keywords.join(', ')
  };

  return (
    <Script
      id={`article-structured-data-${slug}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

interface OrganizationStructuredDataProps {
  includeSiteSearch?: boolean;
}

export function OrganizationStructuredData({ includeSiteSearch = false }: OrganizationStructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ivcaccounting.co.uk';
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'AccountingService',
    '@id': baseUrl,
    name: 'IVC Accounting',
    alternateName: 'IVC Chartered Accountants',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: 'Expert chartered accountants serving Essex businesses. Specializing in tax planning, business growth, and financial strategy.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Halstead',
      addressRegion: 'Essex',
      addressCountry: 'GB'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 51.9453,
      longitude: 0.6309
    },
    telephone: '+44 1787 477602',
    email: 'info@ivcaccounting.co.uk',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '17:30'
      }
    ],
    priceRange: '££',
    sameAs: [
      'https://www.linkedin.com/company/ivc-accounting',
      'https://twitter.com/ivcaccounting'
    ],
    ...(includeSiteSearch && {
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${baseUrl}/blog?search={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      }
    })
  };

  return (
    <Script
      id="organization-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

interface BreadcrumbStructuredDataProps {
  items: Array<{
    name: string;
    url?: string;
  }>;
}

export function BreadcrumbStructuredData({ items }: BreadcrumbStructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ivcaccounting.co.uk';
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url && { item: `${baseUrl}${item.url}` })
    }))
  };

  return (
    <Script
      id="breadcrumb-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

interface FAQStructuredDataProps {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export function FAQStructuredData({ faqs }: FAQStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  return (
    <Script
      id="faq-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

interface ServiceStructuredDataProps {
  serviceName: string;
  description: string;
  provider?: string;
  areaServed?: string[];
  hasOfferCatalog?: {
    name: string;
    itemListElement: Array<{
      name: string;
      description: string;
    }>;
  };
}

export function ServiceStructuredData({
  serviceName,
  description,
  provider = 'IVC Accounting',
  areaServed = ['Halstead', 'Essex', 'East of England'],
  hasOfferCatalog
}: ServiceStructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ivcaccounting.co.uk';
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: serviceName,
    description: description,
    provider: {
      '@type': 'AccountingService',
      name: provider,
      url: baseUrl
    },
    areaServed: areaServed.map(area => ({
      '@type': 'Place',
      name: area
    })),
    ...(hasOfferCatalog && {
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: hasOfferCatalog.name,
        itemListElement: hasOfferCatalog.itemListElement.map(item => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: item.name,
            description: item.description
          }
        }))
      }
    })
  };

  return (
    <Script
      id={`service-structured-data-${serviceName.toLowerCase().replace(/\s+/g, '-')}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// Backward compatibility exports
export const BreadcrumbSchema = BreadcrumbStructuredData;
export const ServiceSchema = ServiceStructuredData; 