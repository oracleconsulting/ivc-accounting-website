import Image from 'next/image';

export default function JamesStory() {
  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* Dynamic background effect */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse top-0 right-0" />
        <div className="absolute w-64 h-64 bg-orange-500/10 rounded-full blur-3xl animate-pulse bottom-0 left-0 animation-delay-2000" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/20 to-purple-500/20 rounded-3xl blur-2xl animate-pulse" />
            <Image
              src="/images/james-howard.jpg"
              alt="James Howard"
              width={600}
              height={600}
              className="rounded-3xl shadow-2xl relative z-10 border-gradient"
            />
            <div className="absolute -bottom-6 -right-6 bg-orange-500 text-white p-6 rounded-2xl shadow-xl card-hover">
              <p className="text-3xl font-bold neon-orange">2021</p>
              <p className="text-sm">Founded IVC</p>
              <p className="text-xs mt-1 opacity-90">After my 1st PE exit, I knew there was a better way</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              15+ Years of Fighting
              <span className="block text-orange-500 neon-orange">for Business Owners</span>
            </h2>
            
            <p className="text-lg text-gray-100 leading-relaxed">
              I&apos;m James Howard, and I&apos;ve been in your shoes. After 15 years in accounting and surviving 1 PE acquisition personally, I know the pressure you face.
            </p>
            
            <p className="text-lg text-gray-100 leading-relaxed">
              I&apos;ve seen how the &ldquo;big firms&rdquo; operate - treating clients like numbers, drowning them in jargon, and disappearing when things get tough. That&apos;s not accounting. That&apos;s just filing paperwork.
            </p>
            
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 glass-morphism card-hover">
              <h3 className="text-xl font-bold text-orange-500 mb-3">My PE Exit Story</h3>
              <p className="text-gray-100 leading-relaxed">
                When PE came knocking, I made a choice. I could have stayed and watched as they &ldquo;optimized&rdquo; everything - cutting corners, reducing service quality, treating clients like line items. But I chose to exit. Why? Because I knew it wasn&apos;t right for the clients. They deserved better than becoming just another number in a portfolio.
              </p>
            </div>
            
            <p className="text-lg text-gray-100 leading-relaxed">
              I founded IVC because business owners deserve better. We limit ourselves to 50 clients so every single one gets personal attention. When PE comes knocking, when HMRC gets difficult, when you need strategic advice - you get me, not a junior.
            </p>
            
            <blockquote className="border-l-4 border-orange-500 pl-6 italic text-xl text-gray-100">
              &ldquo;Other accountants file. We fight.&rdquo;
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
} 