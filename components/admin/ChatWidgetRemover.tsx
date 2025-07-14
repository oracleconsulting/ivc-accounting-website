'use client';

import { useEffect } from 'react';

export default function ChatWidgetRemover() {
  useEffect(() => {
    // Hide any chat widgets in admin panel
    const style = document.createElement('style');
    style.innerHTML = `
      /* Hide common chat widget selectors */
      #crisp-chatbox,
      .crisp-client,
      [id*="chat"],
      [class*="chat-widget"],
      .intercom-launcher,
      .fb-customerchat,
      .tawk-widget,
      iframe[title*="chat"],
      iframe[src*="chat"] {
        display: none !important;
        visibility: hidden !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return null;
} 