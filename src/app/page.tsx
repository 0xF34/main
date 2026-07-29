'use client'

/**
 * Dice site — main page.
 *
 * Pure-black theme throughout. Layout:
 *   1. PixelSnow background (transparent — black shows through)
 *   2. Sticky Windows-style header with logo + DM button
 *   3. Hero: FuzzyText "DICE" title + tagline + animated dice
 *   4. Live Discord presence card
 *   5. Tools grid (placeholders the owner edits in tools-section.tsx)
 *   6. Footer
 *   7. Floating DM button (always visible)
 */

import { ArrowDown, Shield } from 'lucide-react'
import { DMButton, DISCORD_USERNAME } from '@/components/dm-button'
import DiscordPresence from '@/components/discord-presence'
import DiceRoller from '@/components/dice-roller'
import ToolsSection from '@/components/tools-section'
import { WinChrome } from '@/components/win-chrome'
import FuzzyText from '@/components/ui/fuzzy-text'
import PixelSnow from '@/components/ui/pixel-snow'

export default function Home() {
  return (
    <div className="relative min-h-[100dvh] bg-black text-white">
      {/* ====================================================== BACKGROUND */}
      {/* PixelSnow layer — fills the viewport, sits behind everything.
          Color set to a soft purple so the snow reads as subtle texture
          on the BLACK background instead of harsh white noise. */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-50">
        <PixelSnow
          color="#a78bfa"
          flakeSize={0.011}
          minFlakeSize={1.25}
          pixelResolution={500}
          speed={1.1}
          density={0.65}
          direction={65}
          brightness={2.9}
          depthFade={7.5}
          farPlane={19}
          variant="snowflake"
        />
      </div>

      {/* Pure-black vignette so the snow is brightest in the middle and
          fades to true black at the edges — keeps the page feeling BLACK. */}
      <div
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.6) 70%, #000 100%)',
        }}
      />

      {/* ========================================================== CONTENT */}
      <div className="relative z-10 flex min-h-[100dvh] flex-col">
        {/* ===== Header ===== */}
        <header className="sticky top-0 z-30 border-b border-white/10 bg-black/70 backdrop-blur-xl">
          <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3">
            {/* Tiny Windows-style four-square logo next to the brand */}
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-purple-400" fill="currentColor" aria-hidden>
              <rect x="2" y="2" width="9" height="9" rx="0.5" />
              <rect x="13" y="2" width="9" height="9" rx="0.5" />
              <rect x="2" y="13" width="9" height="9" rx="0.5" />
              <rect x="13" y="13" width="9" height="9" rx="0.5" />
            </svg>
            <span className="text-sm font-black tracking-tight text-white">
              DICE<span className="text-purple-400">.exe</span>
            </span>
            <nav className="ml-6 hidden items-center gap-5 text-xs text-white/60 sm:flex">
              <a href="#tools" className="transition-colors hover:text-white">Tools</a>
              <a href="#about" className="transition-colors hover:text-white">About</a>
              <a href="#contact" className="transition-colors hover:text-white">Contact</a>
            </nav>
            <div className="ml-auto">
              <DMButton variant="inline" />
            </div>
          </div>
        </header>

        {/* ===== Hero ===== */}
        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:py-24">
          <div className="flex flex-col items-center gap-8 text-center">
            {/* FuzzyText — hero title. Glitch mode for the chaotic dice vibe. */}
            <div className="flex justify-center">
              <FuzzyText
                baseIntensity={0.27}
                hoverIntensity={0.77}
                enableHover={true}
                fontSize="clamp(3rem, 14vw, 9rem)"
                fontWeight={900}
                color="#ffffff"
                glitchMode={true}
                glitchInterval={3500}
                glitchDuration={280}
                clickEffect={true}
                direction="horizontal"
                className="select-none"
              >
                DICE
              </FuzzyText>
            </div>

            <p className="max-w-2xl text-sm text-white/60 sm:text-base">
              Roblox dice-game tools &amp; brainrot scripts. Built for mobile-first
              iOS users. Clean. Free. Updated constantly.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="#tools"
                className="inline-flex items-center gap-2 rounded-full border border-purple-500/40 bg-purple-500/15 px-5 py-2.5 text-sm font-semibold text-purple-200 transition-colors hover:bg-purple-500/25"
              >
                Browse tools
                <ArrowDown className="h-4 w-4" />
              </a>
              <a
                href="#about"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10"
              >
                <Shield className="h-4 w-4" />
                Is this safe?
              </a>
            </div>

            {/* Dice roller — wrapped in Windows-style chrome for the "compatible
                with every Windows" vibe the user asked for. */}
            <div className="mt-8 w-full max-w-md">
              <WinChrome title="dice-roller.exe">
                <DiceRoller />
              </WinChrome>
            </div>
          </div>
        </section>

        {/* ===== About / Trust ===== */}
        <section id="about" className="mx-auto w-full max-w-6xl px-4 py-16">
          <WinChrome title="about.txt">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <h3 className="mb-2 text-sm font-bold text-white">What is this?</h3>
                <p className="text-xs leading-relaxed text-white/60">
                  A collection of dice-game and brainrot-game scripts for Roblox.
                  Every tool on this site is hand-tested and links directly to the
                  source — no surveys, no paywalls, no scams.
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-bold text-white">Is it safe?</h3>
                <p className="text-xs leading-relaxed text-white/60">
                  Every link opens directly to the source. Always run scripts in a
                  sandboxed executor, never reuse your main Roblox password, and
                  DM me on Discord if anything looks off.
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-bold text-white">Who runs this?</h3>
                <p className="text-xs leading-relaxed text-white/60">
                  Just me — <span className="text-purple-300">@{DISCORD_USERNAME}</span>.
                  The widget below shows my real-time Discord status so you know
                  I'm an actual person, not a content farm.
                </p>
              </div>
            </div>
          </WinChrome>
        </section>

        {/* ===== Tools section (placeholders the owner edits) ===== */}
        <ToolsSection />

        {/* ===== Contact / Discord presence ===== */}
        <section id="contact" className="mx-auto w-full max-w-6xl px-4 py-16">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                Talk to me directly
              </h2>
              <p className="mt-2 max-w-md text-sm text-white/60">
                Found a broken link? Want a custom script? Just bored? My Discord
                is always open. The widget on the right is live — if it says I'm
                online, I'll usually reply within a few minutes.
              </p>

              <div className="mt-6 space-y-3">
                <DMButton variant="inline" />
                <div className="rounded-xl border border-white/10 bg-black/50 p-4">
                  <p className="text-[11px] uppercase tracking-wider text-white/40">
                    Discord username
                  </p>
                  <p className="font-mono text-lg font-bold text-white">
                    @{DISCORD_USERNAME}
                  </p>
                  <p className="mt-1 text-[10px] text-white/40">
                    User ID: 1507582050683850885
                  </p>
                </div>
              </div>
            </div>

            <DiscordPresence />
          </div>
        </section>

        {/* ===== Footer ===== */}
        <footer className="mt-auto border-t border-white/10 bg-black/70 px-4 py-6 backdrop-blur-xl">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 text-xs text-white/40 sm:flex-row">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-purple-400" fill="currentColor" aria-hidden>
                <rect x="2" y="2" width="9" height="9" rx="0.5" />
                <rect x="13" y="2" width="9" height="9" rx="0.5" />
                <rect x="2" y="13" width="9" height="9" rx="0.5" />
                <rect x="13" y="13" width="9" height="9" rx="0.5" />
              </svg>
              <span>DICE.exe — run on any Windows, iOS, or Android</span>
            </div>
            <span>
              Maintained by @{DISCORD_USERNAME}
            </span>
          </div>
        </footer>
      </div>

      {/* Floating DM button — always visible bottom-right */}
      <DMButton variant="floating" />
    </div>
  )
}
