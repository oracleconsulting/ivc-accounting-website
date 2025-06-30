'use client'

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptAll = () => {
    const newPrefs = { necessary: true, analytics: true, marketing: true };
    setPreferences(newPrefs);
    localStorage.setItem('cookie-consent', JSON.stringify(newPrefs));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setShowBanner(false);
    
    // Load analytics scripts
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  const acceptSelected = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setShowBanner(false);
    
    if (preferences.analytics && typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  const rejectAll = () => {
    const newPrefs = { necessary: true, analytics: false, marketing: false };
    setPreferences(newPrefs);
    localStorage.setItem('cookie-consent', JSON.stringify(newPrefs));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-6 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-8">
              <h3 className="text-lg font-semibold text-white mb-2">Cookie Preferences</h3>
              <p className="text-gray-400 text-sm mb-4">
                We use cookies to provide the best experience and analyze site usage. 
                Your privacy matters to us - we only use necessary cookies by default.
              </p>
              
              {!showSettings && (
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={rejectAll}
                    className="px-4 py-2 text-sm border border-gray-600 rounded-lg text-white hover:bg-gray-800 transition-colors"
                  >
                    Reject All
                  </button>
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="px-4 py-2 text-sm border border-gray-600 rounded-lg text-white hover:bg-gray-800 transition-colors"
                  >
                    Cookie Settings
                  </button>
                  <button
                    onClick={acceptAll}
                    className="px-4 py-2 text-sm bg-orange-500 rounded-lg text-white hover:bg-orange-600 transition-colors"
                  >
                    Accept All
                  </button>
                </div>
              )}
            </div>
            
            <button
              onClick={() => setShowBanner(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          {showSettings && (
            <div className="mt-6 space-y-4 border-t border-gray-800 pt-6">
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <div>
                    <span className="text-white font-medium">Necessary Cookies</span>
                    <p className="text-sm text-gray-400">Required for the website to function properly</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.necessary}
                    disabled
                    className="w-5 h-5 rounded text-orange-500"
                  />
                </label>
                
                <label className="flex items-center justify-between">
                  <div>
                    <span className="text-white font-medium">Analytics Cookies</span>
                    <p className="text-sm text-gray-400">Help us understand how visitors use our website</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                    className="w-5 h-5 rounded text-orange-500"
                  />
                </label>
                
                <label className="flex items-center justify-between">
                  <div>
                    <span className="text-white font-medium">Marketing Cookies</span>
                    <p className="text-sm text-gray-400">Used to track visitors across websites</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                    className="w-5 h-5 rounded text-orange-500"
                  />
                </label>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={acceptSelected}
                  className="px-6 py-2 bg-orange-500 rounded-lg text-white hover:bg-orange-600 transition-colors"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 