import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Client Login - IVC Accounting',
  description: 'Secure client portal access for IVC Accounting clients.',
};

export default function ClientLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-oracle-navy to-oracle-dark flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="relative">
          {/* Offset Border */}
          <div className="absolute -top-2 -left-2 w-full h-full border-2 border-oracle-orange" />
          
          {/* Content */}
          <div className="relative bg-white p-8 shadow-xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black text-oracle-navy uppercase mb-2">Client Portal</h1>
              <p className="text-gray-600">Access your secure client dashboard</p>
            </div>

            <form className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-oracle-navy uppercase mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded focus:border-oracle-orange focus:outline-none transition-colors"
                  placeholder="you@company.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-bold text-oracle-navy uppercase mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded focus:border-oracle-orange focus:outline-none transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-gray-600">Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-oracle-orange hover:text-oracle-orange/80">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full bg-oracle-orange hover:bg-oracle-orange/90 text-oracle-cream font-black uppercase py-3 transition-colors"
              >
                Sign In
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-600 text-sm">
                Need help accessing your account?{' '}
                <Link href="/contact" className="text-oracle-orange hover:text-oracle-orange/80 font-semibold">
                  Contact us
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 text-center">
          <p className="text-oracle-cream/80 text-sm">
            🔒 Secured by IVC Accounting. All data is encrypted and protected.
          </p>
        </div>
      </div>
    </div>
  );
} 