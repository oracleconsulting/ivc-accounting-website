import Image from 'next/image';

export default function JamesStory() {
  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* Subtle background effect */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl top-0 right-0" />
        <div className="absolute w-64 h-64 bg-orange-500/10 rounded-full blur-3xl bottom-0 left-0" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image Section */}
            <div className="relative order-2 lg:order-1">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/20 to-purple-500/20 rounded-3xl blur-2xl opacity-50" />
                <Image
                  src="/images/james-howard.jpg"
                  alt="James Howard"
                  width={600}
                  height={600}
                  className="rounded-3xl shadow-2xl relative z-10"
                />
                <div className="absolute -bottom-8 -right-8 bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl shadow-xl max-w-xs">
                  <p className="text-3xl font-bold mb-2">2021</p>
                  <p className="text-lg font-semibold">Founded IVC</p>
                  <p className="text-sm opacity-90 mt-1">After my 1st PE exit, I knew there was a better way</p>
                </div>
              </div>
            </div>
            
            {/* Content Section */}
            <div className="space-y-6 order-1 lg:order-2">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                <span className="text-white">15+ Years of Fighting</span>
                <span className="block text-orange-500 mt-2">for Business Owners</span>
              </h2>
              
              <div className="space-y-4 text-lg text-gray-300 leading-relaxed">
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
              
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-orange-500 mb-4">My PE Exit Story</h3>
                <p className="text-gray-300 leading-relaxed">
                  When PE came knocking, I made a choice. I could have stayed and watched as they 
                  &ldquo;optimized&rdquo; everything - cutting corners, reducing service quality, 
                  treating clients like line items. But I chose to exit. Why? Because I knew it 
                  wasn&apos;t right for the clients. They deserved better than becoming just another 
                  number in a portfolio.
                </p>
              </div>
              
              <p className="text-lg text-gray-300 leading-relaxed">
                I founded IVC because business owners deserve better. We limit ourselves to 50 clients 
                so every single one gets personal attention. When PE comes knocking, when HMRC gets 
                difficult, when you need strategic advice - you get me, not a junior.
              </p>
              
              <blockquote className="border-l-4 border-orange-500 pl-6">
                <p className="text-2xl font-semibold italic text-white">
                  &ldquo;Other accountants file. We fight.&rdquo;
                </p>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 