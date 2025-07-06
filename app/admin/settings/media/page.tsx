'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Image, Upload, Settings, Save } from 'lucide-react';

export default function MediaSettingsPage() {
  const [settings, setSettings] = useState({
    imageOptimization: true,
    webpConversion: true,
    maxImageSize: 2048,
    quality: 85,
    storageProvider: 'supabase',
    cdnEnabled: false,
    socialMediaPresets: {
      facebook: { width: 1200, height: 630 },
      twitter: { width: 1200, height: 675 },
      linkedin: { width: 1200, height: 627 },
      instagram: { width: 1080, height: 1080 }
    }
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: Implement save to Supabase
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert('Media settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Media Settings</h1>
        <p className="text-gray-600">Configure image optimization, storage, and social media presets</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Image Optimization */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Image className="w-5 h-5 text-[#ff6b35]" />
            <h2 className="text-lg font-semibold">Image Optimization</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="image-optimization">Enable Image Optimization</Label>
                <p className="text-sm text-gray-600">Automatically optimize images for web</p>
              </div>
              <Switch
                id="image-optimization"
                checked={settings.imageOptimization}
                onCheckedChange={(checked) => 
                  setSettings({ ...settings, imageOptimization: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="webp-conversion">Convert to WebP</Label>
                <p className="text-sm text-gray-600">Convert images to modern WebP format</p>
              </div>
              <Switch
                id="webp-conversion"
                checked={settings.webpConversion}
                onCheckedChange={(checked) => 
                  setSettings({ ...settings, webpConversion: checked })
                }
              />
            </div>

            <div>
              <Label htmlFor="max-size">Maximum Image Size (KB)</Label>
              <Input
                id="max-size"
                type="number"
                value={settings.maxImageSize}
                onChange={(e) => 
                  setSettings({ ...settings, maxImageSize: parseInt(e.target.value) })
                }
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="quality">Image Quality</Label>
              <div className="mt-2">
                <Slider
                  value={[settings.quality]}
                  onValueChange={([value]) => 
                    setSettings({ ...settings, quality: value })
                  }
                  max={100}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>1%</span>
                  <span>{settings.quality}%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Storage Configuration */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Upload className="w-5 h-5 text-[#ff6b35]" />
            <h2 className="text-lg font-semibold">Storage Configuration</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="storage-provider">Storage Provider</Label>
              <select
                id="storage-provider"
                value={settings.storageProvider}
                onChange={(e) => 
                  setSettings({ ...settings, storageProvider: e.target.value })
                }
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
              >
                <option value="supabase">Supabase Storage</option>
                <option value="aws">AWS S3</option>
                <option value="cloudinary">Cloudinary</option>
                <option value="local">Local Storage</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="cdn-enabled">Enable CDN</Label>
                <p className="text-sm text-gray-600">Use CDN for faster image delivery</p>
              </div>
              <Switch
                id="cdn-enabled"
                checked={settings.cdnEnabled}
                onCheckedChange={(checked) => 
                  setSettings({ ...settings, cdnEnabled: checked })
                }
              />
            </div>

            {settings.cdnEnabled && (
              <div>
                <Label htmlFor="cdn-url">CDN URL</Label>
                <Input
                  id="cdn-url"
                  placeholder="https://cdn.example.com"
                  className="mt-1"
                />
              </div>
            )}
          </div>
        </Card>

        {/* Social Media Presets */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-[#ff6b35]" />
            <h2 className="text-lg font-semibold">Social Media Presets</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(settings.socialMediaPresets).map(([platform, dimensions]) => (
              <div key={platform} className="p-4 border rounded-lg">
                <h3 className="font-medium capitalize mb-2">{platform}</h3>
                <div className="space-y-2">
                  <div>
                    <Label htmlFor={`${platform}-width`}>Width (px)</Label>
                    <Input
                      id={`${platform}-width`}
                      type="number"
                      value={dimensions.width}
                      onChange={(e) => 
                        setSettings({
                          ...settings,
                          socialMediaPresets: {
                            ...settings.socialMediaPresets,
                            [platform]: {
                              ...dimensions,
                              width: parseInt(e.target.value)
                            }
                          }
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`${platform}-height`}>Height (px)</Label>
                    <Input
                      id={`${platform}-height`}
                      type="number"
                      value={dimensions.height}
                      onChange={(e) => 
                        setSettings({
                          ...settings,
                          socialMediaPresets: {
                            ...settings.socialMediaPresets,
                            [platform]: {
                              ...dimensions,
                              height: parseInt(e.target.value)
                            }
                          }
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
} 