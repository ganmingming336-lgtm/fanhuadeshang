export type Draw = number[];

export interface FrequencyData {
  number: number;
  count: number;
  percentage: number;
  rank: number;
}

export interface ExtremeValueAnalysis {
  max_frequency: number;
  min_frequency: number;
  mean_frequency: number;
  std_deviation: number;
  upper_threshold: number;
  lower_threshold: number;
  extreme_high: number[];
  extreme_low: number[];
  anomaly_score: Record<number, number>;
}

export interface AutocorrelationAnalysis {
  lag_1_correlation: number;
  lag_2_correlation: number;
  lag_3_correlation: number;
  has_significant_autocorrelation: boolean;
  significant_lags: number[];
  predictability_score: number;
  interpretation: string;
}

export interface AnovaAnalysis {
  periods: {
    period_name: string;
    period_frequency: Record<number, number>;
    period_mean: number;
    period_variance: number;
    top_3_numbers: number[];
  }[];
  f_statistic: number;
  p_value: number;
  is_significant: boolean;
  hottest_period: string;
  coldest_period: string;
  period_based_scores: Record<number, Record<string, number>>;
}

export interface NumberSumAnalysis {
  all_sums: number[];
  sum_mean: number;
  sum_min: number;
  sum_max: number;
  sum_std_dev: number;
  sum_median: number;
  sum_quartiles: { q1: number; q2: number; q3: number };
  sum_distribution: Record<number, number>;
  predicted_sum_range: [number, number];
  sum_based_numbers: number[];
  sum_score: Record<number, number>;
}

export interface RuleTreeAnalysis {
  predictions: {
    number: number;
    confidence_score: number;
    confidence_level: "High" | "Medium" | "Low";
    feature_scores: {
      frequency_score: number;
      extreme_value_score: number;
      autocorrelation_score: number;
      anova_score: number;
      sum_score: number;
    };
    voting_methods: string[];
    reasons: string[];
  }[];
  top_10_predictions: number[];
  confidence_distribution: {
    high_count: number;
    medium_count: number;
    low_count: number;
  };
  tree_depth: number;
  rule_summary: string;
}

export interface ComprehensivePrediction {
  all_predictions: {
    number: number;
    rank: number;
    comprehensive_score: number;
    confidence_level: "High" | "Medium" | "Low";
    contributing_methods: {
      extreme_value: number;
      autocorrelation: number;
      anova: number;
      sum_analysis: number;
      rule_tree: number;
    };
    method_votes: number;
    key_features: string[];
  }[];
  summary_stats: {
    total_high_confidence: number;
    total_medium_confidence: number;
    total_low_confidence: number;
    average_score: number;
  };
  last_updated: string;
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
  extremeValueAnalysis?: ExtremeValueAnalysis;
  autocorrelationAnalysis?: AutocorrelationAnalysis;
  anovaAnalysis?: AnovaAnalysis;
  numberSumAnalysis?: NumberSumAnalysis;
  ruleTreeAnalysis?: RuleTreeAnalysis;
  comprehensivePrediction?: ComprehensivePrediction;
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

  const extremeValueAnalysis = analyzeExtremeValues(frequency, frequencyList);
  const autocorrelationAnalysis = analyzeAutocorrelation(validDraws);
  const anovaAnalysis = analyzeAnova(validDraws);
  const numberSumAnalysis = analyzeNumberSum(validDraws);
  const ruleTreeAnalysis = analyzeRuleTree(
    frequency,
    extremeValueAnalysis,
    autocorrelationAnalysis,
    anovaAnalysis,
    numberSumAnalysis
  );
  const comprehensivePrediction = generateComprehensivePrediction(
    ruleTreeAnalysis,
    extremeValueAnalysis,
    autocorrelationAnalysis,
    anovaAnalysis,
    numberSumAnalysis
  );

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
    extremeValueAnalysis,
    autocorrelationAnalysis,
    anovaAnalysis,
    numberSumAnalysis,
    ruleTreeAnalysis,
    comprehensivePrediction,
  };
};

function analyzeExtremeValues(
  frequency: Record<number, number>,
  frequencyList: FrequencyData[]
): ExtremeValueAnalysis {
  const counts = Object.values(frequency);
  const max_frequency = Math.max(...counts);
  const min_frequency = Math.min(...counts);
  const mean_frequency = counts.reduce((a, b) => a + b, 0) / counts.length;
  
  const variance = counts.reduce((sum, val) => sum + Math.pow(val - mean_frequency, 2), 0) / counts.length;
  const std_deviation = Math.sqrt(variance);
  
  const upper_threshold = mean_frequency + 3 * std_deviation;
  const lower_threshold = Math.max(0, mean_frequency - 3 * std_deviation);
  
  const extreme_high: number[] = [];
  const extreme_low: number[] = [];
  const anomaly_score: Record<number, number> = {};
  
  for (let i = 1; i <= 49; i++) {
    const count = frequency[i];
    const deviation = Math.abs(count - mean_frequency) / (std_deviation || 1);
    anomaly_score[i] = Math.min(deviation / 3, 1);
    
    if (count > upper_threshold) {
      extreme_high.push(i);
    }
    if (count < lower_threshold && count >= 0) {
      extreme_low.push(i);
    }
  }
  
  return {
    max_frequency,
    min_frequency,
    mean_frequency,
    std_deviation,
    upper_threshold,
    lower_threshold,
    extreme_high,
    extreme_low,
    anomaly_score,
  };
}

function analyzeAutocorrelation(validDraws: Draw[]): AutocorrelationAnalysis {
  if (validDraws.length < 4) {
    return {
      lag_1_correlation: 0,
      lag_2_correlation: 0,
      lag_3_correlation: 0,
      has_significant_autocorrelation: false,
      significant_lags: [],
      predictability_score: 0,
      interpretation: "Insufficient data for autocorrelation analysis (need at least 4 draws)",
    };
  }
  
  const calculateLagCorrelation = (lag: number): number => {
    if (validDraws.length <= lag) return 0;
    
    const pairs: number[][] = [];
    for (let i = 0; i < validDraws.length - lag; i++) {
      const current = validDraws[i];
      const future = validDraws[i + lag];
      
      current.forEach(num1 => {
        future.forEach(num2 => {
          pairs.push([num1, num2]);
        });
      });
    }
    
    if (pairs.length === 0) return 0;
    
    const mean1 = pairs.reduce((sum, p) => sum + p[0], 0) / pairs.length;
    const mean2 = pairs.reduce((sum, p) => sum + p[1], 0) / pairs.length;
    
    let numerator = 0;
    let denom1 = 0;
    let denom2 = 0;
    
    pairs.forEach(([x, y]) => {
      const dx = x - mean1;
      const dy = y - mean2;
      numerator += dx * dy;
      denom1 += dx * dx;
      denom2 += dy * dy;
    });
    
    const denominator = Math.sqrt(denom1 * denom2);
    return denominator > 0 ? numerator / denominator : 0;
  };
  
  const lag_1_correlation = calculateLagCorrelation(1);
  const lag_2_correlation = calculateLagCorrelation(2);
  const lag_3_correlation = calculateLagCorrelation(3);
  
  const significant_lags: number[] = [];
  const threshold = 0.2;
  
  if (Math.abs(lag_1_correlation) > threshold) significant_lags.push(1);
  if (Math.abs(lag_2_correlation) > threshold) significant_lags.push(2);
  if (Math.abs(lag_3_correlation) > threshold) significant_lags.push(3);
  
  const has_significant_autocorrelation = significant_lags.length > 0;
  const predictability_score = Math.min(
    (Math.abs(lag_1_correlation) + Math.abs(lag_2_correlation) + Math.abs(lag_3_correlation)) / 3,
    1
  );
  
  let interpretation = "";
  if (predictability_score > 0.3) {
    interpretation = "Strong patterns detected. Past draws show correlation with future draws.";
  } else if (predictability_score > 0.15) {
    interpretation = "Moderate patterns detected. Some correlation exists between draws.";
  } else {
    interpretation = "Weak patterns. Draws appear mostly random and independent.";
  }
  
  return {
    lag_1_correlation,
    lag_2_correlation,
    lag_3_correlation,
    has_significant_autocorrelation,
    significant_lags,
    predictability_score,
    interpretation,
  };
}

function analyzeAnova(validDraws: Draw[]): AnovaAnalysis {
  if (validDraws.length < 3) {
    const emptyPeriod = {
      period_name: "Insufficient Data",
      period_frequency: {},
      period_mean: 0,
      period_variance: 0,
      top_3_numbers: [],
    };
    
    return {
      periods: [emptyPeriod],
      f_statistic: 0,
      p_value: 1,
      is_significant: false,
      hottest_period: "N/A",
      coldest_period: "N/A",
      period_based_scores: {},
    };
  }
  
  const third = Math.ceil(validDraws.length / 3);
  const earlyDraws = validDraws.slice(0, third);
  const middleDraws = validDraws.slice(third, third * 2);
  const lateDraws = validDraws.slice(third * 2);
  
  const analyzePeriod = (draws: Draw[], name: string) => {
    const period_frequency: Record<number, number> = {};
    for (let i = 1; i <= 49; i++) {
      period_frequency[i] = 0;
    }
    
    draws.forEach(draw => {
      draw.forEach(num => {
        period_frequency[num]++;
      });
    });
    
    const counts = Object.values(period_frequency);
    const period_mean = counts.reduce((a, b) => a + b, 0) / counts.length;
    const period_variance = counts.reduce((sum, val) => sum + Math.pow(val - period_mean, 2), 0) / counts.length;
    
    const sorted = Object.entries(period_frequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([num]) => parseInt(num));
    
    return {
      period_name: name,
      period_frequency,
      period_mean,
      period_variance,
      top_3_numbers: sorted,
    };
  };
  
  const periods = [
    analyzePeriod(earlyDraws, "Early"),
    analyzePeriod(middleDraws, "Middle"),
    analyzePeriod(lateDraws, "Late"),
  ];
  
  const allCounts = periods.flatMap(p => Object.values(p.period_frequency));
  const grandMean = allCounts.reduce((a, b) => a + b, 0) / allCounts.length;
  
  let ssBetween = 0;
  let ssWithin = 0;
  
  periods.forEach(period => {
    const counts = Object.values(period.period_frequency);
    ssBetween += counts.length * Math.pow(period.period_mean - grandMean, 2);
    counts.forEach(count => {
      ssWithin += Math.pow(count - period.period_mean, 2);
    });
  });
  
  const dfBetween = periods.length - 1;
  const dfWithin = allCounts.length - periods.length;
  
  const msBetween = ssBetween / dfBetween;
  const msWithin = ssWithin / dfWithin;
  
  const f_statistic = msWithin > 0 ? msBetween / msWithin : 0;
  const p_value = f_statistic > 3.0 ? 0.05 : 0.5;
  const is_significant = p_value < 0.05;
  
  const hottest_period = periods.reduce((max, p) => p.period_mean > max.period_mean ? p : max).period_name;
  const coldest_period = periods.reduce((min, p) => p.period_mean < min.period_mean ? p : min).period_name;
  
  const period_based_scores: Record<number, Record<string, number>> = {};
  for (let i = 1; i <= 49; i++) {
    period_based_scores[i] = {};
    periods.forEach(period => {
      const score = period.period_frequency[i] / (period.period_mean || 1);
      period_based_scores[i][period.period_name] = score;
    });
  }
  
  return {
    periods,
    f_statistic,
    p_value,
    is_significant,
    hottest_period,
    coldest_period,
    period_based_scores,
  };
}

function analyzeNumberSum(validDraws: Draw[]): NumberSumAnalysis {
  if (validDraws.length === 0) {
    return {
      all_sums: [],
      sum_mean: 0,
      sum_min: 0,
      sum_max: 0,
      sum_std_dev: 0,
      sum_median: 0,
      sum_quartiles: { q1: 0, q2: 0, q3: 0 },
      sum_distribution: {},
      predicted_sum_range: [0, 0],
      sum_based_numbers: [],
      sum_score: {},
    };
  }
  
  const all_sums = validDraws.map(draw => draw.reduce((sum, num) => sum + num, 0));
  const sorted_sums = [...all_sums].sort((a, b) => a - b);
  
  const sum_mean = all_sums.reduce((a, b) => a + b, 0) / all_sums.length;
  const sum_min = Math.min(...all_sums);
  const sum_max = Math.max(...all_sums);
  
  const variance = all_sums.reduce((sum, val) => sum + Math.pow(val - sum_mean, 2), 0) / all_sums.length;
  const sum_std_dev = Math.sqrt(variance);
  
  const sum_median = sorted_sums[Math.floor(sorted_sums.length / 2)];
  
  const q1_index = Math.floor(sorted_sums.length * 0.25);
  const q2_index = Math.floor(sorted_sums.length * 0.5);
  const q3_index = Math.floor(sorted_sums.length * 0.75);
  
  const sum_quartiles = {
    q1: sorted_sums[q1_index] || 0,
    q2: sorted_sums[q2_index] || 0,
    q3: sorted_sums[q3_index] || 0,
  };
  
  const sum_distribution: Record<number, number> = {};
  all_sums.forEach(sum => {
    sum_distribution[sum] = (sum_distribution[sum] || 0) + 1;
  });
  
  const predicted_sum_range: [number, number] = [
    Math.max(15, Math.round(sum_mean - sum_std_dev)),
    Math.min(294, Math.round(sum_mean + sum_std_dev)),
  ];
  
  const sum_based_numbers: number[] = [];
  const sum_score: Record<number, number> = {};
  
  for (let i = 1; i <= 49; i++) {
    let score = 0;
    all_sums.forEach((sum, idx) => {
      const draw = validDraws[idx];
      if (draw.includes(i)) {
        const deviation = Math.abs(sum - sum_mean);
        score += Math.exp(-deviation / (sum_std_dev || 1));
      }
    });
    sum_score[i] = score / all_sums.length;
  }
  
  const sorted_by_score = Object.entries(sum_score)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([num]) => parseInt(num));
  
  sum_based_numbers.push(...sorted_by_score);
  
  return {
    all_sums,
    sum_mean,
    sum_min,
    sum_max,
    sum_std_dev,
    sum_median,
    sum_quartiles,
    sum_distribution,
    predicted_sum_range,
    sum_based_numbers,
    sum_score,
  };
}

function analyzeRuleTree(
  frequency: Record<number, number>,
  extremeValue: ExtremeValueAnalysis,
  autocorr: AutocorrelationAnalysis,
  anova: AnovaAnalysis,
  sumAnalysis: NumberSumAnalysis
): RuleTreeAnalysis {
  const predictions: RuleTreeAnalysis["predictions"] = [];
  
  for (let num = 1; num <= 49; num++) {
    const freq = frequency[num];
    const freq_score = freq / (extremeValue.mean_frequency || 1);
    const extreme_value_score = 1 - extremeValue.anomaly_score[num];
    
    const autocorrelation_score = autocorr.predictability_score * (freq_score > 0.5 ? 1 : 0.5);
    
    let anova_score = 0;
    if (anova.period_based_scores[num]) {
      const scores = Object.values(anova.period_based_scores[num]);
      anova_score = scores.reduce((a, b) => a + b, 0) / scores.length;
    }
    
    const sum_score = sumAnalysis.sum_score[num] || 0;
    
    const feature_scores = {
      frequency_score: freq_score,
      extreme_value_score,
      autocorrelation_score,
      anova_score,
      sum_score,
    };
    
    const confidence_score = (
      freq_score * 0.3 +
      extreme_value_score * 0.2 +
      autocorrelation_score * 0.15 +
      anova_score * 0.2 +
      sum_score * 0.15
    ) * 100;
    
    let confidence_level: "High" | "Medium" | "Low";
    if (confidence_score >= 60) confidence_level = "High";
    else if (confidence_score >= 40) confidence_level = "Medium";
    else confidence_level = "Low";
    
    const voting_methods: string[] = [];
    const reasons: string[] = [];
    
    if (freq_score > 1.0) {
      voting_methods.push("Frequency");
      reasons.push("Above average frequency");
    }
    if (extreme_value_score > 0.7) {
      voting_methods.push("Extreme Value");
      reasons.push("Not an outlier");
    }
    if (anova_score > 1.0) {
      voting_methods.push("ANOVA");
      reasons.push("Strong in recent period");
    }
    if (sum_score > 0.5) {
      voting_methods.push("Sum Analysis");
      reasons.push("Appears in typical sums");
    }
    
    predictions.push({
      number: num,
      confidence_score,
      confidence_level,
      feature_scores,
      voting_methods,
      reasons,
    });
  }
  
  predictions.sort((a, b) => b.confidence_score - a.confidence_score);
  
  const top_10_predictions = predictions.slice(0, 10).map(p => p.number);
  
  const confidence_distribution = {
    high_count: predictions.filter(p => p.confidence_level === "High").length,
    medium_count: predictions.filter(p => p.confidence_level === "Medium").length,
    low_count: predictions.filter(p => p.confidence_level === "Low").length,
  };
  
  const tree_depth = 3;
  const rule_summary = `Applied ${tree_depth}-level decision tree with 5 features. Top prediction: #${top_10_predictions[0]} with ${predictions[0].confidence_score.toFixed(1)}% confidence.`;
  
  return {
    predictions,
    top_10_predictions,
    confidence_distribution,
    tree_depth,
    rule_summary,
  };
}

function generateComprehensivePrediction(
  ruleTree: RuleTreeAnalysis,
  extremeValue: ExtremeValueAnalysis,
  autocorr: AutocorrelationAnalysis,
  anova: AnovaAnalysis,
  sumAnalysis: NumberSumAnalysis
): ComprehensivePrediction {
  const all_predictions: ComprehensivePrediction["all_predictions"] = [];
  
  for (let num = 1; num <= 49; num++) {
    const rulePred = ruleTree.predictions.find(p => p.number === num);
    
    const ev_score = 1 - extremeValue.anomaly_score[num];
    const autocorr_score = autocorr.predictability_score * 100;
    
    let anova_score = 0;
    if (anova.period_based_scores[num]) {
      const scores = Object.values(anova.period_based_scores[num]);
      anova_score = (scores.reduce((a, b) => a + b, 0) / scores.length) * 100;
    }
    
    const sum_score = (sumAnalysis.sum_score[num] || 0) * 100;
    const rule_tree_score = rulePred?.confidence_score || 0;
    
    const contributing_methods = {
      extreme_value: ev_score,
      autocorrelation: autocorr_score,
      anova: anova_score,
      sum_analysis: sum_score,
      rule_tree: rule_tree_score,
    };
    
    const comprehensive_score = (
      ev_score * 0.15 +
      autocorr_score * 0.15 +
      anova_score * 0.2 +
      sum_score * 0.15 +
      rule_tree_score * 0.35
    );
    
    let method_votes = 0;
    const key_features: string[] = [];
    
    if (ev_score > 50) {
      method_votes++;
      key_features.push("Low anomaly");
    }
    if (anova_score > 100) {
      method_votes++;
      key_features.push("Period strong");
    }
    if (sum_score > 50) {
      method_votes++;
      key_features.push("Sum favorable");
    }
    if (rule_tree_score > 60) {
      method_votes++;
      key_features.push("High confidence");
    }
    
    let confidence_level: "High" | "Medium" | "Low";
    if (comprehensive_score >= 60) confidence_level = "High";
    else if (comprehensive_score >= 40) confidence_level = "Medium";
    else confidence_level = "Low";
    
    all_predictions.push({
      number: num,
      rank: 0,
      comprehensive_score,
      confidence_level,
      contributing_methods,
      method_votes,
      key_features,
    });
  }
  
  all_predictions.sort((a, b) => b.comprehensive_score - a.comprehensive_score);
  
  all_predictions.forEach((pred, idx) => {
    pred.rank = idx + 1;
  });
  
  const summary_stats = {
    total_high_confidence: all_predictions.filter(p => p.confidence_level === "High").length,
    total_medium_confidence: all_predictions.filter(p => p.confidence_level === "Medium").length,
    total_low_confidence: all_predictions.filter(p => p.confidence_level === "Low").length,
    average_score: all_predictions.reduce((sum, p) => sum + p.comprehensive_score, 0) / all_predictions.length,
  };
  
  return {
    all_predictions,
    summary_stats,
    last_updated: new Date().toISOString(),
  };
}
