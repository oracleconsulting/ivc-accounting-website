// FILE: components/admin/PlatformConnector.tsx
// Platform connector component

'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Link, 
  Unlink, 
  Settings, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  RefreshCw
} from 'lucide-react';

interface SocialPlatform {
  id: string;
  name: string;
  icon: React.ReactNode;
  connected: boolean;
  profileUrl: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
}

interface PlatformConnectorProps {
  platforms: SocialPlatform[];
  onPlatformsUpdate: (platforms: SocialPlatform[]) => void;
}

export function PlatformConnector({ platforms, onPlatformsUpdate }: PlatformConnectorProps) {
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});

  const handleConnect = async (platformId: string) => {
    setConnectingPlatform(platformId);
    
    try {
      // Simulate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const updatedPlatforms = platforms.map(platform => 
        platform.id === platformId 
          ? { 
              ...platform, 
              connected: true, 
              accessToken: 'mock_token_' + platformId,
              profileUrl: `https://${platformId}.com/ivcaccounting`
            }
          : platform
      );
      
      onPlatformsUpdate(updatedPlatforms);
    } catch (error) {
      console.error('Failed to connect platform:', error);
    } finally {
      setConnectingPlatform(null);
    }
  };

  const handleDisconnect = async (platformId: string) => {
    try {
      const updatedPlatforms = platforms.map(platform => 
        platform.id === platformId 
          ? { 
              ...platform, 
              connected: false, 
              accessToken: undefined,
              refreshToken: undefined,
              expiresAt: undefined,
              profileUrl: ''
            }
          : platform
      );
      
      onPlatformsUpdate(updatedPlatforms);
    } catch (error) {
      console.error('Failed to disconnect platform:', error);
    }
  };

  const handleRefreshToken = async (platformId: string) => {
    try {
      // Simulate token refresh
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedPlatforms = platforms.map(platform => 
        platform.id === platformId 
          ? { 
              ...platform, 
              accessToken: 'refreshed_token_' + platformId,
              expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // 60 days
            }
          : platform
      );
      
      onPlatformsUpdate(updatedPlatforms);
    } catch (error) {
      console.error('Failed to refresh token:', error);
    }
  };

  const getConnectionStatus = (platform: SocialPlatform) => {
    if (!platform.connected) {
      return { status: 'disconnected', color: 'text-gray-500', icon: <Unlink className="h-4 w-4" /> };
    }
    
    if (platform.expiresAt && new Date() > platform.expiresAt) {
      return { status: 'expired', color: 'text-red-500', icon: <AlertCircle className="h-4 w-4" /> };
    }
    
    return { status: 'connected', color: 'text-green-500', icon: <CheckCircle className="h-4 w-4" /> };
  };

  return (
    <div className="space-y-6">
      {/* Platform Connections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {platforms.map(platform => {
          const connectionStatus = getConnectionStatus(platform);
          
          return (
            <Card key={platform.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${platform.connected ? 'bg-green-100' : 'bg-gray-100'}`}>
                    {platform.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{platform.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className={connectionStatus.color}>{connectionStatus.icon}</span>
                      <span className="text-sm text-gray-600 capitalize">{connectionStatus.status}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {platform.connected ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRefreshToken(platform.id)}
                        disabled={connectingPlatform === platform.id}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDisconnect(platform.id)}
                        disabled={connectingPlatform === platform.id}
                      >
                        <Unlink className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => handleConnect(platform.id)}
                      disabled={connectingPlatform === platform.id}
                    >
                      {connectingPlatform === platform.id ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Link className="h-4 w-4" />
                      )}
                      Connect
                    </Button>
                  )}
                </div>
              </div>
              
              {platform.connected && (
                <div className="space-y-3">
                  {platform.profileUrl && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Profile URL</span>
                      <div className="flex items-center gap-2">
                        <a 
                          href={platform.profileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                        >
                          View Profile
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {platform.expiresAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Token Expires</span>
                      <span className={`text-sm ${new Date() > platform.expiresAt ? 'text-red-600' : 'text-gray-900'}`}>
                        {platform.expiresAt.toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Last Sync</span>
                    <span className="text-sm text-gray-900">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* API Configuration */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">API Configuration</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn Client ID
              </label>
              <Input
                type="password"
                value={apiKeys.linkedin_client_id || ''}
                onChange={(e) => setApiKeys({ ...apiKeys, linkedin_client_id: e.target.value })}
                placeholder="Enter LinkedIn Client ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn Client Secret
              </label>
              <Input
                type="password"
                value={apiKeys.linkedin_client_secret || ''}
                onChange={(e) => setApiKeys({ ...apiKeys, linkedin_client_secret: e.target.value })}
                placeholder="Enter LinkedIn Client Secret"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram App ID
              </label>
              <Input
                type="password"
                value={apiKeys.instagram_app_id || ''}
                onChange={(e) => setApiKeys({ ...apiKeys, instagram_app_id: e.target.value })}
                placeholder="Enter Instagram App ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram App Secret
              </label>
              <Input
                type="password"
                value={apiKeys.instagram_app_secret || ''}
                onChange={(e) => setApiKeys({ ...apiKeys, instagram_app_secret: e.target.value })}
                placeholder="Enter Instagram App Secret"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Twitter API Key
              </label>
              <Input
                type="password"
                value={apiKeys.twitter_api_key || ''}
                onChange={(e) => setApiKeys({ ...apiKeys, twitter_api_key: e.target.value })}
                placeholder="Enter Twitter API Key"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Twitter API Secret
              </label>
              <Input
                type="password"
                value={apiKeys.twitter_api_secret || ''}
                onChange={(e) => setApiKeys({ ...apiKeys, twitter_api_secret: e.target.value })}
                placeholder="Enter Twitter API Secret"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button>
              <Settings className="mr-2 h-4 w-4" />
              Save Configuration
            </Button>
          </div>
        </div>
      </Card>

      {/* Connection Instructions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Connection Instructions</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">LinkedIn</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
              <li>Go to LinkedIn Developers and create a new app</li>
              <li>Add the redirect URI: <code className="bg-gray-100 px-1 rounded">https://yourdomain.com/api/auth/linkedin/callback</code></li>
              <li>Copy the Client ID and Client Secret to the fields above</li>
              <li>Click "Connect" to authorize the application</li>
            </ol>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Instagram</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
              <li>Go to Facebook Developers and create a new app</li>
              <li>Add Instagram Basic Display product to your app</li>
              <li>Configure the OAuth redirect URI</li>
              <li>Copy the App ID and App Secret to the fields above</li>
              <li>Click "Connect" to authorize the application</li>
            </ol>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Twitter/X</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
              <li>Go to Twitter Developer Portal and create a new app</li>
              <li>Enable OAuth 2.0 and set the callback URL</li>
              <li>Copy the API Key and API Secret to the fields above</li>
              <li>Click "Connect" to authorize the application</li>
            </ol>
          </div>
        </div>
      </Card>
    </div>
  );
} 