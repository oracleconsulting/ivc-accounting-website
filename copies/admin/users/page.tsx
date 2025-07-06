// FILE: app/admin/users/page.tsx
// Users management page

'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Shield, User, Mail, Calendar, Search, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';

interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at?: string;
  is_super_admin?: boolean;
}

interface Profile {
  id: string;
  email: string;
  is_admin: boolean;
  created_at: string;
}

export default function UsersPage() {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showDropdownId, setShowDropdownId] = useState<string | null>(null);

  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchCurrentUser();
    fetchUsers();
  }, []);

  const fetchCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
  };

  const fetchUsers = async () => {
    try {
      // Fetch admin users
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (adminError) throw adminError;

      // Fetch profiles with admin status
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_admin', true)
        .order('created_at', { ascending: false });

      if (profileError) throw profileError;

      setAdminUsers(adminData || []);
      setProfiles(profileData || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAdminStatus = async (userId: string, currentStatus: boolean, isFromAdminTable: boolean) => {
    try {
      if (isFromAdminTable) {
        // For super admins, we can't change their status from this UI
        alert('Super admin status cannot be changed from this interface.');
        return;
      }

      // Update profile admin status
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: !currentStatus })
        .eq('id', userId);

      if (error) throw error;

      // Refresh users
      fetchUsers();
    } catch (error) {
      console.error('Error updating admin status:', error);
      alert('Error updating admin status. Please try again.');
    }
  };

  const handleRemoveAdmin = async (userId: string, isFromAdminTable: boolean) => {
    if (!confirm('Are you sure you want to remove admin access for this user?')) return;

    try {
      if (isFromAdminTable) {
        // For super admins, we need special handling
        alert('Super admins cannot be removed from this interface. Please contact system administrator.');
        return;
      }

      // Remove admin status from profile
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: false })
        .eq('id', userId);

      if (error) throw error;

      fetchUsers();
    } catch (error) {
      console.error('Error removing admin:', error);
      alert('Error removing admin. Please try again.');
    }
  };

  // Combine and deduplicate users
  const allUsers = [
    ...adminUsers.map(u => ({ ...u, isSuper: true, source: 'admin_users' as const })),
    ...profiles.filter(p => !adminUsers.some(a => a.email === p.email))
      .map(p => ({ ...p, isSuper: false, source: 'profiles' as const, last_sign_in_at: undefined }))
  ];

  const filteredUsers = allUsers.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Admin Users</h1>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search users by email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
        />
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Super admins (from admin_users table) have full system access. 
          Regular admins (from profiles table) have access to content management features.
        </p>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Added
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Login
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No admin users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                          {user.email}
                          {user.email === currentUser?.email && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {user.id.substring(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {user.isSuper ? (
                        <>
                          <Shield className="w-4 h-4 text-[#ff6b35]" />
                          <span className="text-sm font-medium text-[#ff6b35]">Super Admin</span>
                        </>
                      ) : (
                        <>
                          <User className="w-4 h-4 text-[#4a90e2]" />
                          <span className="text-sm font-medium text-[#4a90e2]">Admin</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {format(new Date(user.created_at), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {user.last_sign_in_at ? 
                      format(new Date(user.last_sign_in_at), 'MMM d, yyyy') : 
                      'Never'
                    }
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="relative">
                      <button
                        onClick={() => setShowDropdownId(showDropdownId === user.id ? null : user.id)}
                        className="text-gray-400 hover:text-gray-600"
                        disabled={user.email === currentUser?.email}
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      
                      {showDropdownId === user.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                          <div className="py-1">
                            {!user.isSuper && (
                              <button
                                onClick={() => {
                                  handleRemoveAdmin(user.id, false);
                                  setShowDropdownId(null);
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                              >
                                Remove Admin Access
                              </button>
                            )}
                            {user.isSuper && (
                              <div className="px-4 py-2 text-sm text-gray-400">
                                Cannot modify super admin
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Admins</p>
              <p className="text-2xl font-bold text-gray-900">{allUsers.length}</p>
            </div>
            <User className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Super Admins</p>
              <p className="text-2xl font-bold text-[#ff6b35]">{adminUsers.length}</p>
            </div>
            <Shield className="h-8 w-8 text-[#ff6b35]" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Regular Admins</p>
              <p className="text-2xl font-bold text-[#4a90e2]">{profiles.length}</p>
            </div>
            <User className="h-8 w-8 text-[#4a90e2]" />
          </div>
        </div>
      </div>
    </div>
  );
} 