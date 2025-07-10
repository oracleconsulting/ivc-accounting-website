// components/home/JamesStory.tsx
import Image from 'next/image';

export default function JamesStory() {
  return (
    <section className="py-24 bg-[#1a2b4a] relative overflow-hidden">
      {/* Geometric Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 40px,
            #ff6b35 40px,
            #ff6b35 41px
          )`
        }} />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image Section */}
            <div className="relative order-2 lg:order-1">
              <div className="relative">
                {/* Frame Effect */}
                <div className="absolute -top-4 -left-4 w-full h-full border-2 border-[#ff6b35]" />
                <div className="relative bg-[#f5f1e8] p-2">
                  <Image
                    src="/images/james-howard.jpg"
                    alt="James Howard"
                    width={600}
                    height={600}
                    className="w-full"
                  />
                  <div className="absolute bottom-8 right-8 bg-[#ff6b35] text-[#f5f1e8] p-6 max-w-xs">
                    <p className="text-3xl font-black uppercase">2025</p>
                    <p className="text-lg font-bold uppercase">Founded IVC</p>
                    <p className="text-sm mt-1">After my PE exit, I knew there was a better way</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Content Section */}
            <div className="space-y-6 order-1 lg:order-2">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase text-[#f5f1e8]">
                15+ YEARS OF FIGHTING
                <span className="block text-[#ff6b35] mt-2">FOR BUSINESS OWNERS</span>
              </h2>
              
              <div className="space-y-4 text-lg text-[#f5f1e8]/80 leading-relaxed">
                <p>
                  I&apos;m James Howard, and I&apos;ve been in your shoes. After 15 years in accounting 
                  and surviving 1 PE acquisition personally, I know the pressure you face.
                </p>
                
                <p>
                  I&apos;ve seen how the &ldquo;big firms&rdquo; operate - treating clients like numbers, 
                  drowning them in jargon, and disappearing when things get tough. That&apos;s not 
                  accounting. That&apos;s just filing paperwork.
                </p>
              </div>
              
              <div className="bg-[#ff6b35] p-8">
                <h3 className="text-2xl font-black uppercase text-[#f5f1e8] mb-4">MY PE EXIT STORY</h3>
                <p className="text-[#f5f1e8] leading-relaxed">
                  When PE came knocking, I made a choice. I could have stayed and watched as they 
                  &ldquo;optimized&rdquo; everything - cutting corners, reducing service quality, 
                  treating clients like line items. But I chose to exit. Why? Because I knew it 
                  wasn&apos;t right for the clients. They deserved better than becoming just another 
                  number in a portfolio.
                </p>
              </div>
              
              <p className="text-lg text-[#f5f1e8]/80 leading-relaxed">
                I founded IVC because business owners deserve better. We limit ourselves to 50 clients 
                so every single one gets personal attention. When PE comes knocking, when HMRC gets 
                difficult, when you need strategic advice - you get me, not a junior.
              </p>
              
              <blockquote className="border-l-4 border-[#ff6b35] pl-6">
                <p className="text-2xl font-black uppercase text-[#ff6b35]">
                  &ldquo;OTHER ACCOUNTANTS FILE. WE FIGHT.&rdquo;
                </p>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}