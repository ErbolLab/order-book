import { useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { SIG_FIG_OPTIONS, SYMBOLS } from './lib/feed'
import type { NSigFigs } from './lib/feed'
import { formatFixed, formatUsd } from '../lib/format'
import { useOrderBook } from './hooks/useOrderBook'
import { Select } from '../components/Select'
import { BookSide } from './components/BookSide'
import { Spread } from './components/Spread'
import { ImbalanceBar } from './components/ImbalanceBar'
import styles from './OrderBook.module.css'

const SYMBOL_OPTIONS = SYMBOLS.map((s) => ({ value: s.coin, label: s.coin }))

interface Hover {
  side: 'bid' | 'ask'
  idx: number
  y: number
}

export function OrderBook() {
  const [coin, setCoin] = useState(SYMBOLS[0].coin)
  const [nSigFigs, setNSigFigs] = useState<NSigFigs>(5)
  const [hover, setHover] = useState<Hover | null>(null)
  const widgetRef = useRef<HTMLElement>(null)

  const book = useOrderBook(coin, nSigFigs)
  const szDecimals = SYMBOLS.find((s) => s.coin === coin)?.szDecimals ?? 2
  const priceDecimals = book?.priceDecimals ?? 2

  const summary = useMemo(() => {
    if (!hover || !book) return null
    const side = hover.side === 'bid' ? book.bids : book.asks
    let size = 0
    let notional = 0
    for (const r of side.slice(0, hover.idx + 1)) {
      size += r.size
      notional += r.size * r.price
    }
    if (size === 0) return null
    const distance = book.mid > 0 ? (Math.abs(side[hover.idx].price - book.mid) / book.mid) * 100 : 0
    return { size, notional, avg: notional / size, distance }
  }, [hover, book])

  const widgetLeft = widgetRef.current?.getBoundingClientRect().left ?? 0

  return (
    <section className={styles.widget} ref={widgetRef}>
      <header className={styles.header}>
        <h1 className={styles.title}>Order Book</h1>
      </header>

      <div className={styles.controls}>
        <Select label="Market" value={coin} options={SYMBOL_OPTIONS} onChange={setCoin} />
        <Select label="Sig figs" value={nSigFigs} options={SIG_FIG_OPTIONS} onChange={setNSigFigs} />
      </div>

      <div className={styles.columns}>
        <span>Price</span>
        <span>Size ({coin})</span>
        <span>Total ({coin})</span>
      </div>

      {book ? (
        <div className={styles.ladder}>
          <BookSide
            rows={book.asks}
            side="ask"
            szDecimals={szDecimals}
            priceDecimals={priceDecimals}
            hoveredIdx={hover?.side === 'ask' ? hover.idx : -1}
            onHover={(side, idx, y) => setHover({ side, idx, y })}
            onLeave={() => setHover(null)}
          />
          <Spread
            mid={book.mid}
            spread={book.spread}
            spreadPct={book.spreadPct}
            priceDecimals={priceDecimals}
          />
          <BookSide
            rows={book.bids}
            side="bid"
            szDecimals={szDecimals}
            priceDecimals={priceDecimals}
            hoveredIdx={hover?.side === 'bid' ? hover.idx : -1}
            onHover={(side, idx, y) => setHover({ side, idx, y })}
            onLeave={() => setHover(null)}
          />
        </div>
      ) : (
        <div className={styles.loading}>Loading order book</div>
      )}

      <footer className={styles.footer}>
        {book && <ImbalanceBar bidVol={book.bidVol} askVol={book.askVol} />}
      </footer>

      {summary && hover && (
        <div
          className={styles.tooltip}
          style={{ '--tip-left': `${widgetLeft}px`, '--tip-top': `${hover.y}px` } as CSSProperties}
        >
          <div>
            <span>Distance from Mid</span>
            <b>{summary.distance.toFixed(4)}%</b>
          </div>
          <div>
            <span>Average Price</span>
            <b>{formatFixed(summary.avg, priceDecimals)}</b>
          </div>
          <div>
            <span>Total ({coin})</span>
            <b>{formatFixed(summary.size, szDecimals)}</b>
          </div>
          <div>
            <span>Total (USD)</span>
            <b>{formatUsd(summary.notional)}</b>
          </div>
        </div>
      )}
    </section>
  )
}
