import { PolynomialSolver } from '@/components/calculators/polynomial-solver';
import { CalculatorShell } from '@/components/calculator-shell';

export default function PolynomialSolverPage() {
  return (
    <CalculatorShell
      title="Polynomial Solver"
      description="Solve quadratic and cubic equations, and see step-by-step solutions for the roots."
    >
      <PolynomialSolver />
    </CalculatorShell>
  );
}
