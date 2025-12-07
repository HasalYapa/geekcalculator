import type { ReactNode } from 'react';

interface CalculatorShellProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function CalculatorShell({
  title,
  description,
  children,
}: CalculatorShellProps) {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <header className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 font-headline">
          {title}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {description}
        </p>
      </header>
      <div className="max-w-4xl mx-auto">{children}</div>
    </div>
  );
}
