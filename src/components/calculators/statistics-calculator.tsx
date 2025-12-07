'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { calculateStatistics, StatisticsResult } from '@/lib/calculators/statistics';
import { useLocalStorage } from '@/hooks/use-local-storage';

type HistoryEntry = {
    data: string;
    result: StatisticsResult;
    timestamp: string;
}

export function StatisticsCalculator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<StatisticsResult | null>(null);
  const [history, setHistory] = useLocalStorage<HistoryEntry[]>('statistics-history', []);

  const handleCalculate = () => {
    const numbers = input
      .split(',')
      .map((s) => parseFloat(s.trim()))
      .filter((n) => !isNaN(n));

    if (numbers.length > 0) {
      const res = calculateStatistics(numbers);
      setResult(res);
      const newEntry: HistoryEntry = { data: input, result: res, timestamp: new Date().toISOString()};
      setHistory(prev => [newEntry, ...prev.filter(h => h.data !== input)].slice(0, 5));
    } else {
      setResult(null);
    }
  };
  
  const ResultDisplay = ({ res }: { res: StatisticsResult | null }) => {
    if (!res) return null;
    return (
        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Measure</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(res).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</TableCell>
                    <TableCell className="text-right font-code">
                      {typeof value === 'number' ? value.toFixed(4) : Array.isArray(value) ? value.join(', ') : value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
    );
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Data Input</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter comma-separated numbers, e.g., 1, 2, 3.5, 4"
            className="font-code"
            rows={5}
          />
          <Button onClick={handleCalculate}>Calculate</Button>
        </CardContent>
      </Card>
      
      {result && <ResultDisplay res={result} />}

      {history.length > 0 && (
        <Card>
            <CardHeader>
                <CardTitle>Recent Calculations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {history.map((h, i) => (
                    <div key={i}>
                        <p className="text-sm text-muted-foreground font-code mb-2">{h.data}</p>
                        <ResultDisplay res={h.result} />
                    </div>
                ))}
            </CardContent>
        </Card>
      )}
    </div>
  );
}
