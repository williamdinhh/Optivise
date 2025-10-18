'use client';

import { useState } from 'react';
import axios from 'axios';

export default function SimulationPanel() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSimulate = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('/api/simulate');
      setMessage(`Successfully simulated user data for ${response.data.results.length} variant(s)! Run analysis to see results.`);
    } catch (error: any) {
      console.error('Error simulating data:', error);
      setMessage(error.response?.data?.error || 'Failed to simulate data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">User Data Simulation</h2>
      <p className="text-gray-600 mb-4">
        Generate synthetic user interaction data for all active variants to test their performance.
      </p>
      
      <button
        onClick={handleSimulate}
        disabled={loading}
        className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {loading ? 'Simulating...' : 'Run Simulation'}
      </button>

      {message && (
        <div className={`mt-4 p-3 rounded-lg ${message.includes('Failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}
    </div>
  );
}

