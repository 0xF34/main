'use client'

/**
 * DiceRoller — animated 6-sided dice that the user can roll by clicking.
 * Pure CSS 3D transform — no extra deps.
 */

import { useCallback, useState } from 'react'
import { Dices } from 'lucide-react'

const PIPS: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
}

function Die({ value, rolling }: { value: number; rolling: boolean }) {
  return (
    <div
      className={`relative h-20 w-20 rounded-2xl border border-white/15 bg-gradient-to-br from-zinc-900 to-black shadow-2xl shadow-black/60 ${
        rolling ? 'animate-pulse' : ''
      }`}
      style={{
        transform: rolling
          ? `rotate(${Math.random() * 720 - 360}deg) scale(${0.95 + Math.random() * 0.1})`
          : 'rotate(0deg) scale(1)',
        transition: rolling ? 'transform 0.1s linear' : 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      <div className="grid h-full w-full grid-cols-3 grid-rows-3 gap-1 p-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className={`rounded-full transition-opacity duration-150 ${
              PIPS[value]?.includes(i) ? 'bg-white opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default function DiceRoller() {
  const [values, setValues] = useState<number[]>([6, 3])
  const [rolling, setRolling] = useState(false)
  const [history, setHistory] = useState<{ values: number[]; total: number; ts: number }[]>([])

  const roll = useCallback(() => {
    if (rolling) return
    setRolling(true)

    // Spin through random faces while "rolling".
    const interval = setInterval(() => {
      setValues([1 + Math.floor(Math.random() * 6), 1 + Math.floor(Math.random() * 6)])
    }, 80)

    setTimeout(() => {
      clearInterval(interval)
      const final = [1 + Math.floor(Math.random() * 6), 1 + Math.floor(Math.random() * 6)]
      setValues(final)
      setRolling(false)
      setHistory((h) => [
        { values: final, total: final[0] + final[1], ts: Date.now() },
        ...h.slice(0, 4),
      ])
    }, 700)
  }, [rolling])

  const total = values[0] + values[1]

  return (
    <div className="rounded-2xl border border-white/10 bg-black/60 p-6 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white/80">
          <Dices className="h-4 w-4" />
          Roll the dice
        </h3>
        <span className="text-xs text-white/40">just for fun</span>
      </div>

      <div className="flex items-center justify-center gap-4 py-4">
        <Die value={values[0]} rolling={rolling} />
        <Die value={values[1]} rolling={rolling} />
      </div>

      <div className="mb-4 text-center">
        <p className="text-[11px] uppercase tracking-wider text-white/40">Total</p>
        <p className="text-3xl font-black tabular-nums text-white">{total}</p>
      </div>

      <button
        type="button"
        onClick={roll}
        disabled={rolling}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 disabled:opacity-50"
      >
        {rolling ? 'Rolling…' : 'Roll'}
      </button>

      {history.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-[10px] uppercase tracking-wider text-white/40">
            Recent rolls
          </p>
          <div className="flex flex-wrap gap-2">
            {history.map((h) => (
              <div
                key={h.ts}
                className="rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1 text-xs tabular-nums text-white/70"
                title={new Date(h.ts).toLocaleTimeString()}
              >
                {h.values[0]}+{h.values[1]}={h.total}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
