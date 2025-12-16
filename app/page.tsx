"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<{
    totalNumbers: number;
    uniqueNumbers: number;
    mostCommon: string;
    leastCommon: string;
    frequency: Record<number, number>;
  } | null>(null);
  const [error, setError] = useState("");
  const [realTimeWarning, setRealTimeWarning] = useState("");
  const [showGuide, setShowGuide] = useState(false);

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

    // Split by comma, space, or newline
    const rawItems = input.split(/[\s,]+/);
    const numbers: number[] = [];
    const invalidItems: string[] = [];

    rawItems.forEach((item) => {
      if (!item) return;
      const num = Number(item);
      if (!isNaN(num) && num >= 1 && num <= 49) {
        numbers.push(num);
      } else {
        invalidItems.push(item);
      }
    });

    if (numbers.length === 0) {
      setError("No valid numbers found (1-49). Check your format.");
      return;
    }

    // Calculate statistics
    const freq: Record<number, number> = {};
    numbers.forEach((n) => {
      freq[n] = (freq[n] || 0) + 1;
    });

    const sortedFreq = Object.entries(freq).sort((a, b) => b[1] - a[1]);
    const maxFreq = sortedFreq[0][1];
    const minFreq = sortedFreq[sortedFreq.length - 1][1];

    const mostCommon = sortedFreq
      .filter(([, count]) => count === maxFreq)
      .map(([num]) => num)
      .join(", ");

    const leastCommon = sortedFreq
      .filter(([, count]) => count === minFreq)
      .map(([num]) => num)
      .join(", ");

    setResults({
      totalNumbers: numbers.length,
      uniqueNumbers: Object.keys(freq).length,
      mostCommon,
      leastCommon,
      frequency: freq,
    });
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

        {/* How to Use Guide - Accordion */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-zinc-800 dark:to-zinc-900 rounded-xl shadow-lg border border-blue-200 dark:border-zinc-700 overflow-hidden">
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-blue-100/50 dark:hover:bg-zinc-700/50 transition-colors"
            aria-expanded={showGuide}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">📚</span>
              <div>
                <h2 className="text-xl font-bold text-blue-900 dark:text-blue-300">How to Use This Tool / 使用指南</h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Click to expand step-by-step instructions</p>
              </div>
            </div>
            <svg 
              className={`w-6 h-6 text-blue-600 dark:text-blue-400 transform transition-transform ${showGuide ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showGuide && (
            <div className="px-6 pb-6 space-y-6 animate-in slide-in-from-top-2 duration-300">
              {/* Quick Start */}
              <div className="bg-white dark:bg-zinc-800/50 rounded-lg p-5 border border-zinc-200 dark:border-zinc-600">
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
                  <span className="text-xl">🚀</span> Quick Start / 快速开始
                </h3>
                <ol className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300 list-decimal list-inside">
                  <li><strong>Paste your numbers</strong> in the input box on the left (or click &ldquo;Paste &amp; Analyze Example&rdquo;)</li>
                  <li className="text-zinc-600 dark:text-zinc-400 ml-5">在左侧的输入框中粘贴您的号码（或点击&ldquo;粘贴并分析示例&rdquo;）</li>
                  <li><strong>Click &ldquo;Analyze Numbers&rdquo;</strong> button</li>
                  <li className="text-zinc-600 dark:text-zinc-400 ml-5">点击&ldquo;分析号码&rdquo;按钮</li>
                  <li><strong>View results</strong> on the right: stats, charts, and tables will appear instantly</li>
                  <li className="text-zinc-600 dark:text-zinc-400 ml-5">在右侧查看结果：统计数据、图表和表格将立即显示</li>
                </ol>
              </div>

              {/* Data Format Tips */}
              <div className="bg-white dark:bg-zinc-800/50 rounded-lg p-5 border border-zinc-200 dark:border-zinc-600">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-3 flex items-center gap-2">
                  <span className="text-xl">✏️</span> Formatting Tips / 格式提示
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium text-zinc-800 dark:text-zinc-200">✅ Accepted formats:</p>
                    <ul className="list-disc list-inside ml-4 text-zinc-600 dark:text-zinc-400 space-y-1">
                      <li>Comma-separated: <code className="bg-zinc-100 dark:bg-zinc-700 px-2 py-0.5 rounded">5, 12, 23, 34, 45, 49</code></li>
                      <li>Space-separated: <code className="bg-zinc-100 dark:bg-zinc-700 px-2 py-0.5 rounded">1 2 3 4 5 6</code></li>
                      <li>Multiple lines or mixed formats are OK!</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-zinc-800 dark:text-zinc-200">⚠️ Important rules:</p>
                    <ul className="list-disc list-inside ml-4 text-zinc-600 dark:text-zinc-400 space-y-1">
                      <li>Numbers must be between <strong>1 and 49</strong> (inclusive)</li>
                      <li>Only numbers, commas, and spaces are allowed</li>
                      <li>Letters and special symbols will trigger a warning</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Understanding Results */}
              <div className="bg-white dark:bg-zinc-800/50 rounded-lg p-5 border border-zinc-200 dark:border-zinc-600">
                <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-300 mb-3 flex items-center gap-2">
                  <span className="text-xl">📊</span> Understanding Your Results / 理解分析结果
                </h3>
                <div className="space-y-3 text-sm text-zinc-700 dark:text-zinc-300">
                  <div>
                    <p className="font-semibold text-blue-700 dark:text-blue-300">🔥 Hot Numbers (Most Common):</p>
                    <p className="ml-4 text-zinc-600 dark:text-zinc-400">These numbers appear most frequently in your data. They might indicate trending patterns.</p>
                    <p className="ml-4 text-zinc-500 dark:text-zinc-500 text-xs">这些号码在您的数据中出现最频繁，可能表明趋势模式。</p>
                  </div>
                  <div>
                    <p className="font-semibold text-blue-700 dark:text-blue-300">❄️ Cold Numbers (Least Common):</p>
                    <p className="ml-4 text-zinc-600 dark:text-zinc-400">These numbers appear least frequently. They may be &ldquo;due&rdquo; or simply less popular.</p>
                    <p className="ml-4 text-zinc-500 dark:text-zinc-500 text-xs">这些号码出现频率最低，可能是&ldquo;应出&rdquo;号码或只是不太常见。</p>
                  </div>
                  <div>
                    <p className="font-semibold text-blue-700 dark:text-blue-300">📈 Frequency Chart:</p>
                    <p className="ml-4 text-zinc-600 dark:text-zinc-400">Hover over bars to see exact counts. Taller bars = more frequent numbers.</p>
                    <p className="ml-4 text-zinc-500 dark:text-zinc-500 text-xs">悬停在条形图上可查看确切数量。条形越高 = 号码越频繁。</p>
                  </div>
                  <div>
                    <p className="font-semibold text-blue-700 dark:text-blue-300">📋 Detailed Table:</p>
                    <p className="ml-4 text-zinc-600 dark:text-zinc-400">Shows each number&apos;s frequency count and percentage of total. Scroll to see all entries.</p>
                    <p className="ml-4 text-zinc-500 dark:text-zinc-500 text-xs">显示每个号码的频率计数和总数百分比。滚动查看所有条目。</p>
                  </div>
                </div>
              </div>

              {/* Troubleshooting */}
              <div className="bg-white dark:bg-zinc-800/50 rounded-lg p-5 border border-zinc-200 dark:border-zinc-600">
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-3 flex items-center gap-2">
                  <span className="text-xl">🔧</span> Troubleshooting / 故障排除
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-3">
                    <p className="font-semibold text-yellow-900 dark:text-yellow-300">⚠️ &ldquo;Input contains invalid characters&rdquo;</p>
                    <p className="text-zinc-700 dark:text-zinc-300 mt-1">Remove any letters, symbols (except commas), or characters that aren&apos;t numbers.</p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3">
                    <p className="font-semibold text-red-900 dark:text-red-300">❌ &ldquo;No valid numbers found&rdquo;</p>
                    <p className="text-zinc-700 dark:text-zinc-300 mt-1">Make sure all numbers are between 1-49 and properly separated by commas or spaces.</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-3">
                    <p className="font-semibold text-blue-900 dark:text-blue-300">💡 Tip: Export Results</p>
                    <p className="text-zinc-700 dark:text-zinc-300 mt-1">To save your analysis, take a screenshot or manually copy data from the statistics cards and table. Future versions may include CSV download.</p>
                  </div>
                </div>
              </div>

              {/* Mobile Tips */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-5 border border-blue-200 dark:border-blue-800">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
                  <span className="text-xl">📱</span> Mobile Users / 移动端用户
                </h3>
                <p className="text-sm text-zinc-700 dark:text-zinc-300">
                  This tool works great on phones and tablets! On smaller screens, you&apos;ll see the input and results stacked vertically. 
                  Swipe left/right on the chart to see all numbers. The table is also scrollable.
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2">
                  此工具在手机和平板电脑上运行良好！在较小的屏幕上，您将看到输入和结果垂直堆叠。在图表上左右滑动可查看所有号码。表格也可以滚动。
                </p>
              </div>
            </div>
          )}
        </section>

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
                    <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Total Numbers</h3>
                    <p className="text-3xl font-bold mt-2">{results.totalNumbers}</p>
                  </div>
                  <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700">
                    <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Unique Numbers</h3>
                    <p className="text-3xl font-bold mt-2">{results.uniqueNumbers}</p>
                  </div>
                  <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700 col-span-2">
                    <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Most Common</h3>
                    <p className="text-xl font-bold mt-2 text-blue-600 dark:text-blue-400 break-words">{results.mostCommon}</p>
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
                      
                      return (
                        <div key={num} className="flex-1 min-w-[12px] flex flex-col items-center group">
                          <div 
                            className="w-full bg-blue-200 dark:bg-blue-900/50 rounded-t-sm relative transition-all hover:bg-blue-500 dark:hover:bg-blue-500"
                            style={{ height: `${Math.max(heightPercentage, 0)}%`, minHeight: count > 0 ? '4px' : '0' }}
                          >
                             {/* Tooltip */}
                             <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                                #{num}: {count}
                             </div>
                          </div>
                          <span className="text-[10px] text-zinc-400 mt-1">{num % 5 === 0 || num === 1 || num === 49 ? num : ''}</span>
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
                   <div className="overflow-x-auto max-h-64 overflow-y-auto">
                      <table className="w-full text-left text-sm">
                          <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 dark:text-zinc-400 sticky top-0">
                              <tr>
                                  <th scope="col" className="px-6 py-3 font-medium">Number</th>
                                  <th scope="col" className="px-6 py-3 font-medium">Frequency</th>
                                  <th scope="col" className="px-6 py-3 font-medium text-right">Percentage</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                              {Object.entries(results.frequency)
                                .sort((a, b) => Number(a[0]) - Number(b[0]))
                                .map(([num, count]) => (
                                  <tr key={num} className="hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors">
                                      <td className="px-6 py-3 font-medium">{num}</td>
                                      <td className="px-6 py-3">{count}</td>
                                      <td className="px-6 py-3 text-right">
                                          {((count / results.totalNumbers) * 100).toFixed(1)}%
                                      </td>
                                  </tr>
                              ))}
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
