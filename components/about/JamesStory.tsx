import Image from 'next/image'

export default function JamesStory() {
  return (
    <section className="py-20 px-4" id="about">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="text-orange-500">15+ Years</span> of Fighting for Business Owners
            </h2>
            
            <div className="space-y-4 text-lg text-gray-300">
              <p>
                I'm James Howard, and I've been in your shoes. After 15 years in accounting and 
                surviving 3 PE acquisitions personally, I know the pressure you face.
              </p>
              
              <p>
                I've seen how the "big firms" operate - treating clients like numbers, drowning 
                them in jargon, and disappearing when things get tough. That's not accounting. 
                That's just filing paperwork.
              </p>
              
              <p>
                I founded IVC because business owners deserve better. We limit ourselves to 50 
                clients so every single one gets personal attention. When PE comes knocking, 
                when HMRC gets difficult, when you need strategic advice - you get me, not a junior.
              </p>
              
              <div className="pt-4">
                <blockquote className="border-l-4 border-orange-500 pl-6 italic text-xl">
                  "Other accountants file. We fight."
                </blockquote>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-square relative rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-purple-500/20 z-10"></div>
              <Image
                src="/images/james-howard.jpg"
                alt="James Howard - Founder of IVC Accounting"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            
            <div className="absolute -bottom-6 -right-6 bg-orange-500 text-white p-6 rounded-lg max-w-xs">
              <p className="font-semibold">Founded IVC in 2021</p>
              <p className="text-sm opacity-90">After my 3rd PE exit, I knew there was a better way</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 