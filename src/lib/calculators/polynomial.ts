export interface QuadraticResult {
  roots: string[];
  discriminant: number;
  natureOfRoots: string;
}

export interface CubicResult {
  roots: string[];
}

function formatComplex(real: number, imag: number): string {
    if (Math.abs(imag) < 1e-9) return real.toFixed(4);
    return `${real.toFixed(4)} ${imag > 0 ? '+' : '-'} ${Math.abs(imag).toFixed(4)}i`;
}

export function solveQuadratic(a: number, b: number, c: number): QuadraticResult {
  if (a === 0) {
    if (b === 0) {
        return { roots: c === 0 ? ["Infinite solutions"] : ["No solution"], discriminant: NaN, natureOfRoots: "Not a quadratic equation" };
    }
    return { roots: [(-c / b).toFixed(4)], discriminant: NaN, natureOfRoots: "Linear equation" };
  }

  const discriminant = b * b - 4 * a * c;
  let roots: string[];
  let natureOfRoots: string;

  if (discriminant > 0) {
    const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
    roots = [root1.toFixed(4), root2.toFixed(4)];
    natureOfRoots = 'Two distinct real roots';
  } else if (discriminant === 0) {
    const root = -b / (2 * a);
    roots = [root.toFixed(4)];
    natureOfRoots = 'One real root (repeated)';
  } else {
    const realPart = -b / (2 * a);
    const imaginaryPart = Math.sqrt(-discriminant) / (2 * a);
    roots = [
        formatComplex(realPart, imaginaryPart),
        formatComplex(realPart, -imaginaryPart)
    ];
    natureOfRoots = 'Two complex conjugate roots';
  }
  return { roots, discriminant, natureOfRoots };
}

export function solveCubic(a: number, b: number, c: number, d: number): CubicResult {
    if (a === 0) {
        return { roots: solveQuadratic(b, c, d).roots };
    }

    // Normalize to x^3 + a'x^2 + b'x + c' = 0
    const a_ = b / a;
    const b_ = c / a;
    const c_ = d / a;

    const p = (3 * b_ - a_ * a_) / 3;
    const q = (2 * a_ * a_ * a_ - 9 * a_ * b_ + 27 * c_) / 27;
    
    const discriminant = (q / 2) ** 2 + (p / 3) ** 3;

    let roots: number[] | {real: number, imag: number}[] = [];

    if (discriminant >= 0) {
        const u = Math.cbrt(-q / 2 + Math.sqrt(discriminant));
        const v = Math.cbrt(-q / 2 - Math.sqrt(discriminant));
        const root1 = u + v;
        const realPart = - (u + v) / 2;
        const imagPart = (Math.sqrt(3) / 2) * (u - v);

        if (Math.abs(imagPart) < 1e-9) { // 3 real roots, at least 2 are equal
            roots = [root1, realPart, realPart];
        } else {
            roots = [{real: root1, imag: 0}, {real: realPart, imag: imagPart}, {real: realPart, imag: -imagPart}];
        }
    } else {
        const r = Math.sqrt(-(p ** 3) / 27);
        const phi = Math.acos(-q / (2 * r));
        const twoSqrtNegP3 = 2 * Math.sqrt(-p / 3);
        const root1 = twoSqrtNegP3 * Math.cos(phi / 3);
        const root2 = twoSqrtNegP3 * Math.cos((phi + 2 * Math.PI) / 3);
        const root3 = twoSqrtNegP3 * Math.cos((phi + 4 * Math.PI) / 3);
        roots = [root1, root2, root3];
    }
    
    // De-normalize
    const finalRoots = roots.map(root => {
        if (typeof root === 'number') {
            return formatComplex(root - a_ / 3, 0);
        } else {
            return formatComplex(root.real - a_ / 3, root.imag);
        }
    });

    return { roots: finalRoots };
}
