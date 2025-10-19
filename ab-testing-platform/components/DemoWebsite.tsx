'use client';

import { useEffect, useRef } from 'react';
import { useStatsigClient } from '@statsig/react-bindings';

interface DemoWebsiteProps {
  html: string;
  css: string;
  variantId: string;
  captureEnabled?: boolean;
}

export default function DemoWebsite({ html, css, variantId, captureEnabled = false }: DemoWebsiteProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shadowRootRef = useRef<ShadowRoot | null>(null);
  const { client } = useStatsigClient();

  useEffect(() => {
    if (!containerRef.current) return;

    // Get or create shadow root
    if (!shadowRootRef.current) {
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

    // Log impression if capture is enabled
    if (captureEnabled && client) {
      client.logEvent('variant_impression', variantId, {
        variant_id: variantId,
        timestamp: Date.now(),
      });
      console.log('📊 Statsig Event: variant_impression', {
        variant_id: variantId,
        timestamp: new Date().toISOString()
      });
    }

    // Add click tracking
    const buttons = shadowRoot.querySelectorAll('button');
    buttons.forEach((button, index) => {
      button.addEventListener('click', () => {
        console.log('Button clicked:', button.textContent);
        
        // Track click event with Statsig if capture is enabled
        if (captureEnabled && client) {
          const eventData = {
            variant_id: variantId,
            button_text: button.textContent,
            button_index: index,
            timestamp: Date.now(),
          };
          client.logEvent('button_click', button.textContent || `button_${index}`, eventData);
          console.log('📊 Statsig Event: button_click', eventData);
        }
      });
    });

    // Track all clickable elements
    if (captureEnabled && shadowRoot) {
      const allClickables = shadowRoot.querySelectorAll('a, button, [onclick]');
      allClickables.forEach((element, index) => {
        element.addEventListener('click', (e) => {
          if (client) {
            const elementType = element.tagName.toLowerCase();
            const elementText = element.textContent || '';
            const eventData = {
              variant_id: variantId,
              element_type: elementType,
              element_text: elementText,
              element_index: index,
              timestamp: Date.now(),
            };
            
            client.logEvent('element_click', elementText || `${elementType}_${index}`, eventData);
            console.log('📊 Statsig Event: element_click', eventData);
          }
        });
      });
    }
  }, [html, css, variantId, captureEnabled, client]);

  return (
    <div className="bg-gray-100 p-6 rounded-lg relative">
      {captureEnabled && (
        <div className="absolute top-2 right-2 z-10">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <span className="animate-pulse mr-2">●</span>
            Recording
          </span>
        </div>
      )}
      <div ref={containerRef} className="bg-white rounded-lg shadow-lg overflow-hidden"></div>
    </div>
  );
}
