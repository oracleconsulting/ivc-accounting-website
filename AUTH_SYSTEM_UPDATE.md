# IVC Authentication System Update

## Overview
Updated the IVC blog system's authentication to use existing `admin_users` and `profiles` tables instead of creating new ones.

## Changes Made

### 1. Updated Admin Layout (`app/admin/layout.tsx`)
- **Before**: Only checked `profiles` table with `role` field
- **After**: Checks both `admin_users` and `profiles` tables
- **Logic**: 
  - First checks `admin_users` table for super admin access
  - If not found, checks `profiles` table for `is_admin` field
  - Redirects to `/unauthorized` if no admin access found

### 2. Updated Login Page (`app/login/page.tsx`)
- **Before**: Only checked `profiles` table with `role` field
- **After**: Checks both tables for admin access
- **Logic**:
  - First checks `admin_users` table for super admin access
  - If not found, checks `profiles` table for `is_admin` field
  - Redirects to `/admin` for admin users, shows error for non-admin users
- **UI**: Updated placeholder to show `james@ivcaccounting.co.uk`

### 3. Created Auth Callback Route (`app/auth/callback/route.ts`)
- Handles Supabase authentication redirects
- Exchanges auth code for session
- Redirects to `/admin` after successful authentication

### 4. Created Unauthorized Page (`app/unauthorized/page.tsx`)
- Clean, branded error page for unauthorized access
- Provides options to try different account or return to website
- Uses Oracle design system colors

### 5. Created Middleware (`middleware.ts`)
- Protects all `/admin/*` routes
- Redirects unauthenticated users to `/login`
- Uses Supabase middleware client for session management

### 6. Updated Admin Header (`components/admin/AdminHeader.tsx`)
- Updated to use `createClientComponentClient`
- Changed logout to redirect to `/login` instead of home page
- Added `router.refresh()` for proper state updates

### 7. Added TypeScript Types (`lib/types/blog.ts`)
- Added `AdminUser` interface for `admin_users` table
- Added `Profile` interface for `profiles` table
- Supports role-based access control

## Database Tables Used

### `admin_users` Table
- Contains super admin users (e.g., james@ivcaccounting.co.uk)
- Fields: `id`, `email`, `role`, `created_at`, `updated_at`
- Role values: `super_admin`, `admin`, `editor`

### `profiles` Table
- Contains regular users with admin flags
- Fields: `id`, `email`, `is_admin`, `created_at`, `updated_at`
- `is_admin` boolean field determines admin access

## Authentication Flow

1. **Login**: User enters credentials at `/login`
2. **Auth Check**: System checks both `admin_users` and `profiles` tables
3. **Access Control**: 
   - Super admins (admin_users) get full access
   - Regular admins (profiles with is_admin=true) get access
   - Non-admin users get redirected to `/unauthorized`
4. **Session Management**: Supabase handles session persistence
5. **Route Protection**: Middleware protects all admin routes

## Environment Variables Required
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Testing Checklist

- [ ] Login with james@ivcaccounting.co.uk (super admin)
- [ ] Login with user from profiles table (is_admin=true)
- [ ] Test non-admin user gets redirected to /unauthorized
- [ ] Test logout redirects to /login
- [ ] Test middleware protection of admin routes
- [ ] Test auth callback route functionality

## Security Considerations

1. **Row Level Security (RLS)**: Ensure RLS policies are enabled on both tables
2. **Session Management**: Supabase handles secure session management
3. **Route Protection**: Middleware prevents unauthorized access
4. **Error Handling**: Proper error messages without exposing sensitive data

## Files Modified/Created

### Modified Files:
- `app/admin/layout.tsx`
- `app/login/page.tsx`
- `components/admin/AdminHeader.tsx`
- `lib/types/blog.ts`

### Created Files:
- `app/auth/callback/route.ts`
- `app/unauthorized/page.tsx`
- `middleware.ts`
- `AUTH_SYSTEM_UPDATE.md` (this file)

## Next Steps

1. **Test the system** with existing users
2. **Add RLS policies** if not already configured
3. **Consider role-based permissions** for different admin levels
4. **Monitor authentication logs** for security
5. **Add password reset functionality** if needed

## Notes

- The system now supports both super admins and regular admins
- All authentication uses Supabase Auth helpers for Next.js
- The design follows the Oracle design system colors
- Error handling is user-friendly and secure
- Build completed successfully with no TypeScript errors 