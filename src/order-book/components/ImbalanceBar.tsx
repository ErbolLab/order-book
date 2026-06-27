import styles from '../OrderBook.module.css'

interface ImbalanceBarProps {
  bidVol: number
  askVol: number
}

export function ImbalanceBar({ bidVol, askVol }: ImbalanceBarProps) {
  const total = bidVol + askVol
  const bidPct = total > 0 ? (bidVol / total) * 100 : 50

  return (
    <div className={styles.imbalance}>
      <span className={styles.imbLabelBid}>B {bidPct.toFixed(1)}%</span>
      <div className={styles.imbTrack}>
        <div className={styles.imbBid} style={{ width: `${bidPct}%` }} />
        <div className={styles.imbAsk} style={{ width: `${100 - bidPct}%` }} />
      </div>
      <span className={styles.imbLabelAsk}>{(100 - bidPct).toFixed(1)}% S</span>
    </div>
  )
}
