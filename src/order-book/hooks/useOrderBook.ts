import { useEffect, useState } from 'react'
import { DEPTH, PING_MSG, WS_URL, subscribeMsg } from '../lib/feed'
import type { NSigFigs } from '../lib/feed'
import { buildBook } from '../lib/book'
import type { BookView } from '../lib/book'

const PING_INTERVAL = 30_000
const RECONNECT_DELAY = 1000

export function useOrderBook(coin: string, nSigFigs: NSigFigs) {
  const [book, setBook] = useState<BookView | null>(null)

  useEffect(() => {
    setBook(null)

    let socket: WebSocket
    let reconnectTimer: ReturnType<typeof setTimeout>
    let closed = false

    const connect = () => {
      socket = new WebSocket(WS_URL)

      socket.onopen = () => socket.send(subscribeMsg(coin, nSigFigs))
      socket.onmessage = (event) => {
        const msg = JSON.parse(event.data)
        if (msg.channel === 'l2Book') setBook(buildBook(msg.data, DEPTH))
      }
      socket.onclose = () => {
        if (!closed) reconnectTimer = setTimeout(connect, RECONNECT_DELAY)
      }
    }
    connect()

    const ping = setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) socket.send(PING_MSG)
    }, PING_INTERVAL)

    return () => {
      closed = true
      clearTimeout(reconnectTimer)
      clearInterval(ping)
      socket.close()
    }
  }, [coin, nSigFigs])

  return book
}
