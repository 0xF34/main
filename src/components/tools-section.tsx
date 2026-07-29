'use client'

/**
 * ToolsSection — placeholder grid where the owner adds their tool/script links.
 *
 * ============================================================================
 * 👇 OWNER: EDIT THIS FILE TO ADD YOUR TOOL LINKS  👇
 * ============================================================================
 *
 * Scroll down to the `TOOLS` array below and replace the placeholder entries
 * with your real tools. Each entry looks like:
 *
 *   {
 *     name: 'Your tool name',
 *     game: 'Steal a Brainrot',           // which Roblox game it's for
 *     description: 'What it does',
 *     url: 'https://your-link-here.com',  // link to the tool / pastebin / discord
 *     badge: 'Free',                       // optional: 'Free' | 'Premium' | 'Beta' | etc
 *   }
 *
 * You can add as many as you want. The grid will reflow automatically.
 *
 * The "Folder" visual on each card uses the Folder component from React Bits.
 * Click a folder to flip it open and see the tool's quick info inside.
 * ============================================================================
 */

import { ExternalLink, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import Folder from '@/components/ui/folder'
import { cn } from '@/lib/utils'

export interface Tool {
  name: string
  game: string
  description: string
  url: string
  badge?: string
  // Visual: which folder color to use. Defaults to purple.
  color?: string
}

// ============================================================================
// 🛠️  EDIT YOUR TOOLS HERE  🛠️
// Replace these placeholder entries with your real tool links.
// ============================================================================
const TOOLS: Tool[] = [
  {
    name: 'Brainrot Stealer',
    game: 'Steal a Brainrot',
    description:
      'Auto-steal script with anti-AFK. Pastebin link inside the folder.',
    url: '#PLACEHOLDER-REPLACE-WITH-YOUR-LINK',
    badge: 'Free',
    color: '#6d28d9',
  },
  {
    name: 'Dice Predictor',
    game: 'Roblox Dice',
    description:
      'Predicts next roll using seed analysis. Works on most dice games.',
    url: '#PLACEHOLDER-REPLACE-WITH-YOUR-LINK',
    badge: 'Beta',
    color: '#9333ea',
  },
  {
    name: 'Universal ESP',
    game: 'Multiple games',
    description:
      'Player + item ESP. Lightweight, works on most executor environments.',
    url: '#PLACEHOLDER-REPLACE-WITH-YOUR-LINK',
    badge: 'Free',
    color: '#7c3aed',
  },
  {
    name: 'Auto-Farm Suite',
    game: 'Steal a Brainrot',
    description:
      'Full auto-farm with webhook notifications. Premium tier in Discord.',
    url: '#PLACEHOLDER-REPLACE-WITH-YOUR-LINK',
    badge: 'Premium',
    color: '#c026d3',
  },
  {
    name: 'Speed + Fly',
    game: 'Universal',
    description: 'Classic mobility scripts. Bypasses most anti-cheat (YMMV).',
    url: '#PLACEHOLDER-REPLACE-WITH-YOUR-LINK',
    badge: 'Free',
    color: '#5b21b6',
  },
  {
    name: 'Dice GUI v3',
    game: 'Roblox Dice',
    description:
      'Clean UI with one-click load. Mobile-friendly. Recommended for iOS users.',
    url: '#PLACEHOLDER-REPLACE-WITH-YOUR-LINK',
    badge: 'Free',
    color: '#a21caf',
  },
]
// ============================================================================
// ✅  THAT'S IT — save the file and your tools will show up automatically.  ✅
// ============================================================================

const ALL_GAMES = ['All', ...Array.from(new Set(TOOLS.map((t) => t.game)))]

const BADGE_STYLES: Record<string, string> = {
  Free: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  Premium: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  Beta: 'border-blue-500/30 bg-blue-500/10 text-blue-300',
  Default: 'border-white/15 bg-white/5 text-white/70',
}

function ToolCard({ tool }: { tool: Tool }) {
  const badgeStyle = tool.badge
    ? BADGE_STYLES[tool.badge] ?? BADGE_STYLES.Default
    : BADGE_STYLES.Default

  const isPlaceholder = tool.url.startsWith('#PLACEHOLDER')

  return (
    <div className="group relative flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-black/50 p-6 backdrop-blur-xl transition-colors hover:border-white/20">
      {/* Folder visual (purely cosmetic — opens on click to show tool info) */}
      <Folder
        size={1.4}
        color={tool.color ?? '#6d28d9'}
        items={[
          <div key="paper-1" className="flex h-full flex-col">
            <p className="font-mono text-[8px] uppercase opacity-70">tool</p>
            <p className="font-bold leading-tight">{tool.name}</p>
          </div>,
          <div key="paper-2" className="flex h-full items-center">
            <p className="text-[8px] leading-tight opacity-80">{tool.game}</p>
          </div>,
          <div key="paper-3" className="flex h-full items-center">
            <p className="text-[7px] leading-tight opacity-60">tap to view</p>
          </div>,
        ]}
      />

      <div className="w-full text-center">
        <div className="mb-1 flex items-center justify-center gap-2">
          <h3 className="text-base font-bold text-white">{tool.name}</h3>
          {tool.badge && (
            <span
              className={cn(
                'rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider',
                badgeStyle,
              )}
            >
              {tool.badge}
            </span>
          )}
        </div>
        <p className="text-[11px] uppercase tracking-wider text-purple-400/80">
          {tool.game}
        </p>
        <p className="mt-2 text-xs leading-relaxed text-white/60">
          {tool.description}
        </p>
      </div>

      {isPlaceholder ? (
        <div
          className="w-full rounded-lg border border-dashed border-amber-500/40 bg-amber-500/5 px-3 py-2 text-center text-[11px] text-amber-300"
          title="Owner: replace this in src/components/tools-section.tsx"
        >
          ⚠ Link placeholder — edit tools-section.tsx
        </div>
      ) : (
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/10"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Open tool
        </a>
      )}
    </div>
  )
}

export default function ToolsSection() {
  const [filter, setFilter] = useState<string>('All')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    return TOOLS.filter((t) => {
      if (filter !== 'All' && t.game !== filter) return false
      if (query.trim()) {
        const q = query.trim().toLowerCase()
        return (
          t.name.toLowerCase().includes(q) ||
          t.game.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [filter, query])

  return (
    <section id="tools" className="mx-auto w-full max-w-6xl px-4 py-16">
      <div className="mb-8">
        <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
          Tools &amp; Scripts
        </h2>
        <p className="mt-2 text-sm text-white/50">
          Browse the collection. Click a folder to peek inside, then hit{' '}
          <span className="text-white/80">Open tool</span> to grab the link.
        </p>
      </div>

      {/* Filters + search */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {ALL_GAMES.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setFilter(g)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                filter === g
                  ? 'border-purple-500/40 bg-purple-500/15 text-purple-200'
                  : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10',
              )}
            >
              {g}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools…"
            className="w-full rounded-lg border border-white/10 bg-black/60 py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/30 focus:border-purple-500/40 focus:outline-none focus:ring-1 focus:ring-purple-500/30"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-white/40">
          No tools match your search.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tool) => (
            <ToolCard key={tool.name} tool={tool} />
          ))}
        </div>
      )}
    </section>
  )
}
