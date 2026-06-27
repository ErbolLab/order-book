import { useRef } from 'react'
import { formatFixed } from '../../lib/format'
import styles from '../OrderBook.module.css'

interface SpreadProps {
  mid: number
  spread: number
  spreadPct: number
  priceDecimals: number
}

export function Spread({ mid, spread, spreadPct, priceDecimals }: SpreadProps) {
  const prev = useRef(mid)
  const dir = mid > prev.current ? 'up' : mid < prev.current ? 'down' : 'flat'
  prev.current = mid

  return (
    <div className={styles.spread}>
      <div className={styles.spreadMid} data-dir={dir}>
        {formatFixed(mid, priceDecimals)}
        <svg className={styles.spreadArrow} viewBox="0 0 10 10" aria-hidden="true">
          <path d="M5 1 9 7H1z" fill="currentColor" />
        </svg>
      </div>
      <div className={styles.spreadInfo}>
        <span>Spread</span>
        <span className={styles.spreadValue}>{formatFixed(spread, priceDecimals)}</span>
        <span>{spreadPct.toFixed(3)}%</span>
      </div>
    </div>
  )
}
