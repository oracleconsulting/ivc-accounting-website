// FILE: components/admin/AIPromptSettings.tsx
// AI prompt settings component

'use client';

import { useState, useEffect } from 'react';
import { Save, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface AISettings {
  research_system_prompt: string;
  research_temperature: number;
  research_model: string;
  writing_system_prompt: string;
  writing_temperature: number;
  writing_model: string;
  social_system_prompt: string;
  social_temperature: number;
  social_model: string;
}

export default function AIPromptSettings() {
  const [settings, setSettings] = useState<AISettings>({
    research_system_prompt: '',
    research_temperature: 0.7,
    research_model: 'anthropic/claude-3-haiku',
    writing_system_prompt: '',
    writing_temperature: 0.8,
    writing_model: 'anthropic/claude-3-sonnet',
    social_system_prompt: '',
    social_temperature: 0.9,
    social_model: 'anthropic/claude-3-haiku',
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/ai/settings');
      if (!response.ok) throw new Error('Failed to fetch settings');
      
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load AI settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/ai/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save settings');
      }
      
      toast.success('AI settings saved successfully!');
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error(error instanceof Error ? error.message : 'Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset to default settings? This will discard all changes.')) {
      fetchSettings();
      setHasChanges(false);
    }
  };

  const updateSetting = (key: keyof AISettings, value: string | number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading AI settings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">AI Prompt Configuration</h2>
          <p className="text-sm text-gray-600 mt-1">
            Configure system prompts and parameters for AI assistants
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Reset to Defaults
          </button>
          
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className="flex items-center gap-2 bg-[#ff6b35] text-white px-6 py-2 rounded-lg hover:bg-[#e55a2b] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </div>

      {hasChanges && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <span className="text-yellow-800">You have unsaved changes</span>
        </div>
      )}

      {/* Research Agent */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          Research Agent
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              System Prompt
            </label>
            <textarea
              value={settings.research_system_prompt}
              onChange={(e) => updateSetting('research_system_prompt', e.target.value)}
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent resize-none"
              placeholder="System prompt for research agent..."
            />
            <p className="mt-1 text-sm text-gray-500">
              {settings.research_system_prompt.length} characters
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temperature: {settings.research_temperature}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.research_temperature}
                onChange={(e) => updateSetting('research_temperature', parseFloat(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Lower = more focused, Higher = more creative
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model
              </label>
              <select
                value={settings.research_model}
                onChange={(e) => updateSetting('research_model', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
              >
                <option value="anthropic/claude-3-haiku">Claude 3 Haiku (Fast)</option>
                <option value="anthropic/claude-3-sonnet">Claude 3 Sonnet (Balanced)</option>
                <option value="anthropic/claude-3-opus">Claude 3 Opus (Best)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Writing Agent */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          Writing Agent
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              System Prompt
            </label>
            <textarea
              value={settings.writing_system_prompt}
              onChange={(e) => updateSetting('writing_system_prompt', e.target.value)}
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent resize-none"
              placeholder="System prompt for writing agent..."
            />
            <p className="mt-1 text-sm text-gray-500">
              {settings.writing_system_prompt.length} characters
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temperature: {settings.writing_temperature}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.writing_temperature}
                onChange={(e) => updateSetting('writing_temperature', parseFloat(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Lower = more focused, Higher = more creative
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model
              </label>
              <select
                value={settings.writing_model}
                onChange={(e) => updateSetting('writing_model', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
              >
                <option value="anthropic/claude-3-haiku">Claude 3 Haiku (Fast)</option>
                <option value="anthropic/claude-3-sonnet">Claude 3 Sonnet (Balanced)</option>
                <option value="anthropic/claude-3-opus">Claude 3 Opus (Best)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media Agent */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
          Social Media Agent
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              System Prompt
            </label>
            <textarea
              value={settings.social_system_prompt}
              onChange={(e) => updateSetting('social_system_prompt', e.target.value)}
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent resize-none"
              placeholder="System prompt for social media agent..."
            />
            <p className="mt-1 text-sm text-gray-500">
              {settings.social_system_prompt.length} characters
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temperature: {settings.social_temperature}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.social_temperature}
                onChange={(e) => updateSetting('social_temperature', parseFloat(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Lower = more focused, Higher = more creative
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model
              </label>
              <select
                value={settings.social_model}
                onChange={(e) => updateSetting('social_model', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
              >
                <option value="anthropic/claude-3-haiku">Claude 3 Haiku (Fast)</option>
                <option value="anthropic/claude-3-sonnet">Claude 3 Sonnet (Balanced)</option>
                <option value="anthropic/claude-3-opus">Claude 3 Opus (Best)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">💡 Tips for Effective Prompts</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Be specific about the role and expertise required</li>
          <li>• Include brand voice and tone guidelines</li>
          <li>• Specify the target audience and their needs</li>
          <li>• Mention any compliance or regulatory requirements</li>
          <li>• Include examples of desired output format</li>
        </ul>
      </div>
    </div>
  );
} 