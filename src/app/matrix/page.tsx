import { MatrixCalculator } from '@/components/calculators/matrix-calculator';
import { CalculatorShell } from '@/components/calculator-shell';

export default function MatrixCalculatorPage() {
  return (
    <CalculatorShell
      title="Matrix Calculator"
      description="Perform matrix operations like addition, subtraction, multiplication, and find the determinant and inverse."
    >
      <MatrixCalculator />
    </CalculatorShell>
  );
}
