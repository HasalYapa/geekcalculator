'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  solveQuadratic,
  solveCubic,
  QuadraticResult,
  CubicResult,
} from '@/lib/calculators/polynomial';
import { useLocalStorage } from '@/hooks/use-local-storage';

type QuadraticFormValues = { a: string; b: string; c: string };
type CubicFormValues = { a: string; b: string; c: string; d: string };
type HistoryEntry = {
    type: 'Quadratic' | 'Cubic';
    equation: string;
    result: QuadraticResult | CubicResult;
    timestamp: string;
}

export function PolynomialSolver() {
  const [result, setResult] = useState<QuadraticResult | CubicResult | null>(
    null
  );
  const [history, setHistory] = useLocalStorage<HistoryEntry[]>('polynomial-history', []);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const quadraticForm = useForm<QuadraticFormValues>({
    defaultValues: { a: '', b: '', c: '' },
  });
  const cubicForm = useForm<CubicFormValues>({
    defaultValues: { a: '', b: '', c: '', d: '' },
  });

  const onQuadraticSubmit = (data: QuadraticFormValues) => {
    const a = parseFloat(data.a);
    const b = parseFloat(data.b);
    const c = parseFloat(data.c);
    if (!isNaN(a) && !isNaN(b) && !isNaN(c)) {
      const res = solveQuadratic(a, b, c);
      setResult(res);
      const equation = `${a}x² + ${b}x + ${c} = 0`;
      const newEntry: HistoryEntry = { type: 'Quadratic', equation, result: res, timestamp: new Date().toISOString()};
      setHistory(prev => [newEntry, ...prev.filter(h => h.equation !== equation)].slice(0, 5));
    }
  };

  const onCubicSubmit = (data: CubicFormValues) => {
    const a = parseFloat(data.a);
    const b = parseFloat(data.b);
    const c = parseFloat(data.c);
    const d = parseFloat(data.d);
    if (!isNaN(a) && !isNaN(b) && !isNaN(c) && !isNaN(d)) {
      const res = solveCubic(a, b, c, d);
      setResult(res);
      const equation = `${a}x³ + ${b}x² + ${c}x + ${d} = 0`;
      const newEntry: HistoryEntry = { type: 'Cubic', equation, result: res, timestamp: new Date().toISOString()};
      setHistory(prev => [newEntry, ...prev.filter(h => h.equation !== equation)].slice(0, 5));
    }
  };

  const ResultDisplay = ({ res }: { res: QuadraticResult | CubicResult | null }) => {
    if (!res) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold">Roots</h4>
            <ul className="list-disc list-inside font-code">
              {res.roots.map((root, i) => (
                <li key={i}>{root}</li>
              ))}
            </ul>
          </div>
          {'discriminant' in res && (
            <div>
              <h4 className="font-semibold">Discriminant (Δ)</h4>
              <p className="font-code">{res.discriminant.toString()}</p>
            </div>
          )}
          {'natureOfRoots' in res && (
            <div>
              <h4 className="font-semibold">Nature of Roots</h4>
              <p>{res.natureOfRoots}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      <Tabs defaultValue="quadratic" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="quadratic">ax² + bx + c = 0</TabsTrigger>
          <TabsTrigger value="cubic">ax³ + bx² + cx + d = 0</TabsTrigger>
        </TabsList>
        <TabsContent value="quadratic">
          <Card>
            <CardHeader>
              <CardTitle>Quadratic Solver</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...quadraticForm}>
                <form
                  onSubmit={quadraticForm.handleSubmit(onQuadraticSubmit)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField name="a" render={({ field }) => <FormItem><FormLabel>a</FormLabel><FormControl><Input type="number" step="any" {...field} /></FormControl></FormItem>} />
                    <FormField name="b" render={({ field }) => <FormItem><FormLabel>b</FormLabel><FormControl><Input type="number" step="any" {...field} /></FormControl></FormItem>} />
                    <FormField name="c" render={({ field }) => <FormItem><FormLabel>c</FormLabel><FormControl><Input type="number" step="any" {...field} /></FormControl></FormItem>} />
                  </div>
                  <Button type="submit">Solve</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="cubic">
          <Card>
            <CardHeader>
              <CardTitle>Cubic Solver</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...cubicForm}>
                <form
                  onSubmit={cubicForm.handleSubmit(onCubicSubmit)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <FormField name="a" render={({ field }) => <FormItem><FormLabel>a</FormLabel><FormControl><Input type="number" step="any" {...field} /></FormControl></FormItem>} />
                    <FormField name="b" render={({ field }) => <FormItem><FormLabel>b</FormLabel><FormControl><Input type="number" step="any" {...field} /></FormControl></FormItem>} />
                    <FormField name="c" render={({ field }) => <FormItem><FormLabel>c</FormLabel><FormControl><Input type="number" step="any" {...field} /></FormControl></FormItem>} />
                    <FormField name="d" render={({ field }) => <FormItem><FormLabel>d</FormLabel><FormControl><Input type="number" step="any" {...field} /></FormControl></FormItem>} />
                  </div>
                  <Button type="submit">Solve</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {result && <ResultDisplay res={result} />}

      {isClient && history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Calculations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {history.map((h, i) => (
                <div key={i}>
                    <p className="font-semibold">{h.type}: <span className="font-code">{h.equation}</span></p>
                    <ResultDisplay res={h.result} />
                </div>
            ))}
          </CardContent>
        </Card>
      )}

    </div>
  );
}
