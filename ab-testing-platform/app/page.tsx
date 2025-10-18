'use client';

import { useState, useEffect } from 'react';
import DemoWebsite from '@/components/DemoWebsite';
import ModeratorDashboard from '@/components/ModeratorDashboard';
import SimulationPanel from '@/components/SimulationPanel';
import { Variant } from '@/types';
import axios from 'axios';

export default function Home() {
  const [currentVariant, setCurrentVariant] = useState<Variant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await axios.get('/api/config');
      const config = response.data;
      
      // Find the current variant
      const allVariants = [config.originalVariant, ...config.variants];
      const current = allVariants.find(v => v.id === config.currentVariant) || config.originalVariant;
      setCurrentVariant(current);
    } catch (error) {
      console.error('Error loading config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVariantChange = async (variant: Variant) => {
    setCurrentVariant(variant);
    try {
      await axios.post('/api/config', { currentVariant: variant.id });
    } catch (error) {
      console.error('Error updating current variant:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!currentVariant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-red-600">Error loading configuration</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">AI-Powered A/B Testing Platform</h1>
          <p className="text-blue-100">Generate, test, and analyze website variants with AI</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p className="text-blue-900">
            <strong>Current Variant:</strong> {currentVariant.name}
          </p>
          <p className="text-blue-700 text-sm mt-1">{currentVariant.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Live Preview</h2>
            <DemoWebsite html={currentVariant.html} css={currentVariant.css} />
          </div>

          <div>
            <ModeratorDashboard
              onVariantChange={handleVariantChange}
              currentVariant={currentVariant}
            />
          </div>
        </div>

        <SimulationPanel />

        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Next Steps</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Generate variants using AI prompts or click "Auto-Generate"</li>
            <li>Review and activate/deactivate variants as needed</li>
            <li>Run the simulation to generate synthetic user data</li>
            <li>Use the terminal CLI to analyze results: <code className="bg-gray-100 px-2 py-1 rounded">npm run analyze</code></li>
            <li>Apply winning variants or iterate with new prompts</li>
          </ol>
        </div>
      </main>
    </div>
  );
}
