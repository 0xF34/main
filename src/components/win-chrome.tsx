'use client'

/**
 * WinChrome — a Windows-style window header (title bar + min/max/close buttons)
 * used as a decorative wrapper to give the site a Windows-app feel.
 *
 * This is purely cosmetic — the buttons don't do anything functional. The user
 * asked for "Windows logo and things make it look good" / "compatible with
 * every windows" — we add the iconic four-square Windows logo + the three
 * caption buttons (minimize, maximize, close) as visual cues.
 */

import { type ReactNode } from 'react'

function WindowsLogo({ className = '' }: { className?: string }) {
  // Four-square Windows 8/10/11-style logo
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <rect x="2" y="2" width="9" height="9" rx="0.5" />
      <rect x="13" y="2" width="9" height="9" rx="0.5" />
      <rect x="2" y="13" width="9" height="9" rx="0.5" />
      <rect x="13" y="13" width="9" height="9" rx="0.5" />
    </svg>
  )
}

export function WinChrome({
  title = 'dice.exe',
  children,
  className = '',
}: {
  title?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-white/10 bg-black/70 shadow-2xl shadow-black/60 backdrop-blur-xl ${className}`}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-white/10 bg-gradient-to-r from-white/[0.03] to-transparent px-3 py-2">
        <WindowsLogo className="h-3.5 w-3.5 text-purple-400" />
        <span className="flex-1 truncate text-xs font-medium text-white/70">
          {title}
        </span>
        {/* Caption buttons — purely decorative */}
        <div className="flex items-center gap-1.5">
          <span
            className="h-3 w-3 rounded-sm border border-white/20 bg-white/5"
            title="Minimize"
          />
          <span
            className="h-3 w-3 rounded-sm border border-white/20 bg-white/5"
            title="Maximize"
          />
          <span
            className="h-3 w-3 rounded-sm border border-red-500/30 bg-red-500/15"
            title="Close"
          />
        </div>
      </div>
      {/* Body */}
      <div className="p-4">{children}</div>
    </div>
  )
}
