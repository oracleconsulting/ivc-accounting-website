const { createClient } = require('@supabase/supabase-js');

// This script tests the database connection and creates test data
// Run with: node scripts/test-db-connection.js

async function testDatabaseConnection() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase environment variables');
    console.log('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
    return;
  }
  
  console.log('🔗 Testing connection to:', supabaseUrl);
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Test basic connection
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('id, title, slug, status')
      .limit(5);
    
    if (postsError) {
      console.error('❌ Error fetching posts:', postsError);
      return;
    }
    
    console.log('✅ Database connection successful');
    console.log(`📊 Found ${posts?.length || 0} posts in database`);
    
    if (posts && posts.length > 0) {
      console.log('📝 Existing posts:');
      posts.forEach(post => {
        console.log(`  - ${post.title} (${post.slug}) - ${post.status}`);
      });
    } else {
      console.log('📝 No posts found. Creating test post...');
      
      // Create a test post
      const { data: newPost, error: createError } = await supabase
        .from('posts')
        .insert({
          title: 'Welcome to IVC Accounting Blog',
          slug: 'welcome-to-ivc-accounting-blog',
          content: '{"type": "doc", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Welcome to our blog! This is a test post to verify the database connection."}]}]}',
          content_text: 'Welcome to our blog! This is a test post to verify the database connection.',
          content_html: '<p>Welcome to our blog! This is a test post to verify the database connection.</p>',
          excerpt: 'A test post to verify the database connection.',
          status: 'published',
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (createError) {
        console.error('❌ Error creating test post:', createError);
        return;
      }
      
      console.log('✅ Test post created successfully:', newPost.title);
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
}

// Run the test
testDatabaseConnection(); 