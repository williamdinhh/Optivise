'use client';

import { useState } from 'react';

interface CapturePanelProps {
  onCaptureToggle: (isCapturing: boolean) => void;
  isCapturing: boolean;
}

export default function CapturePanel({ onCaptureToggle, isCapturing }: CapturePanelProps) {
  const [message, setMessage] = useState('');

  const handleToggleCapture = () => {
    const newState = !isCapturing;
    onCaptureToggle(newState);
    
    if (newState) {
      setMessage('✅ Event capture started! Statsig is now tracking all user interactions.');
    } else {
      setMessage('⏸️ Event capture paused. Data collection stopped.');
    }

    // Clear message after 5 seconds
    setTimeout(() => setMessage(''), 5000);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Event Capture</h2>
      <p className="text-gray-600 mb-4">
        {isCapturing 
          ? '🔴 Currently capturing real user interactions with Statsig. All clicks, impressions, and conversions are being tracked in real-time.'
          : '⚫ Event capture is paused. Click "Start Capture" to begin tracking real user interactions.'
        }
      </p>
      
      <div className="flex items-center gap-4">
        <button
          onClick={handleToggleCapture}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            isCapturing
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isCapturing ? '⏸️ Stop Capture' : '▶️ Start Capture'}
        </button>

        {isCapturing && (
          <div className="flex items-center text-red-600 animate-pulse">
            <div className="w-3 h-3 bg-red-600 rounded-full mr-2"></div>
            <span className="font-medium">Recording...</span>
          </div>
        )}
      </div>

      {message && (
        <div className={`mt-4 p-3 rounded-lg ${
          isCapturing ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
        }`}>
          {message}
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
        <h3 className="font-semibold text-blue-900 mb-2">📊 Tracked Events:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Impressions:</strong> When variants are displayed</li>
          <li>• <strong>Clicks:</strong> Button and element interactions</li>
          <li>• <strong>Conversions:</strong> Goal completions</li>
          <li>• <strong>Time on Page:</strong> Engagement duration</li>
        </ul>
      </div>
    </div>
  );
}

