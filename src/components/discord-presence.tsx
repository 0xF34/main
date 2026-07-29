'use client'

/**
 * DiscordPresence — live Discord status widget powered by Lanyard.
 * https://github.com/Phineas/lanyard
 *
 * Lanyard is a free service that broadcasts your Discord presence over a
 * WebSocket. For it to work, the Discord user MUST join the Lanyard Discord
 * server once:  https://discord.gg/lanyard  (one-time, free).
 *
 * After that, this widget will show their live status, what they're playing,
 * Spotify activity, etc.
 */

import { useEffect, useState } from 'react'

const DISCORD_USER_ID = '1507582050683850885'
const DISCORD_USERNAME = 'lcr4'
const LANYARD_WS = 'wss://api.lanyard.rest/socket'
const LANYARD_REST = `https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`

interface LanyardActivity {
  id: string
  name: string
  type: number
  state?: string
  details?: string
  application_id?: string
  timestamps?: { start?: number; end?: number }
  assets?: {
    large_image?: string
    large_text?: string
    small_image?: string
    small_text?: string
  }
  emoji?: { name: string; id?: string; animated?: boolean }
  sync_id?: string
}

interface LanyardData {
  discord_user: {
    id: string
    username: string
    global_name?: string
    avatar: string | null
    discriminator: string
    bot?: boolean
    clan?: { tag?: string }
  }
  discord_status: 'online' | 'idle' | 'dnd' | 'offline'
  activities: LanyardActivity[]
  listening_to_spotify: boolean
  spotify?: {
    album: string
    album_art_url: string
    artist: string
    song: string
    timestamps: { start: number; end: number }
  }
  active_on_discord_desktop?: boolean
  active_on_discord_mobile?: boolean
}

type ConnectionState = 'connecting' | 'open' | 'closed'

const STATUS_COLORS: Record<LanyardData['discord_status'], string> = {
  online: '#22c55e',
  idle: '#eab308',
  dnd: '#ef4444',
  offline: '#6b7280',
}

const STATUS_LABELS: Record<LanyardData['discord_status'], string> = {
  online: 'Online',
  idle: 'Idle',
  dnd: 'Do Not Disturb',
  offline: 'Offline',
}

function avatarUrl(data: LanyardData): string {
  const u = data.discord_user
  if (u.avatar) {
    const ext = u.avatar.startsWith('a_') ? 'gif' : 'png'
    return `https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.${ext}?size=128`
  }
  // Default avatar fallback
  return `https://cdn.discordapp.com/embed/avatars/0.png`
}

function formatTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000)
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function DiscordPresence() {
  const [data, setData] = useState<LanyardData | null>(null)
  const [connState, setConnState] = useState<ConnectionState>('connecting')
  const [now, setNow] = useState(Date.now())
  const [usingFallback, setUsingFallback] = useState(false)

  // Tick every second so Spotify/activity timers stay live.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  // Try REST first (immediate render), then upgrade to WebSocket for live updates.
  useEffect(() => {
    let cancelled = false
    let ws: WebSocket | null = null
    let heartbeat: ReturnType<typeof setInterval> | null = null
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null

    const restFetch = async () => {
      try {
        const res = await fetch(LANYARD_REST)
        if (!res.ok) return
        const json = (await res.json()) as { success: boolean; data: LanyardData }
        if (!cancelled && json.success && json.data) {
          setData(json.data)
        }
      } catch {
        // ignore — REST is best-effort
      }
    }

    const connect = () => {
      try {
        ws = new WebSocket(LANYARD_WS)
      } catch {
        if (!cancelled) {
          setUsingFallback(true)
          // REST polling fallback (every 30s) if WS fails entirely.
          restFetch()
          const id = setInterval(restFetch, 30000)
          heartbeat = id as unknown as ReturnType<typeof setInterval>
        }
        return
      }

      ws.onopen = () => {
        if (cancelled) return
        setConnState('open')
        ws?.send(
          JSON.stringify({
            op: 2,
            d: { subscribe_to_id: DISCORD_USER_ID },
          }),
        )
      }

      ws.onmessage = (e) => {
        if (cancelled) return
        try {
          const msg = JSON.parse(e.data)
          if (msg.op === 1) {
            // Hello: start heartbeat
            const interval = msg.d?.heartbeat_interval ?? 30000
            if (heartbeat) clearInterval(heartbeat)
            heartbeat = setInterval(() => {
              if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ op: 3 }))
              }
            }, interval)
          } else if (msg.op === 0) {
            // Dispatch
            if (msg.t === 'INIT_STATE' || msg.t === 'PRESENCE_UPDATE') {
              const d = msg.d?.[DISCORD_USER_ID] ?? msg.d
              if (d?.discord_user) {
                setData(d as LanyardData)
              }
            }
          }
        } catch {
          // ignore parse errors
        }
      }

      ws.onclose = () => {
        if (cancelled) return
        setConnState('closed')
        if (heartbeat) {
          clearInterval(heartbeat)
          heartbeat = null
        }
        // Exponential-ish reconnect, capped at 15s.
        reconnectTimer = setTimeout(connect, 5000)
      }

      ws.onerror = () => {
        // onclose will fire next; let it drive reconnect.
      }
    }

    restFetch()
    connect()

    return () => {
      cancelled = true
      if (heartbeat) clearInterval(heartbeat)
      if (reconnectTimer) clearTimeout(reconnectTimer)
      if (ws) {
        ws.onclose = null
        ws.onerror = null
        ws.onmessage = null
        ws.onopen = null
        try {
          ws.close()
        } catch {
          // ignore
        }
      }
    }
  }, [])

  const status = data?.discord_status ?? 'offline'
  const statusColor = STATUS_COLORS[status]
  const statusLabel = STATUS_LABELS[status]

  // Filter out the invisible "Custom" status type 4 placeholder if it has no
  // emoji/state — Lanyard sometimes sends an empty custom-status activity.
  const visibleActivities = (data?.activities ?? []).filter(
    (a) => a.type !== 4 || a.emoji || a.state,
  )

  const playingActivity = visibleActivities.find((a) => a.type === 0)
  const spotify = data?.listening_to_spotify ? data.spotify : null

  const avatar = data ? avatarUrl(data) : null
  const displayName = data?.discord_user.global_name || data?.discord_user.username || DISCORD_USERNAME
  const username = data?.discord_user.username || DISCORD_USERNAME

  return (
    <div className="rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl p-5 shadow-2xl shadow-black/50">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: '#5865F2' }} />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-white/60">
          Discord · Live
        </span>
        <span className="ml-auto text-[10px] text-white/40">
          {connState === 'open'
            ? 'synced'
            : connState === 'connecting'
              ? 'syncing…'
              : usingFallback
                ? 'polling'
                : 'reconnecting…'}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          {avatar ? (
             
            <img
              src={avatar}
              alt={displayName}
              className="h-16 w-16 rounded-full border-2 border-white/10 object-cover"
            />
          ) : (
            <div className="h-16 w-16 rounded-full border-2 border-white/10 bg-gradient-to-br from-purple-600 to-fuchsia-600" />
          )}
          <div
            className="absolute bottom-0 right-0 h-5 w-5 rounded-full border-2 border-black"
            style={{ backgroundColor: statusColor }}
            title={statusLabel}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-base font-bold text-white">{displayName}</p>
            {data?.active_on_discord_mobile && (
              <span className="text-[10px]" title="On mobile">📱</span>
            )}
          </div>
          <p className="truncate text-xs text-white/50">@{username}</p>
          <p className="mt-1 text-xs font-medium" style={{ color: statusColor }}>
            {statusLabel}
          </p>
        </div>

        <a
          href={`https://discord.com/users/${DISCORD_USER_ID}`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          title="Open Discord profile"
        >
          View
        </a>
      </div>

      {/* Spotify live card */}
      {spotify && (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
          { }
          <img
            src={spotify.album_art_url}
            alt={spotify.album}
            className="h-12 w-12 rounded-md object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-emerald-300">
              🎵 {spotify.song}
            </p>
            <p className="truncate text-[11px] text-white/50">{spotify.artist}</p>
            <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-emerald-400 transition-[width] duration-1000 ease-linear"
                style={{
                  width: `${Math.min(100, Math.max(0, ((now - spotify.timestamps.start) / (spotify.timestamps.end - spotify.timestamps.start)) * 100))}%`,
                }}
              />
            </div>
            <p className="mt-0.5 text-[9px] text-white/40">
              {formatTime(now - spotify.timestamps.start)} /{' '}
              {formatTime(spotify.timestamps.end - spotify.timestamps.start)}
            </p>
          </div>
        </div>
      )}

      {/* Currently playing game */}
      {playingActivity && !spotify && (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
            Playing
          </p>
          <p className="text-sm font-semibold text-white">{playingActivity.name}</p>
          {playingActivity.details && (
            <p className="truncate text-xs text-white/60">{playingActivity.details}</p>
          )}
          {playingActivity.state && (
            <p className="truncate text-xs text-white/50">{playingActivity.state}</p>
          )}
          {playingActivity.timestamps?.start && (
            <p className="mt-1 text-[10px] text-white/40">
              {formatTime(now - playingActivity.timestamps.start)} elapsed
            </p>
          )}
        </div>
      )}

      {!spotify && !playingActivity && status !== 'offline' && (
        <p className="mt-4 text-xs text-white/40">
          Not playing anything right now.
        </p>
      )}

      {status === 'offline' && !usingFallback && (
        <p className="mt-4 text-xs text-white/40">
          Appears offline — Discord may be closed.
        </p>
      )}
    </div>
  )
}
