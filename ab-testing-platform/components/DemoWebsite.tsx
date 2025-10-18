'use client';

import { useEffect, useRef } from 'react';

interface DemoWebsiteProps {
  html: string;
  css: string;
}

export default function DemoWebsite({ html, css }: DemoWebsiteProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shadowRootRef = useRef<ShadowRoot | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Get or create shadow root
    if (!shadowRootRef.current) {
      // Check if shadow root already exists, otherwise create it
      if (containerRef.current.shadowRoot) {
        shadowRootRef.current = containerRef.current.shadowRoot;
      } else {
        shadowRootRef.current = containerRef.current.attachShadow({ mode: 'open' });
      }
    }

    const shadowRoot = shadowRootRef.current;
    if (!shadowRoot) return;

    // Create style element
    const style = document.createElement('style');
    style.textContent = css;

    // Create content container
    const content = document.createElement('div');
    content.innerHTML = html;
    content.style.fontFamily = 'system-ui, -apple-system, sans-serif';

    // Clear and update shadow root
    shadowRoot.innerHTML = '';
    shadowRoot.appendChild(style);
    shadowRoot.appendChild(content);

    // Add click tracking
    const buttons = shadowRoot.querySelectorAll('button');
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        console.log('Button clicked:', button.textContent);
      });
    });
  }, [html, css]);

  return (
    <div className="bg-gray-100 p-6 rounded-lg">
      <div ref={containerRef} className="bg-white rounded-lg shadow-lg overflow-hidden"></div>
    </div>
  );
}

