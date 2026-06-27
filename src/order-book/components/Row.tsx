import { memo, useEffect, useRef, useState } from 'react'
import type { BookRow } from '../lib/book'
import { formatFixed } from '../../lib/format'
import styles from '../OrderBook.module.css'

interface RowProps {
  row: BookRow
  side: 'bid' | 'ask'
  idx: number
  szDecimals: number
  priceDecimals: number
  inRange: boolean
}

function RowBase({ row, side, idx, szDecimals, priceDecimals, inRange }: RowProps) {
  const prev = useRef({ px: row.px, size: row.size })
  const [flash, setFlash] = useState(0)

  useEffect(() => {
    const last = prev.current
    if (!row.empty && last.px === row.px && last.size !== row.size) {
      setFlash((n) => n + 1)
    }
    prev.current = { px: row.px, size: row.size }
  }, [row.px, row.size, row.empty])

  if (row.empty) {
    return <div className={styles.row} data-side={side} aria-hidden="true" />
  }

  return (
    <div className={styles.row} data-side={side} data-idx={idx} data-range={inRange || undefined}>
      <div className={styles.depth} style={{ transform: `scaleX(${row.depth})` }} />
      {flash > 0 && <div key={flash} className={styles.flash} />}
      <span className={styles.price}>{formatFixed(row.price, priceDecimals)}</span>
      <span className={styles.size}>{formatFixed(row.size, szDecimals)}</span>
      <span className={styles.total}>{formatFixed(row.total, szDecimals)}</span>
    </div>
  )
}

export const Row = memo(RowBase)
