import { UnitConverter } from '@/components/calculators/unit-converter';
import { CalculatorShell } from '@/components/calculator-shell';

export default function UnitConverterPage() {
  return (
    <CalculatorShell
      title="Unit Converter"
      description="Convert various physics units for length, mass, temperature, force, and energy."
    >
      <UnitConverter />
    </CalculatorShell>
  );
}
