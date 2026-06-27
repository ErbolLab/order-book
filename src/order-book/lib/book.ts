import { decimalsOf } from '../../lib/format'
import type { L2BookData, RawLevel } from './feed'

export interface BookRow {
  px: string
  price: number
  size: number
  total: number
  depth: number
  empty?: boolean
}

export interface BookView {
  bids: BookRow[]
  asks: BookRow[]
  bestBid: number
  bestAsk: number
  mid: number
  spread: number
  spreadPct: number
  priceDecimals: number
  bidVol: number
  askVol: number
}

function buildSide(levels: RawLevel[], depth: number) {
  const rows: BookRow[] = []
  let total = 0
  let decimals = 0

  for (let i = 0; i < depth; i++) {
    const level = levels[i]
    if (!level) {
      rows.push({ px: `empty-${i}`, price: 0, size: 0, total: 0, depth: 0, empty: true })
      continue
    }
    const size = Number(level.sz)
    total += size
    decimals = Math.max(decimals, decimalsOf(level.px))
    rows.push({ px: level.px, price: Number(level.px), size, total, depth: 0 })
  }

  for (const row of rows) if (!row.empty) row.depth = row.total / (total || 1)

  return { rows, total, decimals }
}

export function buildBook(snapshot: L2BookData, depth: number): BookView {
  const [rawBids, rawAsks] = snapshot.levels
  const bids = buildSide(rawBids, depth)
  const asks = buildSide(rawAsks, depth)

  const bestBid = bids.rows[0]?.price ?? 0
  const bestAsk = asks.rows[0]?.price ?? 0
  const hasBoth = bestBid > 0 && bestAsk > 0
  const mid = hasBoth ? (bestBid + bestAsk) / 2 : bestBid || bestAsk
  const spread = hasBoth ? bestAsk - bestBid : 0

  return {
    bids: bids.rows,
    asks: asks.rows,
    bestBid,
    bestAsk,
    mid,
    spread,
    spreadPct: mid > 0 ? (spread / mid) * 100 : 0,
    priceDecimals: Math.max(bids.decimals, asks.decimals),
    bidVol: bids.total,
    askVol: asks.total,
  }
}
