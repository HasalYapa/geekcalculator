export interface Vector {
  x: number;
  y: number;
  z: number;
}

export function add(v1: Vector, v2: Vector): Vector {
  return {
    x: v1.x + v2.x,
    y: v1.y + v2.y,
    z: v1.z + v2.z,
  };
}

export function subtract(v1: Vector, v2: Vector): Vector {
  return {
    x: v1.x - v2.x,
    y: v1.y - v2.y,
    z: v1.z - v2.z,
  };
}

export function dotProduct(v1: Vector, v2: Vector): number {
  return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}

export function crossProduct(v1: Vector, v2: Vector): Vector {
  return {
    x: v1.y * v2.z - v1.z * v2.y,
    y: v1.z * v2.x - v1.x * v2.z,
    z: v1.x * v2.y - v1.y * v2.x,
  };
}

function magnitude(v: Vector): number {
  return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
}

export function angleBetween(v1: Vector, v2: Vector): number {
  const mag1 = magnitude(v1);
  const mag2 = magnitude(v2);

  if (mag1 === 0 || mag2 === 0) {
    throw new Error('Cannot calculate angle with a zero vector.');
  }

  const dot = dotProduct(v1, v2);
  const cosTheta = dot / (mag1 * mag2);

  // Clamp the value to avoid floating point errors with Math.acos
  const clampedCosTheta = Math.max(-1, Math.min(1, cosTheta));
  
  const angleRad = Math.acos(clampedCosTheta);
  return angleRad * (180 / Math.PI); // Convert radians to degrees
}
