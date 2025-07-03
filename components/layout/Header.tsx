import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="fixed w-full top-0 z-50 bg-[#1a2b4a] text-[#f5f1e8]">
      <div className="container-xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/ivc-logo.png"
              alt="IVC Accounting"
              width={150}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/services" className="font-bold uppercase hover:text-[#ff6b35] transition-colors">
              Services
            </Link>
            <Link href="/about" className="font-bold uppercase hover:text-[#ff6b35] transition-colors">
              About
            </Link>
            <Link href="/blog" className="font-bold uppercase hover:text-[#ff6b35] transition-colors">
              Blog
            </Link>
            <Link href="/contact" className="font-bold uppercase hover:text-[#ff6b35] transition-colors">
              Contact
            </Link>
          </nav>

          {/* CTA Button */}
          <Link 
            href="/client-login"
            className="hidden md:inline-block bg-[#ff6b35] hover:bg-[#e55a2b] text-[#f5f1e8] font-black uppercase px-6 py-2 transition-colors"
          >
            Client Login
          </Link>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" aria-label="Menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 