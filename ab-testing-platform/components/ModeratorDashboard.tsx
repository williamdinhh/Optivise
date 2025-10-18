'use client';

import { useState, useEffect } from 'react';
import { Variant } from '@/types';
import axios from 'axios';

interface ModeratorDashboardProps {
  onVariantChange: (variant: Variant) => void;
  currentVariant: Variant;
}

export default function ModeratorDashboard({ onVariantChange, currentVariant }: ModeratorDashboardProps) {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [variantCount, setVariantCount] = useState(2);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadVariants();
  }, []);

  const loadVariants = async () => {
    try {
      const response = await axios.get('/api/variants');
      setVariants(response.data.variants);
    } catch (error) {
      console.error('Error loading variants:', error);
      setMessage('Failed to load variants');
    }
  };

  const handleGenerateVariants = async () => {
    if (!prompt.trim()) {
      setMessage('Please enter a prompt');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('/api/variants/generate', {
        prompt,
        currentHtml: currentVariant.html,
        currentCss: currentVariant.css,
        variantCount,
      });

      setMessage(`Successfully generated ${response.data.variants.length} variant(s)!`);
      setPrompt('');
      await loadVariants();
    } catch (error: any) {
      console.error('Error generating variants:', error);
      setMessage(error.response?.data?.error || 'Failed to generate variants');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVariant = async (variantId: string) => {
    if (!confirm('Are you sure you want to delete this variant?')) {
      return;
    }

    try {
      await axios.delete('/api/variants', { data: { variantId } });
      setMessage('Variant deleted successfully');
      await loadVariants();
    } catch (error: any) {
      console.error('Error deleting variant:', error);
      setMessage(error.response?.data?.error || 'Failed to delete variant');
    }
  };

  const handleToggleVariant = async (variant: Variant) => {
    try {
      await axios.patch('/api/variants', {
        variantId: variant.id,
        updates: { isActive: !variant.isActive },
      });
      await loadVariants();
    } catch (error: any) {
      console.error('Error toggling variant:', error);
      setMessage(error.response?.data?.error || 'Failed to toggle variant');
    }
  };

  const handleAutoGenerate = async () => {
    const autoPrompts = [
      'Make the call-to-action button more prominent and eye-catching',
      'Improve the hero section with better visual hierarchy',
      'Optimize the layout for higher conversion rates',
    ];

    const randomPrompt = autoPrompts[Math.floor(Math.random() * autoPrompts.length)];
    setPrompt(randomPrompt);
    
    // Trigger generation after setting prompt
    setTimeout(() => {
      handleGenerateVariants();
    }, 100);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">AI Variant Generator</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Describe the changes you want to make:
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Make the signup button larger and change it to green"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of variants to generate:
          </label>
          <input
            type="number"
            min="1"
            max="3"
            value={variantCount}
            onChange={(e) => setVariantCount(Number(e.target.value))}
            className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleGenerateVariants}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Generating...' : 'Generate Variants'}
          </button>
          <button
            onClick={handleAutoGenerate}
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Auto-Generate Optimal Variants
          </button>
        </div>

        {message && (
          <div className={`mt-4 p-3 rounded-lg ${message.includes('Failed') || message.includes('error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Variants ({variants.length})</h2>
        
        <div className="space-y-3">
          {variants.map((variant) => (
            <div
              key={variant.id}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                currentVariant.id === variant.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              } ${!variant.isActive ? 'opacity-50' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1" onClick={() => onVariantChange(variant)}>
                  <h3 className="font-semibold text-lg text-gray-800">{variant.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{variant.description}</p>
                  <div className="flex gap-2 mt-2">
                    <span className={`text-xs px-2 py-1 rounded ${variant.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {variant.isActive ? 'Active' : 'Inactive'}
                    </span>
                    {variant.metrics && (
                      <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-700">
                        CTR: {variant.metrics.clickThroughRate.toFixed(2)}%
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleVariant(variant);
                    }}
                    className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                  >
                    {variant.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  {variant.id !== 'original' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteVariant(variant.id);
                      }}
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

