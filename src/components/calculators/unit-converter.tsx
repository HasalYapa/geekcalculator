'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UNIT_CATEGORIES, convertUnits, Unit } from '@/lib/calculators/units';
import { ArrowRight } from 'lucide-react';
import { useLocalStorage } from '@/hooks/use-local-storage';

type HistoryEntry = {
  fromValue: number;
  fromUnit: string;
  toValue: number;
  toUnit: string;
  category: string;
};

export function UnitConverter() {
  const [category, setCategory] = useState(Object.keys(UNIT_CATEGORIES)[0]);
  const [fromUnit, setFromUnit] = useState(
    UNIT_CATEGORIES[Object.keys(UNIT_CATEGORIES)[0]].units[0].name
  );
  const [toUnit, setToUnit] = useState(
    UNIT_CATEGORIES[Object.keys(UNIT_CATEGORIES)[0]].units[1]?.name ||
    UNIT_CATEGORIES[Object.keys(UNIT_CATEGORIES)[0]].units[0].name
  );
  const [fromValue, setFromValue] = useState('1');
  const [toValue, setToValue] = useState('');
  const [history, setHistory] = useLocalStorage<HistoryEntry[]>('unit-converter-history', []);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const currentCategory = UNIT_CATEGORIES[category];
    setFromUnit(currentCategory.units[0].name);
    setToUnit(currentCategory.units[1]?.name || currentCategory.units[0].name);
    setFromValue('1');
  }, [category]);
  
  useEffect(() => {
    const value = parseFloat(fromValue);
    if (!isNaN(value)) {
      const result = convertUnits(
        value,
        fromUnit,
        toUnit,
        UNIT_CATEGORIES[category].units as Unit[]
      );
      if (result !== null) {
        const newToValue = Number(result.toFixed(6)).toString();
        setToValue(newToValue);
      } else {
        setToValue('');
      }
    } else {
      setToValue('');
    }
  }, [fromValue, fromUnit, toUnit, category]);

  useEffect(() => {
    const fromNum = parseFloat(fromValue);
    const toNum = parseFloat(toValue);
    if (!isNaN(fromNum) && !isNaN(toNum) && fromNum !== 0) {
      const newEntry = {
        fromValue: fromNum,
        fromUnit,
        toValue: toNum,
        toUnit,
        category,
      };
      // Add to history only if it's a new, valid conversion
      if (history[0]?.fromValue !== fromNum || history[0]?.fromUnit !== fromUnit || history[0]?.toValue !== toNum || history[0]?.toUnit !== toUnit) {
        setHistory((prev) =>
          [newEntry, ...prev].slice(0, 5)
        );
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toValue]); // Only run when toValue changes

  const handleFromValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromValue(e.target.value);
  };


  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Live Converter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(UNIT_CATEGORIES).map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {UNIT_CATEGORIES[cat].name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-4">
            <div className="space-y-2">
              <Input
                type="number"
                value={fromValue}
                onChange={handleFromValueChange}
                className="font-code text-lg"
              />
              <Select value={fromUnit} onValueChange={setFromUnit}>
                <SelectTrigger>
                  <SelectValue placeholder="From unit" />
                </SelectTrigger>
                <SelectContent>
                  {UNIT_CATEGORIES[category].units.map((unit) => (
                    <SelectItem key={unit.name} value={unit.name}>
                      {unit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-muted-foreground flex justify-center">
              <ArrowRight className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <Input
                type="number"
                value={toValue}
                readOnly
                className="font-code text-lg bg-muted"
              />
              <Select value={toUnit} onValueChange={setToUnit}>
                <SelectTrigger>
                  <SelectValue placeholder="To unit" />
                </SelectTrigger>
                <SelectContent>
                  {UNIT_CATEGORIES[category].units.map((unit) => (
                    <SelectItem key={unit.name} value={unit.name}>
                      {unit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      {isClient && history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Conversions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {history.map((entry, index) => (
                <li key={index} className="font-code">
                  {entry.fromValue} {entry.fromUnit} = {entry.toValue} {entry.toUnit}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
