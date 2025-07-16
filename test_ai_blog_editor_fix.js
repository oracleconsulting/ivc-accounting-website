// Test script to verify AI Blog Editor fix
// Run this in the browser console while using the AI Blog Editor

console.log('🧪 Testing AI Blog Editor Fix...');

// Track API calls
let apiCallCount = 0;
let lastApiCallTime = 0;

// Intercept fetch calls to /api/ai/score
const originalFetch = window.fetch;
window.fetch = function(...args) {
  const url = args[0];
  if (typeof url === 'string' && url.includes('/api/ai/score')) {
    apiCallCount++;
    lastApiCallTime = Date.now();
    console.log(`📡 API call #${apiCallCount} to /api/ai/score at ${new Date().toLocaleTimeString()}`);
  }
  return originalFetch.apply(this, args);
};

// Monitor for continuous calls
let continuousCallDetected = false;
let lastCheckTime = Date.now();

const checkForContinuousCalls = () => {
  const now = Date.now();
  const timeSinceLastCall = now - lastApiCallTime;
  const timeSinceLastCheck = now - lastCheckTime;
  
  // If we've had more than 3 API calls in 10 seconds, flag as continuous
  if (apiCallCount > 3 && timeSinceLastCheck < 10000) {
    continuousCallDetected = true;
    console.error('❌ CONTINUOUS API CALLS DETECTED! The fix may not be working.');
  }
  
  // If no API calls in 30 seconds, the fix is working
  if (timeSinceLastCall > 30000 && apiCallCount > 0) {
    console.log('✅ No continuous API calls detected. Fix appears to be working!');
    console.log(`📊 Total API calls made: ${apiCallCount}`);
    console.log(`⏰ Last API call was ${Math.round(timeSinceLastCall / 1000)} seconds ago`);
  }
  
  lastCheckTime = now;
};

// Check every 10 seconds
const interval = setInterval(checkForContinuousCalls, 10000);

// Instructions for testing
console.log(`
🎯 TEST INSTRUCTIONS:

1. Open the AI Blog Editor page
2. Start typing in the content area
3. Watch the console for API call logs
4. You should see:
   - 🔍 Local analysis messages (every 2 seconds)
   - 📡 API calls only when manually triggered
   - ✅ No continuous API calls

5. To test manual API analysis:
   - Click "Refresh AI Analysis" button
   - Click "Apply All Improvements" button
   - These should trigger API calls

6. Expected behavior:
   - Local analysis: Every 2 seconds (no API calls)
   - Manual API calls: Only when buttons are clicked
   - No continuous network activity in dev tools

7. To stop monitoring:
   - Run: clearInterval(${interval})
   - Or refresh the page
`);

// Export functions for manual testing
window.testAIBlogEditor = {
  getApiCallCount: () => apiCallCount,
  getLastApiCallTime: () => lastApiCallTime,
  resetCounters: () => {
    apiCallCount = 0;
    lastApiCallTime = 0;
    continuousCallDetected = false;
    console.log('🔄 Counters reset');
  },
  stopMonitoring: () => {
    clearInterval(interval);
    console.log('🛑 Monitoring stopped');
  },
  checkStatus: () => {
    console.log(`📊 Status Report:
    - Total API calls: ${apiCallCount}
    - Last API call: ${lastApiCallTime ? Math.round((Date.now() - lastApiCallTime) / 1000) + 's ago' : 'Never'}
    - Continuous calls detected: ${continuousCallDetected ? 'YES ❌' : 'NO ✅'}
    - Fix working: ${!continuousCallDetected && apiCallCount > 0 ? 'YES ✅' : 'UNKNOWN'}`);
  }
};

console.log('✅ Test script loaded. Use window.testAIBlogEditor.checkStatus() to check results.'); 