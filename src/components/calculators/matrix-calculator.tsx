'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  add,
  subtract,
  multiply,
  determinant,
  inverse,
} from '@/lib/calculators/matrix';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/use-local-storage';

type Matrix = number[][];
type HistoryEntry = {
    operation: string;
    result: Matrix | number;
    timestamp: string;
}

const generateMatrix = (rows: number, cols: number): Matrix =>
  Array(rows)
    .fill(0)
    .map(() => Array(cols).fill(0));

export function MatrixCalculator() {
  const [rowsA, setRowsA] = useState(2);
  const [colsA, setColsA] = useState(2);
  const [rowsB, setRowsB] = useState(2);
  const [colsB, setColsB] = useState(2);

  const [matrixA, setMatrixA] = useState<Matrix>(generateMatrix(2, 2));
  const [matrixB, setMatrixB] = useState<Matrix>(generateMatrix(2, 2));
  const [result, setResult] = useState<Matrix | number | null>(null);
  const [operation, setOperation] = useState('');

  const [history, setHistory] = useLocalStorage<HistoryEntry[]>('matrix-history', []);
  const { toast } = useToast();

  const handleMatrixChange = (
    val: string,
    r: number,
    c: number,
    matrix: 'A' | 'B'
  ) => {
    const value = val === '' ? 0 : parseFloat(val);
    if (matrix === 'A') {
      const newMatrix = matrixA.map((row, i) =>
        i === r ? row.map((cell, j) => (j === c ? value : cell)) : row
      );
      setMatrixA(newMatrix);
    } else {
      const newMatrix = matrixB.map((row, i) =>
        i === r ? row.map((cell, j) => (j === c ? value : cell)) : row
      );
      setMatrixB(newMatrix);
    }
  };
  
  const updateMatrixSize = (
    value: string,
    dim: 'rows' | 'cols',
    matrix: 'A' | 'B'
  ) => {
    const size = parseInt(value, 10);
    if (size > 0 && size <= 5) {
      if (matrix === 'A') {
        const newRows = dim === 'rows' ? size : rowsA;
        const newCols = dim === 'cols' ? size : colsA;
        setRowsA(newRows);
        setColsA(newCols);
        setMatrixA(generateMatrix(newRows, newCols));
      } else {
        const newRows = dim === 'rows' ? size : rowsB;
        const newCols = dim === 'cols' ? size : colsB;
        setRowsB(newRows);
        setColsB(newCols);
        setMatrixB(generateMatrix(newRows, newCols));
      }
    }
  };

  const performOperation = (op: 'add' | 'subtract' | 'multiply' | 'determinant' | 'inverse') => {
    let res: Matrix | number | null = null;
    let opName = '';
    try {
      switch (op) {
        case 'add':
          res = add(matrixA, matrixB);
          opName = 'Addition';
          break;
        case 'subtract':
          res = subtract(matrixA, matrixB);
          opName = 'Subtraction';
          break;
        case 'multiply':
          res = multiply(matrixA, matrixB);
          opName = 'Multiplication';
          break;
        case 'determinant':
          res = determinant(matrixA);
          opName = 'Determinant (A)';
          break;
        case 'inverse':
          res = inverse(matrixA);
          opName = 'Inverse (A)';
          break;
      }
      setResult(res);
      setOperation(opName);
      if(res !== null) {
          const newEntry: HistoryEntry = { operation: opName, result: res, timestamp: new Date().toISOString() };
          setHistory(prev => [newEntry, ...prev.filter(e => e.operation !== opName)].slice(0, 5));
      }
    } catch (e: any) {
      toast({
        title: 'Error',
        description: e.message,
        variant: 'destructive',
      });
      setResult(null);
    }
  };

  const MatrixInput = ({ matrix, setMatrix, rows, cols, updateSize, label }: any) => (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">{label}</h3>
      <div className="flex gap-4 items-center">
        <Select
          value={String(rows)}
          onValueChange={(val) => updateSize(val, 'rows', label.slice(-1))}
        >
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5].map((s) => (
              <SelectItem key={s} value={String(s)}>
                {s} Rows
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={String(cols)}
          onValueChange={(val) => updateSize(val, 'cols', label.slice(-1))}
        >
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5].map((s) => (
              <SelectItem key={s} value={String(s)}>
                {s} Cols
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        }}
      >
        {matrix.map((row: any, r: number) =>
          row.map((cell: any, c: number) => (
            <Input
              key={`${r}-${c}`}
              type="number"
              value={cell === 0 ? '' : cell}
              onChange={(e) =>
                handleMatrixChange(e.target.value, r, c, label.slice(-1))
              }
              className="font-code text-center"
              placeholder="0"
            />
          ))
        )}
      </div>
    </div>
  );
  
  const ResultDisplay = ({ result, operation }: { result: Matrix | number | null; operation: string }) => {
    if (result === null) return null;
  
    return (
        <Card>
            <CardHeader>
                <CardTitle>{operation} Result</CardTitle>
            </CardHeader>
            <CardContent>
                {typeof result === 'number' ? (
                    <p className="font-code text-2xl font-bold">{result}</p>
                ) : (
                    <Table>
                        <TableBody>
                            {result.map((row, r) => (
                                <TableRow key={r}>
                                    {row.map((cell, c) => (
                                        <TableCell key={c} className="font-code text-center">
                                            {Number(cell.toFixed(4))}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
};


  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Matrices</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-8">
          <MatrixInput
            matrix={matrixA}
            rows={rowsA}
            cols={colsA}
            updateSize={updateMatrixSize}
            label="Matrix A"
          />
          <MatrixInput
            matrix={matrixB}
            rows={rowsB}
            cols={colsB}
            updateSize={updateMatrixSize}
            label="Matrix B"
          />
        </CardContent>
      </Card>

      <Card>
          <CardHeader>
              <CardTitle>Operations</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
              <Button onClick={() => performOperation('add')}>A + B</Button>
              <Button onClick={() => performOperation('subtract')}>A - B</Button>
              <Button onClick={() => performOperation('multiply')}>A * B</Button>
              <Button onClick={() => performOperation('determinant')}>det(A)</Button>
              <Button onClick={() => performOperation('inverse')}>inv(A)</Button>
          </CardContent>
      </Card>
      
      {result !== null && <ResultDisplay result={result} operation={operation} />}

      {history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Calculations</CardTitle>
          </CardHeader>
          <CardContent>
            {history.map((h, i) => (
                <div key={i} className="mb-4">
                    <h4 className="font-semibold">{h.operation}</h4>
                    <ResultDisplay result={h.result} operation="" />
                </div>
            ))}
          </CardContent>
        </Card>
      )}

    </div>
  );
}
