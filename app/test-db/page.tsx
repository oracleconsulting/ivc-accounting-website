import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function TestDB() {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, slug, title, status')
    .eq('status', 'published')
    .limit(5);
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Database Test</h1>
      
      {error && (
        <div className="bg-red-100 p-4 rounded mb-4">
          Error: {error.message}
        </div>
      )}
      
      <h2 className="text-xl font-semibold mb-2">Published Posts:</h2>
      {posts && posts.length > 0 ? (
        <ul className="space-y-2">
          {posts.map(post => (
            <li key={post.id} className="border p-2 rounded">
              <div>ID: {post.id}</div>
              <div>Title: {post.title}</div>
              <div>Slug: {post.slug}</div>
              <div>Status: {post.status}</div>
              <a 
                href={`/blog/${post.slug}`} 
                className="text-blue-500 underline"
              >
                View Post
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No published posts found</p>
      )}
    </div>
  );
} 