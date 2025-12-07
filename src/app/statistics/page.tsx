import { StatisticsCalculator } from '@/components/calculators/statistics-calculator';
import { CalculatorShell } from '@/components/calculator-shell';

export default function StatisticsCalculatorPage() {
  return (
    <CalculatorShell
      title="Statistics Calculator"
      description="Calculate mean, median, mode, variance, and standard deviation from a list of numbers."
    >
      <StatisticsCalculator />
    </CalculatorShell>
  );
}
