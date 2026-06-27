export function decimalsOf(numStr: string): number {
  const dot = numStr.indexOf('.')
  if (dot === -1) return 0
  let end = numStr.length - 1
  while (end > dot && numStr[end] === '0') end--
  return end - dot
}

export function formatFixed(n: number, dp: number): string {
  const digits = Math.min(dp, 8)
  return n.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })
}

export function formatUsd(n: number): string {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
