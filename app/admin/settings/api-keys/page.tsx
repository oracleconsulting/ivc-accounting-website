'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Key, 
  Eye, 
  EyeOff, 
  Copy, 
  Save, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface APIKey {
  id: string;
  name: string;
  provider: string;
  key: string;
  isActive: boolean;
  lastUsed?: string;
  createdAt: string;
  permissions: string[];
}

export default function APIKeysPage() {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: '1',
      name: 'OpenAI API Key',
      provider: 'OpenAI',
      key: 'sk-...',
      isActive: true,
      lastUsed: '2024-01-15T10:30:00Z',
      createdAt: '2024-01-01T00:00:00Z',
      permissions: ['read', 'write']
    },
    {
      id: '2',
      name: 'Resend Email API',
      provider: 'Resend',
      key: 're_...',
      isActive: true,
      lastUsed: '2024-01-15T09:15:00Z',
      createdAt: '2024-01-05T00:00:00Z',
      permissions: ['send']
    },
    {
      id: '3',
      name: 'LinkedIn API',
      provider: 'LinkedIn',
      key: 'li_...',
      isActive: false,
      createdAt: '2024-01-10T00:00:00Z',
      permissions: ['read', 'post']
    }
  ]);

  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [isAddingKey, setIsAddingKey] = useState(false);
  const [newKey, setNewKey] = useState({
    name: '',
    provider: '',
    key: '',
    permissions: [] as string[]
  });

  const providers = [
    { id: 'openai', name: 'OpenAI', description: 'AI and language models' },
    { id: 'resend', name: 'Resend', description: 'Email delivery service' },
    { id: 'linkedin', name: 'LinkedIn', description: 'Professional networking' },
    { id: 'twitter', name: 'Twitter/X', description: 'Social media platform' },
    { id: 'instagram', name: 'Instagram', description: 'Photo sharing platform' },
    { id: 'youtube', name: 'YouTube', description: 'Video platform' },
    { id: 'tiktok', name: 'TikTok', description: 'Short-form video platform' },
    { id: 'google', name: 'Google', description: 'Search and analytics' },
    { id: 'facebook', name: 'Facebook', description: 'Social media platform' }
  ];

  const permissions = [
    { id: 'read', name: 'Read', description: 'Read data from the service' },
    { id: 'write', name: 'Write', description: 'Write data to the service' },
    { id: 'send', name: 'Send', description: 'Send messages or emails' },
    { id: 'post', name: 'Post', description: 'Create posts or content' },
    { id: 'manage', name: 'Manage', description: 'Full management access' }
  ];

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('API key copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleAddKey = () => {
    if (!newKey.name || !newKey.provider || !newKey.key) {
      alert('Please fill in all required fields');
      return;
    }

    const key: APIKey = {
      id: Date.now().toString(),
      name: newKey.name,
      provider: newKey.provider,
      key: newKey.key,
      isActive: true,
      createdAt: new Date().toISOString(),
      permissions: newKey.permissions
    };

    setApiKeys(prev => [...prev, key]);
    setNewKey({ name: '', provider: '', key: '', permissions: [] });
    setIsAddingKey(false);
  };

  const toggleKeyStatus = (keyId: string) => {
    setApiKeys(prev => 
      prev.map(key => 
        key.id === keyId 
          ? { ...key, isActive: !key.isActive }
          : key
      )
    );
  };

  const deleteKey = (keyId: string) => {
    if (confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      setApiKeys(prev => prev.filter(key => key.id !== keyId));
    }
  };

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? (
      <CheckCircle className="w-4 h-4 text-green-600" />
    ) : (
      <XCircle className="w-4 h-4 text-red-600" />
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">API Key Management</h1>
        <p className="text-gray-600">Securely manage API keys for third-party integrations</p>
      </div>

      {/* Security Warning */}
      <Card className="p-6 bg-yellow-50 border-yellow-200">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-900">Security Notice</h3>
            <p className="text-sm text-yellow-800 mt-1">
              API keys are sensitive credentials. Never share them publicly or commit them to version control. 
              All keys are encrypted and stored securely in environment variables.
            </p>
          </div>
        </div>
      </Card>

      {/* Add New Key */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">API Keys</h2>
          <Button onClick={() => setIsAddingKey(true)}>
            <Key className="w-4 h-4 mr-2" />
            Add New Key
          </Button>
        </div>

        {isAddingKey && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <h3 className="font-medium mb-4">Add New API Key</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="key-name">Key Name</Label>
                <Input
                  id="key-name"
                  value={newKey.name}
                  onChange={(e) => setNewKey({ ...newKey, name: e.target.value })}
                  placeholder="e.g., OpenAI Production Key"
                />
              </div>
              <div>
                <Label htmlFor="key-provider">Provider</Label>
                <select
                  id="key-provider"
                  value={newKey.provider}
                  onChange={(e) => setNewKey({ ...newKey, provider: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
                >
                  <option value="">Select Provider</option>
                  {providers.map(provider => (
                    <option key={provider.id} value={provider.name}>
                      {provider.name} - {provider.description}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="key-value">API Key</Label>
                <Input
                  id="key-value"
                  type="password"
                  value={newKey.key}
                  onChange={(e) => setNewKey({ ...newKey, key: e.target.value })}
                  placeholder="Enter your API key"
                />
              </div>
              <div className="md:col-span-2">
                <Label>Permissions</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {permissions.map(permission => (
                    <label key={permission.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newKey.permissions.includes(permission.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewKey({
                              ...newKey,
                              permissions: [...newKey.permissions, permission.id]
                            });
                          } else {
                            setNewKey({
                              ...newKey,
                              permissions: newKey.permissions.filter(p => p !== permission.id)
                            });
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{permission.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleAddKey}>Add Key</Button>
              <Button variant="outline" onClick={() => setIsAddingKey(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {/* API Keys List */}
        <div className="space-y-4">
          {apiKeys.map(key => (
            <div key={key.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getStatusIcon(key.isActive)}
                  <div>
                    <h3 className="font-medium">{key.name}</h3>
                    <p className="text-sm text-gray-600">{key.provider}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={key.isActive ? 'default' : 'secondary'}>
                    {key.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleKeyVisibility(key.id)}
                  >
                    {showKeys[key.id] ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(key.key)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">API Key:</span>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {showKeys[key.id] ? key.key : '••••••••••••••••'}
                  </code>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Created: {new Date(key.createdAt).toLocaleDateString()}</span>
                  {key.lastUsed && (
                    <span>Last used: {new Date(key.lastUsed).toLocaleDateString()}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Permissions:</span>
                  <div className="flex gap-1">
                    {key.permissions.map(permission => (
                      <Badge key={permission} variant="outline" className="text-xs">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Switch
                    checked={key.isActive}
                    onCheckedChange={() => toggleKeyStatus(key.id)}
                  />
                  <span className="text-sm">Enable/Disable</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteKey(key.id)}
                    className="ml-auto text-red-600 hover:text-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {apiKeys.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Key className="mx-auto w-12 h-12 text-gray-400 mb-4" />
              <p>No API keys configured</p>
              <p className="text-sm">Add your first API key to get started</p>
            </div>
          )}
        </div>
      </Card>

      {/* Usage Statistics */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Usage Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{apiKeys.length}</div>
            <div className="text-sm text-gray-600">Total Keys</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {apiKeys.filter(k => k.isActive).length}
            </div>
            <div className="text-sm text-gray-600">Active Keys</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {providers.length}
            </div>
            <div className="text-sm text-gray-600">Supported Providers</div>
          </div>
        </div>
      </Card>
    </div>
  );
} 