<ServiceSchema
  serviceName={service.name}
  description={service.longDescription || service.description}
  provider="IVC Accounting"
  areaServed={["Halstead", "Essex", "East of England"]}
  hasOfferCatalog={{
    name: service.name,
    itemListElement: service.features.map((f: { title: string; description: string }) => ({
      name: f.title,
      description: f.description
    }))
  }}
/> 