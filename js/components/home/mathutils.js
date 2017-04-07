
export function round(ts) {
  return Math.round(ts * 100) / 100;
}

export function extractLast(num, n) {
  return num.toString().slice(n);
}

export function extractLast4(num) {
    return extractLast(num, -4);
}