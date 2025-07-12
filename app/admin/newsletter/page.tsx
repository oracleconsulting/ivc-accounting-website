import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Plus, Mail, Users, Eye, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function NewsletterPage() {
  const supabase = createServerComponentClient({ cookies });
  
  // Get newsletters
  const { data: newsletters } = await supabase
    .from('newsletters')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  // Get subscriber count
  const { count: subscriberCount } = await supabase
    .from('newsletter_subscribers')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'confirmed');

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1a2b4a]">Newsletter Management</h1>
          <p className="text-gray-600 mt-2">Create and send newsletters to your subscribers</p>
        </div>
        <Link href="/admin/newsletter/new">
          <Button className="bg-[#ff6b35] hover:bg-[#e55a2b]">
            <Plus className="w-4 h-4 mr-2" />
            Create Newsletter
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Users className="w-8 h-8 text-[#ff6b35]" />
            <div>
              <p className="text-2xl font-bold">{subscriberCount || 0}</p>
              <p className="text-gray-600">Active Subscribers</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Mail className="w-8 h-8 text-[#4a90e2]" />
            <div>
              <p className="text-2xl font-bold">{newsletters?.filter(n => n.status === 'sent').length || 0}</p>
              <p className="text-gray-600">Sent Newsletters</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Clock className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold">{newsletters?.filter(n => n.status === 'draft').length || 0}</p>
              <p className="text-gray-600">Drafts</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Newsletters</h2>
          <div className="space-y-4">
            {newsletters && newsletters.length > 0 ? (
              newsletters.map((newsletter) => (
                <div key={newsletter.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div>
                    <h3 className="font-semibold">{newsletter.title}</h3>
                    <p className="text-sm text-gray-600">{newsletter.subject}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(newsletter.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 text-sm rounded-full ${
                      newsletter.status === 'sent' 
                        ? 'bg-green-100 text-green-800'
                        : newsletter.status === 'draft'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {newsletter.status}
                    </span>
                    <Link href={`/admin/newsletter/${newsletter.id}/edit`}>
                      <Button variant="outline" size="sm">Edit</Button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No newsletters yet. Create your first one!</p>
            )}
          </div>
        </div>
      </Card>

      <div className="mt-8 flex gap-4">
        <Link href="/admin/newsletter/subscribers">
          <Button variant="outline">
            <Users className="w-4 h-4 mr-2" />
            Manage Subscribers
          </Button>
        </Link>
        <Link href="/admin/newsletter/templates">
          <Button variant="outline">
            <Mail className="w-4 h-4 mr-2" />
            Email Templates
          </Button>
        </Link>
      </div>
    </div>
  );
} 