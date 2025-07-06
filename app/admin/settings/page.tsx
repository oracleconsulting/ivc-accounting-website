'use client';

import { useState } from 'react';
import { Globe, Search, Bot, Bell, Image, Database, Key, Save, Settings, Mail } from 'lucide-react';
import Link from 'next/link';
import AIPromptSettings from '@/components/admin/AIPromptSettings';
import { AI_PROVIDERS } from '@/lib/types/ai-providers';

interface SettingsSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('general');
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  
  // Add new state for provider selection
  const [selectedProviders, setSelectedProviders] = useState({
    research: { provider: 'openrouter', model: 'anthropic/claude-3-opus' },
    writing: { provider: 'openrouter', model: 'openai/gpt-4-turbo' },
    social: { provider: 'openrouter', model: 'anthropic/claude-3-haiku' }
  });
  
  // Form states
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'IVC Accounting',
    tagline: 'OTHER ACCOUNTANTS FILE. WE FIGHT.',
    contactEmail: 'info@ivcaccounting.co.uk',
    contactPhone: '01787 477 602',
    address: 'Halstead, Essex',
    footerText: '© 2024 IVC Accounting. All rights reserved.'
  });

  const [seoSettings, setSeoSettings] = useState({
    metaTitle: 'IVC Accounting - Chartered Accountants in Halstead, Essex',
    metaDescription: 'Expert chartered accountants serving Essex businesses. Specializing in tax planning, business growth, and financial strategy.',
    metaKeywords: 'chartered accountants halstead, essex accountants, tax planning, business accounting',
    ogImage: '/og-image.jpg',
    googleAnalytics: '',
    googleSearchConsole: ''
  });

  const sections: SettingsSection[] = [
    {
      id: 'general',
      title: 'General Settings',
      icon: <Globe className="w-5 h-5" />,
      description: 'Basic site information and contact details'
    },
    {
      id: 'seo',
      title: 'SEO Settings',
      icon: <Search className="w-5 h-5" />,
      description: 'Search engine optimization and meta tags'
    },
    {
      id: 'ai',
      title: 'AI Integration',
      icon: <Bot className="w-5 h-5" />,
      description: 'Multi-provider AI configuration (OpenAI, Claude, Perplexity, Grok)'
    },
    {
      id: 'ai-prompts',
      title: 'AI Prompts',
      icon: <Bot className="w-5 h-5" />,
      description: 'Configure AI agent prompts and behavior'
    },
    {
      id: 'email',
      title: 'Email Settings',
      icon: <Bell className="w-5 h-5" />,
      description: 'Newsletter and notification settings'
    },
    {
      id: 'media',
      title: 'Media Settings',
      icon: <Image className="w-5 h-5" />,
      description: 'Image optimization and storage'
    },
    {
      id: 'database',
      title: 'Database',
      icon: <Database className="w-5 h-5" />,
      description: 'Backup and maintenance options'
    },
    {
      id: 'api',
      title: 'API Keys',
      icon: <Key className="w-5 h-5" />,
      description: 'Manage third-party integrations'
    }
  ];

  const handleSave = () => {
    // In a real app, this would save to Supabase
    alert('Settings saved successfully!');
    setUnsavedChanges(false);
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Site Name
        </label>
        <input
          type="text"
          value={generalSettings.siteName}
          onChange={(e) => {
            setGeneralSettings({ ...generalSettings, siteName: e.target.value });
            setUnsavedChanges(true);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tagline
        </label>
        <input
          type="text"
          value={generalSettings.tagline}
          onChange={(e) => {
            setGeneralSettings({ ...generalSettings, tagline: e.target.value });
            setUnsavedChanges(true);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact Email
          </label>
          <input
            type="email"
            value={generalSettings.contactEmail}
            onChange={(e) => {
              setGeneralSettings({ ...generalSettings, contactEmail: e.target.value });
              setUnsavedChanges(true);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact Phone
          </label>
          <input
            type="text"
            value={generalSettings.contactPhone}
            onChange={(e) => {
              setGeneralSettings({ ...generalSettings, contactPhone: e.target.value });
              setUnsavedChanges(true);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address
        </label>
        <input
          type="text"
          value={generalSettings.address}
          onChange={(e) => {
            setGeneralSettings({ ...generalSettings, address: e.target.value });
            setUnsavedChanges(true);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Footer Text
        </label>
        <textarea
          value={generalSettings.footerText}
          onChange={(e) => {
            setGeneralSettings({ ...generalSettings, footerText: e.target.value });
            setUnsavedChanges(true);
          }}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
        />
      </div>
    </div>
  );

  const renderSeoSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Default Meta Title
        </label>
        <input
          type="text"
          value={seoSettings.metaTitle}
          onChange={(e) => {
            setSeoSettings({ ...seoSettings, metaTitle: e.target.value });
            setUnsavedChanges(true);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
        />
        <p className="mt-1 text-sm text-gray-500">
          {seoSettings.metaTitle.length}/60 characters
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Default Meta Description
        </label>
        <textarea
          value={seoSettings.metaDescription}
          onChange={(e) => {
            setSeoSettings({ ...seoSettings, metaDescription: e.target.value });
            setUnsavedChanges(true);
          }}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
        />
        <p className="mt-1 text-sm text-gray-500">
          {seoSettings.metaDescription.length}/160 characters
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Meta Keywords
        </label>
        <textarea
          value={seoSettings.metaKeywords}
          onChange={(e) => {
            setSeoSettings({ ...seoSettings, metaKeywords: e.target.value });
            setUnsavedChanges(true);
          }}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
          placeholder="Separate keywords with commas"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Open Graph Image URL
        </label>
        <input
          type="text"
          value={seoSettings.ogImage}
          onChange={(e) => {
            setSeoSettings({ ...seoSettings, ogImage: e.target.value });
            setUnsavedChanges(true);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Google Analytics ID
          </label>
          <input
            type="text"
            value={seoSettings.googleAnalytics}
            onChange={(e) => {
              setSeoSettings({ ...seoSettings, googleAnalytics: e.target.value });
              setUnsavedChanges(true);
            }}
            placeholder="G-XXXXXXXXXX"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Google Search Console
          </label>
          <input
            type="text"
            value={seoSettings.googleSearchConsole}
            onChange={(e) => {
              setSeoSettings({ ...seoSettings, googleSearchConsole: e.target.value });
              setUnsavedChanges(true);
            }}
            placeholder="Verification code"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderAIIntegration = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">AI Provider Configuration</h3>
        <p className="text-blue-700 text-sm">
          Configure multiple AI providers for different content generation tasks. Each agent type can use a different provider and model.
        </p>
      </div>

      {/* Provider Selection for Each Agent Type */}
      {Object.entries(selectedProviders).map(([agentType, config]) => (
        <div key={agentType} className="border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold mb-4 capitalize">{agentType} Agent</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Provider Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AI Provider
              </label>
              <select
                value={config.provider}
                onChange={(e) => {
                  const newConfig = { ...config, provider: e.target.value };
                  setSelectedProviders(prev => ({
                    ...prev,
                    [agentType]: newConfig
                  }));
                  setUnsavedChanges(true);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
              >
                {AI_PROVIDERS.map(provider => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Model Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model
              </label>
              <select
                value={config.model}
                onChange={(e) => {
                  setSelectedProviders(prev => ({
                    ...prev,
                    [agentType]: { ...prev[agentType as keyof typeof prev], model: e.target.value }
                  }));
                  setUnsavedChanges(true);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
              >
                {AI_PROVIDERS
                  .find(p => p.id === config.provider)
                  ?.models.map(model => (
                    <option key={model.id} value={model.id}>
                      {model.name} (${model.costPer1kTokens}/1k tokens)
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Model Info */}
          {(() => {
            const provider = AI_PROVIDERS.find(p => p.id === config.provider);
            const model = provider?.models.find(m => m.id === config.model);
            return model ? (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Max Tokens:</span>
                    <span className="ml-2">{model.maxTokens.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="font-medium">Cost:</span>
                    <span className="ml-2">${model.costPer1kTokens}/1k tokens</span>
                  </div>
                  <div>
                    <span className="font-medium">Streaming:</span>
                    <span className="ml-2">{model.supportsStreaming ? 'Yes' : 'No'}</span>
                  </div>
                  <div>
                    <span className="font-medium">Provider:</span>
                    <span className="ml-2">{provider?.name}</span>
                  </div>
                </div>
              </div>
            ) : null;
          })()}
        </div>
      ))}

      {/* API Keys Section */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold mb-4">API Keys</h4>
        <div className="space-y-4">
          {AI_PROVIDERS.map(provider => (
            <div key={provider.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <h5 className="font-medium">{provider.name}</h5>
                <p className="text-sm text-gray-600">
                  {provider.apiKeyRequired ? 'API key required' : 'No API key needed'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${provider.apiKeyRequired ? 'bg-red-400' : 'bg-green-400'}`}></div>
                <span className="text-sm text-gray-600">
                  {provider.apiKeyRequired ? 'Not configured' : 'Ready'}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> API keys are stored securely in environment variables. 
            Contact your system administrator to configure missing API keys.
          </p>
        </div>
      </div>

      {/* Usage Statistics */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold mb-4">Usage Statistics</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">0</div>
            <div className="text-sm text-gray-600">Total Requests</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">$0.00</div>
            <div className="text-sm text-gray-600">Total Cost</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">0</div>
            <div className="text-sm text-gray-600">Tokens Used</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderComingSoon = (sectionTitle: string) => (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
        <Database className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{sectionTitle} Coming Soon</h3>
      <p className="text-gray-500 max-w-md mx-auto">
        This section is under development and will be available in a future update.
      </p>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'general':
        return renderGeneralSettings();
      case 'seo':
        return renderSeoSettings();
      case 'ai':
        return renderAIIntegration();
      case 'ai-prompts':
        return <AIPromptSettings />;
      case 'email':
        return (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Mail className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Email Settings</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-4">
              Configure email providers, templates, and automation settings.
            </p>
            <Link
              href="/admin/settings/email"
              className="inline-flex items-center px-4 py-2 bg-[#ff6b35] text-white rounded-md hover:bg-[#e55a2b] transition-colors"
            >
              <Mail className="mr-2 h-4 w-4" />
              Configure Email Settings
            </Link>
          </div>
        );
      case 'media':
        return (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Image className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Media Settings</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-4">
              Configure image optimization, storage, and social media presets.
            </p>
            <Link
              href="/admin/settings/media"
              className="inline-flex items-center px-4 py-2 bg-[#ff6b35] text-white rounded-md hover:bg-[#e55a2b] transition-colors"
            >
              <Image className="mr-2 h-4 w-4" />
              Configure Media Settings
            </Link>
          </div>
        );
      case 'database':
        return (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Database className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Database Management</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-4">
              Monitor database health, create backups, and perform maintenance tasks.
            </p>
            <a
              href="/admin/database"
              className="inline-flex items-center px-4 py-2 bg-[#ff6b35] text-white rounded-md hover:bg-[#e55a2b] transition-colors"
            >
              <Database className="mr-2 h-4 w-4" />
              Open Database Management
            </a>
          </div>
        );
      case 'api':
        return (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Key className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">API Key Management</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-4">
              Securely manage API keys for third-party integrations.
            </p>
            <Link
              href="/admin/settings/api-keys"
              className="inline-flex items-center px-4 py-2 bg-[#ff6b35] text-white rounded-md hover:bg-[#e55a2b] transition-colors"
            >
              <Key className="mr-2 h-4 w-4" />
              Manage API Keys
            </Link>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex gap-6">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0">
        <nav className="space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeSection === section.id
                  ? 'bg-[#ff6b35] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {section.icon}
              <div className="flex-1">
                <div className="font-medium">{section.title}</div>
                <div className={`text-xs ${
                  activeSection === section.id ? 'text-orange-100' : 'text-gray-500'
                }`}>
                  {section.description}
                </div>
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {sections.find(s => s.id === activeSection)?.title}
            </h2>
            <p className="text-gray-600 mt-1">
              {sections.find(s => s.id === activeSection)?.description}
            </p>
          </div>

          {renderContent()}

          {/* Save Button */}
          {(activeSection === 'general' || activeSection === 'seo' || activeSection === 'ai') && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleSave}
                disabled={!unsavedChanges}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  unsavedChanges
                    ? 'bg-[#ff6b35] text-white hover:bg-[#e55a2b]'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Save className="w-4 h-4" />
                {unsavedChanges ? 'Save Changes' : 'No Changes'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 