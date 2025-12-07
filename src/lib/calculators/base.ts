type Base = 'binary' | 'octal' | 'decimal' | 'hexadecimal';
const baseMap: { [key in Base]: number } = {
  binary: 2,
  octal: 8,
  decimal: 10,
  hexadecimal: 16,
};

const validationPatterns: { [key in Base]: RegExp } = {
  binary: /^[01]*$/,
  octal: /^[0-7]*$/,
  decimal: /^[0-9]*$/,
  hexadecimal: /^[0-9a-fA-F]*$/,
};

export function convertBase(
  value: string,
  from: Base,
  to: Base
): string | null {
  if (value === '' || !validationPatterns[from].test(value)) {
    return from === to ? value : '';
  }

  const fromBase = baseMap[from];
  const toBase = baseMap[to];

  if (from === to) {
    return value;
  }
  
  try {
    const decimalValue = parseInt(value, fromBase);
    if (isNaN(decimalValue)) {
      return '';
    }
    return decimalValue.toString(toBase).toUpperCase();
  } catch (e) {
    return '';
  }
}
