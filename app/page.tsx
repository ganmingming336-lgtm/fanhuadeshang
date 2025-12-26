"use client";

import { useState } from "react";
import { analyzeInput, AnalysisResult } from "../lib/lottery";

export default function Home() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<AnalysisResult | null>(null);
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
                {/* Comprehensive Prediction Panel */}
                {results.comprehensivePrediction && (
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6 rounded-xl shadow-lg border-2 border-purple-200 dark:border-purple-800">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-100 flex items-center gap-2">
                        ⭐ Comprehensive Prediction
                      </h3>
                      <button
                        onClick={() => {
                          const csv = [
                            ["Rank", "Number", "Score", "Confidence", "Votes", "Features"].join(","),
                            ...results.comprehensivePrediction!.all_predictions.map(p =>
                              [p.rank, p.number, p.comprehensive_score.toFixed(2), p.confidence_level, p.method_votes, p.key_features.join(";")].join(",")
                            )
                          ].join("\n");
                          const blob = new Blob([csv], { type: "text/csv" });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = "predictions.csv";
                          a.click();
                        }}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        📥 Export
                      </button>
                    </div>

                    {/* Confidence Summary */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="text-sm text-green-700 dark:text-green-300 font-medium">High Confidence</div>
                        <div className="text-2xl font-bold text-green-900 dark:text-green-100">{results.comprehensivePrediction.summary_stats.total_high_confidence}</div>
                      </div>
                      <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <div className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">Medium Confidence</div>
                        <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{results.comprehensivePrediction.summary_stats.total_medium_confidence}</div>
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-800/30 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">Low Confidence</div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{results.comprehensivePrediction.summary_stats.total_low_confidence}</div>
                      </div>
                    </div>

                    {/* Top 10 Predictions */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold mb-3 text-purple-900 dark:text-purple-200">🎯 Top 10 Recommendations</h4>
                      <div className="flex flex-wrap gap-3">
                        {results.comprehensivePrediction.all_predictions.slice(0, 10).map((pred, idx) => (
                          <div
                            key={pred.number}
                            className={`relative px-5 py-4 rounded-lg font-bold text-lg shadow-md ${
                              pred.confidence_level === "High"
                                ? "bg-green-500 text-white"
                                : pred.confidence_level === "Medium"
                                ? "bg-yellow-500 text-white"
                                : "bg-gray-400 text-white"
                            }`}
                          >
                            <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center font-bold">
                              {idx + 1}
                            </div>
                            <div className="text-center">
                              <div className="text-2xl">{pred.number}</div>
                              <div className="text-xs opacity-90">{pred.comprehensive_score.toFixed(1)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Full 49 Numbers Table */}
                    <div className="bg-white dark:bg-zinc-800 rounded-lg overflow-hidden border border-purple-200 dark:border-purple-800">
                      <div className="px-4 py-3 bg-purple-100 dark:bg-purple-900/40 border-b border-purple-200 dark:border-purple-800">
                        <h4 className="font-semibold text-purple-900 dark:text-purple-200">Complete Rankings (All 49 Numbers)</h4>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-zinc-50 dark:bg-zinc-900/50 sticky top-0 z-10">
                            <tr>
                              <th className="px-4 py-2 text-left font-medium text-zinc-600 dark:text-zinc-400">Rank</th>
                              <th className="px-4 py-2 text-left font-medium text-zinc-600 dark:text-zinc-400">Number</th>
                              <th className="px-4 py-2 text-right font-medium text-zinc-600 dark:text-zinc-400">Score</th>
                              <th className="px-4 py-2 text-center font-medium text-zinc-600 dark:text-zinc-400">Confidence</th>
                              <th className="px-4 py-2 text-center font-medium text-zinc-600 dark:text-zinc-400">Votes</th>
                              <th className="px-4 py-2 text-left font-medium text-zinc-600 dark:text-zinc-400">Key Features</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                            {results.comprehensivePrediction.all_predictions.map((pred, idx) => (
                              <tr
                                key={pred.number}
                                className={`hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors ${
                                  idx % 2 === 0 ? "bg-white dark:bg-zinc-800" : "bg-zinc-50 dark:bg-zinc-900/50"
                                }`}
                              >
                                <td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">#{pred.rank}</td>
                                <td className="px-4 py-2 font-bold text-lg">{pred.number}</td>
                                <td className="px-4 py-2 text-right font-semibold">{pred.comprehensive_score.toFixed(2)}</td>
                                <td className="px-4 py-2 text-center">
                                  <span
                                    className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                      pred.confidence_level === "High"
                                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                        : pred.confidence_level === "Medium"
                                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                                    }`}
                                  >
                                    {pred.confidence_level}
                                  </span>
                                </td>
                                <td className="px-4 py-2 text-center">{pred.method_votes}/4</td>
                                <td className="px-4 py-2 text-xs text-zinc-600 dark:text-zinc-400">{pred.key_features.join(", ") || "—"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Advanced Analysis Cards Grid */}
                {(results.extremeValueAnalysis || results.autocorrelationAnalysis || results.anovaAnalysis || results.numberSumAnalysis) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Extreme Value Analysis */}
                    {results.extremeValueAnalysis && (
                      <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-600 dark:text-red-400">
                          🔴 Extreme Value Analysis
                        </h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-700 pb-2">
                            <span className="text-zinc-600 dark:text-zinc-400">Max Frequency:</span>
                            <span className="font-semibold">{results.extremeValueAnalysis.max_frequency}</span>
                          </div>
                          <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-700 pb-2">
                            <span className="text-zinc-600 dark:text-zinc-400">Mean ± Std:</span>
                            <span className="font-semibold">
                              {results.extremeValueAnalysis.mean_frequency.toFixed(2)} ± {results.extremeValueAnalysis.std_deviation.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-700 pb-2">
                            <span className="text-zinc-600 dark:text-zinc-400">Upper Threshold (μ+3σ):</span>
                            <span className="font-semibold">{results.extremeValueAnalysis.upper_threshold.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-600 dark:text-zinc-400">Extreme High:</span>
                            <span className="font-semibold text-red-600 dark:text-red-400">
                              {results.extremeValueAnalysis.extreme_high.length > 0 ? results.extremeValueAnalysis.extreme_high.join(", ") : "None"}
                            </span>
                          </div>
                        </div>
                        
                        {/* Top 5 Anomaly Scores */}
                        <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
                          <h4 className="text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">Top 5 Anomalies:</h4>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(results.extremeValueAnalysis.anomaly_score)
                              .sort(([, a], [, b]) => b - a)
                              .slice(0, 5)
                              .map(([num, score]) => (
                                <div key={num} className="px-3 py-1 bg-red-100 dark:bg-red-900/30 rounded-full text-xs font-medium">
                                  #{num}: {(score * 100).toFixed(0)}%
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Autocorrelation Analysis */}
                    {results.autocorrelationAnalysis && (
                      <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-600 dark:text-blue-400">
                          📈 Autocorrelation Analysis
                        </h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-700 pb-2">
                            <span className="text-zinc-600 dark:text-zinc-400">Lag-1 Correlation:</span>
                            <span className="font-semibold">{results.autocorrelationAnalysis.lag_1_correlation.toFixed(3)}</span>
                          </div>
                          <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-700 pb-2">
                            <span className="text-zinc-600 dark:text-zinc-400">Lag-2 Correlation:</span>
                            <span className="font-semibold">{results.autocorrelationAnalysis.lag_2_correlation.toFixed(3)}</span>
                          </div>
                          <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-700 pb-2">
                            <span className="text-zinc-600 dark:text-zinc-400">Lag-3 Correlation:</span>
                            <span className="font-semibold">{results.autocorrelationAnalysis.lag_3_correlation.toFixed(3)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-600 dark:text-zinc-400">Predictability Score:</span>
                            <span className="font-bold text-blue-600 dark:text-blue-400">
                              {(results.autocorrelationAnalysis.predictability_score * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>

                        {/* Interpretation */}
                        <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
                          <p className="text-xs text-zinc-600 dark:text-zinc-400 italic">{results.autocorrelationAnalysis.interpretation}</p>
                        </div>

                        {/* Visual Bar Chart */}
                        <div className="mt-4 space-y-2">
                          {[
                            { label: "Lag-1", value: results.autocorrelationAnalysis.lag_1_correlation },
                            { label: "Lag-2", value: results.autocorrelationAnalysis.lag_2_correlation },
                            { label: "Lag-3", value: results.autocorrelationAnalysis.lag_3_correlation },
                          ].map(({ label, value }) => (
                            <div key={label} className="flex items-center gap-2">
                              <span className="text-xs w-12">{label}</span>
                              <div className="flex-1 bg-zinc-200 dark:bg-zinc-700 rounded-full h-4 overflow-hidden">
                                <div
                                  className="bg-blue-500 h-full transition-all"
                                  style={{ width: `${Math.abs(value) * 100}%` }}
                                />
                              </div>
                              <span className="text-xs w-12 text-right">{value.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ANOVA Analysis */}
                    {results.anovaAnalysis && (
                      <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-green-600 dark:text-green-400">
                          📊 ANOVA (Variance Analysis)
                        </h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-700 pb-2">
                            <span className="text-zinc-600 dark:text-zinc-400">F-Statistic:</span>
                            <span className="font-semibold">{results.anovaAnalysis.f_statistic.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-700 pb-2">
                            <span className="text-zinc-600 dark:text-zinc-400">P-Value:</span>
                            <span className="font-semibold">{results.anovaAnalysis.p_value.toFixed(3)}</span>
                          </div>
                          <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-700 pb-2">
                            <span className="text-zinc-600 dark:text-zinc-400">Significant:</span>
                            <span className={`font-bold ${results.anovaAnalysis.is_significant ? "text-green-600" : "text-gray-500"}`}>
                              {results.anovaAnalysis.is_significant ? "Yes" : "No"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-600 dark:text-zinc-400">Hottest Period:</span>
                            <span className="font-semibold text-orange-600 dark:text-orange-400">{results.anovaAnalysis.hottest_period}</span>
                          </div>
                        </div>

                        {/* Period Comparison */}
                        <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700 space-y-3">
                          {results.anovaAnalysis.periods.map(period => (
                            <div key={period.period_name} className="space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{period.period_name}</span>
                                <span className="text-xs text-zinc-500">Mean: {period.period_mean.toFixed(2)}</span>
                              </div>
                              <div className="text-xs text-zinc-600 dark:text-zinc-400">
                                Top 3: {period.top_3_numbers.join(", ")}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Number Sum Analysis */}
                    {results.numberSumAnalysis && (
                      <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-purple-600 dark:text-purple-400">
                          ➕ Number Sum Analysis
                        </h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-700 pb-2">
                            <span className="text-zinc-600 dark:text-zinc-400">Sum Mean:</span>
                            <span className="font-semibold">{results.numberSumAnalysis.sum_mean.toFixed(1)}</span>
                          </div>
                          <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-700 pb-2">
                            <span className="text-zinc-600 dark:text-zinc-400">Sum Range:</span>
                            <span className="font-semibold">
                              {results.numberSumAnalysis.sum_min} - {results.numberSumAnalysis.sum_max}
                            </span>
                          </div>
                          <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-700 pb-2">
                            <span className="text-zinc-600 dark:text-zinc-400">Std Deviation:</span>
                            <span className="font-semibold">{results.numberSumAnalysis.sum_std_dev.toFixed(1)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-600 dark:text-zinc-400">Predicted Range:</span>
                            <span className="font-bold text-purple-600 dark:text-purple-400">
                              {results.numberSumAnalysis.predicted_sum_range[0]} - {results.numberSumAnalysis.predicted_sum_range[1]}
                            </span>
                          </div>
                        </div>

                        {/* Quartiles */}
                        <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
                          <h4 className="text-xs font-medium mb-2 text-zinc-700 dark:text-zinc-300">Quartiles:</h4>
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="bg-purple-50 dark:bg-purple-900/20 rounded p-2">
                              <div className="text-xs text-zinc-600 dark:text-zinc-400">Q1</div>
                              <div className="font-bold">{results.numberSumAnalysis.sum_quartiles.q1}</div>
                            </div>
                            <div className="bg-purple-50 dark:bg-purple-900/20 rounded p-2">
                              <div className="text-xs text-zinc-600 dark:text-zinc-400">Q2</div>
                              <div className="font-bold">{results.numberSumAnalysis.sum_quartiles.q2}</div>
                            </div>
                            <div className="bg-purple-50 dark:bg-purple-900/20 rounded p-2">
                              <div className="text-xs text-zinc-600 dark:text-zinc-400">Q3</div>
                              <div className="font-bold">{results.numberSumAnalysis.sum_quartiles.q3}</div>
                            </div>
                          </div>
                        </div>

                        {/* Top Numbers by Sum Score */}
                        <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
                          <h4 className="text-xs font-medium mb-2 text-zinc-700 dark:text-zinc-300">Recommended (Sum-Based):</h4>
                          <div className="flex flex-wrap gap-1">
                            {results.numberSumAnalysis.sum_based_numbers.slice(0, 7).map(num => (
                              <span key={num} className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 rounded text-xs font-medium">
                                {num}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Decision Tree Analysis */}
                {results.ruleTreeAnalysis && (
                  <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                      🎯 Decision Tree / Random Forest
                    </h3>
                    
                    {/* Rule Summary */}
                    <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                      <p className="text-sm text-indigo-900 dark:text-indigo-200">{results.ruleTreeAnalysis.rule_summary}</p>
                    </div>

                    {/* Confidence Distribution */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="text-2xl font-bold text-green-700 dark:text-green-300">{results.ruleTreeAnalysis.confidence_distribution.high_count}</div>
                        <div className="text-xs text-green-600 dark:text-green-400">High</div>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{results.ruleTreeAnalysis.confidence_distribution.medium_count}</div>
                        <div className="text-xs text-yellow-600 dark:text-yellow-400">Medium</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">{results.ruleTreeAnalysis.confidence_distribution.low_count}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Low</div>
                      </div>
                    </div>

                    {/* Top 10 with Feature Scores */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-zinc-700 dark:text-zinc-300">Top 10 Predictions with Feature Scores:</h4>
                      {results.ruleTreeAnalysis.predictions.slice(0, 10).map((pred, idx) => (
                        <div key={pred.number} className="p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-200 dark:border-zinc-700">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">#{pred.number}</div>
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  pred.confidence_level === "High"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                    : pred.confidence_level === "Medium"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                                }`}
                              >
                                {pred.confidence_level}
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold">{pred.confidence_score.toFixed(1)}%</div>
                              <div className="text-xs text-zinc-500">{pred.voting_methods.length} votes</div>
                            </div>
                          </div>
                          
                          {/* Feature Scores Mini Bars */}
                          <div className="grid grid-cols-5 gap-1 text-xs">
                            <div className="text-center">
                              <div className="h-12 bg-zinc-200 dark:bg-zinc-700 rounded relative overflow-hidden">
                                <div className="absolute bottom-0 w-full bg-blue-500" style={{ height: `${pred.feature_scores.frequency_score * 50}%` }} />
                              </div>
                              <div className="mt-1 text-zinc-600 dark:text-zinc-400">Freq</div>
                            </div>
                            <div className="text-center">
                              <div className="h-12 bg-zinc-200 dark:bg-zinc-700 rounded relative overflow-hidden">
                                <div className="absolute bottom-0 w-full bg-red-500" style={{ height: `${pred.feature_scores.extreme_value_score * 100}%` }} />
                              </div>
                              <div className="mt-1 text-zinc-600 dark:text-zinc-400">Extr</div>
                            </div>
                            <div className="text-center">
                              <div className="h-12 bg-zinc-200 dark:bg-zinc-700 rounded relative overflow-hidden">
                                <div className="absolute bottom-0 w-full bg-purple-500" style={{ height: `${pred.feature_scores.autocorrelation_score * 100}%` }} />
                              </div>
                              <div className="mt-1 text-zinc-600 dark:text-zinc-400">Auto</div>
                            </div>
                            <div className="text-center">
                              <div className="h-12 bg-zinc-200 dark:bg-zinc-700 rounded relative overflow-hidden">
                                <div className="absolute bottom-0 w-full bg-green-500" style={{ height: `${pred.feature_scores.anova_score * 50}%` }} />
                              </div>
                              <div className="mt-1 text-zinc-600 dark:text-zinc-400">ANOVA</div>
                            </div>
                            <div className="text-center">
                              <div className="h-12 bg-zinc-200 dark:bg-zinc-700 rounded relative overflow-hidden">
                                <div className="absolute bottom-0 w-full bg-yellow-500" style={{ height: `${pred.feature_scores.sum_score * 100}%` }} />
                              </div>
                              <div className="mt-1 text-zinc-600 dark:text-zinc-400">Sum</div>
                            </div>
                          </div>
                          
                          {pred.reasons.length > 0 && (
                            <div className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
                              {pred.reasons.join(" • ")}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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
