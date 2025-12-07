type Matrix = number[][];

function validate(...matrices: Matrix[]) {
  for (const matrix of matrices) {
    if (!Array.isArray(matrix) || !Array.isArray(matrix[0])) {
      throw new Error('Invalid matrix format');
    }
  }
}

export function add(a: Matrix, b: Matrix): Matrix {
  validate(a, b);
  if (a.length !== b.length || a[0].length !== b[0].length) {
    throw new Error('Matrices must have the same dimensions for addition');
  }
  return a.map((row, r) => row.map((cell, c) => cell + b[r][c]));
}

export function subtract(a: Matrix, b: Matrix): Matrix {
  validate(a, b);
  if (a.length !== b.length || a[0].length !== b[0].length) {
    throw new Error('Matrices must have the same dimensions for subtraction');
  }
  return a.map((row, r) => row.map((cell, c) => cell - b[r][c]));
}

export function multiply(a: Matrix, b: Matrix): Matrix {
  validate(a, b);
  if (a[0].length !== b.length) {
    throw new Error('The number of columns in matrix A must equal the number of rows in matrix B for multiplication');
  }
  const result: Matrix = Array(a.length).fill(0).map(() => Array(b[0].length).fill(0));
  for (let r = 0; r < a.length; r++) {
    for (let c = 0; c < b[0].length; c++) {
      for (let i = 0; i < a[0].length; i++) {
        result[r][c] += a[r][i] * b[i][c];
      }
    }
  }
  return result;
}

export function determinant(m: Matrix): number {
  validate(m);
  if (m.length !== m[0].length) {
    throw new Error('Matrix must be square to calculate the determinant');
  }
  const n = m.length;
  if (n === 1) return m[0][0];
  if (n === 2) return m[0][0] * m[1][1] - m[0][1] * m[1][0];
  if (n === 3) {
    return (
      m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
      m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
      m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0])
    );
  }
  throw new Error('Determinant calculation for matrices larger than 3x3 is not supported');
}

export function inverse(m: Matrix): Matrix {
  validate(m);
  const det = determinant(m);
  if (det === 0) {
    throw new Error('Matrix is singular and cannot be inverted');
  }
  const n = m.length;
  if (n === 1) return [[1/m[0][0]]];
  if (n === 2) {
    return [
      [m[1][1] / det, -m[0][1] / det],
      [-m[1][0] / det, m[0][0] / det],
    ];
  }
  if (n === 3) {
    const invDet = 1 / det;
    const result: Matrix = Array(3).fill(0).map(() => Array(3).fill(0));
    result[0][0] = (m[1][1] * m[2][2] - m[1][2] * m[2][1]) * invDet;
    result[0][1] = (m[0][2] * m[2][1] - m[0][1] * m[2][2]) * invDet;
    result[0][2] = (m[0][1] * m[1][2] - m[0][2] * m[1][1]) * invDet;
    result[1][0] = (m[1][2] * m[2][0] - m[1][0] * m[2][2]) * invDet;
    result[1][1] = (m[0][0] * m[2][2] - m[0][2] * m[2][0]) * invDet;
    result[1][2] = (m[0][2] * m[1][0] - m[0][0] * m[1][2]) * invDet;
    result[2][0] = (m[1][0] * m[2][1] - m[1][1] * m[2][0]) * invDet;
    result[2][1] = (m[0][1] * m[2][0] - m[0][0] * m[2][1]) * invDet;
    result[2][2] = (m[0][0] * m[1][1] - m[0][1] * m[1][0]) * invDet;
    return result;
  }
  throw new Error('Inverse calculation for matrices larger than 3x3 is not supported');
}
