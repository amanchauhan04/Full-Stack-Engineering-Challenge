import React, { useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    const lines = input
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    try {
      const res = await fetch(`${API_URL}/bfhl`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: lines }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error || 'Unknown error from server.');
      } else {
        setResult(json);
      }
    } catch (err) {
      setError(`Network error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Tree Relationship Analyzer
        </h1>
        <p className="text-gray-500 mb-6 text-sm">
          Enter one relationship per line in the format{' '}
          <code className="bg-gray-100 px-1 rounded">X-&gt;Y</code>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            rows={6}
            placeholder={"A->B\nB->C\nC->D"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            {loading ? 'Analyzing…' : 'Analyze'}
          </button>
        </form>

        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-6 space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h2 className="font-semibold text-green-800 mb-2">Results</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Root(s)</span>
                  <p className="font-mono font-bold text-gray-800">
                    {result.roots.join(', ') || '—'}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Max Depth</span>
                  <p className="font-mono font-bold text-gray-800">
                    {result.maxDepth}
                  </p>
                </div>
                {result.cycleNodes.length > 0 && (
                  <div className="col-span-2">
                    <span className="text-gray-500">Cycle Nodes</span>
                    <p className="font-mono font-bold text-yellow-700">
                      {result.cycleNodes.join(', ')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
