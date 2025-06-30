'use client'

import React, { useState, useEffect } from 'react';
import { ChevronDown, Shield, Target, TrendingUp, Phone, Mail, Calendar, Clock, Menu, X, Award, Users, Heart, Briefcase, ArrowRight, Zap, CheckCircle } from 'lucide-react';

export default function IVCHomepage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const parallaxStyle = {
    transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
  };

  return (
    <div className="bg-black text-white min-h-screen overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled ? 'bg-black/90 backdrop-blur-lg py-4' : 'bg-transparent py-6'
      }`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="text-2xl font-bold">
            <span className="text-orange-500">IVC</span> Accounting
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {['Home', 'About', 'Services', 'Team', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-orange-500 transition-colors duration-300">
                {item}
              </a>
            ))}
            <button className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-orange-500/30">
              Book a No-BS Call
            </button>
          </div>
          
          <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-purple-500/10 to-blue-500/10 animate-gradient-shift" />
          <div className="absolute top-20 left-20 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl animate-float" style={parallaxStyle} />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float-delayed" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-6xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <span className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500/20 backdrop-blur-sm rounded-full border border-orange-500/30 text-orange-400 font-bold animate-pulse-subtle">
              <Zap className="w-4 h-4" />
              QUALITY OVER QUANTITY • 50 CLIENT LIMIT
            </span>
          </div>
          
          <h1 className="mb-8 animate-fade-in-up">
            <span className="block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Other Accountants
            </span>
            <span className="block text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-black text-orange-500 mb-4 animate-glow">
              FILE
            </span>
            <span className="block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold">
              We <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-purple-500 animate-text-shimmer">FIGHT</span>
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto animate-fade-in">
            We don&apos;t hide behind jargon or drown you in reports. 
            We protect your business and help you build something real.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-fade-in">
            <button className="group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/30 flex items-center justify-center gap-2">
              Book a No-BS Call
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="border-2 border-gray-600 hover:border-orange-500 hover:text-orange-500 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 backdrop-blur-sm">
              Learn More
            </button>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in-up delay-300">
            {[
              { value: '15+', label: 'Years Fighting', icon: Award },
              { value: '1', label: 'PE Exit (By Choice)', icon: Briefcase },
              { value: '50', label: 'Client Limit', icon: Users },
              { value: '100%', label: 'Personal Service', icon: Heart }
            ].map((stat, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-1">
                  <stat.icon className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-orange-500 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-gray-400" />
        </div>
      </section>

      {/* James Story Section */}
      <section className="py-24 relative" id="about">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/30 to-purple-500/30 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
              <div className="relative bg-gray-900 rounded-3xl overflow-hidden">
                <img 
                  src="/images/james-howard.jpg" 
                  alt="James Howard" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-orange-500 text-white p-6 rounded-2xl backdrop-blur-sm">
                    <p className="text-3xl font-bold mb-2">2021</p>
                    <p className="font-semibold">Founded IVC</p>
                    <p className="text-sm opacity-90">After my PE exit, I knew there was a better way</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                <span className="text-orange-500">15+ Years</span> of Fighting 
                <span className="block">for Business Owners</span>
              </h2>
              
              <div className="space-y-4 text-lg text-gray-300">
                <p>
                  I&apos;m James Howard, and I&apos;ve been in your shoes. After 15 years in accounting 
                  and surviving 1 PE acquisition personally, I know the pressure you face.
                </p>
                
                <div className="bg-gradient-to-r from-orange-500/10 to-purple-500/10 border border-orange-500/30 rounded-2xl p-6 backdrop-blur-sm">
                  <h3 className="text-2xl font-bold text-orange-500 mb-3">My PE Exit Story</h3>
                  <p>
                    When PE came knocking, I made a choice. I could have stayed and watched as they 
                    &ldquo;optimized&rdquo; everything - cutting corners, reducing service quality, treating clients 
                    like line items. But I chose to exit. Why? Because I knew it wasn&apos;t right for the 
                    clients. They deserved better than becoming just another number in a portfolio.
                  </p>
                </div>
                
                <p>
                  I founded IVC because business owners deserve better. We limit ourselves to 50 
                  clients so every single one gets personal attention. When PE comes knocking, 
                  when HMRC gets difficult, when you need strategic advice - you get me, not a junior.
                </p>
              </div>
              
              <blockquote className="border-l-4 border-orange-500 pl-6">
                <p className="text-2xl font-semibold italic text-orange-500">
                  &ldquo;Other accountants file. We fight.&rdquo;
                </p>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-gray-900/30" id="services">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Three Ways We <span className="text-orange-500">Fight For You</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From essential compliance to strategic growth, we&apos;re your complete financial 
              partner. Not just an accountant - your business advocate.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Shield,
                title: 'Essential Compliance',
                description: 'Rock-solid bookkeeping, VAT, payroll, and year-end accounts. The basics done right, every time.',
                features: ['Monthly bookkeeping', 'VAT returns', 'Payroll management', 'Year-end accounts', 'Company secretarial'],
                color: 'from-blue-500 to-cyan-500'
              },
              {
                icon: Target,
                title: 'Strategic Advisory',
                description: "Real advice for real challenges. PE negotiations, tax planning, and business strategy from someone who's been there.",
                features: ['PE deal navigation', 'Tax optimization', 'Cash flow planning', 'Exit strategies', 'Board reporting'],
                color: 'from-purple-500 to-pink-500'
              },
              {
                icon: TrendingUp,
                title: 'Business Growth',
                description: 'Beyond the numbers. We help you build systems, find opportunities, and grow sustainably.',
                features: ['Growth strategy', 'Financial modeling', 'KPI dashboards', 'Funding support', 'Operational efficiency'],
                color: 'from-orange-500 to-red-500'
              }
            ].map((service, index) => (
              <div key={index} className="group relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
                <div className="relative bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-3xl p-8 h-full hover:border-gray-700 transition-all duration-300 hover:-translate-y-2">
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${service.color} mb-6`}>
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                  <p className="text-gray-400 mb-6">{service.description}</p>
                  
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-gray-300">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button className="group/btn inline-flex items-center text-orange-500 hover:text-orange-400 font-semibold transition-colors">
                    Learn more
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-orange-500/20 to-purple-500/20 backdrop-blur-sm border border-orange-500/30 rounded-3xl p-8 text-center max-w-2xl animate-pulse-subtle">
              <p className="text-2xl font-bold mb-2">
                🎯 Remember: <span className="text-orange-500">50 Client Limit</span>
              </p>
              <p className="text-gray-300 text-lg">
                Every client gets the attention they deserve
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24" id="faq">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Straight Answers to <span className="text-orange-500">Real Questions</span>
            </h2>
            <p className="text-xl text-gray-300">
              No corporate speak. No jargon. Just honest answers.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: "Why only 50 clients?",
                a: "Because real service takes time. I'd rather do exceptional work for 50 businesses than mediocre work for 500. Every client gets my personal attention, not passed to a junior."
              },
              {
                q: "What makes you different from other accountants?",
                a: "I've been through 3 PE acquisitions myself. I know the pressure, the negotiations, the sleepless nights. When I say 'we fight', I mean it - I've been in the trenches."
              },
              {
                q: "Do you work with startups or just established businesses?",
                a: "Both. Whether you're just starting out or preparing for exit, we provide the same personal service. The key is you're serious about building something real."
              },
              {
                q: "What if I already have an accountant?",
                a: "No problem. We'll handle the transition smoothly. Most clients switch because they're tired of being a number. If you want someone who actually cares about your business, let's talk."
              },
              {
                q: "How do you handle PE negotiations?",
                a: "With experience and aggression. I've been on both sides of the table. I know their tactics, their pressure points, and how to protect your interests. This isn't theoretical - it's personal."
              }
            ].map((faq, index) => (
              <div key={index} className="group">
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 text-left hover:border-orange-500/50 transition-all duration-300"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold pr-4">{faq.q}</h3>
                    <ChevronDown className={`w-5 h-5 text-orange-500 transition-transform duration-300 ${
                      openFAQ === index ? 'rotate-180' : ''
                    }`} />
                  </div>
                  {openFAQ === index && (
                    <p className="mt-4 text-gray-300 animate-fade-in">{faq.a}</p>
                  )}
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-300 mb-4">Have more questions?</p>
            <a href="#contact" className="text-orange-500 hover:text-orange-400 font-semibold transition-colors inline-flex items-center group">
              Let&apos;s have a real conversation 
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 to-black relative overflow-hidden" id="contact">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8">
                Ready to <span className="text-orange-500">Fight</span> Instead of File?
              </h2>
              
              <p className="text-xl text-gray-300 mb-12">
                Let&apos;s have a real conversation. No sales pitch, no jargon, just 
                straight talk about your business and how we can help protect and grow it.
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: Phone, title: 'Direct Line', desc: 'Call James directly - no gatekeepers' },
                  { icon: Mail, title: 'james@ivcaccounting.co.uk', desc: 'I read and respond to every email personally' },
                  { icon: Calendar, title: 'Book a No-BS Call', desc: '30 minutes, no obligation, real advice' }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-4 group">
                    <div className="bg-gradient-to-br from-orange-500 to-purple-500 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                      <p className="text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="mt-8 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/30 flex items-center gap-2 group">
                <Calendar className="w-5 h-5" />
                Schedule Your Call Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-800 p-8 lg:p-12">
              <h3 className="text-2xl font-bold mb-6">Quick Connect</h3>
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-orange-500/10 to-purple-500/10 rounded-2xl p-6 border border-orange-500/30">
                  <h4 className="text-xl font-semibold mb-3 flex items-center">
                    <Phone className="w-5 h-5 mr-2 text-orange-500" />
                    Direct Line to James
                  </h4>
                  <p className="text-gray-300 mb-4">
                    No gatekeepers, no junior staff. When you call, you get me directly.
                  </p>
                  <p className="text-sm text-gray-400">
                    Available to clients Mon-Fri 8am-6pm
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl p-6 border border-purple-500/30">
                  <h4 className="text-xl font-semibold mb-3 flex items-center">
                    <Mail className="w-5 h-5 mr-2 text-purple-500" />
                    Email Me Directly
                  </h4>
                  <a href="mailto:james@ivcaccounting.co.uk" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors text-lg">
                    james@ivcaccounting.co.uk
                  </a>
                  <p className="text-gray-400 mt-2 text-sm">
                    I personally read and respond within 24 hours
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl p-6 border border-blue-500/30">
                  <h4 className="text-xl font-semibold mb-3 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                    Book Your Strategy Call
                  </h4>
                  <p className="text-gray-300 mb-4">
                    30 minutes of straight talk about your business. No sales pitch, just honest advice.
                  </p>
                  <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30">
                    Schedule Now →
                  </button>
                </div>
              </div>
              
              <div className="mt-8 text-center p-6 bg-black/30 rounded-2xl">
                <Clock className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <p className="text-sm text-gray-400">
                  <span className="text-orange-500 font-semibold">Response Times:</span><br />
                  Emails: Within 24 hours<br />
                  Urgent matters: Same day<br />
                  PE negotiations: Available 24/7
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">
                <span className="text-orange-500">IVC</span> Accounting
              </h3>
              <p className="text-gray-400 mb-4">
                Other Accountants File. We Fight.
              </p>
              <p className="text-sm text-gray-500">
                Quality over quantity. 50 client limit.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-orange-500 transition-colors">Essential Compliance</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Strategic Advisory</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Business Growth</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-orange-500 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Team</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-gray-400">
                <p>
                  <a href="mailto:james@ivcaccounting.co.uk" className="hover:text-orange-500 transition-colors">
                    james@ivcaccounting.co.uk
                  </a>
                </p>
                <p>Direct line available to clients</p>
                <a href="#" className="inline-flex items-center text-orange-500 hover:text-orange-400 transition-colors mt-4">
                  <Calendar className="w-4 h-4 mr-2" />
                  Book a Call
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © 2025 IVC Accounting Ltd. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gray-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-gray-400 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 