// 유틸
export const rnd = ((seed) => () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 2**32)(Date.now()>>>0);
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
