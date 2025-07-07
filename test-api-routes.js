#!/usr/bin/env node

/**
 * Test script to verify API routes are working
 * Run with: node test-api-routes.js
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const testRoutes = [
  {
    name: 'Simple Test Route',
    url: `${BASE_URL}/api/test-simple`,
    method: 'GET'
  },
  {
    name: 'Dynamic Test Route',
    url: `${BASE_URL}/api/test-dynamic/123`,
    method: 'GET'
  },
  {
    name: 'Admin Test Route',
    url: `${BASE_URL}/api/admin/test`,
    method: 'GET'
  },
  {
    name: 'Admin Posts Route',
    url: `${BASE_URL}/api/admin/posts`,
    method: 'GET'
  },
  {
    name: 'Admin Posts Dynamic Route',
    url: `${BASE_URL}/api/admin/posts/test-id`,
    method: 'GET'
  }
];

async function testRoute(route) {
  try {
    console.log(`\n🧪 Testing: ${route.name}`);
    console.log(`   URL: ${route.url}`);
    
    const response = await fetch(route.url, {
      method: route.method,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log(`   Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`   ✅ Success:`, data);
    } else {
      const errorText = await response.text();
      console.log(`   ❌ Error: ${errorText}`);
    }
  } catch (error) {
    console.log(`   💥 Network Error: ${error.message}`);
  }
}

async function runTests() {
  console.log('🚀 Starting API Route Tests');
  console.log(`📍 Base URL: ${BASE_URL}`);
  console.log('=' .repeat(50));
  
  for (const route of testRoutes) {
    await testRoute(route);
  }
  
  console.log('\n' + '=' .repeat(50));
  console.log('🏁 Test Complete');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testRoutes, testRoute, runTests }; 