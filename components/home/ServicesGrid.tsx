// components/home/ServicesGrid.tsx
import Link from 'next/link';

const services = [
  {
    title: 'ACCOUNTING',
    description: 'Full-service accounting with a focus on growth and strategic insights.',
    icon: '📊',
    link: '/services/accounting'
  },
  {
    title: 'TAX PLANNING',
    description: 'Proactive tax strategies to protect and maximize your wealth.',
    icon: '💰',
    link: '/services/tax'
  },
  {
    title: 'BUSINESS ADVISORY',
    description: 'Strategic guidance to scale your business and achieve your goals.',
    icon: '📈',
    link: '/services/advisory'
  },
  {
    title: 'COMPLIANCE',
    description: 'Stay compliant with all regulatory requirements and deadlines.',
    icon: '✓',
    link: '/services/compliance'
  }
];

const ServicesGrid = () => {
  return (
    <section className="section-padding bg-[#f5f1e8]">
      <div className="container-xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-section mb-6">
            SERVICES THAT
            <span className="block text-[#ff6b35]">DRIVE GROWTH</span>
          </h2>
          <p className="text-body max-w-2xl mx-auto">
            We combine corporate expertise with a fighting spirit to deliver results-driven
            financial services that help your business thrive.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Link 
              key={index}
              href={service.link}
              className="group"
            >
              <div className="relative">
                <div className="absolute -top-2 -left-2 w-full h-full border-2 border-[#ff6b35] group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" />
                <div className="relative bg-white border-2 border-[#1a2b4a] p-8 h-full">
                  <div className="bg-[#1a2b4a] p-4 inline-block mb-6">
                    <span className="text-3xl">{service.icon}</span>
                  </div>
                  <h3 className="text-subsection mb-4">{service.title}</h3>
                  <p className="text-body text-[#1a2b4a]/80">{service.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;