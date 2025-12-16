/**
 * Export utilities for lottery analysis results
 * Generates CSV and JSON blobs with timestamped filenames
 */

export interface ExportData {
  totalNumbers: number;
  uniqueNumbers: number;
  mostCommon: string;
  leastCommon: string;
  frequency: Record<number, number>;
}

/**
 * Generate a timestamped filename
 */
export const getTimestampedFilename = (prefix: string, extension: string): string => {
  const now = new Date();
  const dateStr = now.toISOString().replace(/[:.]/g, "-").slice(0, -5);
  return `${prefix}_${dateStr}.${extension}`;
};

/**
 * Convert results to CSV format
 * Includes summary metrics and detailed frequency table
 */
export const generateCSV = (data: ExportData): string => {
  const lines: string[] = [];

  // Header section
  lines.push("Lottery Analysis Export");
  lines.push(`Export Date,${new Date().toLocaleString()}`);
  lines.push("");

  // Summary section
  lines.push("SUMMARY METRICS");
  lines.push("Metric,Value");
  lines.push(`Total Numbers,${data.totalNumbers}`);
  lines.push(`Unique Numbers,${data.uniqueNumbers}`);
  lines.push(`Most Common,"${data.mostCommon}"`);
  lines.push(`Least Common,"${data.leastCommon}"`);
  lines.push("");

  // Frequency table section
  lines.push("FREQUENCY TABLE");
  lines.push("Number,Frequency,Percentage");

  const sortedFrequencies = Object.entries(data.frequency)
    .map(([num, count]) => [Number(num), count] as [number, number])
    .sort((a, b) => a[0] - b[0]);

  sortedFrequencies.forEach(([num, count]) => {
    const percentage = ((count / data.totalNumbers) * 100).toFixed(1);
    lines.push(`${num},${count},${percentage}%`);
  });

  return lines.join("\n");
};

/**
 * Convert results to JSON format
 * Includes all data with metadata
 */
export const generateJSON = (data: ExportData): string => {
  const json = {
    metadata: {
      exportDate: new Date().toISOString(),
      version: "1.0",
    },
    summary: {
      totalNumbers: data.totalNumbers,
      uniqueNumbers: data.uniqueNumbers,
      mostCommon: data.mostCommon,
      leastCommon: data.leastCommon,
    },
    frequencyTable: data.frequency,
  };

  return JSON.stringify(json, null, 2);
};

/**
 * Download a blob as a file
 * Uses browser's download API (works offline)
 */
export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  
  // Append to body for compatibility with some browsers
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  URL.revokeObjectURL(url);
};

/**
 * Copy text to clipboard
 * Uses modern Clipboard API with fallback
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for non-secure contexts or older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      
      textArea.focus();
      textArea.select();
      const success = document.execCommand("copy");
      
      document.body.removeChild(textArea);
      return success;
    }
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
};

/**
 * Export results as CSV file
 */
export const exportAsCSV = (data: ExportData): void => {
  const csv = generateCSV(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const filename = getTimestampedFilename("lottery_analysis", "csv");
  downloadBlob(blob, filename);
};

/**
 * Export results as JSON file
 */
export const exportAsJSON = (data: ExportData): void => {
  const json = generateJSON(data);
  const blob = new Blob([json], { type: "application/json;charset=utf-8;" });
  const filename = getTimestampedFilename("lottery_analysis", "json");
  downloadBlob(blob, filename);
};

/**
 * Copy results as JSON to clipboard
 */
export const copyResultsToClipboard = async (data: ExportData): Promise<boolean> => {
  const json = generateJSON(data);
  return copyToClipboard(json);
};
