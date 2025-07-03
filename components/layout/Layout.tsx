import { ReactNode } from 'react';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-20">
        {children}
      </main>
      <footer className="bg-[#1a2b4a] text-[#f5f1e8] py-12">
        <div className="container-xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-subsection mb-4">IVC ACCOUNTING</h3>
              <p className="text-small opacity-80">
                Corporate strength with fighting spirit. We help businesses grow through strategic financial management.
              </p>
            </div>
            <div>
              <h4 className="font-bold uppercase mb-4">Services</h4>
              <ul className="space-y-2">
                <li><a href="/services/accounting" className="hover:text-[#ff6b35] transition-colors">Accounting</a></li>
                <li><a href="/services/tax" className="hover:text-[#ff6b35] transition-colors">Tax Planning</a></li>
                <li><a href="/services/advisory" className="hover:text-[#ff6b35] transition-colors">Business Advisory</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold uppercase mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="/about" className="hover:text-[#ff6b35] transition-colors">About Us</a></li>
                <li><a href="/team" className="hover:text-[#ff6b35] transition-colors">Our Team</a></li>
                <li><a href="/contact" className="hover:text-[#ff6b35] transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold uppercase mb-4">Contact</h4>
              <ul className="space-y-2 text-small">
                <li>123 Business Street</li>
                <li>London, UK</li>
                <li>+44 (0) 123 456 789</li>
                <li>contact@ivcaccounting.com</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#f5f1e8]/20 mt-8 pt-8 text-small text-center">
            © {new Date().getFullYear()} IVC Accounting. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 