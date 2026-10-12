function lattice(x: number, y: number, seed: number) {
  let n = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ seed
  n = Math.imul(n ^ (n >>> 13), 1274126177)
  return ((n ^ (n >>> 16)) >>> 0) / 4294967295
}
/** Smooth value noise with deterministic integer lattice values. */
export function noise2(x: number, y: number, seed = 19) {
  const ix = Math.floor(x), iy = Math.floor(y)
  const fx = x - ix, fy = y - iy
  const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy)
  const a = lattice(ix, iy, seed), b = lattice(ix + 1, iy, seed)
  const c = lattice(ix, iy + 1, seed), d = lattice(ix + 1, iy + 1, seed)
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
}
export function fbm(x: number, y: number, seed = 19, octaves = 4) {
  let value = 0, amplitude = 0.5, sum = 0
  for (let octave = 0; octave < octaves; octave++) {
    value += noise2(x, y, seed + octave * 101) * amplitude
    sum += amplitude
    x = x * 2.03 + 13.7; y = y * 2.03 + 9.2; amplitude *= 0.5
  }
  return value / sum
}
