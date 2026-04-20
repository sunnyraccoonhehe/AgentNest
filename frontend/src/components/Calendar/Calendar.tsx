import { useMemo, useState } from 'react'
import styles from './Calendar.module.css'

type Props = {
  initialDate?: Date
  selectedDate?: Date | null
  onSelectDate?: (date: Date) => void
  plans?: Date[]
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function addMonths(date: Date, delta: number) {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1)
}

function toIsoDayKey(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function isWeekend(date: Date) {
  // JS: 0=Sun ... 6=Sat
  const d = date.getDay()
  return d === 0 || d === 6
}

const WEEKDAYS_RU = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

const monthFmt = new Intl.DateTimeFormat('ru-RU', { month: 'long' })

const Calendar: React.FC<Props> = ({ initialDate, selectedDate, onSelectDate, plans }) => {
  const [month, setMonth] = useState(() => startOfMonth(initialDate ?? new Date()))
  const [internalSelected, setInternalSelected] = useState<Date | null>(null)

  const selected = selectedDate ?? internalSelected

  const plansSet = useMemo(() => {
    const set = new Set<string>()
    for (const d of plans ?? []) set.add(toIsoDayKey(d))
    return set
  }, [plans])

  const title = useMemo(() => {
    const raw = monthFmt.format(month)
    const cap = raw.length ? raw[0].toUpperCase() + raw.slice(1) : raw
    return `${cap} ${month.getFullYear()}`
  }, [month])

  const days = useMemo(() => {
    // Monday-first grid, 6 weeks
    const first = startOfMonth(month)
    const firstDowMonFirst = (first.getDay() + 6) % 7 // 0..6 (Mon..Sun)
    const gridStart = new Date(first)
    gridStart.setDate(first.getDate() - firstDowMonFirst)

    const out: Array<{ date: Date; outside: boolean }> = []
    for (let i = 0; i < 42; i++) {
      const d = new Date(gridStart)
      d.setDate(gridStart.getDate() + i)
      out.push({ date: d, outside: d.getMonth() !== month.getMonth() })
    }
    return out
  }, [month])

  const handlePick = (date: Date) => {
    if (onSelectDate) onSelectDate(date)
    else setInternalSelected(date)
  }

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <button className={styles.navBtn} onClick={() => setMonth((m) => addMonths(m, -1))} aria-label="Назад">
          ‹
        </button>
        <div className={styles.title}>{title}</div>
        <button className={styles.navBtn} onClick={() => setMonth((m) => addMonths(m, 1))} aria-label="Вперёд">
          ›
        </button>
      </div>

      <div className={styles.weekdays}>
        {WEEKDAYS_RU.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className={styles.grid}>
        {days.map(({ date, outside }) => {
          const isSel = selected ? isSameDay(selected, date) : false
          const hasPlans = plansSet.has(toIsoDayKey(date))
          const cls = [
            styles.cell,
            outside ? styles.outside : '',
            isSel ? styles.selected : '',
            isWeekend(date) ? styles.weekend : '',
            hasPlans ? styles.hasPlans : '',
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <button key={toIsoDayKey(date)} className={cls} onClick={() => handlePick(date)} type="button">
              {date.getDate()}
            </button>
          )
        })}
      </div>

      <div className={styles.legend}>
        <div className={styles.legendRow}>
          <span className={`${styles.legendSquare} ${styles.legendWeekend}`} />
          <span>- выходной</span>
        </div>
        <div className={styles.legendRow}>
          <span className={`${styles.legendSquare} ${styles.legendPlans}`} />
          <span>- есть планы</span>
        </div>
      </div>
    </div>
  )
}

export default Calendar