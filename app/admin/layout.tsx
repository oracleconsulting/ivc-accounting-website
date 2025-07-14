import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminSidebarV2 from '@/components/admin/AdminSidebarV2';
import AdminHeader from '@/components/admin/AdminHeader';
import ChatWidgetRemover from '@/components/admin/ChatWidgetRemover';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }
  
  // Check if user is admin using existing tables
  // First check admin_users table
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('*')
    .eq('email', user.email)
    .single();
    
  // If not in admin_users, check profiles table
  if (!adminUser) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('email', user.email)
      .single();
      
    if (!profile?.is_admin) {
      redirect('/unauthorized');
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f1e8]">
      <ChatWidgetRemover />
      <AdminHeader />
      <div className="flex">
        <AdminSidebarV2 key="v2" />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
} 