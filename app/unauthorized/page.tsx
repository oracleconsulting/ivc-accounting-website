import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-[#1a2b4a] flex items-center justify-center px-4">
      <div className="bg-white p-8 shadow-lg max-w-md text-center">
        <h1 className="text-3xl font-black text-[#1a2b4a] mb-4">
          ACCESS DENIED
        </h1>
        <p className="text-gray-600 mb-8">
          You don't have permission to access the admin area.
        </p>
        <div className="space-y-4">
          <Link 
            href="/login"
            className="block w-full bg-[#ff6b35] hover:bg-[#e55a2b] text-white font-bold py-3 uppercase transition-colors"
          >
            Try Different Account
          </Link>
          <Link 
            href="/"
            className="block w-full border-2 border-[#1a2b4a] text-[#1a2b4a] hover:bg-[#1a2b4a] hover:text-white font-bold py-3 uppercase transition-colors"
          >
            Back to Website
          </Link>
        </div>
      </div>
    </div>
  );
} 