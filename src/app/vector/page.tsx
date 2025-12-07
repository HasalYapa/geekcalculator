import { VectorCalculator } from '@/components/calculators/vector-calculator';
import { CalculatorShell } from '@/components/calculator-shell';

export default function VectorCalculatorPage() {
  return (
    <CalculatorShell
      title="Vector Calculator"
      description="Calculate vector addition, subtraction, dot product, cross product, and the angle between vectors."
    >
      <VectorCalculator />
    </CalculatorShell>
  );
}
