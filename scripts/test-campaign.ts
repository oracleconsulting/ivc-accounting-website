/**
 * Simple test script for campaign creation
 * Run with: npm run campaign:test
 */

import { supabase } from '../lib/supabaseClient';

async function testCampaignCreation() {
  console.log('🧪 Testing Campaign Creation System...\n');

  try {
    // Test 1: Check database connection
    console.log('1️⃣ Testing database connection...');
    const { data, error } = await supabase
      .from('campaigns')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('❌ Database connection failed:', error.message);
      return;
    }
    console.log('✅ Database connected successfully');

    // Test 2: Check if campaigns table exists
    console.log('\n2️⃣ Checking campaigns table...');
    const { data: campaigns, error: campaignsError } = await supabase
      .from('campaigns')
      .select('*')
      .limit(1);
    
    if (campaignsError) {
      console.log('❌ Campaigns table not found - run the database migration first');
      console.log('   Error:', campaignsError.message);
      return;
    }
    console.log('✅ Campaigns table exists');

    // Test 3: Test API endpoints
    console.log('\n3️⃣ Testing API endpoints...');
    
    // Test campaign creation endpoint
    const createResponse = await fetch('/api/campaign/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic: 'Test Campaign',
        description: 'This is a test campaign',
        keywords: ['test', 'campaign'],
        targetAudience: 'Test audience',
        tone: 'professional'
      })
    });

    if (createResponse.ok) {
      console.log('✅ Campaign creation endpoint working');
    } else {
      console.log('❌ Campaign creation endpoint failed:', createResponse.status);
    }

    // Test AI generation endpoints
    const aiEndpoints = [
      '/api/ai/generate-series/twitter',
      '/api/ai/generate-series/facebook',
      '/api/ai/generate-series/instagram'
    ];

    for (const endpoint of aiEndpoints) {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Test Content',
          content: 'This is test content for AI generation',
          keywords: ['test']
        })
      });

      if (response.ok) {
        console.log(`✅ ${endpoint} working`);
      } else {
        console.log(`❌ ${endpoint} failed:`, response.status);
      }
    }

    console.log('\n🎉 Basic tests completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Set up Ayrshare API key for social media posting');
    console.log('2. Configure Resend for email newsletters');
    console.log('3. Test with a real blog post');

  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
testCampaignCreation(); 