export const WS_URL = 'wss://api.hyperliquid.xyz/ws'

export const DEPTH = 12

export interface SymbolInfo {
  coin: string
  szDecimals: number
}

export const SYMBOLS: readonly SymbolInfo[] = [
  { coin: 'BTC', szDecimals: 5 },
  { coin: 'ETH', szDecimals: 4 },
]

export type NSigFigs = 2 | 3 | 4 | 5 | null

export const SIG_FIG_OPTIONS: readonly { value: NSigFigs; label: string }[] = [
  { value: 5, label: '5' },
  { value: 4, label: '4' },
  { value: 3, label: '3' },
  { value: 2, label: '2' },
  { value: null, label: 'Full' },
]

export interface RawLevel {
  px: string
  sz: string
  n: number
}

export interface L2BookData {
  coin: string
  time: number
  levels: [RawLevel[], RawLevel[]]
}

export const PING_MSG = JSON.stringify({ method: 'ping' })

export function subscribeMsg(coin: string, nSigFigs: NSigFigs): string {
  const subscription =
    nSigFigs == null ? { type: 'l2Book', coin } : { type: 'l2Book', coin, nSigFigs }
  return JSON.stringify({ method: 'subscribe', subscription })
}
