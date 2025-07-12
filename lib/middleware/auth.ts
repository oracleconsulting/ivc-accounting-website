import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { AuthenticationError, AuthorizationError } from '@/lib/utils/errors';

export async function requireAuth(request: NextRequest): Promise<string> {
  // Get user from Supabase auth
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    throw new AuthenticationError();
  }
  
  return user.id;
}

export async function requireRole(
  userId: string, 
  allowedRoles: string[]
): Promise<void> {
  const { data: user } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single();
  
  if (!user || !allowedRoles.includes(user.role)) {
    throw new AuthorizationError();
  }
}

export async function requireTeamAccess(
  userId: string,
  resourceOwnerId: string
): Promise<void> {
  // Check if user owns the resource
  if (userId === resourceOwnerId) return;
  
  // Check if user has team access
  const { data: teamMember } = await supabase
    .from('team_members')
    .select('role')
    .eq('user_id', userId)
    .single();
  
  if (!teamMember || !['admin', 'editor'].includes(teamMember.role)) {
    throw new AuthorizationError();
  }
} 