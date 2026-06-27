import type { MouseEvent } from 'react'
import type { BookRow } from '../lib/book'
import { Row } from './Row'
import styles from '../OrderBook.module.css'

interface BookSideProps {
  rows: BookRow[]
  side: 'bid' | 'ask'
  szDecimals: number
  priceDecimals: number
  hoveredIdx: number
  onHover: (side: 'bid' | 'ask', idx: number, y: number) => void
  onLeave: () => void
}

export function BookSide({
  rows,
  side,
  szDecimals,
  priceDecimals,
  hoveredIdx,
  onHover,
  onLeave,
}: BookSideProps) {
  const order = rows.map((row, idx) => ({ row, idx }))
  if (side === 'ask') order.reverse()

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = (e.target as HTMLElement).closest('[data-idx]') as HTMLElement | null
    if (el) onHover(side, Number(el.dataset.idx), e.clientY)
  }

  return (
    <div className={styles.side} data-side={side} onMouseMove={handleMove} onMouseLeave={onLeave}>
      {order.map(({ row, idx }) => (
        <Row
          key={idx}
          row={row}
          side={side}
          idx={idx}
          szDecimals={szDecimals}
          priceDecimals={priceDecimals}
          inRange={idx <= hoveredIdx}
        />
      ))}
    </div>
  )
}
