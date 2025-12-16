export type Draw = number[];

export interface FrequencyData {
  number: number;
  count: number;
  percentage: number;
  rank: number;
}

export interface AnalysisResult {
  totalDraws: number;
  totalNumbers: number;
  validDraws: Draw[];
  frequency: Record<number, number>;
  frequencyList: FrequencyData[]; // Sorted list for table
  hotNumbers: number[]; // Top 5
  coldNumbers: number[]; // Bottom 5
  mostFrequent: number[];
  leastFrequent: number[]; // excluding 0 if there are numbers with 0
  neverDrawn: number[];
  invalidEntries: string[];
}

export const analyzeInput = (input: string): AnalysisResult => {
  const lines = input.split(/\r?\n/);
  const validDraws: Draw[] = [];
  const invalidEntries: string[] = [];
  const frequency: Record<number, number> = {};
  let totalNumbers = 0;

  // Initialize frequency for all 1-49 numbers to 0
  for (let i = 1; i <= 49; i++) {
    frequency[i] = 0;
  }

  lines.forEach((line) => {
    if (!line.trim()) return;

    // Split by non-digit characters
    const rawTokens = line.split(/[^0-9]+/);
    const draw: Draw = [];
    
    rawTokens.forEach((token) => {
        if (!token) return;
        const num = Number(token);
        if (!isNaN(num)) {
            if (num >= 1 && num <= 49) {
                draw.push(num);
                frequency[num] = (frequency[num] || 0) + 1;
                totalNumbers++;
            } else {
                invalidEntries.push(token);
            }
        } else {
             // This might not be reached due to split regex, but good safety
             invalidEntries.push(token);
        }
    });

    if (draw.length > 0) {
        validDraws.push(draw);
    }
  });

  // Calculate stats
  const frequencyList: FrequencyData[] = [];
  for (let i = 1; i <= 49; i++) {
    frequencyList.push({
      number: i,
      count: frequency[i],
      percentage: totalNumbers > 0 ? (frequency[i] / totalNumbers) * 100 : 0,
      rank: 0, // placeholder
    });
  }

  // Sort by count desc, then by number asc (deterministic tie-breaking)
  frequencyList.sort((a, b) => {
    if (b.count !== a.count) {
      return b.count - a.count;
    }
    return a.number - b.number;
  });

  // Assign ranks
  let currentRank = 1;
  for (let i = 0; i < frequencyList.length; i++) {
      if (i > 0 && frequencyList[i].count < frequencyList[i-1].count) {
          currentRank = i + 1;
      }
      frequencyList[i].rank = currentRank;
  }

  // Hot numbers: Top 5
  const hotNumbers = frequencyList.slice(0, 5).map(f => f.number);

  // Cold numbers: Bottom 5. 
  // We need to be careful. Is "Cold" the least frequent among those drawn, 
  // or generally the numbers with lowest counts (including 0)?
  // Usually "Cold" means numbers that haven't appeared much.
  // I'll take the last 5 from the sorted list.
  const coldNumbers = frequencyList.slice(-5).map(f => f.number);

  // Most frequent (could be more than 1 if ties)
  const maxFreq = frequencyList[0].count;
  const mostFrequent = frequencyList.filter(f => f.count === maxFreq).map(f => f.number);

  // Least frequent (numbers that appeared at least once?)
  // Or just the ones with lowest count?
  // "least frequent, numbers never drawn" are listed as separate items in "Quick stats".
  // So "least frequent" probably implies min count > 0? 
  // Or just min count.
  // If we have never drawn numbers, their count is 0.
  // I will interpret "Least Frequent" as numbers with the minimum count found in the list.
  const minFreq = frequencyList[frequencyList.length - 1].count;
  const leastFrequent = frequencyList.filter(f => f.count === minFreq).map(f => f.number);
  
  const neverDrawn = frequencyList.filter(f => f.count === 0).map(f => f.number);

  return {
    totalDraws: validDraws.length,
    totalNumbers,
    validDraws,
    frequency,
    frequencyList,
    hotNumbers,
    coldNumbers,
    mostFrequent,
    leastFrequent,
    neverDrawn,
    invalidEntries,
  };
};
