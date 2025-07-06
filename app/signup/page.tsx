'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [email, setEmail] = useState('james@ivcaccounting.co.uk');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      alert(error.message);
    } else {
      alert('Check your email for confirmation!');
      router.push('/login');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#1a2b4a] flex items-center justify-center">
      <form onSubmit={handleSignup} className="bg-white p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6">Create Admin Account</h1>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border mb-4"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          className="w-full p-2 border mb-4"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#ff6b35] text-white p-2 font-bold"
        >
          {loading ? 'Creating...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
}