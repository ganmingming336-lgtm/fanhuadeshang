"use client";

import { useState } from "react";
import { analyzeInput, AnalysisResult } from "../lib/lottery";

export default function Home() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [realTimeWarning, setRealTimeWarning] = useState("");

  const validateInput = (value: string) => {
    // Check for characters that are not digits, whitespace, or commas
    if (/[^0-9,\s]/.test(value)) {
      setRealTimeWarning("Input contains invalid characters. Only numbers (1-49), commas, and spaces are allowed.");
    } else {
      setRealTimeWarning("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);
    validateInput(value);
    // Clear main error when user types
    if (error) setError("");
  };

  const handleAnalyze = () => {
    setError("");
    setResults(null);

    if (!input.trim()) {
      setError("Please enter some numbers.");
      return;
    }

    const res = analyzeInput(input);

    if (res.totalNumbers === 0) {
      setError("No valid numbers found (1-49). Check your format.");
      return;
    }

    if (res.invalidEntries.length > 0) {
        // We warn but still show results if we have valid numbers
        setError(`Found ${res.invalidEntries.length} invalid entries (ignored).`);
    }

    setResults(res);
  };

  const pasteExample = () => {
    setInput("5, 12, 23, 34, 45, 49\n1, 2, 3, 4, 5, 6\n10, 20, 30, 40, 42, 49\n5, 15, 25, 35, 45, 12");
    setError("");
    setRealTimeWarning("");
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 p-4 md:p-8 font-sans">
      <main className="max-w-7xl mx-auto space-y-8">
        {/* Hero Section */}
        <header className="text-center space-y-4 py-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
            Lottery Analyzer
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Analyze your lottery numbers instantly. Paste your data to see frequency distributions, ranges, and statistical summaries.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Workspace */}
          <section className="space-y-6" aria-labelledby="input-heading">
            {/* Instructions */}
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700">
              <div className="flex justify-between items-start mb-4">
                <h2 id="input-heading" className="text-xl font-semibold">Input Data</h2>
                <button
                  onClick={pasteExample}
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  Paste & Analyze Example
                </button>
              </div>
              <div className="prose dark:prose-invert text-sm text-zinc-600 dark:text-zinc-400">
                <p className="mb-2">Enter lottery numbers separated by commas, spaces, or newlines.</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Acceptable range: <strong>1 to 49</strong></li>
                  <li>Example: <code>5, 12, 23, 34, 45, 49</code></li>
                  <li>Example: <code>1 2 3 4 5 6</code></li>
                </ul>
              </div>
            </div>

            {/* Input Area */}
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700 space-y-4">
              <label htmlFor="lottery-input" className="sr-only">Lottery Numbers Input</label>
              <textarea
                id="lottery-input"
                className={`w-full h-64 p-4 rounded-lg border bg-zinc-50 dark:bg-zinc-900 focus:ring-2 focus:outline-none resize-none font-mono text-sm ${
                  realTimeWarning 
                    ? "border-yellow-400 focus:ring-yellow-400 dark:border-yellow-600" 
                    : "border-zinc-300 dark:border-zinc-600 focus:ring-blue-500"
                }`}
                placeholder="Paste numbers here..."
                value={input}
                onChange={handleInputChange}
              />

              {/* Real-time Warning */}
              {realTimeWarning && (
                <div className="text-yellow-600 dark:text-yellow-500 text-sm font-medium" role="alert">
                  {realTimeWarning}
                </div>
              )}

              {/* Validation Message */}
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium rounded-lg border border-red-200 dark:border-red-800" role="alert">
                  {error}
                </div>
              )}

              <button
                onClick={handleAnalyze}
                className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors focus:ring-4 focus:ring-blue-500/50 active:scale-[0.99]"
              >
                Analyze Numbers
              </button>
            </div>
          </section>

          {/* Results Area */}
          <section className="space-y-6" aria-labelledby="results-heading">
            <h2 id="results-heading" className="sr-only">Analysis Results</h2>

            {/* Placeholder for when no results are available */}
            {!results && (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-12 text-zinc-400 text-center space-y-4 bg-zinc-50/50 dark:bg-zinc-900/50">
                <svg className="w-16 h-16 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-lg font-medium">No data analyzed yet</p>
                <p className="text-sm">Enter numbers on the left and click Analyze to see statistics.</p>
              </div>
            )}

            {results && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Summary Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700">
                    <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Total Draws</h3>
                    <p className="text-3xl font-bold mt-2">{results.totalDraws}</p>
                  </div>
                  <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700">
                    <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Total Numbers</h3>
                    <p className="text-3xl font-bold mt-2">{results.totalNumbers}</p>
                  </div>
                </div>

                {/* Hot and Cold Lists */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/30">
                        <h3 className="text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-wider flex items-center gap-2">
                             🔥 Hot Numbers
                        </h3>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {results.hotNumbers.map(num => (
                                <span key={num} className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 font-bold text-sm">
                                    {num}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                        <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-2">
                             🧊 Cold Numbers
                        </h3>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {results.coldNumbers.map(num => (
                                <span key={num} className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold text-sm">
                                    {num}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                 {/* Quick Stats */}
                 <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700">
                    <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4">Quick Stats</h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-700/50 pb-2">
                            <span className="text-zinc-600 dark:text-zinc-400">Most Frequent:</span>
                            <span className="font-semibold">{results.mostFrequent.join(", ")}</span>
                        </div>
                        <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-700/50 pb-2">
                            <span className="text-zinc-600 dark:text-zinc-400">Least Frequent (drawn):</span>
                            <span className="font-semibold">{results.leastFrequent.join(", ")}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-zinc-600 dark:text-zinc-400">Never Drawn:</span>
                            <span className="font-semibold text-zinc-500">
                                {results.neverDrawn.length > 0 ? results.neverDrawn.join(", ") : "None"}
                            </span>
                        </div>
                    </div>
                 </div>

                {/* Chart Container (CSS Bar Chart) */}
                <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700">
                  <h3 className="text-lg font-semibold mb-6">Frequency Distribution</h3>
                  <div className="flex items-end space-x-1 h-64 overflow-x-auto pb-2">
                    {Array.from({ length: 49 }, (_, i) => i + 1).map((num) => {
                      const count = results.frequency[num] || 0;
                      // Find max count for scaling
                      const maxVal = Math.max(...Object.values(results.frequency));
                      const heightPercentage = maxVal > 0 ? (count / maxVal) * 100 : 0;
                      const isHot = results.hotNumbers.includes(num);
                      const isCold = results.coldNumbers.includes(num);

                      let barColor = "bg-zinc-300 dark:bg-zinc-600";
                      if (isHot) barColor = "bg-red-500 dark:bg-red-500";
                      if (isCold) barColor = "bg-blue-500 dark:bg-blue-500";

                      return (
                        <div key={num} className="flex-1 min-w-[12px] flex flex-col items-center group">
                          <div 
                            className={`w-full rounded-t-sm relative transition-all hover:opacity-80 ${barColor}`}
                            style={{ height: `${Math.max(heightPercentage, 0)}%`, minHeight: count > 0 ? '4px' : '0' }}
                          >
                             {/* Tooltip */}
                             <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                                #{num}: {count}
                             </div>
                          </div>
                          <span className={`text-[10px] mt-1 ${isHot ? 'font-bold text-red-600' : isCold ? 'font-bold text-blue-600' : 'text-zinc-400'}`}>
                              {num % 5 === 0 || num === 1 || num === 49 ? num : ''}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                   <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-700">
                     <h3 className="text-lg font-semibold">Detailed Statistics</h3>
                   </div>
                   <div className="overflow-x-auto max-h-96 overflow-y-auto">
                      <table className="w-full text-left text-sm">
                          <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 dark:text-zinc-400 sticky top-0 z-10">
                              <tr>
                                  <th scope="col" className="px-6 py-3 font-medium">Rank</th>
                                  <th scope="col" className="px-6 py-3 font-medium">Number</th>
                                  <th scope="col" className="px-6 py-3 font-medium">Frequency</th>
                                  <th scope="col" className="px-6 py-3 font-medium text-right">Percentage</th>
                                  <th scope="col" className="px-6 py-3 font-medium text-center">Status</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                              {results.frequencyList
                                .sort((a, b) => a.number - b.number) // Sort by number for table
                                .map((data) => {
                                    const isHot = results.hotNumbers.includes(data.number);
                                    const isCold = results.coldNumbers.includes(data.number);
                                    
                                    return (
                                  <tr key={data.number} className={`hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors ${isHot ? 'bg-red-50/30 dark:bg-red-900/5' : isCold ? 'bg-blue-50/30 dark:bg-blue-900/5' : ''}`}>
                                      <td className="px-6 py-3 text-zinc-500">{data.rank}</td>
                                      <td className="px-6 py-3 font-medium">{data.number}</td>
                                      <td className="px-6 py-3">{data.count}</td>
                                      <td className="px-6 py-3 text-right">
                                          {data.percentage.toFixed(1)}%
                                      </td>
                                      <td className="px-6 py-3 text-center">
                                          {isHot && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Hot</span>}
                                          {isCold && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Cold</span>}
                                      </td>
                                  </tr>
                                )})}
                          </tbody>
                      </table>
                   </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
