export type Unit = {
  name: string;
  value: number;
  offset?: number;
};

export type UnitCategory = {
  name: string;
  baseUnit: string;
  units: Unit[];
};

export const UNIT_CATEGORIES: { [key: string]: UnitCategory } = {
  length: {
    name: 'Length',
    baseUnit: 'meter',
    units: [
      { name: 'meter', value: 1 },
      { name: 'kilometer', value: 1000 },
      { name: 'centimeter', value: 0.01 },
      { name: 'millimeter', value: 0.001 },
      { name: 'mile', value: 1609.34 },
      { name: 'yard', value: 0.9144 },
      { name: 'foot', value: 0.3048 },
      { name: 'inch', value: 0.0254 },
    ],
  },
  mass: {
    name: 'Mass',
    baseUnit: 'kilogram',
    units: [
      { name: 'kilogram', value: 1 },
      { name: 'gram', value: 0.001 },
      { name: 'milligram', value: 1e-6 },
      { name: 'tonne', value: 1000 },
      { name: 'pound', value: 0.453592 },
      { name: 'ounce', value: 0.0283495 },
    ],
  },
  temperature: {
    name: 'Temperature',
    baseUnit: 'celsius',
    units: [
      { name: 'celsius', value: 1, offset: 0 },
      { name: 'fahrenheit', value: 5/9, offset: 32 },
      { name: 'kelvin', value: 1, offset: 273.15 },
    ],
  },
  force: {
    name: 'Force',
    baseUnit: 'newton',
    units: [
      { name: 'newton', value: 1 },
      { name: 'kilonewton', value: 1000 },
      { name: 'dyne', value: 1e-5 },
      { name: 'pound-force', value: 4.44822 },
    ],
  },
  energy: {
    name: 'Energy',
    baseUnit: 'joule',
    units: [
      { name: 'joule', value: 1 },
      { name: 'kilojoule', value: 1000 },
      { name: 'calorie', value: 4.184 },
      { name: 'kilocalorie', value: 4184 },
      { name: 'electronvolt', value: 1.60218e-19 },
    ],
  },
};

export function convertUnits(
  value: number,
  fromUnitName: string,
  toUnitName: string,
  units: Unit[]
): number | null {
  const fromUnit = units.find((u) => u.name === fromUnitName);
  const toUnit = units.find((u) => u.name === toUnitName);

  if (!fromUnit || !toUnit) {
    return null;
  }
  
  // Handle temperature separately due to offsets
  if (fromUnit.offset !== undefined || toUnit.offset !== undefined) {
    // Convert fromUnit to base (Celsius)
    let baseValue = (value - (fromUnit.offset || 0)) * fromUnit.value;
    
    // Convert base to toUnit
    let result = baseValue / toUnit.value + (toUnit.offset || 0);

    return result;
  }

  // For other units
  const valueInBase = value * fromUnit.value;
  const result = valueInBase / toUnit.value;

  return result;
}
