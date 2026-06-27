import { useEffect, useId, useRef, useState } from 'react'
import styles from './Select.module.css'

interface Option<T> {
  value: T
  label: string
}

interface SelectProps<T> {
  value: T
  options: readonly Option<T>[]
  onChange: (value: T) => void
  label: string
}

export function Select<T extends string | number | null>({
  value,
  options,
  onChange,
  label,
}: SelectProps<T>) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const labelId = useId()

  useEffect(() => {
    if (!open) return
    const onPointer = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const current = options.find((o) => o.value === value)

  return (
    <div className={styles.select} ref={ref}>
      <span className={styles.selectLabel} id={labelId}>
        {label}
      </span>
      <button
        type="button"
        className={styles.selectButton}
        aria-labelledby={labelId}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span>{current?.label ?? ''}</span>
        <svg className={styles.chevron} viewBox="0 0 12 12" aria-hidden="true">
          <path d="M3 4.5 6 7.5 9 4.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </button>
      {open && (
        <ul className={styles.selectMenu} role="listbox" aria-labelledby={labelId}>
          {options.map((o) => (
            <li key={String(o.value)}>
              <button
                type="button"
                role="option"
                aria-selected={o.value === value}
                className={o.value === value ? styles.optionActive : styles.option}
                onClick={() => {
                  onChange(o.value)
                  setOpen(false)
                }}
              >
                {o.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
