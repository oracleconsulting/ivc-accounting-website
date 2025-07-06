'use client';

import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { LogOut, User } from 'lucide-react';

export default function AdminHeader() {
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <header className="bg-[#1a2b4a] text-white p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-black">IVC ADMIN</h1>
          <span className="text-[#ff6b35] font-bold">Blog Management</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5" />
            <span className="text-sm">Admin</span>
          </div>
          
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 bg-[#ff6b35] hover:bg-[#e55a2b] transition-colors rounded"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
} 