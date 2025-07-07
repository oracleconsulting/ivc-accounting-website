# API Routes 404 Fix - Middleware & Runtime Issues

## Problem Identified

The API routes were returning 404 errors because the middleware was incorrectly configured to match `/admin/:path*`, which includes `/api/admin/*` routes. The middleware was running on API routes but not properly handling them.

## Root Cause

**File:** `middleware.ts`
**Issue:** Middleware matcher was too broad and didn't exclude API routes

```typescript
// BEFORE (Problematic)
export const config = {
  matcher: ['/admin/:path*'], // This includes /api/admin/* routes
};
```

## Solution Implemented

### 1. Fixed Middleware Configuration

**File:** `middleware.ts`

**Changes:**
- Added early return for API routes
- Updated matcher to be more specific
- Added debug logging

```typescript
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // CRITICAL: Allow API routes to pass through without authentication checks
  if (req.nextUrl.pathname.startsWith('/api/')) {
    console.log('🔓 Middleware: Allowing API route to pass through:', req.nextUrl.pathname);
    return res;
  }
  
  // ... rest of middleware logic
}

export const config = {
  // Updated matcher to be more specific and exclude API routes
  matcher: [
    // Match admin pages but exclude API routes
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    // Specifically include admin pages
    '/admin/:path*'
  ],
};
```

### 2. Enhanced Route Logging

**File:** `app/api/admin/posts/[id]/route.ts`

**Changes:**
- Added comprehensive debug logging
- Enhanced request header logging
- Better error tracking

```typescript
console.log('🚀 Loading /api/admin/posts/[id]/route.ts');

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  console.log('🎯 GET /api/admin/posts/[id] called with id:', params.id);
  console.log('📡 Request URL:', request.url);
  console.log('🔍 Request headers:', Object.fromEntries(request.headers.entries()));
  // ... rest of handler
}
```

### 3. Created Test Routes

**Files Created:**
- `app/api/test-simple/route.ts` - Simple test route
- `app/api/test-dynamic/[id]/route.ts` - Dynamic test route  
- `app/api/admin/test/route.ts` - Admin test route

**Purpose:** Verify that different types of API routes are working correctly.

### 4. Created Test Script

**File:** `test-api-routes.js`

**Purpose:** Automated testing of all API routes to verify they're working.

## Testing Instructions

### 1. Local Testing

```bash
# Start the development server
npm run dev

# In another terminal, run the test script
node test-api-routes.js
```

### 2. Manual Testing

Test these URLs in your browser or with curl:

```bash
# Simple test route
curl http://localhost:3000/api/test-simple

# Dynamic test route
curl http://localhost:3000/api/test-dynamic/123

# Admin test route
curl http://localhost:3000/api/admin/test

# Admin posts route
curl http://localhost:3000/api/admin/posts

# Admin posts dynamic route
curl http://localhost:3000/api/admin/posts/test-id
```

### 3. Production Testing

Replace `localhost:3000` with your production domain:

```bash
# Test production routes
curl https://www.ivcaccounting.co.uk/api/test-simple
curl https://www.ivcaccounting.co.uk/api/admin/test
```

## Expected Results

After the fix:

1. **All API routes should return 200 OK** instead of 404
2. **Middleware logs should show** "🔓 Middleware: Allowing API route to pass through"
3. **Route logs should show** "🎯 GET /api/admin/posts/[id] called with id:"
4. **Authentication should work** properly in API routes
5. **Admin pages should still be protected** by middleware

## Debugging

### Check Middleware Logs

Look for these console messages:
- `🔓 Middleware: Allowing API route to pass through: /api/admin/posts/123`
- `🚫 Middleware: Redirecting unauthenticated user from admin route`

### Check Route Logs

Look for these console messages:
- `🚀 Loading /api/admin/posts/[id]/route.ts`
- `🎯 GET /api/admin/posts/[id] called with id: 123`
- `📡 Request URL: https://...`
- `🔍 Request headers: {...}`

### Common Issues

1. **Still getting 404s**: Check if the route file exists and is properly exported
2. **Authentication errors**: Check if cookies are being sent properly
3. **Middleware still blocking**: Verify the middleware file was updated and deployed

## Files Modified

1. `middleware.ts` - Fixed middleware configuration
2. `app/api/admin/posts/[id]/route.ts` - Enhanced logging
3. `app/api/test-simple/route.ts` - New test route
4. `app/api/test-dynamic/[id]/route.ts` - New test route
5. `app/api/admin/test/route.ts` - New test route
6. `test-api-routes.js` - New test script
7. `API_ROUTES_404_FIX.md` - This documentation

## Deployment

After making these changes:

1. **Commit and push** the changes
2. **Deploy to production**
3. **Test the routes** using the test script or manual testing
4. **Check logs** for middleware and route messages
5. **Verify admin functionality** still works

## Rollback

If issues persist, you can temporarily disable middleware:

```bash
# Rename to disable
mv middleware.ts middleware.ts.bak
```

This will allow all routes to work but remove admin page protection.

## Status

✅ **Middleware fixed to allow API routes**
✅ **Enhanced logging added**
✅ **Test routes created**
✅ **Test script created**
✅ **Documentation complete**

The API routes should now work correctly without 404 errors. 