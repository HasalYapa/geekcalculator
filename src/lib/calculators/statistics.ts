export interface StatisticsResult {
  mean: number;
  median: number;
  mode: number[] | string;
  variance: number;
  standardDeviation: number;
  count: number;
  sum: number;
}

export function calculateStatistics(data: number[]): StatisticsResult {
  const n = data.length;
  if (n === 0) {
    return { mean: 0, median: 0, mode: 'N/A', variance: 0, standardDeviation: 0, count: 0, sum: 0 };
  }

  const sum = data.reduce((acc, val) => acc + val, 0);
  const mean = sum / n;

  const sortedData = [...data].sort((a, b) => a - b);
  let median: number;
  if (n % 2 === 0) {
    const mid1 = sortedData[n / 2 - 1];
    const mid2 = sortedData[n / 2];
    median = (mid1 + mid2) / 2;
  } else {
    median = sortedData[Math.floor(n / 2)];
  }

  const frequency: { [key: number]: number } = {};
  data.forEach(val => {
    frequency[val] = (frequency[val] || 0) + 1;
  });

  let maxFreq = 0;
  for (const key in frequency) {
    if (frequency[key] > maxFreq) {
      maxFreq = frequency[key];
    }
  }

  let mode: number[] | string;
  if (maxFreq > 1) {
    mode = Object.keys(frequency)
      .filter(key => frequency[Number(key)] === maxFreq)
      .map(Number);
  } else {
    mode = 'No mode';
  }

  const variance = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / n;
  const standardDeviation = Math.sqrt(variance);

  return {
    mean,
    median,
    mode,
    variance,
    standardDeviation,
    count: n,
    sum,
  };
}
