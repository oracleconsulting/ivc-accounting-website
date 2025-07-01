// components/home/ServicesGrid.tsx
import { Shield, TrendingUp, Users } from 'lucide-react';

export default function ServicesGrid() {
  const services = [
    {
      icon: Shield,
      title: "ESSENTIAL COMPLIANCE",
      description: "We handle the boring stuff so HMRC leaves you alone. Every deadline met, every form filed, every pound saved.",
      highlight: "Average client saves: £3,847/year",
      color: "#ff6b35"
    },
    {
      icon: TrendingUp,
      title: "GROWTH STRATEGY",
      description: "Real strategies from someone who's actually built businesses. Not theory - proven tactics that work.",
      highlight: "Average revenue increase: 34%",
      color: "#4a90e2"
    },
    {
      icon: Users,
      title: "PERSONAL CFO",
      description: "Your phone calls get answered. Your emails get replies. Your business gets the attention it deserves.",
      highlight: "Response time: Under 4 hours",
      color: "#ff6b35"
    }
  ];

  return (
    <section className="py-24 bg-[#f5f1e8]">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-black uppercase text-[#1a2b4a] text-center mb-16">
          WE FIGHT FOR YOUR <span className="text-[#ff6b35]">SUCCESS</span>
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <div key={index} className="relative group">
              {/* Offset Border */}
              <div 
                className="absolute -top-2 -left-2 w-full h-full border-2 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" 
                style={{ borderColor: service.color }}
              />
              
              <div className="relative bg-white border-2 border-[#1a2b4a] p-8 h-full">
                <div className="bg-[#1a2b4a] w-16 h-16 flex items-center justify-center mb-6">
                  <service.icon className="w-8 h-8 text-[#f5f1e8]" />
                </div>
                
                <h3 className="text-2xl font-black uppercase text-[#1a2b4a] mb-4">
                  {service.title}
                </h3>
                
                <p className="text-[#1a2b4a] mb-6">
                  {service.description}
                </p>
                
                <div className="font-bold" style={{ color: service.color }}>
                  {service.highlight}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="relative inline-block group">
            <div className="absolute -top-2 -left-2 w-full h-full border-2 border-[#ff6b35] group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" />
            <div className="relative bg-[#1a2b4a] border-2 border-[#ff6b35] p-8 max-w-2xl">
              <p className="text-xl text-[#f5f1e8] mb-4">
                <span className="font-black text-[#ff6b35]">LIMITED AVAILABILITY:</span> We only work with 50 clients. 
                When we&apos;re full, we&apos;re full. No exceptions, no matter the offer.
              </p>
              <p className="text-[#f5f1e8]/80">
                This isn&apos;t a sales tactic. It&apos;s how we deliver on our promise.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}