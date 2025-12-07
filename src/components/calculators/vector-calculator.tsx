'use client';

import { useState, useEffect, useCallback } from 'react';
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
import { Switch } from '@/components/ui/switch';
import {
  add,
  subtract,
  dotProduct,
  crossProduct,
  angleBetween,
  Vector,
} from '@/lib/calculators/vector';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/use-local-storage';

type FormValues = {
  v1_x: string;
  v1_y: string;
  v1_z: string;
  v2_x: string;
  v2_y: string;
  v2_z: string;
};

type HistoryEntry = {
  operation: string;
  result: Vector | number | string;
  timestamp: string;
};

const VectorInput = ({
  id,
  label,
  is3D,
}: {
  id: 1 | 2;
  label: string;
  is3D: boolean;
}) => (
  <div className="space-y-2">
    <h3 className="font-semibold text-lg">{label}</h3>
    <div className="grid grid-cols-3 gap-2">
      <FormField
        name={`v${id}_x`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>x</FormLabel>
            <FormControl>
              <Input type="number" step="any" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        name={`v${id}_y`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>y</FormLabel>
            <FormControl>
              <Input type="number" step="any" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      {is3D && (
        <FormField
          name={`v${id}_z`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>z</FormLabel>
              <FormControl>
                <Input type="number" step="any" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      )}
    </div>
  </div>
);

const ResultDisplay = ({
  res,
  op,
  is3D,
}: {
  res: Vector | number | string | null;
  op: string;
  is3D: boolean;
}) => {
  if (res === null) return null;

  let displayValue: string;
  if (typeof res === 'object') {
    displayValue = `( ${res.x.toFixed(4)}, ${res.y.toFixed(4)}${
      is3D ? `, ${res.z.toFixed(4)}` : ''
    } )`;
  } else {
    displayValue = res.toString();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Result: {op}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-code text-2xl font-bold">{displayValue}</p>
      </CardContent>
    </Card>
  );
};

export function VectorCalculator() {
  const [is3D, setIs3D] = useState(true);
  const [result, setResult] = useState<Vector | number | string | null>(null);
  const [operation, setOperation] = useState('');
  const [history, setHistory] = useLocalStorage<HistoryEntry[]>(
    'vector-history',
    []
  );
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const form = useForm<FormValues>({
    defaultValues: {
      v1_x: '',
      v1_y: '',
      v1_z: '',
      v2_x: '',
      v2_y: '',
      v2_z: '',
    },
  });

  const getVector = useCallback(
    (id: 1 | 2): Vector => {
      const values = form.getValues();
      return {
        x: parseFloat(values[`v${id}_x`]) || 0,
        y: parseFloat(values[`v${id}_y`]) || 0,
        z: is3D ? parseFloat(values[`v${id}_z`]) || 0 : 0,
      };
    },
    [form, is3D]
  );

  const performOperation = useCallback(
    (op: 'add' | 'subtract' | 'dot' | 'cross' | 'angle') => {
      const v1 = getVector(1);
      const v2 = getVector(2);
      let res: Vector | number | null = null;
      let opName = '';

      try {
        switch (op) {
          case 'add':
            res = add(v1, v2);
            opName = 'Addition (v1 + v2)';
            break;
          case 'subtract':
            res = subtract(v1, v2);
            opName = 'Subtraction (v1 - v2)';
            break;
          case 'dot':
            res = dotProduct(v1, v2);
            opName = 'Dot Product';
            break;
          case 'cross':
            if (!is3D) {
              toast({
                title: 'Error',
                description: 'Cross product is only defined for 3D vectors.',
                variant: 'destructive',
              });
              return;
            }
            res = crossProduct(v1, v2);
            opName = 'Cross Product';
            break;
          case 'angle':
            res = angleBetween(v1, v2);
            opName = 'Angle Between';
            break;
        }

        const displayRes =
          op === 'angle' && typeof res === 'number' ? `${res.toFixed(2)}°` : res;
        setResult(displayRes);
        setOperation(opName);

        if (displayRes !== null) {
          const newEntry: HistoryEntry = {
            operation: opName,
            result: displayRes,
            timestamp: new Date().toISOString(),
          };
          setHistory((prev) =>
            [
              newEntry,
              ...prev.filter(
                (h) => h.result !== displayRes || h.operation !== opName
              ),
            ].slice(0, 5)
          );
        }
      } catch (e: any) {
        toast({ title: 'Error', description: e.message, variant: 'destructive' });
      }
    },
    [getVector, is3D, setHistory, toast]
  );

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Vectors</CardTitle>
            {isClient && (
              <div className="flex items-center space-x-2">
                <FormLabel>3D</FormLabel>
                <Switch checked={is3D} onCheckedChange={setIs3D} />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isClient ? (
            <Form {...form}>
              <form
                className="grid md:grid-cols-2 gap-8"
                onSubmit={(e) => e.preventDefault()}
              >
                <VectorInput id={1} label="Vector v1" is3D={is3D} />
                <VectorInput id={2} label="Vector v2" is3D={is3D} />
              </form>
            </Form>
          ) : (
            <div className="h-24 bg-muted rounded-md animate-pulse" />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Operations</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button onClick={() => performOperation('add')}>Add</Button>
          <Button onClick={() => performOperation('subtract')}>Subtract</Button>
          <Button onClick={() => performOperation('dot')}>Dot Product</Button>
          <Button onClick={() => performOperation('cross')} disabled={!is3D}>
            Cross Product
          </Button>
          <Button onClick={() => performOperation('angle')}>Angle Between</Button>
        </CardContent>
      </Card>

      {result !== null && <ResultDisplay res={result} op={operation} is3D={is3D} />}

      {isClient && history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Calculations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {history.map((h, i) => (
              <div key={i} className="p-4 border rounded-lg">
                <ResultDisplay res={h.result} op={h.operation} is3D={is3D} />
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
