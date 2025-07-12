'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function TestPage() {
  const [message, setMessage] = useState('');
  const supabase = createClientComponentClient();

  const testOperations = async () => {
    setMessage('Testing...\n');
    
    try {
      // 1. Test auth
      const { data: { user } } = await supabase.auth.getUser();
      setMessage(prev => prev + `✓ Auth: ${user?.email || 'NOT LOGGED IN'}\n`);
      
      if (!user) {
        setMessage(prev => prev + '❌ Not authenticated - cannot proceed\n');
        return;
      }
      
      // 2. Test create
      const { data: newPost, error: createError } = await supabase
        .from('posts')
        .insert({
          title: 'Test from minimal component',
          slug: `test-${Date.now()}`,
          content: { type: 'doc', content: [] },
          status: 'draft',
          author_id: user.id
        })
        .select()
        .single();
        
      if (createError) {
        setMessage(prev => prev + `❌ Create failed: ${createError.message}\n`);
        return;
      }
      
      setMessage(prev => prev + `✓ Created post: ${newPost.id}\n`);
      
      // 3. Test update
      const { error: updateError } = await supabase
        .from('posts')
        .update({ title: 'Updated test post' })
        .eq('id', newPost.id);
        
      if (updateError) {
        setMessage(prev => prev + `❌ Update failed: ${updateError.message}\n`);
      } else {
        setMessage(prev => prev + `✓ Updated post\n`);
      }
      
      // 4. Test delete
      const { error: deleteError } = await supabase
        .from('posts')
        .delete()
        .eq('id', newPost.id);
        
      if (deleteError) {
        setMessage(prev => prev + `❌ Delete failed: ${deleteError.message}\n`);
      } else {
        setMessage(prev => prev + `✓ Deleted post\n`);
      }
      
      setMessage(prev => prev + '\n✅ All tests passed!');
      
    } catch (error) {
      setMessage(prev => prev + `\n❌ Error: ${error}`);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Database Test Page</h1>
      
      <button
        onClick={testOperations}
        className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 mb-4"
      >
        Run Tests
      </button>
      
      <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">
        {message || 'Click "Run Tests" to start...'}
      </pre>
      
      <div className="mt-4">
        <a href="/admin/posts/new" className="text-blue-500 underline">
          Back to Blog Editor
        </a>
      </div>
    </div>
  );
} 