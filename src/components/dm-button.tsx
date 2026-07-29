'use client'

/**
 * DMButton — floating button that opens the owner's Discord profile.
 *
 * Discord doesn't allow direct DM URLs to non-friends, so this opens the
 * profile page where the visitor can click "Send Message" if they share a
 * server. We also display the username prominently so people can add as a
 * friend or DM via Discord search.
 */

import { MessageCircle } from 'lucide-react'

const DISCORD_USER_ID = '1507582050683850885'
const DISCORD_USERNAME = 'lcr4'
const DISCORD_PROFILE_URL = `https://discord.com/users/${DISCORD_USER_ID}`

export function DMButton({ variant = 'floating' }: { variant?: 'floating' | 'inline' }) {
  const base =
    'group inline-flex items-center gap-2 rounded-full border border-white/15 bg-gradient-to-br from-purple-700/40 to-fuchsia-700/30 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-black/40 backdrop-blur-xl transition-all hover:border-white/30 hover:from-purple-700/60 hover:to-fuchsia-700/50 active:scale-95'

  if (variant === 'inline') {
    return (
      <a
        href={DISCORD_PROFILE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={base}
      >
        <MessageCircle className="h-4 w-4" />
        DM me — @{DISCORD_USERNAME}
      </a>
    )
  }

  return (
    <a
      href={DISCORD_PROFILE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} fixed bottom-4 right-4 z-50 px-5 py-3 shadow-2xl shadow-fuchsia-900/30`}
      aria-label={`DM ${DISCORD_USERNAME} on Discord`}
      title={`DM @${DISCORD_USERNAME} on Discord`}
    >
      <MessageCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
      <span className="hidden sm:inline">DM me</span>
      <span className="sm:hidden">@{DISCORD_USERNAME}</span>
    </a>
  )
}

export { DISCORD_USER_ID, DISCORD_USERNAME, DISCORD_PROFILE_URL }
