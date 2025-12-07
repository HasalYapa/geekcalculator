import { BaseConverter } from '@/components/calculators/base-converter';
import { CalculatorShell } from '@/components/calculator-shell';

export default function BaseConverterPage() {
  return (
    <CalculatorShell
      title="Base Converter"
      description="Convert numbers between binary, octal, decimal, and hexadecimal with live updates."
    >
      <BaseConverter />
    </CalculatorShell>
  );
}
